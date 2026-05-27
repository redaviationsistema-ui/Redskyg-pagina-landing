<template>
  <MainLayout>
    <section class="quote section">
      <img class="hero-bg" src="/images/reserva/DSC03873.jpg" />
      <div class="quote-overlay"></div>

      <div class="container quote-content">
        <div class="quote-right">
          <div class="quote-left">
            <div class="quote-header">
              <h5 class="subtitle">{{ copy.subtitle }}</h5>
              <h2>{{ copy.title }}</h2>
            </div>
          </div>

          <div class="quote-right">
            <ReservationForm
              :form="form"
              :routes="routes"
              :routeType="routeType"
              :returnToBaseEnabled="returnToBaseEnabled"
              :countries="countries"
              :states="states"
              :citiesByState="citiesByState"
              :citiesByCountry="citiesByCountry"
              :airportsByCity="airportsByCity"
              :aircraftFleet="aircraftFleet"
              :loading="loading"
              :errorMessage="errorMessage"
              :allowedAirportTypes="allowedAirportTypes"
              :blockedDates="blockedDates"
              :aircraftAvailability="aircraftAvailability"
              :locale="currentLocale"
              @update:routeType="routeType = $event"
              @addRoute="addRoute"
              @closeAtBase="closeAtBase"
              @removeRoute="removeRoute"
              @reopenRoutes="reopenRoutes"
              @preview="submitForm"
            />
          </div>
        </div>
      </div>
    </section>

    <QuoteModal
      v-if="showQuoteModal"
      :form="form"
      :routes="billableRoutes"
      :breakdowns="billableBreakdowns"
      :totalFlightCost="flightCostTotal"
      :totalOvernight="overnightTotal"
      :globalExpenses="operationalExpenses"
      :subtotal="subtotal"
      :iva="iva"
      :totalPrice="totalFinal"
      :isInternational="isInternationalFlight"
      :getAircraftName="getAircraftName"
      :getAircraftById="getAircraftById"
      :locale="currentLocale"
      @close="showQuoteModal = false"
      @confirm="handleConfirm"
    />
  </MainLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { supabase } from "../supabase";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

import MainLayout from "@/layouts/MainLayout.vue";
import ReservationForm from "@/components/reservation/ReservationForm.vue";
import QuoteModal from "@/components/reservation/QuoteModal.vue";
import { generateReservationPDF } from "@/utils/pdfGenerator";

const route = useRoute();
const router = useRouter();
const currentLocale = computed(() =>
  String(route.meta?.locale || "es-mx").toLowerCase(),
);
const isSpanish = computed(() => currentLocale.value === "es-mx");
const copy = computed(() =>
  isSpanish.value
    ? {
        subtitle: "Solicitud de reservación",
        title: "Solicita una reservación de vuelo",
        noAircraft: "No se seleccionó ninguna aeronave.",
        unavailableAircraft:
          "Esta aeronave ya está reservada en el rango de tiempo seleccionado.",
      }
    : {
        subtitle: "Reservation Request",
        title: "Request a Flight Reservation",
        noAircraft: "No aircraft selected.",
        unavailableAircraft:
          "This aircraft is already reserved in that time range.",
      },
);

const showQuoteModal = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const routeType = ref("NATIONAL");
const aircraftAvailability = ref(true);
const returnToBaseEnabled = ref(false);

