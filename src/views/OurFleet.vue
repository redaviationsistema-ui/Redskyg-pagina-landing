<template>
  <MainLayout>
    <!-- HERO -->
    <section class="home-hero">
      <img
        class="hero-bg"
        src="/images/Ourfleet/Ourfleet.jpg"
        alt="Executive Fleet"
      />
      <div class="hero-overlay"></div>

      <div class="hero-content container">
        <h1>Executive Fleet</h1>
        <p>Luxury aircraft for business and private travel</p>
      </div>
    </section>

    <!-- =========================
         FLEET SECTION
    ========================== -->
    <section class="fleet-section">
      <div class="container">
        <div class="fleet-intro">
          <span class="fleet-kicker">Private Aviation Collection</span>
          <h2>Aircraft selected for executive travel, flexibility and comfort</h2>
          <p>
            Explore our active fleet and review availability at a glance before
            requesting a tailored quote.
          </p>
        </div>

        <!-- LOADING -->
        <div v-if="loadingMore" class="fleet-overlay">
          <div class="fleet-loader">
            <div class="premium-spinner"></div>
            <p>Loading fleet aircraft...</p>
          </div>
        </div>

        <!-- GRID -->
        <div v-else class="fleet-grid">
          <div
            v-for="item in aeronaves"
            :key="item.id"
            class="fleet-card"
            @click="openModal(item)"
          >
            <!-- IMAGE -->
            <div class="card-image-wrapper">
              <img
                :src="item.imagenes?.[0] || '/images/placeholder-jet.jpg'"
                class="fleet-image"
                loading="lazy"
              />
              <div class="card-overlay">
                <span>View Aircraft</span>
              </div>
            </div>

            <!-- CONTENT -->
            <div class="fleet-content">
              <h3>{{ item.nombre }}</h3>
              <p class="category">{{ item.categoria }}</p>

              <div class="fleet-info">
                <span class="fleet-spec-pill">
                  <strong>{{ item.capacidad_pasajeros }}</strong> pax
                </span>
                <span class="fleet-spec-pill">
                  <strong>{{ item.alcance_horas }}</strong> hrs
                </span>

                <span
                  :class="
                    item.disponible ? 'badge-available' : 'badge-unavailable'
                  "
                >
                  {{
                    item.disponible
                      ? "Available for Charter"
                      : "Currently Unavailable"
                  }}
                </span>
              </div>

              <p class="price">${{ item.precio_renta_usd }} / hour</p>

              <div class="availability-luxury" @click.stop>
                <VCalendar
                  :attributes="getCalendarAttributes(item)"
                  :min-date="new Date()"
                  :disabled="true"
                  class="luxury-calendar"
                />
                <!-- <button @click="" > get a quote</button> -->
                <button class="btn-quote" @click="goToQuote(item)">
                  Get a Quote
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================
             PAGINATION CONTROLS
        ========================== -->
        <div class="pagination" v-if="totalPages > 1">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Previous
          </button>

          <span> Page {{ currentPage }} of {{ totalPages }} </span>

          <button
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </MainLayout>

  <!-- =========================
     PREMIUM MODAL
