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

          <div class="fleet-hero__actions">
            <button class="fleet-button fleet-button--gold" type="button" @click="scrollToFleet">
              {{ heroCopy.explore }}
              <ArrowRight aria-hidden="true" />
            </button>
            <button class="fleet-button fleet-button--ghost" type="button" @click="goToQuoteRequest">
              {{ content.actions.quote }}
            </button>
          </div>

          <div class="fleet-hero__stats" aria-label="Fleet highlights">
            <div v-for="stat in featuredStats" :key="stat.label" class="fleet-stat">
              <component :is="stat.icon" aria-hidden="true" />
              <div>
                <strong>{{ stat.value }}</strong>
                <span>{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref="workspaceRef" class="fleet-workspace">
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

          <div v-else>
            <div class="fleet-toolbar" aria-label="Fleet filters">
              <div class="fleet-tabs">
                <button
                  v-for="option in categoryFilterOptions"
                  :key="option.value || 'all'"
                  type="button"
                  class="fleet-tab"
                  :class="{ active: selectedCategory === option.value }"
                  @click="setCategoryFilter(option.value)"
                >
                  <component :is="option.icon" aria-hidden="true" />
                  <span>{{ option.label }}</span>
                </button>
              </div>

              <div class="fleet-toolbar__row">
                <div class="fleet-chip-group" aria-label="Capacity filters">
                  <button
                    v-for="option in capacityFilterOptions"
                    :key="option.value"
                    type="button"
                    class="fleet-chip"
                    :class="{ active: capacityFilter === option.value }"
                    @click="setCapacityFilter(option.value)"
                  >
                    <Users aria-hidden="true" />
                    {{ option.label }}
                  </button>
                </div>

                <label class="fleet-sort">
                  <span>{{ heroCopy.sortBy }}</span>
                  <select v-model="selectedSort">
                    <option value="popular">{{ heroCopy.popular }}</option>
                    <option value="priceAsc">{{ heroCopy.lowestRate }}</option>
                    <option value="capacityDesc">{{ heroCopy.capacity }}</option>
                    <option value="rangeDesc">{{ heroCopy.range }}</option>
                  </select>
                </label>
              </div>
            </div>

            <p class="fleet-results">
              {{ filteredAircraft.length }} {{ filterLabels.results }}
            </p>

            <div
              v-if="!paginatedAircraft.length"
              class="fleet-empty"
            >
              {{ filterLabels.empty }}
            </div>

            <div v-else class="fleet-list">
            <article
              v-for="item in paginatedAircraft"
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
                <span class="aircraft-category">{{ getAircraftCategoryLabel(item) }}</span>
                <h3>{{ item.nombre }}</h3>
                <p>{{ getAircraftDescription(item) }}</p>

                <div class="aircraft-specs">
                  <span>
                    <Users aria-hidden="true" />
                    <strong>{{ item.capacidad_pasajeros }}</strong>
                    {{ content.specs.passengers }}
                  </span>
                  <span>
                    <Gauge aria-hidden="true" />
                    <strong>{{ item.cruise_speed_knots || item.alcance_horas || "-" }}</strong>
                    kts
                  </span>
                  <span>
                    <Map aria-hidden="true" />
                    <strong>{{ item.alcance_nm || "-" }}</strong>
                    NM
                  </span>
                  <span>
                    <Briefcase aria-hidden="true" />
                    {{ isEnglish ? "Baggage" : "Equipaje" }}
                  </span>
                  <span
                    :class="
                      item.disponible
                        ? 'aircraft-status aircraft-status--available'
                        : 'aircraft-status aircraft-status--unavailable'
                    "
                  >
                    <BadgeCheck aria-hidden="true" />
                    {{
                      item.disponible
                        ? content.status.available
                        : content.status.unavailable
                    }}
                  </span>
                </div>
              </div>

              <aside class="aircraft-action" @click.stop>
                <button class="aircraft-favorite" type="button" aria-label="Save aircraft">
                  <Heart aria-hidden="true" />
                </button>

                <div class="aircraft-price">
                  <span>{{ heroCopy.from }}</span>
                  <strong>{{ formatCurrency(item.precio_renta_usd) }}<small> / {{ content.specs.hour }}</small></strong>
                  <em>{{ heroCopy.estimatedTotal }}</em>
                </div>

                <button class="quote-button quote-button--dark" type="button" @click="openModal(item)">
                  {{ content.actions.view }}
                  <ArrowRight aria-hidden="true" />
                </button>

                <button class="quote-button quote-button--outline" type="button" @click="goToQuote(item)">
                  {{ content.actions.quote }}
                </button>
              </aside>
            </article>
            </div>
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

      <section class="fleet-benefits" aria-label="Fleet benefits">
        <div class="fleet-shell fleet-benefits__grid">
          <div v-for="benefit in fleetBenefits" :key="benefit.title" class="fleet-benefit">
            <component :is="benefit.icon" aria-hidden="true" />
            <div>
              <strong>{{ benefit.title }}</strong>
              <span>{{ benefit.text }}</span>
            </div>
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
            <span class="aircraft-category">{{ getAircraftCategoryLabel(selectedAircraft) }}</span>
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

            <p>{{ getAircraftDescription(selectedAircraft) }}</p>

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
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  Clock3,
  Gauge,
  Grid3X3,
  Headphones,
  Heart,
  Map,
  Plane,
  ShieldCheck,
  Users,
} from "lucide-vue-next";
import MainLayout from "@/layouts/MainLayout.vue";
import { supabase } from "@/supabase";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
});

