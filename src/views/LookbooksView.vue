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

        <div v-if="schemaWarning" class="lookbooks-banner lookbooks-banner--warning">
          <strong>{{ copy.schemaWarningTitle }}</strong>
          <span>{{ schemaWarning }}</span>
          <code>{{ migrationSql }}</code>
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

          <div class="lookbooks-filters">
            <button
              v-for="option in categoryOptions"
              :key="option.value"
              type="button"
              class="lookbooks-filter"
              :class="{ active: selectedCategory === option.value }"
              @click="selectedCategory = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="lookbooks-grid">
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
            @preview="openPreview(lookbook)"
            @download="handleDownloadRequest(lookbook)"
          />
        </div>
      </div>

      <LookbookPreviewModal
        :visible="previewVisible"
        :title="selectedLookbook?.title || copy.title"
        :pdf-url="previewUrl"
        :loading="previewLoading"
        @close="closePreview"
      />

      <LookbookAccessModal
        :visible="accessModalVisible"
        :is-authenticated="Boolean(currentUser)"
        :email="email"
        :instagram-username="instagramUsername"
        :consent-accepted="consentAccepted"
        :loading="accessLoading"
        :error-message="accessError"
        :facebook-enabled="facebookEnabled"
        :show-instagram-coming-soon="true"
        :instagram-notice="copy.instagramAuthStatus"
        @update:email="email = $event"
        @update:instagramUsername="instagramUsername = $event"
        @update:consentAccepted="consentAccepted = $event"
        @submit="submitAccess"
        @facebook="continueWithFacebook"
        @close="closeAccessModal"
      />
    </section>
  </component>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import LookbookCard from "@/components/lookbooks/LookbookCard.vue";
import LookbookPreviewModal from "@/components/lookbooks/LookbookPreviewModal.vue";
import LookbookAccessModal from "@/components/lookbooks/LookbookAccessModal.vue";
import { useLocalizedNavigation } from "@/composables/useLocalizedNavigation";
import {
  checkFacebookOAuthAvailable,
  clearPendingLookbookDownload,
  createLookbookSignedUrl,
  fetchLookbookBlob,
  getActiveLookbooks,
  getCurrentSession,
  getDownloadMigrationSql,
  getLookbookSchemaCapabilities,
  normalizeInstagramUsername,
  readPendingLookbookDownload,
  registerLookbookDownload,
  saveInstagramUsername,
  sendLookbookMagicLink,
  signInWithFacebook,
  triggerLookbookDownload,
  writePendingLookbookDownload,
} from "@/services/lookbooks.service";
import { supabase } from "@/supabase";

const props = defineProps({
  embedded: {
    type: Boolean,
    default: false,
  },
});

const { locale, localizedPath } = useLocalizedNavigation();

const lookbooks = ref([]);
const loading = ref(false);
const error = ref("");
const searchTerm = ref("");
const selectedCategory = ref("Todos");
const selectedLookbook = ref(null);
const previewVisible = ref(false);
const previewLoading = ref(false);
const previewUrl = ref("");
const accessModalVisible = ref(false);
const downloadingId = ref(null);
const instagramUsername = ref("");
const consentAccepted = ref(false);
const email = ref("");
const accessLoading = ref(false);
const accessError = ref("");
const currentUser = ref(null);
const facebookEnabled = ref(false);
const schemaWarning = ref("");
const feedback = ref({
  tone: "",
  message: "",
});
const migrationSql = getDownloadMigrationSql();