const norm = (value) =>
  (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getAircraftCruiseSpeed = (aircraft) =>
  toNumber(
    aircraft?.cruise_speed_knots ??
      aircraft?.cruiseSpeedKnots ??
      aircraft?.cruise_speed ??
      aircraft?.speed_knots ??
      aircraft?.speed,
  );

const getAircraftRentalRate = (aircraft) =>
  toNumber(
    aircraft?.rental_price_usd ??
      aircraft?.rentalPriceUsd ??
      aircraft?.precio_renta_usd,
  );

const form = reactive({
  name: "",
  email: "",
  phone: "",
  flightType: "",
});

const emptyRoute = () => ({
  fromCountry: "",
  fromState: "",
  fromCity: "",
  fromAirport: "",
  toCountry: "",
  toState: "",
  toCity: "",
  toAirport: "",
  passengers: 1,
  aircraft_id: null,
  start_date: "",
  end_date: "",
});

const routes = ref([emptyRoute()]);

const getHomeBaseDestination = () => {
  const firstRoute = routes.value[0] || {};

  return {
    toCountry: firstRoute.fromCountry || "",
    toState: firstRoute.fromState || "",
    toCity: firstRoute.fromCity || "",
    toAirport: firstRoute.fromAirport || "",
  };
};

const syncLastRouteDestinationToHomeBase = () => {
  if (!returnToBaseEnabled.value || routes.value.length <= 1) return;

  const lastRoute = routes.value[routes.value.length - 1];
  if (!lastRoute) return;

  Object.assign(lastRoute, getHomeBaseDestination());
};

const airportsNational = ref([]);
const airportsInternational = ref([]);
const aircraftFleet = ref([]);
const blockedDates = ref([]);

const citiesByCountry = (country) => {
  if (!country) return [];

  return [
    ...new Set(
      airportsInternational.value
        .filter((airport) => norm(airport.COUNTRY) === norm(country))
        .map((airport) => airport.CIUDAD)
        .filter(Boolean),
    ),
  ].sort();
};

const states = computed(() => {
  return [
    ...new Set(airportsNational.value.map((airport) => airport.ESTADO).filter(Boolean)),
  ].sort();
});

const countries = computed(() => {
  return [
    ...new Set(
      airportsInternational.value.map((airport) => airport.COUNTRY).filter(Boolean),
    ),
  ].sort();
});

const getAirportOptionValue = (airport) =>
  (airport?.iata || airport?.IATA || airport?.aeropuerto || "").toString().trim();

const allAirports = computed(() => [
  ...airportsNational.value.map((airport) => ({
    source: "NATIONAL",
    aeropuerto: airport.AEROPUERTO,
    iata: (airport.IATA || airport.iata || "").toUpperCase(),
    ciudad: airport.CIUDAD,
    estado: airport.ESTADO,
    country: "MEXICO",
    lat: airport.LATITUDE,
    lng: airport.LONGITUDE,
    type: norm(airport.TYPE),
  })),
  ...airportsInternational.value.map((airport) => ({
    source: "INTERNATIONAL",
    aeropuerto: airport.AEROPUERTO,
    iata: (airport.IATA || "").toUpperCase(),
    ciudad: airport.CIUDAD,
    country: airport.COUNTRY,
    lat: airport.LATITUDE,
    lng: airport.LONGITUDE,
    type: norm(airport.TYPE),
  })),
]);

const validAirports = computed(() => {
  return routeType.value === "NATIONAL"
    ? allAirports.value.filter((airport) => airport.source === "NATIONAL")
    : allAirports.value.filter((airport) => airport.source === "INTERNATIONAL");
});

const airportsByCity = (country, state, city) => {
  if (!city) return [];

  if (routeType.value === "NATIONAL") {
    return validAirports.value.filter(
      (airport) =>
        norm(airport.estado) === norm(state) && norm(airport.ciudad) === norm(city),
    );
  }

  return validAirports.value.filter(
    (airport) =>
      norm(airport.country) === norm(country) && norm(airport.ciudad) === norm(city),
  );
};

const citiesByStateMap = computed(() => {
  const map = {};

  validAirports.value.forEach((airport) => {
    const state = norm(airport.estado);
    if (!map[state]) map[state] = new Set();
    map[state].add(airport.ciudad);
  });

  Object.keys(map).forEach((key) => {
    map[key] = Array.from(map[key]).sort();
  });

  return map;
});

const citiesByState = (state) => {
  if (!state) return [];
  return citiesByStateMap.value[norm(state)] || [];
};

const allowedAirportTypes = computed(() => []);

const getAircraftById = (id) =>
  aircraftFleet.value.find(
    (aircraft) => String(aircraft.id) === String(id),
  );
const getAircraftName = (id) => getAircraftById(id)?.name || "";
const getPrimaryAircraftId = () => routes.value[0]?.aircraft_id || null;
const getRouteAircraftId = (routeItem) =>
  routeItem?.aircraft_id || getPrimaryAircraftId();

const getRouteDateRange = (routeItem) => {
  const fallbackStart = routes.value[0]?.start_date || "";
  const fallbackEnd = routes.value[0]?.end_date || fallbackStart;
  const startValue = routeItem?.start_date || fallbackStart;
  const endValue = routeItem?.end_date || startValue || fallbackEnd;

  if (!startValue) {
    return {
      startISO: "",
      endISO: "",
    };
  }

  return {
    startISO: new Date(startValue).toISOString(),
    endISO: new Date(endValue || startValue).toISOString(),
  };
};

const getReservationBounds = (routeItems) => {
  const ranges = routeItems
    .map((routeItem) => getRouteDateRange(routeItem))
    .filter((range) => range.startISO && range.endISO);

  if (!ranges.length) {
    const firstRange = getRouteDateRange(routes.value[0]);
    return {
      startISO: firstRange.startISO,
      endISO: firstRange.endISO || firstRange.startISO,
    };
  }

  const sortedStarts = ranges
    .map((range) => range.startISO)
    .sort((left, right) => new Date(left) - new Date(right));
  const sortedEnds = ranges
    .map((range) => range.endISO)
    .sort((left, right) => new Date(left) - new Date(right));

  return {
    startISO: sortedStarts[0],
    endISO: sortedEnds[sortedEnds.length - 1],
  };
};

const findAirportForRoute = (routeItem, direction) => {
  const airportValue =
    direction === "from" ? routeItem?.fromAirport : routeItem?.toAirport;
  const city = direction === "from" ? routeItem?.fromCity : routeItem?.toCity;
  const state = direction === "from" ? routeItem?.fromState : routeItem?.toState;
  const country =
    direction === "from" ? routeItem?.fromCountry : routeItem?.toCountry;

  const directMatch = allAirports.value.find(
    (airport) =>
      norm(getAirportOptionValue(airport)) === norm(airportValue) ||
      norm(airport.aeropuerto) === norm(airportValue),
  );

  if (directMatch) return directMatch;

  const candidates = allAirports.value.filter((airport) => {
    const sameCity = norm(airport.ciudad) === norm(city);
    const sameState = state ? norm(airport.estado) === norm(state) : true;
    const sameCountry = country ? norm(airport.country) === norm(country) : true;
    return sameCity && sameState && sameCountry;
  });

  if (candidates.length === 1) return candidates[0];

  return candidates.find(
    (airport) =>
      norm(getAirportOptionValue(airport)) === norm(airportValue) ||
      norm(airport.aeropuerto) === norm(airportValue),
  );
};

const getRouteAirport = (airportName) =>
  allAirports.value.find(
    (airport) =>
      getAirportOptionValue(airport).toUpperCase() ===
        (airportName || "").toUpperCase() ||
      airport.aeropuerto === airportName,
  );

const getAircraftBaseAirport = (aircraftId) => {
  const aircraft = getAircraftById(aircraftId);
  if (!aircraft?.home_base) return null;

  const iata = norm(aircraft.iata || aircraft.home_base);

  let match = allAirports.value.find(
    (airport) => norm(getAirportOptionValue(airport)) === iata,
  );

  if (match) return match;

  match = allAirports.value.find(
    (airport) =>
      norm(airport.ciudad) === norm(aircraft.ciudad) &&
      (!aircraft.estado || norm(airport.estado) === norm(aircraft.estado)),
  );

  return match || null;
};

const isSameAirportLocation = (leftAirport, rightAirport) => {
  if (!leftAirport || !rightAirport) return false;

  const sameCode =
    norm(getAirportOptionValue(leftAirport)) ===
    norm(getAirportOptionValue(rightAirport));
  const sameName =
    norm(leftAirport.aeropuerto) === norm(rightAirport.aeropuerto);
  const sameCity = norm(leftAirport.ciudad) === norm(rightAirport.ciudad);
  const sameState =
    norm(leftAirport.estado || "") === norm(rightAirport.estado || "");
  const sameCountry =
    norm(leftAirport.country || "") === norm(rightAirport.country || "");

  return sameCode || sameName || (sameCity && sameState && sameCountry);
};

const isRouteEndpointAtBase = (routeItem, direction, baseAirport) => {
  const endpointAirport = findAirportForRoute(routeItem, direction);

  if (!endpointAirport) return false;

  return isSameAirportLocation(endpointAirport, baseAirport);
};

const buildPositioningRoute = (
  aircraftId,
  fromAirport,
  toAirport,
  positioningType = "repositioning",
) => ({
  aircraft_id: aircraftId,
  fromAirport,
  toAirport,
  passengers: 1,
  start_date: "",
  end_date: "",
  positioning: true,
  positioningType,
});

const getRouteNights = (routeItem) => {
  if (!routeItem?.start_date || !routeItem?.end_date) return 0;

  const start = new Date(routeItem.start_date);
  const end = new Date(routeItem.end_date);
  return Math.max(0, (end - start) / 86400000);
};

const isInternationalFlight = computed(() => {
  if ((routeType.value || "").toUpperCase() === "INTERNATIONAL") return true;

  return routes.value.some((routeItem) => {
    const from = getRouteAirport(routeItem.fromAirport);
    const to = getRouteAirport(routeItem.toAirport);
    if (!from || !to) return false;
    return norm(from.country) !== norm(to.country);
  });
});

watch(
  () => routes.value.map((routeItem) => `${routeItem.fromState}-${routeItem.fromCity}`),
  () => {
    routes.value.forEach((routeItem) => {
      if (routeItem.fromAirport) return;

      const list = airportsByCity(
        routeItem.fromCountry,
        routeItem.fromState,
        routeItem.fromCity,
      );

      if (list.length === 1) {
        routeItem.fromAirport = getAirportOptionValue(list[0]);
      }
    });
  },
);

onMounted(async () => {
  try {
    loading.value = true;

    const { data: national } = await supabase
      .from("aeropuertos_mexico")
      .select("*");

    const { data: international } = await supabase
      .from("airports_geo")
      .select("*");

    const { data: fleet } = await supabase
      .from("aircraft_fleet")
      .select("*")
      .eq("is_active", true);

    const { data: blocked } = await supabase.from("blocked_dates").select("*");

    airportsNational.value = national || [];
    airportsInternational.value = international || [];
    aircraftFleet.value = fleet || [];
    blockedDates.value = blocked || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  const aircraftId = route.query.aircraftId;
  const flightType = route.query.flightType;

  if (aircraftId) {
    routes.value[0].aircraft_id = aircraftId;
  }

  if (flightType) {
    form.flightType = flightType;
  }
});

const toRad = (deg) => (deg * Math.PI) / 180;

const getDistanceNM = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) / 1.852;
};