const AIRCRAFT_TABLE = "aircraft_fleet";

const pageSize = 6;
const currentPage = ref(1);
const loadingMore = ref(false);
const allAircraft = ref([]);
const selectedAircraft = ref(null);
const showModal = ref(false);
const currentImage = ref(0);
const modalLoading = ref(false);
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedBase = ref("");
const minimumPassengers = ref(null);
const capacityFilter = ref("all");
const selectedSort = ref("popular");
const airportLabels = ref({});
const isAircraftComboboxOpen = ref(false);
const workspaceRef = ref(null);

const router = useRouter();
const { localizedPath, locale } = useLocalizedNavigation();
let interval = null;

const categoryOptions = computed(() => [
  {
    value: "Helicóptero",
    label: filterLabels.value.categoryOptions?.helicopter || "Helicóptero · trayectos cortos y acceso flexible",
  },
  {
    value: "Monomotor Pistón",
    label: filterLabels.value.categoryOptions?.singleEngine || "Avión pequeño · opción práctica para pocos pasajeros",
  },
  {
    value: "Turbohélice",
    label: filterLabels.value.categoryOptions?.turboprop || "Turbohélice · eficiente para vuelos regionales",
  },
  {
    value: "Jet ligero (Light Jet)",
    label: filterLabels.value.categoryOptions?.lightJet || "Jet ligero · rápido para grupos pequeños",
  },
  {
    value: "Midsize Jet (Mid Jet)",
    label: filterLabels.value.categoryOptions?.midJet || "Jet mediano · más espacio y alcance",
  },
  {
    value: "Super Midsize Jet",
    label: filterLabels.value.categoryOptions?.superMidJet || "Jet grande · más comodidad para viajes largos",
  },
  {
    value: "Heavy Jet",
    label: filterLabels.value.categoryOptions?.heavyJet || "Jet de largo alcance · cabina amplia",
  },
  {
    value: "Regional Jet",
    label: filterLabels.value.categoryOptions?.regionalJet || "Jet regional · capacidad alta para grupos",
  },
]);

const heroCopy = computed(() => {
  if (isEnglish.value) {
    return {
      explore: "Explore Fleet",
      sortBy: "Sort by",
      popular: "Popular",
      lowestRate: "Lowest rate",
      capacity: "Capacity",
      range: "Range",
      from: "From",
      estimatedTotal: "Est. total based on 2h min",
      allAircraft: "All Aircraft",
      availability: "Availability",
      aircraftWorldwide: "Aircraft worldwide",
      yearsExperience: "Years of experience",
      certifiedOperator: "Certified operator",
      globalCoverage: "Global Coverage",
      globalCoverageText: "4,000+ airports worldwide",
      safetyFirst: "Safety First",
      safetyFirstText: "IS-BAO certified operations",
      dedicatedSupport: "Dedicated Support",
      dedicatedSupportText: "24/7 concierge service",
      flexibleSolutions: "Flexible Solutions",
      flexibleSolutionsText: "Tailored to your mission",
    };
  }

  return {
    explore: "Explorar flota",
    sortBy: "Ordenar",
    popular: "Popular",
    lowestRate: "Menor tarifa",
    capacity: "Capacidad",
    range: "Alcance",
    from: "Desde",
    estimatedTotal: "Total estimado con minimo 2h",
    allAircraft: "Toda la flota",
    availability: "Disponibilidad",
    aircraftWorldwide: "Aeronaves disponibles",
    yearsExperience: "Anios de experiencia",
    certifiedOperator: "Operador certificado",
    globalCoverage: "Cobertura global",
    globalCoverageText: "4,000+ aeropuertos en el mundo",
    safetyFirst: "Seguridad primero",
    safetyFirstText: "Operaciones certificadas IS-BAO",
    dedicatedSupport: "Soporte dedicado",
    dedicatedSupportText: "Concierge 24/7",
    flexibleSolutions: "Soluciones flexibles",
    flexibleSolutionsText: "A la medida de tu mision",
  };
});

