<template>
  <MainLayout>
    <div class="fleet-page">
      <section class="fleet-hero">
        <img
          class="fleet-hero__image"
          :src="assetUrl(content.hero.image)"
          :alt="content.hero.alt"
        />
        <div class="fleet-hero__overlay"></div>

        <div class="fleet-shell fleet-hero__content">
          <span class="fleet-eyebrow fleet-eyebrow--light">
            {{ content.hero.eyebrow }}
          </span>
          <h1>{{ content.hero.title }}</h1>
          <p>{{ content.hero.subtitle }}</p>
        </div>
      </section>

      <section class="fleet-workspace">
        <div class="fleet-shell">
          <div class="fleet-intro">
            <div>
              <span class="fleet-eyebrow">{{ content.intro.kicker }}</span>
              <h2>{{ content.intro.title }}</h2>
              <p>{{ content.intro.description }}</p>
            </div>

            <div class="fleet-summary" aria-label="Fleet summary">
              <strong>{{ totalCount }}</strong>
              <span>{{ content.intro.totalLabel }}</span>
            </div>
          </div>

          <div v-if="loadingMore" class="fleet-loading">
            <div class="fleet-spinner"></div>
            <p>{{ content.loading }}</p>
          </div>

          <div v-else class="fleet-list">
            <article
              v-for="item in aeronaves"
              :key="item.id"
              class="aircraft-row"
            >
              <button
                class="aircraft-media"
                type="button"
                :aria-label="`${content.actions.view} ${item.nombre}`"
                @click="openModal(item)"
              >
                <img
                  :src="item.imagenes?.[0] || assetUrl(content.fallbackImage)"
                  :alt="item.nombre"
                  loading="lazy"
                  decoding="async"
                />
                <span>{{ content.actions.view }}</span>
              </button>

              <div class="aircraft-main">
                <span class="aircraft-category">{{ item.categoria }}</span>
                <h3>{{ item.nombre }}</h3>
                <p>{{ item.descripcion }}</p>

                <div class="aircraft-specs">
                  <span>
                    <strong>{{ item.capacidad_pasajeros }}</strong>
                    {{ content.specs.passengers }}
                  </span>
                  <span>
                    <strong>{{ item.alcance_horas }}</strong>
                    {{ content.specs.range }}
                  </span>
                  <span
                    :class="
                      item.disponible
                        ? 'aircraft-status aircraft-status--available'
                        : 'aircraft-status aircraft-status--unavailable'
                    "
                  >
                    {{
                      item.disponible
                        ? content.status.available
                        : content.status.unavailable
                    }}
                  </span>
                </div>
              </div>

              <aside class="aircraft-action" @click.stop>
                <div class="aircraft-price">
                  <span>{{ content.specs.rate }}</span>
                  <strong>${{ item.precio_renta_usd }} / {{ content.specs.hour }}</strong>
                </div>

                <VCalendar
                  :attributes="getCalendarAttributes(item)"
                  :min-date="new Date()"
                  :disabled="true"
                  class="fleet-calendar"
                />

                <button class="quote-button" type="button" @click="goToQuote(item)">
                  {{ content.actions.quote }}
                </button>
              </aside>
            </article>
          </div>

          <div class="pagination" v-if="totalPages > 1">
            <button
              type="button"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              {{ content.pagination.previous }}
            </button>

            <span>
              {{ content.pagination.page }} {{ currentPage }}
              {{ content.pagination.of }} {{ totalPages }}
            </span>

            <button
              type="button"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              {{ content.pagination.next }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>

  <transition name="fade">
    <div v-if="showModal" class="fleet-modal-overlay" @click="closeModal">
      <div class="fleet-modal" @click.stop>
        <div v-if="modalLoading" class="fleet-modal-loading">
          <div class="fleet-spinner"></div>
        </div>

        <div v-else-if="selectedAircraft" class="fleet-modal-grid">
          <div class="modal-media">
            <img
              v-if="selectedAircraft.imagenes.length"
              :src="selectedAircraft.imagenes[currentImage]"
              :alt="selectedAircraft.nombre"
              class="modal-image"
            />

            <div class="modal-controls">
              <button
                v-if="selectedAircraft.imagenes.length > 1"
                type="button"
                @click="prevImage"
              >
                ‹
              </button>
              <button
                v-if="selectedAircraft.imagenes.length > 1"
                type="button"
                @click="nextImage"
              >
                ›
              </button>
              <button type="button" @click="closeModal">
                {{ content.modal.close }}
              </button>
            </div>
          </div>

          <div class="modal-info">
            <span class="aircraft-category">{{ selectedAircraft.categoria }}</span>
            <h2>{{ selectedAircraft.nombre }}</h2>

            <div class="modal-specs">
              <div>
                <span>{{ content.modal.passengers }}</span>
                <strong>{{ selectedAircraft.capacidad_pasajeros }}</strong>
              </div>
              <div>
                <span>{{ content.modal.range }}</span>
                <strong>{{ selectedAircraft.alcance_horas }} hrs</strong>
              </div>
              <div>
                <span>{{ content.modal.rate }}</span>
                <strong>${{ selectedAircraft.precio_renta_usd }} / hr</strong>
              </div>
            </div>

            <p>{{ selectedAircraft.descripcion }}</p>

            <button
              class="quote-button quote-button--modal"
              type="button"
              @click="goToQuote(selectedAircraft)"
            >
              {{ content.actions.quote }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import { supabase } from "@/supabase";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

defineProps({
  content: {
    type: Object,
    required: true,
  },
});

const pageSize = 6;
const currentPage = ref(1);
const loadingMore = ref(false);
const totalCount = ref(0);
const totalPages = ref(0);
const aeronaves = ref([]);
const selectedAircraft = ref(null);
const showModal = ref(false);
const currentImage = ref(0);
const modalLoading = ref(false);
const aircraftFleet = ref([]);

const router = useRouter();
const { localizedPath } = useLocalizedNavigation();
let interval = null;

const assetUrl = (path = "") =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

const checkAvailability = async (aircraftId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const { data: reservations } = await supabase
    .from("reservations")
    .select("id")
    .eq("aircraft_id", aircraftId)
    .in("status", ["pending", "confirmed"])
    .gte("end_datetime", todayISO);

  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("id")
    .eq("aircraft_id", aircraftId)
    .gte("blocked_date", todayISO);

  return !(
    (reservations && reservations.length > 0) ||
    (blocked && blocked.length > 0)
  );
};

const startAutoSlide = () => {
  stopAutoSlide();

  interval = setInterval(() => {
    if (!selectedAircraft.value?.imagenes?.length) return;

    currentImage.value =
      (currentImage.value + 1) % selectedAircraft.value.imagenes.length;
  }, 3000);
};

const stopAutoSlide = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

const loadFleetPage = async (page = 1) => {
  loadingMore.value = true;
  aeronaves.value = [];

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const {
    data: fleetData,
    count,
    error,
  } = await supabase
    .from("aircraft_fleet")
    .select(
      `
      id,
      name,
      aircraft_type,
      ideal_use,
      descripcion,
      capacity_passengers,
      cruise_speed_knots,
      rental_price_usd,
      is_active,
      aeronave_imagenes!fk_aircraft (
        imagen_url
      )
    `,
      { count: "exact" },
    )
    .eq("is_active", true)
    .range(from, to);

  if (error) {
    console.error("ERROR FLEET:", error);
    loadingMore.value = false;
    return;
  }

  totalCount.value = count;
  totalPages.value = Math.ceil(count / pageSize);

  for (const item of fleetData) {
    const imagenes =
      item.aeronave_imagenes?.map((img) => img.imagen_url).filter(Boolean) || [];

    aeronaves.value.push({
      id: item.id,
      nombre: item.name,
      categoria: item.aircraft_type,
      capacidad_pasajeros: item.capacity_passengers,
      alcance_horas: item.cruise_speed_knots,
      precio_renta_usd: item.rental_price_usd,
      descripcion: item.descripcion || item.ideal_use,
      disponible: item.is_active,
      imagenes,
      unavailableDates: [],
    });
  }

  for (const aircraft of aeronaves.value) {
    await loadAvailabilityForAircraft(aircraft);
  }

  loadingMore.value = false;
};

const loadAvailabilityForAircraft = async (item) => {
  const { data, error } = await supabase
    .from("reservations")
    .select("start_datetime, end_datetime")
    .eq("aircraft_id", item.id);

  if (error || !data?.length) return;

  const blockedDates = [];

  const parseLocalDate = (dateString) => {
    const [date] = dateString.split("T");
    const [year, month, day] = date.split("-");

    return new Date(year, month - 1, day);
  };

  data.forEach((reservation) => {
    const start = parseLocalDate(reservation.start_datetime);
    const end = parseLocalDate(reservation.end_datetime);
    const current = new Date(start);

    while (current <= end) {
      blockedDates.push(
        new Date(current.getFullYear(), current.getMonth(), current.getDate()),
      );

      current.setDate(current.getDate() + 1);
    }
  });

  item.unavailableDates = blockedDates;
};

const getCalendarAttributes = (item) => [
  {
    key: "blocked",
    dates: item.unavailableDates,
    highlight: {
      fillMode: "solid",
      color: "#c62828",
    },
    contentStyle: {
      color: "#fff",
    },
  },
];

const openModal = (item) => {
  selectedAircraft.value = item;
  currentImage.value = 0;
  showModal.value = true;
  startAutoSlide();
};

const closeModal = () => {
  showModal.value = false;
  stopAutoSlide();
};

const nextImage = () => {
  if (!selectedAircraft.value?.imagenes?.length) return;

  currentImage.value =
    (currentImage.value + 1) % selectedAircraft.value.imagenes.length;
};

const prevImage = () => {
  if (!selectedAircraft.value?.imagenes?.length) return;

  currentImage.value =
    (currentImage.value - 1 + selectedAircraft.value.imagenes.length) %
    selectedAircraft.value.imagenes.length;
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;

  currentPage.value = page;
  loadFleetPage(page);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const goToQuote = (aircraft) => {
  router.push({
    path: localizedPath("reserva"),
    query: {
      aircraftId: aircraft.id,
      flightType: aircraft.categoria,
    },
  });
};

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from("aircraft_fleet")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;

    aircraftFleet.value = await Promise.all(
      data.map(async (item) => ({
        ...item,
        disponible: await checkAvailability(item.id),
      })),
    );

    await loadFleetPage(1);
  } catch (err) {
    console.error("Error loading fleet:", err);
  }
});