const getMinHours = (aircraft, distanceNm) => {
  const configuredMinimum = toNumber(
    aircraft?.minimum_hours ?? aircraft?.minimumHours,
    0,
  );

  if (configuredMinimum > 0) return configuredMinimum;

  const speed = getAircraftCruiseSpeed(aircraft);

  if (distanceNm < 150) return 0.6;
  if (distanceNm < 300) return 0.75;
  if (distanceNm < 500) return 1.0;
  if (speed < 200) return 1.5;
  if (speed < 300) return 1.25;
  if (speed < 450) return 1.0;
  if (speed < 600) return 1.25;
  return 1.5;
};

const calculatePrice = (routeItem) => {
  const aircraft = getAircraftById(getRouteAircraftId(routeItem));
  const from = findAirportForRoute(routeItem, "from");
  const to = findAirportForRoute(routeItem, "to");

  if (!aircraft || !from || !to) {
    return {
      ready: false,
      reason: "missing_route_data",
      flightCost: 0,
      overnightCost: 0,
      operationalCost: 0,
      nights: 0,
      total: 0,
      hours: 0,
      miles: 0,
    };
  }

  const fromLat = Number(from.lat);
  const fromLng = Number(from.lng);
  const toLat = Number(to.lat);
  const toLng = Number(to.lng);

  if (
    !Number.isFinite(fromLat) ||
    !Number.isFinite(fromLng) ||
    !Number.isFinite(toLat) ||
    !Number.isFinite(toLng)
  ) {
    return {
      ready: false,
      reason: "missing_airport_coordinates",
      flightCost: 0,
      overnightCost: 0,
      operationalCost: 0,
      nights: 0,
      total: 0,
      hours: 0,
      miles: 0,
    };
  }

  const distanceNm = getDistanceNM(fromLat, fromLng, toLat, toLng);
  const adjustedDistanceNm =
    distanceNm * (isInternationalFlight.value ? 1.15 : 1.12);

  const speed = getAircraftCruiseSpeed(aircraft);

  if (!speed || speed <= 0) {
    return {
      ready: false,
      reason: "missing_aircraft_speed",
      flightCost: 0,
      overnightCost: 0,
      operationalCost: 0,
      nights: 0,
      total: 0,
      hours: 0,
      miles: 0,
    };
  }

  const airTime = adjustedDistanceNm / speed;
  const buffer =
    adjustedDistanceNm < 300
      ? 0.25
      : adjustedDistanceNm < 600
        ? 0.35
        : adjustedDistanceNm < 1000
          ? 0.45
          : 0.5;
  let hours = Math.ceil((airTime + buffer) * 4) / 4;
  const minHours = getMinHours(aircraft, adjustedDistanceNm);

  if (hours < minHours) hours = minHours;

  const flightCost = Number(
    (hours * getAircraftRentalRate(aircraft)).toFixed(2),
  );
  const nights = getRouteNights(routeItem);
  const crewOvernightUsd = toNumber(
    aircraft.crew_overnight_usd ?? aircraft.crewOvernightUsd,
    0,
  );
  const overnightRate =
    crewOvernightUsd > 0
      ? crewOvernightUsd
      : getAircraftRentalRate(aircraft) * 0.5;
  const overnightCost = Number((nights * overnightRate).toFixed(2));
  const operationalCost = toNumber(
    isInternationalFlight.value
      ? aircraft.international_expenses_usd
      : aircraft.national_expenses_usd,
  );
  const total = Number((flightCost + overnightCost).toFixed(2));

  return {
    ready: true,
    reason: "",
    flightCost,
    overnightCost,
    operationalCost,
    nights,
    total,
    hours,
    miles: Number(distanceNm.toFixed(1)),
  };
};