const featuredStats = computed(() => [
  {
    icon: Plane,
    value: totalCount.value || "52",
    label: heroCopy.value.aircraftWorldwide,
  },
  {
    icon: Clock3,
    value: "24/7",
    label: heroCopy.value.availability,
  },
  {
    icon: ShieldCheck,
    value: "20+",
    label: heroCopy.value.yearsExperience,
  },
  {
    icon: Award,
    value: "IS-BAO",
    label: heroCopy.value.certifiedOperator,
  },
]);

const fleetBenefits = computed(() => [
  {
    icon: Map,
    title: heroCopy.value.globalCoverage,
    text: heroCopy.value.globalCoverageText,
  },
  {
    icon: ShieldCheck,
    title: heroCopy.value.safetyFirst,
    text: heroCopy.value.safetyFirstText,
  },
  {
    icon: Headphones,
    title: heroCopy.value.dedicatedSupport,
    text: heroCopy.value.dedicatedSupportText,
  },
  {
    icon: BadgeCheck,
    title: heroCopy.value.flexibleSolutions,
    text: heroCopy.value.flexibleSolutionsText,
  },
]);

const categoryIcons = {
  "HelicÃ³ptero": Plane,
  "Monomotor PistÃ³n": Plane,
  "TurbohÃ©lice": Plane,
  "Jet ligero (Light Jet)": Plane,
  "Midsize Jet (Mid Jet)": Plane,
  "Super Midsize Jet": Plane,
  "Heavy Jet": Plane,
  "Regional Jet": Plane,
};

const categoryFilterOptions = computed(() => [
  {
    value: "",
    label: heroCopy.value.allAircraft,
    icon: Grid3X3,
  },
  ...categoryOptions.value
    .filter((option) =>
      [
        "HelicÃ³ptero",
        "TurbohÃ©lice",
        "Jet ligero (Light Jet)",
        "Midsize Jet (Mid Jet)",
        "Heavy Jet",
      ].includes(option.value),
    )
    .map((option) => ({
      value: option.value,
      label: getCategoryChipLabel(option.value),
      icon: categoryIcons[option.value] || Plane,
    })),
]);

const capacityFilterOptions = computed(() => [
  { value: "all", label: isEnglish.value ? "All Capacity" : "Toda capacidad" },
  { value: "1-6", label: "1 - 6 pax" },
  { value: "7-9", label: "7 - 9 pax" },
  { value: "10-13", label: "10 - 13 pax" },
  { value: "14", label: "14+ pax" },
]);

const filterLabels = computed(() => ({
  search: props.content.filters?.search || "Buscar",
  searchPlaceholder:
    props.content.filters?.searchPlaceholder || "Nombre o fabricante",
  category: props.content.filters?.category || "Categoría",
  allCategories: props.content.filters?.allCategories || "Todas",
  base: props.content.filters?.base || "Base",
  allBases: props.content.filters?.allBases || "Todas",
  passengers: props.content.filters?.passengers || "Pasajeros mínimos",
  passengersPlaceholder:
    props.content.filters?.passengersPlaceholder || "Mínimo de pasajeros",
  results: props.content.filters?.results || "aeronaves encontradas",
  empty:
    props.content.filters?.empty || "No encontramos aeronaves con esos filtros.",
  categoryOptions: props.content.filters?.categoryOptions || {},
}));

const assetUrl = (path = "") =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