const copy = computed(() =>
  locale.value === "en-us"
    ? {
        eyebrow: "Aircraft Library",
        title: "Private aircraft library",
        subtitle:
          "Explore specifications, premium brochures and technical guides for our aircraft categories.",
        fullLibrary: "Open full library",
        searchLabel: "Search by aircraft",
        searchPlaceholder: "Search by document or aircraft name",
        errorTitle: "Unable to load documents",
        retry: "Try again",
        emptyTitle: "No documents available",
        emptyMessage:
          "There are no active eBooks in this category yet. Please check back soon.",
        downloadSuccess: "Documento descargado correctamente.",
        loginRequired: "Inicia sesión para descargar este eBook.",
        invalidInstagram: "Ingresa un usuario de Instagram válido.",
        consentRequired: "Debes aceptar la autorización para continuar.",
        previewError: "No fue posible generar el acceso al documento.",
        downloadLogError: "No fue posible registrar la descarga.",
        sessionExpired: "Tu sesión expiró. Inicia sesión nuevamente.",
        unavailable: "El documento ya no está disponible.",
        magicLinkSent:
          "Te enviamos un enlace de acceso a tu correo. Vuelve aquí después de iniciar sesión para completar la descarga.",
        schemaWarningTitle: "Database action required",
        instagramAuthStatus:
          "Instagram login is not implemented in this project yet. The button is left prepared for a future integration.",
      }
    : {
        eyebrow: "Biblioteca de aeronaves",
        title: "Biblioteca de aeronaves",
        subtitle:
          "Explora documentación, especificaciones y guías exclusivas de nuestra flota.",
        fullLibrary: "Ver biblioteca completa",
        searchLabel: "Buscar por aeronave",
        searchPlaceholder: "Buscar por documento o nombre de aeronave",
        errorTitle: "No fue posible cargar los documentos",
        retry: "Reintentar",
        emptyTitle: "No hay documentos disponibles",
        emptyMessage:
          "Todavía no hay eBooks activos para esta categoría. Intenta de nuevo más tarde.",
        downloadSuccess: "Documento descargado correctamente.",
        loginRequired: "Inicia sesión para descargar este eBook.",
        invalidInstagram: "Ingresa un usuario de Instagram válido.",
        consentRequired: "Debes aceptar la autorización para continuar.",
        previewError: "No fue posible generar el acceso al documento.",
        downloadLogError: "No fue posible registrar la descarga.",
        sessionExpired: "Tu sesión expiró. Inicia sesión nuevamente.",
        unavailable: "El documento ya no está disponible.",
        magicLinkSent:
          "Te enviamos un enlace de acceso a tu correo. Regresa aquí después de iniciar sesión para completar la descarga.",
        schemaWarningTitle: "Acción pendiente en base de datos",
        instagramAuthStatus:
          "El login con Instagram aún no está implementado en este proyecto. El botón queda preparado para integrarlo después.",
      },
);

const categoryOptions = computed(() =>
  locale.value === "en-us"
    ? [
        { value: "Todos", label: "All" },
        { value: "Helicóptero", label: "Helicopter" },
        { value: "Monomotor Pistón", label: "Single Engine Piston" },
        { value: "Turbohélice", label: "Turboprop" },
        { value: "Light Jet", label: "Light Jet" },
        { value: "Mid Jet", label: "Mid Jet" },
        { value: "Super Mid", label: "Super Mid" },
        { value: "Heavy Jet", label: "Heavy Jet" },
        { value: "Regional Jet", label: "Regional Jet" },
      ]
    : [
        { value: "Todos", label: "Todos" },
        { value: "Helicóptero", label: "Helicóptero" },
        { value: "Monomotor Pistón", label: "Monomotor Pistón" },
        { value: "Turbohélice", label: "Turbohélice" },
        { value: "Light Jet", label: "Light Jet" },
        { value: "Mid Jet", label: "Mid Jet" },
        { value: "Super Mid", label: "Super Mid" },
        { value: "Heavy Jet", label: "Heavy Jet" },
        { value: "Regional Jet", label: "Regional Jet" },
      ],
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
      [item.title, item.aircraft_name, item.category, item.description]
        .filter(Boolean)
        .join(" "),
    );

    return haystack.includes(normalizedSearch.value);
  }),
);

const authRedirectTo = computed(() => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.href;
});

let authSubscription;

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeCategory(value = "") {
  const normalized = normalizeText(value)
    .replace(/\bjets?\b/g, "jet")
    .replace(/\bjet ligero\b/g, "light jet")
    .replace(/\bjet mediano\b/g, "mid jet")
    .replace(/\bjet super mediano\b/g, "super mid")
    .replace(/\bjet de largo alcance\b/g, "heavy jet")
    .replace(/\bhelicopteros?\b/g, "helicoptero")
    .replace(/\bturbohelices?\b/g, "turbohelice");

  const map = {
    all: "todos",
    todos: "todos",
    helicopter: "helicoptero",
    helicoptero: "helicoptero",
    "single engine piston": "monomotor piston",
    "monomotor piston": "monomotor piston",
    turboprop: "turbohelice",
    turbohelice: "turbohelice",
    "light jet": "light jet",
    "mid jet": "mid jet",
    "super mid": "super mid",
    "heavy jet": "heavy jet",
    "regional jet": "regional jet",
  };

  return map[normalized] || normalized;
}