const validRoutes = computed(() =>
  routes.value.filter(
    (routeItem) =>
      Number(routeItem.passengers) > 0 &&
      getRouteAircraftId(routeItem) &&
      routeItem.fromAirport &&
      routeItem.toAirport,
  ),
);

const priceBreakdowns = computed(() =>
  validRoutes.value.map((routeItem) => calculatePrice(routeItem)),
);

const billableRoutes = computed(() => {
  if (!validRoutes.value.length) return [];

  const firstRoute = validRoutes.value[0];
  const lastRoute = validRoutes.value[validRoutes.value.length - 1];
  const aircraftId = firstRoute?.aircraft_id;
  const aircraftBase = getAircraftBaseAirport(aircraftId);

  if (!aircraftBase?.iata) {
    return [...validRoutes.value];
  }

  const baseAirport = aircraftBase.iata;
  const calculatedRoutes = [];

  if (!isRouteEndpointAtBase(firstRoute, "from", aircraftBase)) {
    calculatedRoutes.push(
      buildPositioningRoute(
        aircraftId,
        baseAirport,
        firstRoute.fromAirport,
        "repositioning",
      ),
    );
  }

  calculatedRoutes.push(...validRoutes.value);

  if (!isRouteEndpointAtBase(lastRoute, "to", aircraftBase)) {
    calculatedRoutes.push(
      buildPositioningRoute(
        aircraftId,
        lastRoute.toAirport,
        baseAirport,
        "return_to_base",
      ),
    );
  }

  return calculatedRoutes;
});