const tryParseJson = (value) => {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (
    !(trimmed.startsWith("[") && trimmed.endsWith("]")) &&
    !(trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    return value;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};

const tryParsePostgresArray = (value) => {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!(trimmed.startsWith("{") && trimmed.endsWith("}"))) {
    return value;
  }

  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];

  return inner
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((item) => item.trim().replace(/^"(.*)"$/, "$1"))
    .map((item) => item.replace(/\\"/g, '"'))
    .filter(Boolean);
};

const normalizeImageValue = (value) => {
  const parsedValue = tryParsePostgresArray(tryParseJson(value));

  if (!parsedValue) return [];

  if (Array.isArray(parsedValue)) {
    return parsedValue.flatMap((item) => normalizeImageValue(item));
  }

  if (typeof parsedValue === "string") {
    const trimmed = parsedValue.trim();
    return trimmed ? [trimmed] : [];
  }

  if (parsedValue && typeof parsedValue === "object") {
    return [parsedValue.url, parsedValue.imagen_url, parsedValue.publicUrl]
      .filter((item) => typeof item === "string" && item.trim().length > 0);
  }

  return [];
};

const normalizeImageList = (...sources) => [
  ...new Set(sources.flatMap((source) => normalizeImageValue(source))),
];

const getPrimaryImage = (item) =>
  normalizeImageList(item.imagen_url)[0] ||
  normalizeImageList(item.exterior_images)[0] ||
  normalizeImageList(item.interior_images)[0] ||
  null;

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const isEnglish = computed(() => locale.value === "en-us");

const aircraftCategoryLabels = {
  "Helicóptero": {
    "es-mx": "Helicóptero",
    "en-us": "Helicopter",
  },
  "Monomotor Pistón": {
    "es-mx": "Monomotor Pistón",
    "en-us": "Single-Engine Piston",
  },
  Turbohélice: {
    "es-mx": "Turbohélice",
    "en-us": "Turboprop",
  },
  "Jet ligero (Light Jet)": {
    "es-mx": "Jet ligero (Light Jet)",
    "en-us": "Light Jet",
  },
  "Midsize Jet (Mid Jet)": {
    "es-mx": "Midsize Jet (Mid Jet)",
    "en-us": "Midsize Jet",
  },
  "Super Midsize Jet": {
    "es-mx": "Super Midsize Jet",
    "en-us": "Super Midsize Jet",
  },
  "Heavy Jet": {
    "es-mx": "Heavy Jet",
    "en-us": "Heavy Jet",
  },
  "Regional Jet": {
    "es-mx": "Regional Jet",
    "en-us": "Regional Jet",
  },
};

const getAircraftCategoryLabel = (item) => {
  const category = String(item?.categoria || "").trim();
  if (!category) return "";

  const localizedCategory = aircraftCategoryLabels[category]?.[locale.value];
  return localizedCategory || category;
};

const getAircraftDescription = (item) => {
  const name = item?.nombre || "";
  const category = getAircraftCategoryLabel(item);
  const passengers = item?.capacidad_pasajeros || "-";
  const speed = item?.cruise_speed_knots || item?.alcance_horas || "-";
  const range = item?.alcance_nm || "-";
  const description = String(item?.descripcion || "").trim();

  if (!isEnglish.value) {
    return (
      description ||
      `${name} ${category.toLowerCase()} con capacidad para ${passengers} pasajeros, velocidad crucero aproximada de ${speed} knots y autonomia aproximada de ${range} NM.`
    );
  }

  return `${name} ${category.toLowerCase()} with capacity for ${passengers} passengers, estimated cruise speed of ${speed} knots, and approximate range of ${range} NM.`;
};

const getAirportLabel = (code) => {
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (!normalizedCode) return "";

  return airportLabels.value[normalizedCode] || `Base ${normalizedCode}`;
};

const baseOptions = computed(() =>
  [...new Set(allAircraft.value.map((item) => String(item.base || "").trim().toUpperCase()).filter(Boolean))]
    .sort()
    .map((code) => ({
      value: code,
      label: getAirportLabel(code),
    })),
);

const aircraftSearchOptions = computed(() =>
  [
    ...new Set(
      allAircraft.value
        .map((item) => item.nombre)
        .map((value) => String(value || "").trim())
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b)),
);

const filteredAircraftSearchOptions = computed(() => {
  const query = normalizeText(searchQuery.value);

  return aircraftSearchOptions.value
    .filter((option) => !query || normalizeText(option).includes(query));
});

const filteredAircraft = computed(() => {
  const query = normalizeText(searchQuery.value);
  const category = selectedCategory.value;
  const base = selectedBase.value;
  const minPassengers = Number(minimumPassengers.value);

  return allAircraft.value.filter((item) => {
    const passengers = Number(item.capacidad_pasajeros || 0);
    const matchesQuery =
      !query ||
      normalizeText(item.nombre).includes(query) ||
      normalizeText(item.fabricante).includes(query);

    const matchesCategory = !category || item.categoria === category;
    const matchesBase =
      !base || String(item.base || "").trim().toUpperCase() === base;
    const matchesPassengers =
      !Number.isFinite(minPassengers) ||
      minPassengers <= 0 ||
      passengers >= minPassengers;
    const matchesCapacityRange =
      capacityFilter.value === "all" ||
      (capacityFilter.value === "1-6" && passengers >= 1 && passengers <= 6) ||
      (capacityFilter.value === "7-9" && passengers >= 7 && passengers <= 9) ||
      (capacityFilter.value === "10-13" && passengers >= 10 && passengers <= 13) ||
      (capacityFilter.value === "14" && passengers >= 14);

    return matchesQuery && matchesCategory && matchesBase && matchesPassengers && matchesCapacityRange;
  });
});

const sortedFilteredAircraft = computed(() => {
  const aircraft = [...filteredAircraft.value];

  if (selectedSort.value === "priceAsc") {
    return aircraft.sort(
      (a, b) => Number(a.precio_renta_usd || 0) - Number(b.precio_renta_usd || 0),
    );
  }

  if (selectedSort.value === "capacityDesc") {
    return aircraft.sort(
      (a, b) => Number(b.capacidad_pasajeros || 0) - Number(a.capacidad_pasajeros || 0),
    );
  }

  if (selectedSort.value === "rangeDesc") {
    return aircraft.sort(
      (a, b) => Number(b.alcance_nm || 0) - Number(a.alcance_nm || 0),
    );
  }

  return aircraft;
});

const totalCount = computed(() => allAircraft.value.length);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedFilteredAircraft.value.length / pageSize)),
);
const paginatedAircraft = computed(() => {
  const from = (currentPage.value - 1) * pageSize;
  const to = from + pageSize;
  return sortedFilteredAircraft.value.slice(from, to);
});