========================== -->
  <transition name="fade">
    <div v-if="showModal" class="premium-modal-overlay" @click="closeModal">
      <div class="premium-modal" @click.stop>
        <!-- <button class="premium-close" @click="closeModal">✕</button> -->

        <div v-if="modalLoading" class="premium-modal-loading">
          <div class="premium-spinner"></div>
        </div>

        <div v-else-if="selectedAircraft" class="premium-modal-grid">
          <!-- IMAGE SIDE -->
          <div class="premium-image-section">
            <img
              v-if="selectedAircraft.imagenes.length"
              :src="selectedAircraft.imagenes[currentImage]"
              class="premium-main-image"
            />

            <div
              v-if="selectedAircraft.imagenes.length > 1"
              class="premium-nav"
            >
              <button @click="prevImage">‹</button>
              <button @click="nextImage">›</button>
              <button @click="closeModal">X</button>
            </div>
          </div>

          <!-- INFO SIDE -->
          <div class="premium-info-section">
            <h2 class="premium-title">
              {{ selectedAircraft.nombre }}
            </h2>

            <p class="premium-category">
              {{ selectedAircraft.categoria }}
            </p>

            <div class="premium-specs">
              <div>
                <span>Passengers</span>
                <strong>{{ selectedAircraft.capacidad_pasajeros }}</strong>
              </div>
              <div>
                <span>Range</span>
                <strong>{{ selectedAircraft.alcance_horas }} hrs</strong>
              </div>
              <div>
                <span>Rate</span>
                <strong>${{ selectedAircraft.precio_renta_usd }} / hr</strong>
              </div>
            </div>

            <!-- 🔥 DESCRIPCIÓN CORRECTA (UNA SOLA VEZ) -->
            <p class="premium-description">
              {{ selectedAircraft.descripcion }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { supabase } from "@/supabase";
import { useRouter } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

/* =========================
   STATE
========================= */

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

// const checkAvailability = async (aircraftId) => {
//   const today = new Date().toISOString();

//   // 1️⃣ Revisar reservas activas
//   const { data: reservations } = await supabase
//     .from("reservations")
//     .select("id")
//     .eq("aircraft_id", aircraftId)
//     .in("status", ["pending", "confirmed"])
//     .gte("end_datetime", today);

//   // 2️⃣ Revisar bloqueos
//   const { data: blocked } = await supabase
//     .from("blocked_dates")
//     .select("id")
//     .eq("aircraft_id", aircraftId)
//     .gte("blocked_date", today);

//   if (
//     (reservations && reservations.length > 0) ||
//     (blocked && blocked.length > 0)
//   ) {
//     return false;
//   }

//   return true;
// };
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
/* =========================
   STORAGE HELPER
========================= */

const getPublicUrl = (path) => {
  if (!path) return null;

  const { data } = supabase.storage.from("aircraft-images").getPublicUrl(path);

  return data?.publicUrl || null;
};

/* =========================
   AUTOSLIDE
========================= */

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

onBeforeUnmount(() => stopAutoSlide());

/* =========================
   LOAD FLEET (CORREGIDO)
========================= */

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
    console.error("❌ ERROR FLEET:", error);
    loadingMore.value = false;
    return;
  }

  totalCount.value = count;
  totalPages.value = Math.ceil(count / pageSize);

  // console.log("🚀 FLEET DATA:", fleetData);

  for (const item of fleetData) {
    // console.log("✈ Aircraft:", item.name);
    // console.log("Raw imagenes relation:", item.aeronave_imagenes);

    const imagenes =
      item.aeronave_imagenes?.map((img) => {
        // console.log("➡ URL individual:", img.imagen_url);
        return img.imagen_url;
      }) || [];

    // console.log("✅ Imagenes finales:", imagenes);

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
  // Cargar fechas bloqueadas
  for (const aircraft of aeronaves.value) {
    await loadAvailabilityForAircraft(aircraft);
  }

  loadingMore.value = false;
};

/* =========================
   BLOCKED DATES
========================= */

const loadAvailabilityForAircraft = async (item) => {
  const { data, error } = await supabase
    .from("reservations")
    .select("start_datetime, end_datetime")
    .eq("aircraft_id", item.id);
  // .in("status", ["pending", "confirmed"]);

  if (error || !data?.length) return;

  const blockedDates = [];

  const parseLocalDate = (dateString) => {
  const [date] = dateString.split("T");
  const [year, month, day] = date.split("-");

  return new Date(year, month - 1, day); // 💥 100% LOCAL
};
  data.forEach((reservation) => {
    // const start = new Date(reservation.start_datetime);
    // const end = new Date(reservation.end_datetime);
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
/* =========================
   CALENDAR
========================= */

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

/* =========================
   MODAL
========================= */

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

/* =========================
   PAGINATION
========================= */

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;

  currentPage.value = page;
  loadFleetPage(page);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/* =========================
   QUOTE REDIRECT
========================= */

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

    // 🔥 Calcular disponibilidad real
    const fleetWithAvailability = await Promise.all(
      data.map(async (item) => {
        const disponible = await checkAvailability(item.id);

        return {
          ...item,
          disponible,
        };
      }),
    );

    // ✅ Primero asignas
    aircraftFleet.value = fleetWithAvailability;

    // ✅ Luego cargas paginación si la usas
    await loadFleetPage(1);
  } catch (err) {
    console.error("Error loading fleet:", err);
  }
});
</script>

<style>
:root {
  --fleet-navy: #0f2747;
  --fleet-blue: #1d4f91;
  --fleet-gold: #caa96a;
  --fleet-ink: #142033;
  --fleet-muted: #62738b;
  --fleet-line: rgba(20, 39, 71, 0.12);
  --fleet-panel: rgba(255, 255, 255, 0.88);
  --fleet-shadow: 0 24px 60px rgba(15, 39, 71, 0.12);
  --fleet-shadow-strong: 0 32px 70px rgba(15, 39, 71, 0.2);
}