const billableBreakdowns = computed(() =>
  billableRoutes.value.map((routeItem) => calculatePrice(routeItem)),
);

const flightCostTotal = computed(() =>
  billableBreakdowns.value.reduce((sum, item) => sum + item.flightCost, 0),
);

const overnightTotal = computed(() => priceBreakdowns.value[0]?.overnightCost || 0);

const operationalExpenses = computed(() => {
  const aircraft = getAircraftById(routes.value[0]?.aircraft_id);
  if (!aircraft) return 0;

  return toNumber(
    isInternationalFlight.value
      ? aircraft.international_expenses_usd
      : aircraft.national_expenses_usd,
  );
});

const subtotal = computed(
  () =>
    flightCostTotal.value + overnightTotal.value + operationalExpenses.value,
);

const getTaxRate = () => (isInternationalFlight.value ? 0.04 : 0.16);

const iva = computed(() => Number((subtotal.value * getTaxRate()).toFixed(2)));
const totalFinal = computed(() =>
  Number((subtotal.value + iva.value).toFixed(2)),
);

const submitForm = () => {
  if (!validRoutes.value.length) {
    errorMessage.value =
      "Completa la aeronave, origen, destino y fechas válidas antes de continuar.";
    return;
  }

  const invalidBreakdown = billableBreakdowns.value.find((item) => !item.ready);

  if (invalidBreakdown) {
    const aircraftName =
      getAircraftName(routes.value[0]?.aircraft_id) || "la aeronave seleccionada";
    const reasonMessages = {
      missing_route_data:
        "No se pudo generar la cotización porque falta relacionar un aeropuerto de origen o destino con la ruta seleccionada.",
      missing_airport_coordinates:
        "No se pudo generar la cotización porque uno de los aeropuertos seleccionados no tiene coordenadas configuradas.",
      missing_aircraft_speed: `No se pudo generar la cotización porque ${aircraftName} no tiene velocidad configurada.`,
    };

    errorMessage.value =
      reasonMessages[invalidBreakdown.reason] ||
      "No se pudo generar la cotización con la configuración actual.";
    return;
  }

  errorMessage.value = "";
  showQuoteModal.value = true;
};