const getCategoryChipLabel = (category) => {
  const label = aircraftCategoryLabels[category]?.[locale.value] || category;

  return String(label)
    .replace(/\s*\((?:Light|Mid) Jet\)/gi, "")
    .replace("Single-Engine Piston", "Single Engine")
    .trim();
};

const formatCurrency = (value) =>
  new Intl.NumberFormat(isEnglish.value ? "en-US" : "es-MX", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const setCategoryFilter = (value) => {
  selectedCategory.value = value;
};

const setCapacityFilter = (value) => {
  capacityFilter.value = value;

  const minimumByFilter = {
    all: null,
    "1-6": 1,
    "7-9": 7,
    "10-13": 10,
    14: 14,
  };

  minimumPassengers.value = minimumByFilter[value] ?? null;
};

const scrollToFleet = () => {
  workspaceRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const goToQuoteRequest = () => {
  router.push({ path: localizedPath("reserva") });
};

const checkAvailability = async (aircraftId) => {
  if (!aircraftId) return false;

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

const handleAircraftComboboxBlur = () => {
  window.setTimeout(() => {
    isAircraftComboboxOpen.value = false;
  }, 120);
};

const selectAircraftSearchOption = (option) => {
  searchQuery.value = option;
  isAircraftComboboxOpen.value = false;
};

const loadFleet = async () => {
  loadingMore.value = true;

  const {
    data: fleetData,
    error,
  } = await supabase
    .from(AIRCRAFT_TABLE)
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("ERROR FLEET:", error);
    loadingMore.value = false;
    return;
  }

  const mappedAircraft = await Promise.all(
    (fleetData || []).map(async (item) => {
      const aircraft = {
        id: item.id,
        nombre: item.name,
        fabricante: item.manufacturer || item.engines || "",
        categoria: item.aircraft_type,
        base: item.iata,
        capacidad_pasajeros: item.capacity_passengers,
        cruise_speed_knots: item.cruise_speed_knots,
        alcance_horas: item.cruise_speed_knots,
        alcance_nm: item.range_nm,
        precio_renta_usd: item.rental_price_usd,
        descripcion: item.descripcion || item.ideal_use,
        disponible: await checkAvailability(item.id),
        imagenes: normalizeImageList(
          getPrimaryImage(item),
          item.exterior_images,
          item.interior_images,
        ),
        unavailableDates: [],
      };

      await loadAvailabilityForAircraft(aircraft);
      return aircraft;
    }),
  );

  allAircraft.value = mappedAircraft;

  loadingMore.value = false;
};

const loadAirportLabels = async () => {
  const [{ data: national }, { data: international }] = await Promise.all([
    supabase.from("aeropuertos_mexico").select("IATA, CIUDAD, AEROPUERTO"),
    supabase.from("airports_geo").select("iata, city, name"),
  ]);

  const nextLabels = {};

  (national || []).forEach((airport) => {
    const code = String(airport?.IATA || "").trim().toUpperCase();
    const city = String(airport?.CIUDAD || "").trim();
    const name = String(airport?.AEROPUERTO || "").trim();
    if (!code) return;
    nextLabels[code] = city ? `${city} (${code})` : name ? `${name} (${code})` : `Base ${code}`;
  });

  (international || []).forEach((airport) => {
    const code = String(airport?.iata || "").trim().toUpperCase();
    const city = String(airport?.city || "").trim();
    const name = String(airport?.name || "").trim();
    if (!code || nextLabels[code]) return;
    nextLabels[code] = city ? `${city} (${code})` : name ? `${name} (${code})` : `Base ${code}`;
  });

  airportLabels.value = nextLabels;
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
    await Promise.all([loadAirportLabels(), loadFleet()]);
  } catch (err) {
    console.error("Error loading fleet:", err);
  }
});

