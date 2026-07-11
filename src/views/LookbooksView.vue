<template>
  <component :is="embedded ? 'div' : MainLayout">
    <section class="lookbooks-page" :class="{ 'lookbooks-page--embedded': embedded }">
      <div class="lookbooks-shell">
        <div class="lookbooks-hero">
          <div>
            <span class="lookbooks-eyebrow">{{ copy.eyebrow }}</span>
            <h1>{{ copy.title }}</h1>
            <p>{{ copy.subtitle }}</p>
          </div>

          <RouterLink
            v-if="embedded"
            class="lookbooks-link"
            :to="localizedPath('lookbooks')"
          >
            {{ copy.fullLibrary }}
          </RouterLink>
        </div>

        <div v-if="feedback.message" class="lookbooks-banner" :class="feedbackClass">
          {{ feedback.message }}
        </div>

        <div class="lookbooks-controls">
          <label class="lookbooks-search">
            <span>{{ copy.searchLabel }}</span>
            <input
              v-model.trim="searchTerm"
              type="search"
              :placeholder="copy.searchPlaceholder"
            />
          </label>

          <div class="lookbooks-filters" aria-label="Filtros por categoria">
            <button
              v-for="option in categoryOptions"
              :key="option"
              type="button"
              class="lookbooks-filter"
              :class="{ active: selectedCategory === option }"
              @click="selectedCategory = option"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="lookbooks-grid" aria-live="polite">
          <article v-for="item in 6" :key="item" class="lookbooks-skeleton">
            <div class="lookbooks-skeleton__media"></div>
            <div class="lookbooks-skeleton__line lookbooks-skeleton__line--short"></div>
            <div class="lookbooks-skeleton__line"></div>
            <div class="lookbooks-skeleton__line"></div>
          </article>
        </div>

        <div v-else-if="error" class="lookbooks-empty lookbooks-empty--error">
          <strong>{{ copy.errorTitle }}</strong>
          <p>{{ error }}</p>
          <button type="button" class="lookbooks-refresh" @click="loadLookbooks">
            {{ copy.retry }}
          </button>
        </div>

        <div v-else-if="!filteredLookbooks.length" class="lookbooks-empty">
          <strong>{{ copy.emptyTitle }}</strong>
          <p>{{ copy.emptyMessage }}</p>
        </div>

        <div v-else class="lookbooks-grid">
          <LookbookCard
            v-for="lookbook in filteredLookbooks"
            :key="lookbook.id"
            :lookbook="lookbook"
            :downloading="downloadingId === lookbook.id"
            @download="handleDownloadRequest(lookbook)"
          />
        </div>
      </div>

      <LookbookAccessModal
        :visible="accessModalVisible"
        :email="email"
        :instagram-username="instagramUsername"
        :loading="accessLoading"
        :error-message="accessError"
        @update:email="email = $event"
        @update:instagramUsername="instagramUsername = $event"
        @submit="submitAccess"
        @close="closeAccessModal"
      />
    </section>
  </component>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import LookbookCard from "@/components/lookbooks/LookbookCard.vue";
import LookbookAccessModal from "@/components/lookbooks/LookbookAccessModal.vue";
import { useLocalizedNavigation } from "@/composables/useLocalizedNavigation";
import {
  clearPendingLookbookDownload,
  createLookbookSignedUrl,
  getActiveLookbooks,
  getCurrentSession,
  getUserInstagramUsername,
  isValidEmail,
  normalizeInstagramUsername,
  openLookbookSignedUrl,
  registerLookbookDownload,
} from "@/services/lookbooks.service";

defineProps({
  embedded: {
    type: Boolean,
    default: false,
  },
});

const { locale, localizedPath } = useLocalizedNavigation();

const categoryOptions = [
  "Todos",
  "Helicóptero",
  "Monomotor pistón",
  "Turbohélice",
  "Light Jet",
  "Mid Jet",
  "Super Mid",
  "Heavy Jet",
  "Regional Jet",
];

const lookbooks = ref([]);
const loading = ref(false);
const error = ref("");
const searchTerm = ref("");
const selectedCategory = ref("Todos");
const selectedLookbook = ref(null);
const accessModalVisible = ref(false);
const downloadingId = ref(null);
const instagramUsername = ref("");
const email = ref("");
const accessLoading = ref(false);
const accessError = ref("");
const feedback = ref({ tone: "", message: "" });