const addRoute = () => {
  const last = routes.value[routes.value.length - 1];
  const previousDestination = {
    fromCountry: last?.toCountry || "",
    fromState: last?.toState || "",
    fromCity: last?.toCity || "",
    fromAirport: last?.toAirport || "",
  };

  routes.value.push({
    id: Date.now() + Math.random(),
    ...previousDestination,
    toCountry: "",
    toState: "",
    toCity: "",
    toAirport: "",
    passengers: last?.passengers || 1,
    aircraft_id: last?.aircraft_id || null,
    start_date: "",
    end_date: "",
  });
};

const closeAtBase = () => {
  if (returnToBaseEnabled.value) return;

  const last = routes.value[routes.value.length - 1];
  const homeBaseDestination = getHomeBaseDestination();

  routes.value.push({
    id: Date.now() + Math.random(),
    fromCountry: last?.toCountry || "",
    fromState: last?.toState || "",
    fromCity: last?.toCity || "",
    fromAirport: last?.toAirport || "",
    toCountry: homeBaseDestination.toCountry,
    toState: homeBaseDestination.toState,
    toCity: homeBaseDestination.toCity,
    toAirport: homeBaseDestination.toAirport,
    passengers: last?.passengers || 1,
    aircraft_id: last?.aircraft_id || routes.value[0]?.aircraft_id || null,
    start_date: "",
    end_date: "",
  });

  returnToBaseEnabled.value = true;
};

const reopenRoutes = () => {
  if (!returnToBaseEnabled.value) return;

  routes.value.pop();
  returnToBaseEnabled.value = false;
};

const removeRoute = (index) => {
  if (routes.value.length <= 1) return;
  if (returnToBaseEnabled.value && index === routes.value.length - 1) {
    returnToBaseEnabled.value = false;
  }
  routes.value.splice(index, 1);
};

const handleConfirm = async () => {
  try {
    loading.value = true;
    const firstRoute = routes.value[0];
    const aircraftId = getRouteAircraftId(firstRoute);

    if (!aircraftId) throw new Error(copy.value.noAircraft);

    const { startISO, endISO } = getReservationBounds(validRoutes.value);

    const { data: existingReservations, error: availabilityError } =
      await supabase
        .from("reservations")
        .select("id")
        .eq("aircraft_id", aircraftId)
        .in("status", ["pending", "confirmed"])
        .lt("start_datetime", endISO)
        .gt("end_datetime", startISO);

    if (availabilityError) throw availabilityError;
    if (existingReservations.length > 0) {
      alert(copy.value.unavailableAircraft);
      loading.value = false;
      return;
    }

    const { data: quoteData, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        flight_type: form.flightType,
        total_estimated_price: totalFinal.value,
      })
      .select()
      .single();

    if (quoteError) throw quoteError;
    const quoteId = quoteData.id;

    const routesPayload = validRoutes.value.map((routeItem, index) => {
      return {
        quote_id: quoteId,
        from_airport: routeItem.fromAirport,
        to_airport: routeItem.toAirport,
        passengers: routeItem.passengers,
        aircraft_id: getRouteAircraftId(routeItem),
        estimated_price: priceBreakdowns.value[index]?.flightCost || 0,
      };
    });

    const { error: routesError } = await supabase
      .from("quote_routes")
      .insert(routesPayload);

    if (routesError) throw routesError;

    const blobToBase64 = (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

    const pdfBlob = await generateReservationPDF({
      form,
      routes: billableRoutes.value,
      breakdowns: billableBreakdowns.value,
      totals: {
        flight: flightCostTotal.value,
        overnight: overnightTotal.value,
        expenses: operationalExpenses.value,
        subtotal: subtotal.value,
        iva: iva.value,
        total: totalFinal.value,
      },
      getAircraftName,
      getAircraftById,
    });

    const pdfBase64 = await blobToBase64(pdfBlob);

    const res = await fetch(
      "https://redskyg.com/landing/send-email_movil_cliente.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form,
          routes: billableRoutes.value,
          subtotal: subtotal.value,
          iva: iva.value,
          total: totalFinal.value,
          pdf: pdfBase64,
        }),
      },
    );

    const text = await res.text();
    console.log("SERVER RESPONSE:", text);

    showQuoteModal.value = false;
    router.push({
      path: "/thank-you",
      query: {
        name: form.name,
      },
    });

    resetForm();
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.phone = "";
  form.flightType = "";
  errorMessage.value = "";
  returnToBaseEnabled.value = false;
  routes.value = [emptyRoute()];
};