/* ===============================
   GLOBAL
================================ */
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===============================
   HERO
================================ */
.home-hero {
  position: relative;
  min-height: calc(100vh - 90px);
  padding-top: 90px;
  display: flex;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(7, 17, 33, 0.82), rgba(7, 17, 33, 0.38)),
    linear-gradient(180deg, rgba(12, 28, 53, 0.18), rgba(12, 28, 53, 0.55));
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 720px;
  color: #fff;
  padding: 2.2rem 0;
}

.hero-content h1 {
  font-size: clamp(3rem, 6vw, 5.2rem);
  font-weight: 300;
  letter-spacing: -0.04em;
  margin-bottom: 1rem;
  text-wrap: balance;
}

.hero-content p {
  font-size: 1.05rem;
  line-height: 1.8;
  max-width: 560px;
  color: rgba(255, 255, 255, 0.82);
}

/* ===============================
   FLEET GRID
================================ */
.fleet-section {
  padding: 90px 0 110px;
  background:
    radial-gradient(circle at top right, rgba(202, 169, 106, 0.08), transparent 20%),
    linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
}

.fleet-intro {
  max-width: 780px;
  margin-bottom: 42px;
}

.fleet-kicker {
  display: inline-block;
  margin-bottom: 14px;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(15, 39, 71, 0.07);
  color: var(--fleet-blue);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.fleet-intro h2 {
  margin: 0 0 14px;
  color: var(--fleet-ink);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.fleet-intro p {
  margin: 0;
  max-width: 620px;
  color: var(--fleet-muted);
  font-size: 1rem;
  line-height: 1.8;
}

.fleet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
}

.fleet-card {
  position: relative;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(245, 249, 255, 0.96));
  border: 1px solid rgba(20, 39, 71, 0.08);
  border-radius: 26px;
  overflow: hidden;
  box-shadow: var(--fleet-shadow);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  cursor: pointer;
}

.fleet-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--fleet-shadow-strong);
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
}

.fleet-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.fleet-card:hover .fleet-image {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(15, 39, 71, 0.12), rgba(15, 39, 71, 0.74));
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 13px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fleet-card:hover .card-overlay {
  opacity: 1;
}

.fleet-content {
  padding: 28px;
}

.fleet-content h3 {
  font-size: 1.4rem;
  margin-bottom: 8px;
  color: var(--fleet-ink);
  letter-spacing: -0.03em;
}

.category {
  font-size: 0.78rem;
  color: var(--fleet-muted);
  margin-bottom: 16px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
}

.fleet-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

.fleet-spec-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  background: rgba(15, 39, 71, 0.06);
  color: var(--fleet-ink);
  font-size: 0.8rem;
  font-weight: 600;
}

.fleet-spec-pill strong {
  color: var(--fleet-blue);
}

.price {
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 20px;
  color: var(--fleet-ink);
}
/* ===============================
   CLOSE BUTTON - DESKTOP
================================ */

.premium-close {
  position: absolute;
  bottom: 25px; /* 👇 abajo derecha en PC */
  right: 25px;

  width: 48px;
  height: 48px;

  background: #000;
  color: #fff;

  border: none;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  font-weight: 600;

  cursor: pointer;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.25s ease;

  z-index: 1000;
}

.premium-close:hover {
  transform: scale(1.08);
}

.premium-close:active {
  transform: scale(0.95);
}

/* ===============================
   BADGES
================================ */
.badge-available,
.badge-unavailable {
  padding: 8px 14px;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-radius: 999px;
  font-weight: 700;
}

.badge-available {
  background: rgba(26, 127, 55, 0.12);
  color: #1e7e34;
}

.badge-unavailable {
  background: rgba(198, 40, 40, 0.12);
  color: #c62828;
}

/* ===============================
   PREMIUM AVAILABILITY
================================ */
.availability-premium {
  margin-top: 10px;
}

.date-group {
  display: flex;
  gap: 10px;
}

.premium-date {
  flex: 1;
  padding: 10px 14px;
  font-size: 13px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  background: #fafafa;
  transition: all 0.25s ease;
}