const copy = computed(() =>
  locale.value === "en-us"
    ? {
        eyebrow: "Aircraft Library",
        title: "Aircraft library",
        subtitle:
          "Browse aircraft guides, technical sheets and private aviation brochures.",
        fullLibrary: "Open full library",
        searchLabel: "Search",
        searchPlaceholder: "Search by title, description or aircraft",
        errorTitle: "Unable to load documents",
        retry: "Try again",
        emptyTitle: "No results",
        emptyMessage: "Try another search term or category.",
        downloadSuccess: "Guide ready. We opened the temporary PDF link.",
        invalidEmail: "Enter a valid email address.",
        invalidInstagram: "Enter a valid Instagram username.",
        unavailable: "This document is no longer available.",
      }
    : {
        eyebrow: "Biblioteca de aeronaves",
        title: "Biblioteca de aeronaves",
        subtitle:
          "Explora guias, fichas tecnicas y documentacion de aeronaves privadas.",
        fullLibrary: "Ver biblioteca completa",
        searchLabel: "Buscar",
        searchPlaceholder: "Buscar por titulo, descripcion o aeronave",
        errorTitle: "No fue posible cargar los documentos",
        retry: "Reintentar",
        emptyTitle: "Sin resultados",
        emptyMessage: "Intenta con otra busqueda o categoria.",
        downloadSuccess: "Guia lista. Abrimos el enlace temporal del PDF.",
        invalidEmail: "Ingresa un correo electronico valido.",
        invalidInstagram: "Ingresa un usuario de Instagram valido.",
        unavailable: "El documento ya no esta disponible.",
      },
);

const feedbackClass = computed(() =>
  feedback.value.tone === "success"
    ? "lookbooks-banner--success"
    : feedback.value.tone === "warning"
      ? "lookbooks-banner--warning"
      : "lookbooks-banner--error",
);

const normalizedSearch = computed(() => normalizeText(searchTerm.value));

const filteredLookbooks = computed(() =>
  lookbooks.value.filter((item) => {
    const matchesCategory =
      selectedCategory.value === "Todos" ||
      normalizeCategory(item.category) === normalizeCategory(selectedCategory.value);

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedSearch.value) {
      return true;
    }

    const haystack = normalizeText(
      [item.title, item.description, item.aircraft_name].filter(Boolean).join(" "),
    );

    return haystack.includes(normalizedSearch.value);
  }),
);

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeCategory(value = "") {
  const normalized = normalizeText(value);
  const map = {
    todos: "todos",
    all: "todos",
    helicoptero: "helicoptero",
    helicopter: "helicoptero",
    "monomotor piston": "monomotor piston",
    "single engine piston": "monomotor piston",
    turbohelice: "turbohelice",
    turboprop: "turbohelice",
    "light jet": "light jet",
    "mid jet": "mid jet",
    "super mid": "super mid",
    "heavy jet": "heavy jet",
    "regional jet": "regional jet",
  };

  return map[normalized] || normalized;
}

function setFeedback(message, tone = "error") {
  feedback.value = { message, tone };
}

function resetFeedback() {
  feedback.value = { message: "", tone: "" };
}

async function refreshSession() {
  const session = await getCurrentSession();

  if (session?.user?.email) {
    email.value = session.user.email;
  }

  const instagram = getUserInstagramUsername(session?.user);
  if (instagram) {
    instagramUsername.value = instagram;
  }

  return session;
}

async function loadLookbooks() {
  loading.value = true;
  error.value = "";

  try {
    lookbooks.value = await getActiveLookbooks();
  } catch (loadError) {
    error.value = loadError.message;
  } finally {
    loading.value = false;
  }
}

function openAccessModal(lookbook) {
  selectedLookbook.value = lookbook;
  accessError.value = "";
  accessModalVisible.value = true;
}

function closeAccessModal() {
  accessModalVisible.value = false;
  accessLoading.value = false;
  accessError.value = "";
}

async function retrySignedUrl(lookbookId, accessProof) {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await createLookbookSignedUrl(lookbookId, accessProof);
    } catch (signedUrlError) {
      lastError = signedUrlError;

      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 450));
      }
    }
  }

  throw lastError;
}

async function performDownload({ lookbook, emailValue, instagramValue }) {
  if (!lookbook?.id || downloadingId.value) {
    return;
  }

  downloadingId.value = lookbook.id;
  resetFeedback();

  try {
    const accessProof = await registerLookbookDownload({
      lookbookId: lookbook.id,
      userId: null,
      email: emailValue || "",
      instagramUsername: instagramValue || null,
    });

    const signedUrl = await retrySignedUrl(lookbook.id, accessProof);
    openLookbookSignedUrl(signedUrl);
    setFeedback(copy.value.downloadSuccess, "success");
    clearPendingLookbookDownload();
  } catch (downloadError) {
    setFeedback(downloadError?.message || copy.value.unavailable);
  } finally {
    downloadingId.value = null;
  }
}

async function handleDownloadRequest(lookbook) {
  if (downloadingId.value) {
    return;
  }

  selectedLookbook.value = lookbook;
  resetFeedback();

  try {
    const session = await refreshSession();
    if (session?.user?.email) {
      email.value = session.user.email;
    }
  } catch {
    // La descarga publica no depende de una sesion activa.
  }

  openAccessModal(lookbook);
}