watch(
  () => [
    routes.value[0].start_date,
    routes.value[0].end_date,
    routes.value[0].aircraft_id,
  ],
  async () => {
    const currentRoute = routes.value[0];
    if (!currentRoute.start_date || !currentRoute.aircraft_id) return;

    const start = new Date(currentRoute.start_date).toISOString();
    const end = currentRoute.end_date
      ? new Date(currentRoute.end_date).toISOString()
      : start;

    const { data } = await supabase
      .from("reservations")
      .select("id")
      .eq("aircraft_id", currentRoute.aircraft_id)
      .lt("start_datetime", end)
      .gt("end_datetime", start);

    aircraftAvailability.value = !data?.length;
  },
);

watch(
  () => routes.value[0]?.aircraft_id,
  (aircraftId) => {
    routes.value.forEach((routeItem, index) => {
      if (index === 0) return;
      routeItem.aircraft_id = aircraftId || null;
    });
  },
);

watch(
  () => [
    routeType.value,
    routes.value.length,
    routes.value[0]?.fromCountry,
    routes.value[0]?.fromState,
    routes.value[0]?.fromCity,
    routes.value[0]?.fromAirport,
  ],
  () => {
    syncLastRouteDestinationToHomeBase();
  },
  { immediate: true },
);
</script>

<style>
.quote {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding-top: var(--header-height);
  padding-bottom: 80px;
  background: #000;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.quote-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.75));
  z-index: 1;
}

.quote-content {
  position: relative;
  z-index: 2;
  padding-top: 60px;
}

.quote-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  align-items: start;
}

.quote-left {
  display: flex;
  align-items: flex-start;
  padding-top: 80px;
}

.quote-header h5.subtitle {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #cfcfcf;
  margin-bottom: 0.5rem;
}

.quote-header h2 {
  font-size: 2.4rem;
  font-weight: 300;
  color: #fff;
  margin-bottom: 0.8rem;
  line-height: 1.2;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.6rem;
  margin-bottom: 1.4rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: span 2;
}

label {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
  color: #444;
}

input,
select,
textarea {
  padding: 0.7rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.85rem;
  background: #fff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.12);
}

.btn-primary {
  background: linear-gradient(135deg, #0d6efd, #003eaa);
  color: #fff;
  padding: 0.75rem 1.4rem;
  border-radius: 5px;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(13, 110, 253, 0.35);
}

.btn-secondary {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  background: #f1f3f5;
  color: #333;
  padding: 0.65rem 1.2rem;
  border-radius: 5px;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px dashed #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e9ecef;
  border-color: #0d6efd;
  color: #0d6efd;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 18, 32, 0.85);
  backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
}

.modal-card {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 992px) {
  .quote-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .quote-right {
    justify-content: center;
    padding-top: 0;
  }

  .quote-left {
    padding-top: 40px;
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr !important;
  }

  .form-group.full {
    grid-column: span 1 !important;
  }

  input,
  select,
  textarea {
    width: 100%;
    max-width: 100%;
  }

  .quote-grid {
    grid-template-columns: 1fr;
  }

  .quote-right {
    display: block;
    padding-top: 0;
  }

  .quote-form {
    width: 100%;
    max-width: 380px;
    margin: 0 auto;
  }

  .container {
    padding-left: 15px !important;
    padding-right: 15px !important;
  }

  .container.quote-content {
    max-width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .quote-content {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