.premium-date:focus {
  outline: none;
  border-color: #000;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

.premium-check {
  padding: 10px 18px;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid #000;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.premium-check:hover {
  background: #000;
  color: #fff;
}

.premium-result {
  margin-top: 12px;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 14px;
  letter-spacing: 0.5px;
  animation: fadeInResult 0.3s ease;
}

.result-available {
  background: rgba(30, 126, 52, 0.08);
  color: #1e7e34;
  border: 1px solid rgba(30, 126, 52, 0.2);
}

.result-unavailable {
  background: rgba(198, 40, 40, 0.08);
  color: #c62828;
  border: 1px solid rgba(198, 40, 40, 0.2);
}

@keyframes fadeInResult {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===============================
   LOADING
================================ */
.fleet-overlay {
  min-height: 420px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 28px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(20, 39, 71, 0.08);
}

.fleet-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.premium-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(20, 39, 71, 0.08);
  border-top: 3px solid var(--fleet-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===============================
   RESPONSIVE
================================ */
@media (max-width: 768px) {
  .container {
    padding: 0 18px;
  }

  .home-hero {
    min-height: 76vh;
  }

  .hero-content p {
    font-size: 0.98rem;
    line-height: 1.7;
  }

  .fleet-section {
    padding: 68px 0 84px;
  }

  .fleet-intro {
    margin-bottom: 28px;
  }

  .fleet-grid {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .fleet-content {
    padding: 22px;
  }

  .fleet-image {
    height: 240px;
  }

  .date-group {
    flex-direction: column;
  }

  .premium-check {
    width: 100%;
  }
  .premium-close {
    position: absolute;
    bottom: 25px; /* 👇 abajo */
    right: 25px; /* 👉 derecha */

    width: 48px;
    height: 48px;

    background: #000; /* negro elegante */
    color: #fff;

    border: none;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 18px;
    font-weight: 600;

    cursor: pointer;

    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    transition: all 0.25s ease;

    z-index: 9999;
  }

  .premium-close:hover {
    transform: scale(1.08);
  }

  .premium-close:active {
    transform: scale(0.95);
  }
  .premium-modal {
    position: relative; /* importante */
  }

  .pagination {
    flex-wrap: wrap;
  }
}
/* ===============================
   LUXURY AVAILABILITY
================================ */

/* ===============================
   LUXURY CALENDAR FIX
================================ */

.luxury-calendar {
  width: 100%;
  margin-top: 10px;
  pointer-events: none;
}

.luxury-calendar .vc-container {
  width: 100%;
  border-radius: 20px;
  border: 1px solid rgba(20, 39, 71, 0.08);
  padding: 12px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.8);
}

.luxury-calendar .vc-header {
  font-weight: 700;
  font-size: 14px;
  padding-bottom: 8px;
  color: var(--fleet-ink);
}

.luxury-calendar .vc-day-content {
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.luxury-calendar .vc-day:hover .vc-day-content {
  background: #eef4fb;
}

/* ===============================
   CALENDARIO BASE
================================ */

.luxury-calendar .vc-container {
  border-radius: 18px;
  border: 1px solid #eee;
  box-shadow: none;
}

/* Día normal */
.luxury-calendar .vc-day-content {
  font-weight: 500;
  border-radius: 6px;
  transition: 0.2s ease;
}

/* Hover suave */
.luxury-calendar .vc-day:hover .vc-day-content {
  background: #f2f2f2;
}

/* ===============================
   DÍA BLOQUEADO (BD → GRIS)
================================ */

.luxury-calendar .vc-day.is-disabled .vc-day-content {
  background-color: #d9d9d9 !important;
  color: #888 !important;
  cursor: not-allowed !important;
  border-radius: 6px !important;
}

/* ===============================
   PREMIUM MODAL
================================ */

.premium-modal-overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(10px);
  background: rgba(8, 18, 34, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.premium-modal {
  width: 1200px;
  max-width: 95%;
  background: linear-gradient(180deg, #ffffff, #f6faff);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.3);
  animation: scaleIn 0.25s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* .premium-close {
  position: absolute;
  top: 20px;
  right: 25px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 2;
} */

.premium-modal-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 600px;
}

/* IMAGE SIDE */

.premium-image-section {
  position: relative;
  background: #09172b;
}

.premium-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.premium-nav {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.premium-nav button {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(20, 39, 71, 0.08);
  min-width: 42px;
  height: 42px;
  padding: 8px 14px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s ease, background 0.2s ease;
}

.premium-nav button:hover {
  transform: translateY(-1px);
  background: #ffffff;
}

/* INFO SIDE */

.premium-info-section {
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.premium-title {
  font-size: 2.3rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--fleet-ink);
  letter-spacing: -0.04em;
}

.premium-category {
  font-size: 0.8rem;
  color: var(--fleet-muted);
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
}

.premium-specs {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.premium-specs div {
  min-width: 130px;
  padding: 1rem 1.1rem;
  border-radius: 18px;
  background: rgba(15, 39, 71, 0.05);
}

.premium-specs span {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--fleet-muted);
  letter-spacing: 0.12em;
}

.premium-specs strong {
  display: block;
  font-size: 1.12rem;
  margin-top: 5px;
  color: var(--fleet-blue);
}

.premium-description {
  font-size: 1rem;
  line-height: 1.8;
  color: #4d5c72;
  margin-bottom: 40px;
}

.premium-cta {
  padding: 14px 28px;
  border-radius: 50px;
  border: 1px solid #000;
  background: #000;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s ease;
}

.premium-cta:hover {
  background: transparent;
  color: #000;
}

/* FADE TRANSITION */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===============================
   PREMIUM PAGINATION
================================ */

.pagination {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  font-size: 14px;
  font-weight: 600;
}

/* .pagination span {
  letter-spacing: 1px;
  color: #666;
} */
.pagination span {
  background: rgba(255, 255, 255, 0.86);
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid rgba(20, 39, 71, 0.08);
  color: var(--fleet-ink);
}

.pagination button {
  min-height: 44px;
  padding: 10px 22px;
  border-radius: 999px;
  border: 1px solid rgba(20, 39, 71, 0.12);
  background: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fleet-ink);
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background: var(--fleet-navy);
  color: #fff;
}

.pagination button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* calendario */
.luxury-calendar {
  pointer-events: none;
}

.luxury-calendar .vc-day {
  cursor: default !important;
}

/* =========================================
   FORZAR COLOR PRINCIPAL DEL CALENDARIO A ROJO
========================================= */

.luxury-calendar {
  --vc-accent-50: #fdecea;
  --vc-accent-100: #f8c1c1;
  --vc-accent-200: #f5a3a3;
  --vc-accent-300: #ef7d7d;
  --vc-accent-400: #e35d5d;
  --vc-accent-500: #c62828; /* 🔴 COLOR PRINCIPAL */
  --vc-accent-600: #b71c1c;
  --vc-accent-700: #9a1616;
  --vc-accent-800: #7f1010;
  --vc-accent-900: #660c0c;
}

.luxury-calendar .vc-highlight {
  background-color: #c62828 !important;
  border-color: #c62828 !important;
}

/* ================= GET A QUOTE BUTTON ================= */

.btn-quote {
  margin-top: 18px;
  width: 100%;
  min-height: 50px;
  padding: 12px 18px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, var(--fleet-navy), var(--fleet-blue));
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 18px 28px rgba(15, 39, 71, 0.2);
  transition: all 0.3s ease;
}

.btn-quote:hover {
  background: linear-gradient(135deg, var(--fleet-blue), #2765b4);
  transform: translateY(-2px);
  box-shadow: 0 22px 34px rgba(15, 39, 71, 0.26);
}

.btn-quote:active {
  transform: scale(0.98);
}

.card-description {
  font-size: 13px;
  color: #666;
  margin-top: 8px;
  line-height: 1.4;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
/* ===============================
   PREMIUM MODAL MOBILE FIX
================================ */

@media (max-width: 768px) {
  .premium-modal-overlay {
    align-items: flex-end; /* estilo sheet */
  }

  .premium-modal {
    width: 100%;
    max-width: 100%;
    height: 92vh;
    border-radius: 24px 24px 0 0;
    overflow: hidden;
  }

  .premium-modal-grid {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* IMAGE */
  .premium-image-section {
    height: 35vh;
    min-height: 240px;
  }

  .premium-main-image {
    height: 100%;
    object-fit: cover;
  }

  .premium-nav {
    bottom: 12px;
    right: 12px;
  }

  /* INFO */
  .premium-info-section {
    padding: 30px 22px;
    overflow-y: auto;
    flex: 1;
  }

  .premium-title {
    font-size: 1.5rem;
  }

  .premium-specs {
    gap: 20px;
    flex-wrap: wrap;
  }

  .premium-specs div {
    flex: 1 1 45%;
  }

  .premium-description {
    font-size: 0.9rem;
  }

  /* .premium-close {
    top: 15px;
    right: 18px;
    font-size: 18px;
  } */
  /* CLOSE BUTTON MOBILE */

  .premium-close {
    top: 18px;
    right: 18px;
    bottom: auto; /* 🔥 importante */

    width: 36px;
    height: 36px;

    background: #ffffff;
    color: #111;

    font-size: 16px;

    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .premium-close:hover {
    transform: scale(1.08);
  }

  .premium-close:active {
    transform: scale(0.95);
  }
}
</style>