async function submitAccess() {
  accessError.value = "";
  resetFeedback();

  const lookbook = selectedLookbook.value;
  if (!lookbook) {
    accessError.value = copy.value.unavailable;
    return;
  }

  const trimmedEmail = email.value.trim().toLowerCase();
  if (!isValidEmail(trimmedEmail)) {
    accessError.value = copy.value.invalidEmail;
    return;
  }

  const normalizedInstagram = normalizeInstagramUsername(instagramUsername.value);
  if (!normalizedInstagram.isValid) {
    accessError.value = copy.value.invalidInstagram;
    return;
  }

  accessLoading.value = true;

  try {
    closeAccessModal();
    await performDownload({
      lookbook,
      emailValue: trimmedEmail,
      instagramValue: normalizedInstagram.value || null,
    });
  } finally {
    accessLoading.value = false;
  }
}

onMounted(async () => {
  await Promise.all([loadLookbooks(), refreshSession().catch(() => null)]);
});
</script>

<style scoped>
.lookbooks-page {
  --lookbook-ink: #081a2a;
  --lookbook-blue: #175a8f;
  --lookbook-paper: #f5f8fb;
  --lookbook-muted: #5d697b;
  --lookbook-line: rgba(8, 26, 42, 0.1);
  padding: 164px 0 110px;
  background:
    radial-gradient(circle at top left, rgba(208, 172, 103, 0.12), transparent 30%),
    linear-gradient(180deg, #ffffff 0%, #eef5fa 100%);
}

.lookbooks-page--embedded {
  padding: 108px 0;
}

.lookbooks-shell {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
}

.lookbooks-hero {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 34px;
}

.lookbooks-eyebrow {
  display: inline-flex;
  color: var(--lookbook-blue);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lookbooks-hero h1 {
  margin: 0.8rem 0 1rem;
  color: var(--lookbook-ink);
  font-size: clamp(2.3rem, 4vw, 4.4rem);
  line-height: 1;
  letter-spacing: 0;
}

.lookbooks-hero p {
  max-width: 720px;
  margin: 0;
  color: var(--lookbook-muted);
  font-size: 1rem;
  line-height: 1.8;
}

.lookbooks-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 999px;
  background: #081a2a;
  color: #ffffff;
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lookbooks-banner {
  display: grid;
  gap: 6px;
  margin-bottom: 20px;
  padding: 16px 18px;
  border-radius: 14px;
  font-weight: 600;
}

.lookbooks-banner--success {
  background: rgba(38, 126, 86, 0.1);
  color: #196545;
}

.lookbooks-banner--warning {
  background: rgba(208, 172, 103, 0.14);
  color: #6f531d;
}

.lookbooks-banner--error {
  background: rgba(168, 55, 48, 0.08);
  color: #8d231d;
}

.lookbooks-controls {
  display: grid;
  gap: 18px;
  margin-bottom: 32px;
}

.lookbooks-search {
  display: grid;
  gap: 10px;
}

.lookbooks-search span {
  color: var(--lookbook-ink);
  font-size: 0.85rem;
  font-weight: 700;
}

.lookbooks-search input {
  width: 100%;
  min-height: 54px;
  padding: 0 18px;
  border: 1px solid var(--lookbook-line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.96);
  color: var(--lookbook-ink);
  font: inherit;
  box-shadow: 0 14px 34px rgba(7, 22, 36, 0.04);
}

.lookbooks-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.lookbooks-filter {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid rgba(23, 90, 143, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--lookbook-blue);
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.lookbooks-filter.active {
  background: #081a2a;
  border-color: #081a2a;
  color: #ffffff;
}

.lookbooks-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.lookbooks-skeleton {
  display: grid;
  gap: 18px;
  padding: 20px;
  border: 1px solid var(--lookbook-line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
}

.lookbooks-skeleton__media,
.lookbooks-skeleton__line {
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(226, 234, 242, 0.9), rgba(241, 245, 249, 0.98), rgba(226, 234, 242, 0.9));
  background-size: 200% 100%;
  animation: lookbook-pulse 1.35s ease infinite;
}

.lookbooks-skeleton__media {
  min-height: 260px;
}

.lookbooks-skeleton__line {
  min-height: 14px;
}

.lookbooks-skeleton__line--short {
  width: 52%;
}

.lookbooks-empty {
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 64px 28px;
  border: 1px dashed var(--lookbook-line);
  border-radius: 18px;
  text-align: center;
  background: rgba(255, 255, 255, 0.76);
}

.lookbooks-empty strong {
  color: var(--lookbook-ink);
  font-size: 1.2rem;
}

.lookbooks-empty p {
  max-width: 620px;
  margin: 0;
  color: var(--lookbook-muted);
  line-height: 1.7;
}

.lookbooks-empty--error {
  border-style: solid;
}

.lookbooks-refresh {
  min-height: 48px;
  padding: 0 20px;
  border: 0;
  border-radius: 12px;
  background: #081a2a;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@keyframes lookbook-pulse {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 1100px) {
  .lookbooks-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .lookbooks-page {
    padding-top: 140px;
  }

  .lookbooks-page--embedded {
    padding-top: 92px;
  }

  .lookbooks-hero {
    align-items: start;
    flex-direction: column;
  }

  .lookbooks-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