watch([searchQuery, selectedCategory, selectedBase, minimumPassengers, selectedSort], () => {
  currentPage.value = 1;
});

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages;
  }
});

onBeforeUnmount(() => stopAutoSlide());
</script>

<style scoped>
.fleet-page {
  --fleet-ink: #071526;
  --fleet-navy: #061625;
  --fleet-navy-2: #0b2033;
  --fleet-gold: #d5ad63;
  --fleet-gold-2: #f0cc85;
  --fleet-paper: #f6f8fb;
  --fleet-muted: #647184;
  --fleet-line: rgba(7, 21, 38, 0.12);
  color: var(--fleet-ink);
  background: #ffffff;
  overflow-x: clip;
}

.fleet-shell {
  width: min(1240px, calc(100% - 42px));
  margin: 0 auto;
}

.fleet-hero {
  position: relative;
  min-height: 670px;
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
    linear-gradient(90deg, rgba(5, 17, 29, 0.94) 0%, rgba(5, 17, 29, 0.62) 42%, rgba(5, 17, 29, 0.34) 100%),
    linear-gradient(180deg, rgba(5, 17, 29, 0.22) 0%, rgba(5, 17, 29, 0.82) 100%);
}

.fleet-hero__content {
  position: relative;
  z-index: 1;
  padding: 165px 0 58px;
  color: #ffffff;
}

.fleet-eyebrow {
  display: inline-flex;
  color: var(--fleet-gold);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.fleet-eyebrow--light {
  color: var(--fleet-gold-2);
}

.fleet-hero h1 {
  max-width: 720px;
  margin: 0.85rem 0 1rem;
  color: #ffffff;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(3.4rem, 6.4vw, 6.4rem);
  font-weight: 700;
  line-height: 0.95;
}

.fleet-hero p {
  max-width: 560px;
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: 1.1rem;
  line-height: 1.75;
}

.fleet-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 34px;
}

.fleet-button,
.quote-button {
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
}

.fleet-button svg,
.quote-button svg {
  width: 16px;
  height: 16px;
}

.fleet-button--gold {
  border: 1px solid var(--fleet-gold);
  padding: 0 28px;
  background: linear-gradient(180deg, var(--fleet-gold-2), var(--fleet-gold));
  color: #061625;
}

.fleet-button--ghost {
  border: 1px solid rgba(255, 255, 255, 0.54);
  padding: 0 28px;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.fleet-button:hover,
.quote-button:hover {
  transform: translateY(-2px);
}

.fleet-hero__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
  max-width: 820px;
  margin-top: 64px;
}

.fleet-stat {
  display: flex;
  align-items: center;
  gap: 14px;
}

.fleet-stat svg {
  width: 44px;
  height: 44px;
  padding: 9px;
  color: var(--fleet-gold);
  border: 1px solid rgba(213, 173, 99, 0.5);
  border-radius: 999px;
}

.fleet-stat strong,
.fleet-stat span {
  display: block;
}

.fleet-stat strong {
  color: #ffffff;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.8rem;
  line-height: 1;
}

.fleet-stat span {
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  line-height: 1.25;
  text-transform: uppercase;
}

.fleet-workspace {
  padding: 54px 0 78px;
  background: radial-gradient(circle at 100% 8%, rgba(213, 173, 99, 0.08), transparent 24%), var(--fleet-paper);
}

.fleet-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 30px;
  align-items: center;
  margin-bottom: 32px;
}