onBeforeUnmount(() => stopAutoSlide());
</script>

<style scoped>
.fleet-page {
  --fleet-ink: #07111f;
  --fleet-navy: #071624;
  --fleet-blue: #175a8f;
  --fleet-gold: #d0ac67;
  --fleet-paper: #f5f7fa;
  --fleet-muted: #627086;
  --fleet-line: rgba(7, 17, 31, 0.12);
  color: var(--fleet-ink);
  background: #ffffff;
  overflow-x: clip;
}

.fleet-shell {
  width: min(1220px, calc(100% - 40px));
  margin: 0 auto;
}

.fleet-hero {
  position: relative;
  min-height: 86vh;
  display: flex;
  align-items: end;
  overflow: hidden;
  background: var(--fleet-navy);
}

.fleet-hero__image,
.fleet-hero__overlay {
  position: absolute;
  inset: 0;
}

.fleet-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fleet-hero__overlay {
  background:
    linear-gradient(90deg, rgba(7, 22, 36, 0.88), rgba(7, 22, 36, 0.42)),
    linear-gradient(180deg, rgba(7, 22, 36, 0.12), rgba(7, 22, 36, 0.84));
}

.fleet-hero__content {
  position: relative;
  z-index: 1;
  padding: 160px 0 82px;
  color: #ffffff;
}