function setFeedback(message, tone = "error") {
  feedback.value = {
    message,
    tone,
  };
}

function resetFeedback() {
  feedback.value = {
    message: "",
    tone: "",
  };
}

function syncUserFromSession(session) {
  currentUser.value = session?.user ?? null;
  email.value = session?.user?.email ?? email.value;
  instagramUsername.value =
    session?.user?.user_metadata?.instagram_username ?? instagramUsername.value;
}

async function refreshSession() {
  try {
    const session = await getCurrentSession();
    syncUserFromSession(session);
  } catch (sessionError) {
    setFeedback(sessionError.message || copy.value.sessionExpired);
  }
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

async function inspectSchema() {
  const capabilities = await getLookbookSchemaCapabilities();

  if (!capabilities.hasInstagramUsernameColumn) {
    schemaWarning.value =
      locale.value === "en-us"
        ? "The download log table is missing instagram_username. Run the SQL below before enabling production downloads."
        : "La tabla de descargas no tiene instagram_username. Ejecuta el SQL siguiente antes de habilitar descargas en producción.";
  }
}

function closePreview() {
  previewVisible.value = false;
  previewLoading.value = false;
  previewUrl.value = "";
}

async function openPreview(lookbook) {
  selectedLookbook.value = lookbook;
  previewVisible.value = true;
  previewLoading.value = true;
  previewUrl.value = "";
  resetFeedback();

  try {
    previewUrl.value = await createLookbookSignedUrl(lookbook.pdf_path);
  } catch (previewError) {
    setFeedback(previewError.message || copy.value.previewError);
  } finally {
    previewLoading.value = false;
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

function getResolvedInstagram() {
  return (
    currentUser.value?.user_metadata?.instagram_username ||
    instagramUsername.value ||
    ""
  );
}

async function performDownload(lookbook, instagramValue) {
  downloadingId.value = lookbook.id;
  resetFeedback();

  try {
    const session = await getCurrentSession();
    const user = session?.user;

    if (!user) {
      throw new Error(copy.value.sessionExpired);
    }

    await registerLookbookDownload({
      lookbookId: lookbook.id,
      userId: user.id,
      email: user.email || email.value || "",
      instagramUsername: instagramValue,
    });

    const signedUrl = await createLookbookSignedUrl(lookbook.pdf_path);
    const blob = await fetchLookbookBlob(signedUrl);
    triggerLookbookDownload(blob, `${lookbook.slug || "lookbook"}.pdf`);
    setFeedback(copy.value.downloadSuccess, "success");
    clearPendingLookbookDownload();
  } catch (downloadError) {
    const message =
      downloadError?.message ||
      (downloadError?.code === "LOOKBOOK_INSTAGRAM_COLUMN_MISSING"
        ? copy.value.downloadLogError
        : copy.value.unavailable);
    setFeedback(message);
  } finally {
    downloadingId.value = null;
  }
}

async function handleDownloadRequest(lookbook) {
  selectedLookbook.value = lookbook;
  resetFeedback();

  try {
    const session = await getCurrentSession();
    const user = session?.user;

    if (!user) {
      setFeedback(copy.value.loginRequired, "warning");
      openAccessModal(lookbook);
      return;
    }

    syncUserFromSession(session);

    const normalizedInstagram = normalizeInstagramUsername(getResolvedInstagram());
    if (!normalizedInstagram.isValid) {
      setFeedback(copy.value.invalidInstagram, "warning");
      openAccessModal(lookbook);
      return;
    }

    await performDownload(lookbook, normalizedInstagram.value);
  } catch (downloadError) {
    setFeedback(downloadError.message || copy.value.sessionExpired);
    openAccessModal(lookbook);
  }
}

async function submitAccess() {
  accessError.value = "";
  resetFeedback();

  if (!consentAccepted.value) {
    accessError.value = copy.value.consentRequired;
    return;
  }

  const normalizedInstagram = normalizeInstagramUsername(instagramUsername.value);
  if (!normalizedInstagram.isValid) {
    accessError.value = copy.value.invalidInstagram;
    return;
  }

  accessLoading.value = true;

  try {
    if (currentUser.value) {
      await saveInstagramUsername(normalizedInstagram.value);
      instagramUsername.value = normalizedInstagram.value;
      closeAccessModal();

      if (selectedLookbook.value) {
        await performDownload(selectedLookbook.value, normalizedInstagram.value);
      }

      return;
    }

    if (!email.value) {
      accessError.value =
        locale.value === "en-us"
          ? "Please enter your email to continue."
          : "Ingresa tu correo electrónico para continuar.";
      return;
    }

    writePendingLookbookDownload({
      lookbookId: selectedLookbook.value?.id,
      instagramUsername: normalizedInstagram.value,
      consentAccepted: true,
      createdAt: new Date().toISOString(),
    });

    await sendLookbookMagicLink(email.value, authRedirectTo.value);
    closeAccessModal();
    setFeedback(copy.value.magicLinkSent, "success");
  } catch (submitError) {
    accessError.value = submitError.message || copy.value.loginRequired;
  } finally {
    accessLoading.value = false;
  }
}

async function continueWithFacebook() {
  accessError.value = "";
  resetFeedback();

  if (!consentAccepted.value) {
    accessError.value = copy.value.consentRequired;
    return;
  }

  const normalizedInstagram = normalizeInstagramUsername(instagramUsername.value);
  if (!normalizedInstagram.isValid) {
    accessError.value = copy.value.invalidInstagram;
    return;
  }

  accessLoading.value = true;

  try {
    writePendingLookbookDownload({
      lookbookId: selectedLookbook.value?.id,
      instagramUsername: normalizedInstagram.value,
      consentAccepted: true,
      createdAt: new Date().toISOString(),
    });

    await signInWithFacebook(authRedirectTo.value);
  } catch (facebookError) {
    accessError.value = facebookError.message;
    accessLoading.value = false;
  }
}

async function resumePendingDownload() {
  const pending = readPendingLookbookDownload();
  if (!pending?.lookbookId || !currentUser.value) {
    return;
  }

  const normalizedInstagram = normalizeInstagramUsername(
    pending.instagramUsername || getResolvedInstagram(),
  );

  if (!normalizedInstagram.isValid) {
    instagramUsername.value = pending.instagramUsername || "";
    consentAccepted.value = Boolean(pending.consentAccepted);
    const lookbook = lookbooks.value.find((item) => item.id === pending.lookbookId);
    if (lookbook) {
      openAccessModal(lookbook);
    }
    return;
  }

  try {
    await saveInstagramUsername(normalizedInstagram.value);
  } catch {
    instagramUsername.value = normalizedInstagram.value;
  }

  const lookbook = lookbooks.value.find((item) => item.id === pending.lookbookId);
  if (lookbook) {
    await performDownload(lookbook, normalizedInstagram.value);
  }
}

onMounted(async () => {
  loading.value = true;

  try {
    await Promise.all([loadLookbooks(), refreshSession(), inspectSchema()]);
    facebookEnabled.value = await checkFacebookOAuthAvailable();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserFromSession(session);
      if (session?.user) {
        resumePendingDownload();
      }
    });

    authSubscription = subscription;
    await resumePendingDownload();
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  authSubscription?.unsubscribe?.();
});
</script>

<style scoped>
.lookbooks-page {
  --lookbook-ink: #081a2a;
  --lookbook-blue: #175a8f;
  --lookbook-gold: #d0ac67;
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
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.lookbooks-hero h1 {
  margin: 0.8rem 0 1rem;
  color: var(--lookbook-ink);
  font-size: clamp(2.3rem, 4vw, 4.4rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
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
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.lookbooks-banner {
  display: grid;
  gap: 6px;
  margin-bottom: 20px;
  padding: 16px 18px;
  border-radius: 18px;
  font-weight: 600;
}

.lookbooks-banner code {
  overflow-wrap: anywhere;
  font-size: 0.8rem;
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
  border-radius: 16px;
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
  letter-spacing: 0.08em;
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
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
}

.lookbooks-skeleton__media,
.lookbooks-skeleton__line {
  border-radius: 18px;
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
  border-radius: 28px;
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
  border-radius: 14px;
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