.fleet-intro h2 {
  max-width: 780px;
  margin: 0.55rem 0 0.6rem;
  color: var(--fleet-ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 4vw, 3.6rem);
  line-height: 0.98;
}

.fleet-intro p {
  max-width: 760px;
  margin: 0;
  color: var(--fleet-muted);
  line-height: 1.65;
}

.fleet-summary {
  min-width: 160px;
  text-align: center;
}

.fleet-summary strong {
  display: block;
  color: var(--fleet-ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3rem;
  line-height: 1;
}

.fleet-summary span {
  display: block;
  margin-top: 0.45rem;
  color: var(--fleet-muted);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.fleet-loading,
.fleet-empty {
  min-height: 260px;
  display: grid;
  place-items: center;
  color: var(--fleet-muted);
}

.fleet-spinner {
  width: 46px;
  height: 46px;
  border: 3px solid rgba(7, 21, 38, 0.1);
  border-top-color: var(--fleet-gold);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.fleet-toolbar {
  display: grid;
  gap: 22px;
  margin-bottom: 22px;
}

.fleet-tabs,
.fleet-chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.fleet-tabs {
  display: grid;
  grid-template-columns: 1.1fr repeat(5, 1fr);
}

.fleet-tab,
.fleet-chip {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba(7, 21, 38, 0.12);
  border-radius: 7px;
  background: #ffffff;
  color: #445268;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-shadow: 0 10px 28px rgba(7, 21, 38, 0.04);
}

.fleet-tab {
  min-width: 0;
  padding: 0 18px;
}

.fleet-chip {
  min-width: 132px;
  padding: 0 16px;
}

.fleet-tab svg,
.fleet-chip svg {
  width: 17px;
  height: 17px;
}

.fleet-tab.active,
.fleet-chip.active,
.fleet-tab:hover,
.fleet-chip:hover {
  background: var(--fleet-ink);
  border-color: var(--fleet-ink);
  color: #ffffff;
}

.fleet-toolbar__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: end;
}

.fleet-field,
.fleet-sort {
  position: relative;
  display: grid;
  gap: 6px;
}

.fleet-field > span,
.fleet-sort > span {
  color: var(--fleet-muted);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.fleet-field input,
.fleet-field select,
.fleet-sort select {
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid rgba(7, 21, 38, 0.12);
  border-radius: 7px;
  outline: none;
  background: #ffffff;
  color: var(--fleet-ink);
  font: inherit;
  font-size: 0.86rem;
  font-weight: 800;
}

.fleet-field--search {
  width: min(260px, 100%);
}

.fleet-field--base {
  width: min(230px, 100%);
}

.fleet-sort {
  width: 250px;
}

.fleet-combobox {
  position: relative;
}

.fleet-combobox__menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 20;
  max-height: 280px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid rgba(7, 21, 38, 0.08);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 20px 40px rgba(7, 21, 38, 0.14);
}

.fleet-combobox__option {
  width: 100%;
  min-height: 42px;
  justify-content: flex-start;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--fleet-ink);
  font: inherit;
  font-weight: 800;
  text-align: left;
}

.fleet-combobox__option:hover {
  background: rgba(213, 173, 99, 0.14);
}

.fleet-results {
  margin: 0 0 18px;
  color: var(--fleet-muted);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fleet-list {
  display: grid;
  gap: 16px;
}

.aircraft-row {
  position: relative;
  display: grid;
  grid-template-columns: minmax(250px, 390px) minmax(0, 1fr) minmax(230px, 300px);
  gap: 28px;
  align-items: stretch;
  padding: 12px 22px 12px 12px;
  border: 1px solid rgba(7, 21, 38, 0.08);
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 18px 46px rgba(7, 21, 38, 0.08);
}

.aircraft-media {
  position: relative;
  display: block;
  width: 100%;
  min-height: 210px;
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
  left: 16px;
  bottom: 16px;
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--fleet-ink);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.aircraft-media:hover img {
  transform: scale(1.04);
}

.aircraft-main {
  align-self: center;
  padding: 12px 0;
}

.aircraft-category {
  display: block;
  color: var(--fleet-gold);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.aircraft-main h3 {
  margin: 0.35rem 0 0.55rem;
  color: var(--fleet-ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.75rem, 2.8vw, 2.55rem);
  line-height: 1;
}

.aircraft-main p {
  max-width: 620px;
  margin: 0;
  color: #526177;
  line-height: 1.55;
}

.aircraft-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 18px;
  margin-top: 18px;
}

.aircraft-specs span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
  color: #28384c;
  font-size: 0.76rem;
  font-weight: 800;
}

.aircraft-specs svg {
  width: 15px;
  height: 15px;
  color: var(--fleet-ink);
}

.aircraft-specs strong {
  color: var(--fleet-ink);
}

.aircraft-status--available {
  color: #16813e !important;
}

.aircraft-status--unavailable {
  color: #b73737 !important;
}

.aircraft-action {
  position: relative;
  display: grid;
  align-content: center;
  gap: 12px;
  border-left: 1px solid rgba(7, 21, 38, 0.12);
  padding: 14px 0 14px 26px;
}

.aircraft-favorite {
  position: absolute;
  top: 8px;
  right: 0;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #7d8aa0;
}

.aircraft-favorite svg {
  width: 18px;
  height: 18px;
}

.aircraft-price span,
.aircraft-price em {
  display: block;
  color: var(--fleet-muted);
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 800;
}

.aircraft-price span {
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.aircraft-price strong {
  display: block;
  margin: 0.2rem 0 0.25rem;
  color: var(--fleet-ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2rem;
  line-height: 1;
}

.aircraft-price small {
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 800;
}

.quote-button {
  width: 100%;
  padding: 0 18px;
}

.quote-button--dark {
  border: 1px solid var(--fleet-ink);
  background: var(--fleet-ink);
  color: #ffffff;
}

.quote-button--dark:hover {
  background: var(--fleet-navy-2);
}

.quote-button--outline {
  border: 1px solid rgba(213, 173, 99, 0.75);
  background: #ffffff;
  color: #b4873d;
}

.quote-button--outline:hover {
  background: rgba(213, 173, 99, 0.1);
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 44px;
}

.pagination button,
.pagination span {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-radius: 7px;
  border: 1px solid rgba(7, 21, 38, 0.12);
  background: #ffffff;
  color: var(--fleet-ink);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.pagination button:hover:not(:disabled) {
  background: var(--fleet-ink);
  color: #ffffff;
}

.pagination button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.fleet-benefits {
  background: linear-gradient(180deg, var(--fleet-navy-2), var(--fleet-navy));
  color: #ffffff;
}

.fleet-benefits__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  padding: 34px 0;
}

.fleet-benefit {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 28px;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
}

.fleet-benefit:first-child {
  border-left: 0;
  padding-left: 0;
}

.fleet-benefit svg {
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  color: var(--fleet-gold);
}

.fleet-benefit strong,
.fleet-benefit span {
  display: block;
}

.fleet-benefit strong {
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.fleet-benefit span {
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.35;
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
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1;
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
  color: var(--fleet-ink);
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

@media (max-width: 1100px) {
  .fleet-hero__stats,
  .fleet-benefits__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fleet-intro,
  .fleet-toolbar__row,
  .aircraft-row,
  .fleet-modal-grid {
    grid-template-columns: 1fr;
  }

  .aircraft-action {
    border-left: 0;
    border-top: 1px solid rgba(7, 21, 38, 0.12);
    padding: 22px 0 10px;
  }

  .aircraft-favorite {
    right: 0;
    top: 14px;
  }

  .modal-media {
    min-height: 380px;
  }
}

@media (max-width: 768px) {
  .fleet-shell {
    width: min(100% - 32px, 1240px);
  }

  .fleet-hero {
    min-height: 720px;
  }

  .fleet-hero__content {
    padding: 120px 0 42px;
  }

  .fleet-hero h1 {
    font-size: 3.15rem;
  }

  .fleet-hero__stats,
  .fleet-benefits__grid {
    grid-template-columns: 1fr;
  }

  .fleet-stat {
    align-items: flex-start;
  }

  .fleet-workspace {
    padding: 46px 0 64px;
  }

  .fleet-intro {
    margin-bottom: 26px;
  }

  .fleet-summary {
    text-align: left;
  }

  .fleet-tabs,
  .fleet-chip-group {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .fleet-tabs {
    display: flex;
  }

  .fleet-tab,
  .fleet-chip {
    flex: 0 0 auto;
  }

  .fleet-sort {
    width: 100%;
  }

  .aircraft-row {
    gap: 16px;
    padding: 10px;
  }

  .aircraft-media {
    min-height: 225px;
  }

  .aircraft-price strong {
    font-size: 1.7rem;
  }

  .fleet-benefits__grid {
    padding: 24px 0;
  }

  .fleet-benefit {
    padding: 18px 0;
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .fleet-benefit:first-child {
    border-top: 0;
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