.fleet-eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  color: var(--fleet-blue);
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.fleet-eyebrow--light {
  color: rgba(255, 255, 255, 0.78);
}

.fleet-hero h1 {
  max-width: 820px;
  margin: 0.9rem 0 1rem;
  color: #ffffff;
  font-size: clamp(3.2rem, 7vw, 6.7rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.fleet-hero p {
  max-width: 580px;
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.12rem;
  line-height: 1.75;
}

.fleet-workspace {
  padding: 94px 0 112px;
  background:
    linear-gradient(180deg, #ffffff 0%, var(--fleet-paper) 100%);
}

.fleet-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 32px;
  align-items: end;
  margin-bottom: 44px;
}

.fleet-intro h2 {
  max-width: 850px;
  margin: 0.8rem 0 1rem;
  color: var(--fleet-ink);
  font-size: clamp(2.1rem, 4.8vw, 4.4rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.fleet-intro p {
  max-width: 650px;
  margin: 0;
  color: var(--fleet-muted);
  line-height: 1.8;
}

.fleet-summary {
  min-width: 150px;
  padding: 18px 0;
  border-top: 1px solid var(--fleet-line);
  border-bottom: 1px solid var(--fleet-line);
}

.fleet-summary strong {
  display: block;
  color: var(--fleet-ink);
  font-size: 2.3rem;
  line-height: 1;
}

.fleet-summary span {
  display: block;
  margin-top: 0.45rem;
  color: var(--fleet-muted);
  font-size: 0.88rem;
}

.fleet-loading {
  min-height: 360px;
  display: grid;
  place-items: center;
  gap: 14px;
  border-top: 1px solid var(--fleet-line);
  border-bottom: 1px solid var(--fleet-line);
  color: var(--fleet-muted);
}

.fleet-spinner {
  width: 46px;
  height: 46px;
  border: 3px solid rgba(7, 17, 31, 0.1);
  border-top-color: var(--fleet-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.fleet-list {
  display: grid;
  gap: 22px;
}

.aircraft-row {
  display: grid;
  grid-template-columns: minmax(240px, 360px) minmax(0, 1fr) minmax(280px, 330px);
  gap: 28px;
  align-items: stretch;
  padding: 24px 0;
  border-top: 1px solid var(--fleet-line);
}

.aircraft-row:last-child {
  border-bottom: 1px solid var(--fleet-line);
}

.aircraft-media {
  position: relative;
  display: block;
  width: 100%;
  min-height: 260px;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 8px;
  background: #dce4ec;
  cursor: pointer;
}

.aircraft-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
}

.aircraft-media span {
  position: absolute;
  left: 18px;
  bottom: 18px;
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  padding: 0 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--fleet-ink);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.aircraft-media:hover img {
  transform: scale(1.04);
}

.aircraft-main {
  align-self: center;
}

.aircraft-category {
  display: block;
  color: var(--fleet-blue);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.aircraft-main h3 {
  margin: 0.75rem 0 0.9rem;
  color: var(--fleet-ink);
  font-size: clamp(1.8rem, 3vw, 3rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.aircraft-main p {
  max-width: 620px;
  margin: 0;
  color: var(--fleet-muted);
  line-height: 1.75;
}

.aircraft-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.aircraft-specs span,
.aircraft-status {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--fleet-line);
  color: var(--fleet-ink);
  font-size: 0.82rem;
  font-weight: 700;
}

.aircraft-specs strong {
  margin-right: 5px;
  color: var(--fleet-blue);
}

.aircraft-status--available {
  border-color: rgba(26, 127, 55, 0.2);
  background: rgba(26, 127, 55, 0.08);
  color: #1e7e34;
}

.aircraft-status--unavailable {
  border-color: rgba(198, 40, 40, 0.2);
  background: rgba(198, 40, 40, 0.08);
  color: #c62828;
}

.aircraft-action {
  display: grid;
  align-content: start;
  gap: 14px;
  border-left: 1px solid var(--fleet-line);
  padding-left: 28px;
}

.aircraft-price span {
  display: block;
  color: var(--fleet-muted);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.aircraft-price strong {
  display: block;
  margin-top: 0.35rem;
  color: var(--fleet-ink);
  font-size: 1.2rem;
}

.fleet-calendar {
  width: 100%;
  pointer-events: none;
}

.fleet-calendar :deep(.vc-container) {
  width: 100%;
  border: 1px solid var(--fleet-line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: none;
}

.fleet-calendar :deep(.vc-day) {
  cursor: default !important;
}

.fleet-calendar :deep(.vc-day-content) {
  border-radius: 6px;
  font-weight: 600;
}

.fleet-calendar :deep(.vc-highlight) {
  background-color: #c62828 !important;
  border-color: #c62828 !important;
}

.quote-button {
  width: 100%;
  min-height: 54px;
  padding: 0.95rem 1.1rem;
  border: 0;
  border-radius: 8px;
  background: var(--fleet-ink);
  color: #ffffff;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition:
    transform 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;
}

.quote-button:hover {
  transform: translateY(-2px);
  background: var(--fleet-blue);
  box-shadow: 0 18px 34px rgba(23, 90, 143, 0.22);
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 54px;
}

.pagination button,
.pagination span {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 8px;
  border: 1px solid var(--fleet-line);
  background: #ffffff;
  color: var(--fleet-ink);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.pagination button {
  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  background: var(--fleet-ink);
  color: #ffffff;
}

.pagination button:disabled {
  opacity: 0.36;
  cursor: not-allowed;
}

.fleet-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10002;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(7, 17, 31, 0.76);
  backdrop-filter: blur(10px);
}

.fleet-modal {
  width: min(1180px, 100%);
  max-height: min(88vh, 780px);
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 38px 90px rgba(0, 0, 0, 0.36);
}

.fleet-modal-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
  min-height: 620px;
}

.modal-media {
  position: relative;
  background: var(--fleet-navy);
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-controls {
  position: absolute;
  right: 18px;
  bottom: 18px;
  display: flex;
  gap: 8px;
}

.modal-controls button {
  min-width: 44px;
  min-height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--fleet-ink);
  cursor: pointer;
  font-weight: 900;
}

.modal-info {
  padding: 58px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-info h2 {
  margin: 0.8rem 0 1.5rem;
  color: var(--fleet-ink);
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.modal-specs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin-bottom: 28px;
  border-top: 1px solid var(--fleet-line);
  border-bottom: 1px solid var(--fleet-line);
}

.modal-specs div {
  padding: 18px 14px 18px 0;
}

.modal-specs div + div {
  padding-left: 14px;
  border-left: 1px solid var(--fleet-line);
}

.modal-specs span {
  display: block;
  color: var(--fleet-muted);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.modal-specs strong {
  display: block;
  margin-top: 0.4rem;
  color: var(--fleet-blue);
  font-size: 1.1rem;
}

.modal-info p {
  margin: 0;
  color: var(--fleet-muted);
  line-height: 1.8;
}

.quote-button--modal {
  margin-top: 28px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1080px) {
  .fleet-intro,
  .aircraft-row,
  .fleet-modal-grid {
    grid-template-columns: 1fr;
  }

  .aircraft-action {
    border-left: 0;
    padding-left: 0;
  }

  .fleet-summary {
    width: 100%;
  }

  .modal-media {
    min-height: 380px;
  }
}

@media (max-width: 768px) {
  .fleet-shell {
    width: min(100% - 32px, 1220px);
  }

  .fleet-hero {
    min-height: 72vh;
  }

  .fleet-hero__content {
    padding: 128px 0 54px;
  }

  .fleet-hero h1 {
    font-size: 3rem;
  }

  .fleet-workspace {
    padding: 70px 0 84px;
  }

  .aircraft-row {
    gap: 20px;
    padding: 22px 0;
  }

  .aircraft-media {
    min-height: 230px;
  }

  .fleet-modal-overlay {
    align-items: end;
    padding: 0;
  }

  .fleet-modal {
    width: 100%;
    max-height: 92vh;
    border-radius: 16px 16px 0 0;
  }

  .fleet-modal-grid {
    max-height: 92vh;
    overflow-y: auto;
  }

  .modal-media {
    min-height: 280px;
  }

  .modal-info {
    padding: 30px 22px;
  }

  .modal-specs {
    grid-template-columns: 1fr;
  }

  .modal-specs div,
  .modal-specs div + div {
    padding: 14px 0;
    border-left: 0;
    border-top: 1px solid var(--fleet-line);
  }

  .modal-specs div:first-child {
    border-top: 0;
  }
}
</style>
