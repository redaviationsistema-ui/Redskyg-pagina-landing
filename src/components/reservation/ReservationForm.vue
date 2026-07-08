<template>
  <form class="quote-form" @submit.prevent="handlePreview">
    <!-- ================= FLIGHT CONFIGURATION ================= -->
    <div class="form-row">
      <div class="form-group">
        <label>{{ t.flightType }}</label>
        <select
          v-model="form.flightType"
          :class="{ invalid: errors.flightType }"
        >
          <option value="">{{ t.select }}</option>
          <option value="Private Jet">{{ t.privateJet }}</option>
          <option value="Helicopter">{{ t.helicopter }}</option>
          <option value="Air Ambulance">{{ t.airAmbulance }}</option>
          <option value="Cargo">{{ t.cargo }}</option>
        </select>
        <small v-if="errors.flightType" class="error-text">
          {{ errors.flightType }}
        </small>
      </div>

      <div class="form-group">
        <label>{{ t.routeType }}</label>
        <select v-model="localRouteType">
          <option value="">{{ t.select }}</option>
          <option value="NATIONAL">{{ t.national }}</option>
          <option value="INTERNATIONAL">{{ t.international }}</option>
        </select>
        <small v-if="errors.routeType" class="error-text">
          {{ errors.routeType }}
        </small>
      </div>
    </div>

    <!-- ================= AIRCRAFT & DATES ================= -->

    <div v-if="routes.length">
      <div class="form-group">
        <label>{{ t.aircraft }}</label>

        <!-- 🔒 Vista premium -->
        <div
          v-if="selectedAircraft && !allowAircraftChange"
          class="aircraft-display-card"
        >
          <div class="aircraft-header">
            <div class="aircraft-name">
              {{ selectedAircraft.name }}
            </div>

            <button
              type="button"
              class="change-aircraft-btn"
              @click="allowAircraftChange = true"
            >
              {{ t.change }}
            </button>
          </div>

          <div class="aircraft-meta">
            <div>
              <span>{{ t.capacity }}</span>
              <strong>{{ selectedAircraft.capacity_passengers }} pax</strong>
            </div>

            <div>
              <span>{{ t.type }}</span>
              <strong>{{ selectedAircraft.aircraft_type }}</strong>
            </div>

            <div>
              <span>{{ t.base }}</span>
              <strong>{{ getAircraftBaseLabel(selectedAircraft) }}</strong>
            </div>
          </div>
        </div>

        <!-- 🔓 Select editable -->
        <select
          v-else
          v-model="routes[0].aircraft_id"
          @change="allowAircraftChange = false"
          :class="{ invalid: errors[`aircraft_0`] }"
        >
          <option value="">{{ t.selectAircraft }}</option>

          <option v-for="a in filteredFleet" :key="a.id" :value="a.id">
            {{ a.name }} - {{ a.capacity_passengers }} pax - {{ t.base }}: {{ getAircraftBaseLabel(a) }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>{{ t.departureDate }}</label>
          <input
            type="datetime-local"
            v-model="routes[0].start_date"
            :class="{
              invalid: errors[`start_0`],
              blocked: isBlocked(routes[0].start_date, routes[0].aircraft_id),
              available:
                routes[0].start_date &&
                routes[0].aircraft_id &&
                !isBlocked(routes[0].start_date, routes[0].aircraft_id),
            }"
          />

          <!-- 🔥 MENSAJE CUANDO ESTÁ BLOQUEADO -->
          <small
            v-if="isBlocked(routes[0].start_date, routes[0].aircraft_id)"
            class="availability-error"
          >
            {{ t.aircraftUnavailable }}
          </small>
        </div>

        <div class="form-group">
          <label>{{ t.returnDate }}</label>
          <input
            type="datetime-local"
            v-model="routes[0].end_date"
            :min="routes[0].start_date"
            :class="{
              invalid: errors[`end_0`],
              blocked: isBlocked(routes[0].end_date, routes[0].aircraft_id),
              available:
                routes[0].end_date &&
                routes[0].aircraft_id &&
                !isBlocked(routes[0].end_date, routes[0].aircraft_id),
            }"
          />
          <small v-if="errors[`end_0`]" class="error-text">
            {{ errors[`end_0`] }}
          </small>
        </div>
      </div>
    </div>

    <!-- ================= ROUTES ================= -->

    <div v-if="routeType">
      <!-- <div v-for="(route, index) in routes" :key="index" class="route-block"> -->
      <div
        v-for="(route, index) in routes"
        :key="route.id || index"
        class="route-block"
      >
        <h4>{{ t.route }} {{ index + 1 }}</h4>

        <template v-if="routeType === 'NATIONAL'">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t.fromState }}</label>
              <select
                v-model="route.fromState"
                :disabled="isFirstRouteOriginLocked(index)"
              >
                <option value="">{{ t.selectState }}</option>
                <option v-for="state in states" :key="state" :value="state">
                  {{ state }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ t.fromCity }}</label>
              <select
                v-model="route.fromCity"
                :disabled="isFirstRouteOriginLocked(index) || !route.fromState"
                :key="route.fromState"
              >
                <option value="">{{ t.selectCity }}</option>
                <option
                  v-for="city in citiesByState(route.fromState)"
                  :key="city"
                  :value="city"
                >
                  {{ city }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group full">
            <label>{{ t.fromAirport }}</label>
            <select
              v-model="route.fromAirport"
              :disabled="isFirstRouteOriginLocked(index) || !route.fromCity"
              @change="clearAirportError('from', index)"
            >
              <option value="">{{ t.selectAirport }}</option>

              <option
                v-for="a in airportsByCity(
                  null,
                  route.fromState,
                  route.fromCity,
                )"
                :value="getAirportOptionValue(a)"
                :key="getAirportOptionValue(a)"
              >
                {{ a.aeropuerto }}
              </option>
            </select>

            <small v-if="errors[`fromAirport_${index}`]" class="error-text">
              {{ errors[`fromAirport_${index}`] }}
            </small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t.toState }}</label>
              <select
                v-model="route.toState"
                :disabled="isLastRouteDestinationLocked(index)"
              >
                <option value="">{{ t.selectState }}</option>
                <option v-for="state in states" :key="state" :value="state">
                  {{ state }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ t.toCity }}</label>
              <!-- <select v-model="route.toCity" :disabled="!route.toState"> -->
              <select
                v-model="route.toCity"
                :disabled="isLastRouteDestinationLocked(index) || !route.toState"
                :key="route.toState"
              >
                <option value="">{{ t.selectCity }}</option>
                <option
                  v-for="city in citiesByState(route.toState)"
                  :key="city"
                  :value="city"
                >
                  {{ city }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group full">
            <label>{{ t.toAirport }}</label>
            <select
              v-model="route.toAirport"
              :disabled="isLastRouteDestinationLocked(index) || !route.toCity"
              :key="route.toCity"
              @change="clearAirportError('to', index)"
            >
              <option value="">{{ t.selectAirport }}</option>

              <option
                v-for="a in airportsByCity(null, route.toState, route.toCity)"
                :value="getAirportOptionValue(a)"
                :key="getAirportOptionValue(a)"
              >
                {{ a.aeropuerto }}
              </option>
            </select>
            <small v-if="errors[`toAirport_${index}`]" class="error-text">
              {{ errors[`toAirport_${index}`] }}
            </small>
          </div>
        </template>

        <template v-else-if="routeType === 'INTERNATIONAL'">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t.fromCountry }}</label>
              <select
                v-model="route.fromCountry"
                :disabled="isFirstRouteOriginLocked(index)"
              >
                <option value="">{{ t.selectCountry }}</option>
                <option
                  v-for="country in countries"
                  :key="country"
                  :value="country"
                >
                  {{ country }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <div class="form-group autocomplete">
                <label>{{ t.fromCity }}</label>

                <div class="autocomplete-wrapper">
                  <input
                    type="text"
                    v-model="searchFromCityFrom[index]"
                    :placeholder="t.searchCity"
                    :disabled="isFirstRouteOriginLocked(index) || !route.fromCountry"
                    @input="filterCitiesFrom(route.fromCountry, index)"
                    @focus="openDropdownFrom(index)"
                    @keydown.down.prevent="moveDownFrom(index)"
                    @keydown.up.prevent="moveUpFrom(index)"
                    @keydown.enter.prevent="selectHighlightedFrom(route, index)"
                    @blur="closeDropdownFrom(index)"
                  />

                  <ul
                    v-if="
                      showDropdownFrom[index] &&
                      filteredCitiesFrom[index]?.length
                    "
                    class="autocomplete-list"
                  >
                    <li
                      v-for="(city, i) in filteredCitiesFrom[index]"
                      :key="city"
                      :class="{ active: highlightedIndexFrom[index] === i }"
                      @mousedown.prevent="selectCityFrom(city, route, index)"
                    >
                      <div class="city-name">{{ city }}</div>
                      <div class="city-meta">{{ route.fromCountry }}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group full">
            <label>{{ t.fromAirport }}</label>
            <select
              v-model="route.fromAirport"
              :disabled="isFirstRouteOriginLocked(index) || !route.fromCity"
              @change="clearAirportError('from', index)"
            >
              <option value="">{{ t.selectAirport }}</option>

              <option
                v-for="a in airportsByCity(
                  route.fromCountry,
                  null,
                  route.fromCity,
                )"
                :key="getAirportOptionValue(a)"
                :value="getAirportOptionValue(a)"
              >
                {{ a.aeropuerto }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t.toCountry }}</label>
              <!-- <select v-model="route.toCountry"> -->
              <select
                v-model="route.toCountry"
                :disabled="isLastRouteDestinationLocked(index)"
                @change="onToCountryChange(route)"
              >
                <option value="">{{ t.selectCountry }}</option>
                <option
                  v-for="country in countries"
                  :key="country"
                  :value="country"
                >
                  {{ country }}
                </option>
              </select>
            </div>

            <div class="form-group autocomplete">
              <label>{{ t.toCity }}</label>

              <div class="autocomplete-wrapper">
                <input
                  type="text"
                  v-model="searchFromCity[index]"
                  :placeholder="t.searchCity"
                  :disabled="isLastRouteDestinationLocked(index) || !route.toCountry"
                  @input="filterCities(route.toCountry, index)"
                  @focus="showDropdown[index] = true"
                  @keydown.down.prevent="moveDown(index)"
                  @keydown.up.prevent="moveUp(index)"
                  @keydown.enter.prevent="selectHighlighted(route, index)"
                  @blur="closeDropdown(index)"
                />

                <ul
                  v-if="showDropdown[index] && filteredCities[index]?.length"
                  class="autocomplete-list"
                >
                  <li
                    v-for="(city, i) in filteredCities[index]"
                    :key="city"
                    :class="{ active: highlightedIndex[index] === i }"
                    @mousedown.prevent="selectCity(city, route, index)"
                  >
                    <div class="city-name">{{ city }}</div>
                    <div class="city-meta">{{ route.toCountry }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="form-group full">
            <label>{{ t.toAirport }}</label>

            <select
              v-model="route.toAirport"
              :disabled="isLastRouteDestinationLocked(index) || !route.toCity"
              @change="clearAirportError('to', index)"
            >
              <option value="">{{ t.selectAirport }}</option>

              <option
                v-for="a in airportsByCity(route.toCountry, null, route.toCity)"
                :key="getAirportOptionValue(a)"
                :value="getAirportOptionValue(a)"
              >
                {{ a.aeropuerto }}
              </option>
            </select>

            <small v-if="errors[`toAirport_${index}`]" class="error-text">
              {{ errors[`toAirport_${index}`] }}
            </small>
          </div>
        </template>

        <!-- PASSENGERS -->
        <div class="form-row">
          <div class="form-group">
            <label>{{ t.passengers }}</label>
            <!-- <input type="number" min="1" v-model="route.passengers" /> -->
            <input
              type="number"
              min="1"
              :max="selectedAircraft?.capacity_passengers || 1"
              v-model="route.passengers"
            />
            <small v-if="errors[`passengers_${index}`]" class="error-text">
              {{ errors[`passengers_${index}`] }}
            </small>
          </div>
        </div>
      </div>
      <div class="route-actions">
        <button
          v-if="!returnToBaseEnabled"
          type="button"
          class="btn-secondary"
          @click="$emit('addRoute')"
        >
          + {{ t.addAnotherRoute }}
        </button>
        <button
          v-if="routes.length > 1"
          type="button"
          class="btn-secondary btn-secondary--danger"
          @click="$emit('removeRoute', routes.length - 1)"
        >
          - {{ t.removeLastRoute }}
        </button>
      </div>
    </div>

    <!-- ================= CONTACT INFORMATION ================= -->

    <div class="form-row">
      <div class="form-group">
        <label>{{ t.fullName }}</label>
        <input v-model="form.name" :class="{ invalid: errors.name }" />
        <small v-if="errors.name" class="error-text">{{ errors.name }}</small>
      </div>

      <div class="form-group">
        <label>{{ t.email }}</label>
        <input
          type="email"
          v-model="form.email"
          :class="{ invalid: errors.email }"
        />
        <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>{{ t.phone }}</label>
        <input v-model="form.phone" :class="{ invalid: errors.phone }" />
        <small v-if="errors.phone" class="error-text">{{ errors.phone }}</small>
      </div>
    </div>

    <!-- ================= ACTIONS ================= -->

    <div class="conversion-card">
      <div class="conversion-card__eyebrow">{{ t.quoteReadyEyebrow }}</div>
      <h3>{{ t.quoteReadyTitle }}</h3>
      <p>{{ t.quoteReadyCopy }}</p>

      <div class="conversion-card__meta">
        <span class="conversion-pill">{{ t.availabilityLimited }}</span>
        <span class="conversion-pill conversion-pill--accent">
          {{ t.priceValidity }}
        </span>
      </div>
    </div>

    <button class="btn-outline" type="submit" :disabled="loading">
      {{ loading ? t.sending : t.requestReservation }}
    </button>
    <small v-if="submitErrorMessage" class="error-text form-submit-error">
      {{ submitErrorMessage }}
    </small>
  </form>
</template>
<script setup>
// import { computed, ref } from "vue";
import { computed, ref, toRefs, watch, onMounted } from "vue";
import { supabase } from "@/supabase";
import { nextTick } from "vue";

const allowAircraftChange = ref(false);
const activeReservations = ref([]);
const searchFromCity = ref({});
const filteredCities = ref({});
const validationMessage = ref("");

// ===========================================================================
// ===========================================================================
// INTERNACIONAL
// ===========================================================================
// ===========================================================================

const showDropdown = ref({});
const highlightedIndex = ref({});

const searchFromCityFrom = ref({});
const filteredCitiesFrom = ref({});
const showDropdownFrom = ref({});
const highlightedIndexFrom = ref({});

const selectCity = async (city, route, index) => {
  route.toCity = city;
  route.toAirport = "";

  searchFromCity.value[index] = city;
  filteredCities.value[index] = [];

  await nextTick(); // 🔥 ahora sí funciona
};

const filterCitiesFrom = (country, index) => {
  if (!country) return;

  const query = (searchFromCityFrom.value[index] || "").toLowerCase();

  const cities = props.citiesByCountry(country);

  filteredCitiesFrom.value[index] = cities
    .filter((city) => city.toLowerCase().includes(query))
    .slice(0, 8);

  highlightedIndexFrom.value[index] = 0;
  showDropdownFrom.value[index] = true;
};

const moveDownFrom = (index) => {
  const list = filteredCitiesFrom.value[index] || [];
  if (!list.length) return;

  highlightedIndexFrom.value[index] =
    (highlightedIndexFrom.value[index] + 1) % list.length;
};

const moveUpFrom = (index) => {
  const list = filteredCitiesFrom.value[index] || [];
  if (!list.length) return;

  highlightedIndexFrom.value[index] =
    (highlightedIndexFrom.value[index] - 1 + list.length) % list.length;
};

const selectHighlightedFrom = (route, index) => {
  const list = filteredCitiesFrom.value[index];
  const i = highlightedIndexFrom.value[index];

  if (!list || !list[i]) return;

  selectCityFrom(list[i], route, index);
};

const openDropdownFrom = (index) => {
  showDropdownFrom.value[index] = true;
};

const closeDropdownFrom = (index) => {
  setTimeout(() => {
    showDropdownFrom.value[index] = false;
  }, 150);
};
const selectCityFrom = (city, route, index) => {
  route.fromCity = city;

  searchFromCityFrom.value[index] = city;
  filteredCitiesFrom.value[index] = [];
  showDropdownFrom.value[index] = false;
};

const onToCountryChange = (route) => {
  route.toCity = "";
  route.toAirport = "";
};

const closeDropdown = (index) => {
  setTimeout(() => {
    showDropdown.value[index] = false;
  }, 150);
};
// ===========================================================================
// ===========================================================================
//FIN INTERNACIONAL
// ===========================================================================
// ===========================================================================

const filterCities = (country, index) => {
  if (!country) return;

  const cities = props.citiesByCountry(country);

  filteredCities.value[index] = cities.filter((city) =>
    city
      .toLowerCase()
      .includes((searchFromCity.value[index] || "").toLowerCase()),
  );
};

const loadReservations = async () => {
  const { data, error } = await supabase
    .from("reservations")
    .select("aircraft_id, start_datetime, end_datetime, status")
    .in("status", ["pending", "confirmed"]);

  if (!error) {
    activeReservations.value = data || [];
  }
};

/* ===============================
   filtros
=============================== */

const filteredFleet = computed(() => {
  if (!form.value.flightType) return aircraftFleet.value;

  const normalize = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const map = {
    "Private Jet": [
      "jet ligero (light jet)",
      "midsize jet (mid jet)",
      "super midsize jet",
      "heavy jet",
      "regional jet",
    ],
    Helicopter: ["helicoptero"],
    "Air Ambulance": [
      "jet ligero (light jet)",
      "midsize jet (mid jet)",
      "super midsize jet",
      "heavy jet",
      "regional jet",
      "turbohelice",
    ],
    Cargo: ["turbohelice", "regional jet", "monomotor piston"],
  };

  const selectedTypes = map[form.value.flightType]?.map(normalize) || [];

  if (!selectedTypes.length) return aircraftFleet.value;

  return aircraftFleet.value.filter((aircraft) =>
    selectedTypes.includes(normalize(aircraft.aircraft_type)),
  );
});
/* ===============================
   PROPS
=============================== */
const props = defineProps({
  form: { type: Object, required: true },
  routes: { type: Array, required: true },
  routeType: { type: String, required: true },
  returnToBaseEnabled: { type: Boolean, default: false },
  countries: { type: Array, default: () => [] },
  states: { type: Array, default: () => [] },
  citiesByState: { type: Function, required: true },
  citiesByCountry: { type: Function, required: true },
  airportsByCity: { type: Function, required: true },
  aircraftFleet: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  blockedDates: { type: Array, default: () => [] },
  errorMessage: { type: String, default: "" },
  locale: { type: String, default: "es-mx" },
});

/* ✅ MANTENER REACTIVIDAD */
const {
  form,
  routes,
  routeType,
  returnToBaseEnabled,
  countries,
  states,
  citiesByState,
  // citiesByCountry,
  airportsByCity,
  aircraftFleet,
  loading,
  blockedDates,
  locale,
} = toRefs(props);

const t = computed(() =>
  locale.value === "es-mx"
    ? {
        flightType: "Tipo de vuelo",
        select: "Selecciona",
        privateJet: "Jet privado",
        helicopter: "Helicóptero",
        airAmbulance: "Ambulancia aérea",
        cargo: "Carga",
        routeType: "Tipo de ruta",
        national: "Nacional",
        international: "Internacional",
        aircraft: "Aeronave",
        change: "Cambiar",
        capacity: "Capacidad",
        base: "Base",
        type: "Tipo",
        selectAircraft: "Selecciona aeronave",
        departureDate: "Fecha de salida",
        returnDate: "Fecha de regreso",
        aircraftUnavailable: "Esta aeronave no está disponible en la fecha seleccionada.",
        route: "Ruta",
        fromState: "Estado de origen",
        fromCity: "Ciudad de origen",
        fromAirport: "Aeropuerto de origen",
        toState: "Estado de destino",
        toCity: "Ciudad de destino",
        toAirport: "Aeropuerto de destino",
        fromCountry: "País de origen",
        toCountry: "País de destino",
        selectState: "Selecciona estado",
        selectCity: "Selecciona ciudad",
        selectAirport: "Selecciona aeropuerto",
        selectCountry: "Selecciona país",
        searchCity: "Buscar ciudad...",
        passengers: "Pasajeros",
        addAnotherRoute: "Agregar otra ruta",
        closeAtBase: "Cerrar en base inicial",
        removeLastRoute: "Quitar última ruta",
        reopenRoutes: "Seguir agregando rutas",
        fullName: "Nombre completo",
        email: "Correo electrónico",
        phone: "Teléfono",
        sending: "Enviando...",
        requestReservation: "Confirmar disponibilidad y ver cotización",
        quoteReadyEyebrow: "Cotización lista",
        quoteReadyTitle: "Tu estimado está listo para continuar",
        quoteReadyCopy:
          "Completa esta solicitud para asegurar disponibilidad de aeronave y desbloquear la cotización completa de tu reserva.",
        availabilityLimited: "Disponibilidad de aeronaves limitada",
        priceValidity: "Precio válido por 15 minutos",
        fullNameRequired: "El nombre completo es obligatorio",
        emailRequired: "El correo es obligatorio",
        phoneRequired: "El teléfono es obligatorio",
        flightTypeRequired: "El tipo de vuelo es obligatorio",
        routeTypeRequired: "El tipo de ruta es obligatorio",
        selectAircraftError: "Selecciona una aeronave",
        departureDateRequired: "La fecha de salida es obligatoria",
        returnDateRequired: "La fecha de regreso es obligatoria",
        invalidAirport: "Aeropuerto inválido",
        originAirportRequired: "El aeropuerto de origen es obligatorio",
        destinationAirportRequired: "El aeropuerto de destino es obligatorio",
        maxPassengers: (max) => `Máximo ${max} pasajeros permitidos para esta aeronave`,
        atLeastOnePassenger: "Debe haber al menos 1 pasajero",
        missingFieldsIntro: "Completa o corrige estos campos:",
        routeLabel: "Ruta",
      }
    : {
        flightType: "Flight Type",
        select: "Select",
        privateJet: "Private Jet",
        helicopter: "Helicopter",
        airAmbulance: "Air Ambulance",
        cargo: "Cargo",
        routeType: "Route Type",
        national: "National",
        international: "International",
        aircraft: "Aircraft",
        change: "Change",
        capacity: "Capacity",
        base: "Base",
        type: "Type",
        selectAircraft: "Select Aircraft",
        departureDate: "Departure Date",
        returnDate: "Return Date",
        aircraftUnavailable: "This aircraft is not available on the selected date.",
        route: "Route",
        fromState: "From State",
        fromCity: "From City",
        fromAirport: "From Airport",
        toState: "To State",
        toCity: "To City",
        toAirport: "To Airport",
        fromCountry: "From Country",
        toCountry: "To Country",
        selectState: "Select State",
        selectCity: "Select City",
        selectAirport: "Select Airport",
        selectCountry: "Select Country",
        searchCity: "Search city...",
        passengers: "Passengers",
        addAnotherRoute: "Add Another Route",
        closeAtBase: "Close at Home Base",
        removeLastRoute: "Remove Last Route",
        reopenRoutes: "Keep Adding Routes",
        fullName: "Full Name",
        email: "Email",
        phone: "Phone",
        sending: "Sending...",
        requestReservation: "Confirm Availability & View Quote",
        quoteReadyEyebrow: "Estimated price ready",
        quoteReadyTitle: "Your estimate is ready for the next step",
        quoteReadyCopy:
          "Complete this request to lock aircraft availability and unlock the full quote for your reservation.",
        availabilityLimited: "Aircraft availability is limited",
        priceValidity: "Price valid for 15 minutes",
        fullNameRequired: "Full Name is required",
        emailRequired: "Email is required",
        phoneRequired: "Phone is required",
        flightTypeRequired: "Flight Type is required",
        routeTypeRequired: "Route Type is required",
        selectAircraftError: "Select aircraft",
        departureDateRequired: "Departure date required",
        returnDateRequired: "Return date required",
        invalidAirport: "Invalid airport",
        originAirportRequired: "Origin airport required",
        destinationAirportRequired: "Destination airport required",
        maxPassengers: (max) => `Max ${max} passengers allowed for this aircraft`,
        atLeastOnePassenger: "At least 1 passenger required",
        missingFieldsIntro: "Complete or correct these fields:",
        routeLabel: "Route",
      },
);

const submitErrorMessage = computed(
  () => validationMessage.value || props.errorMessage,
);

// const onRouteTypeChange = (value) => {
//   emit("update:routeType", value);

//   routes.value.forEach((r) => {
//     r.fromCountry = "";
//     r.fromState = "";
//     r.fromCity = "";
//     r.fromAirport = "";
//     r.toCountry = "";
//     r.toState = "";
//     r.toCity = "";
//     r.toAirport = "";
//   });
// };

const onRouteTypeChange = (value) => {
  emit("update:routeType", value);

  routes.value.forEach((r) => {
    r.fromCountry = "";
    r.fromState = "";
    r.fromCity = "";
    r.fromAirport = "";

    r.toCountry = "";
    r.toState = "";
    r.toCity = "";
    r.toAirport = "";
  });

  // reset aircraft base relation
  if (routes.value[0]) {
    routes.value[0].fromState = "";
    routes.value[0].fromCity = "";
    routes.value[0].fromAirport = "";
  }
};

watch(
  () => routes.value.map((r) => r.toAirport),
  (newVal) => {
    newVal.forEach((val, i) => {
      if (val) {
        delete errors.value[`toAirport_${i}`];
      }
    });
  },
);

watch(
  () =>
    routes.value.map((r) => ({
      fromCountry: r.fromCountry,
      fromState: r.fromState,
      fromCity: r.fromCity,
      fromAirport: r.fromAirport,
      toCountry: r.toCountry,
      toState: r.toState,
      toCity: r.toCity,
      toAirport: r.toAirport,
    })),
  (newRoutes, oldRoutes = []) => {
    newRoutes.forEach((route, index) => {
      const previousRoute = oldRoutes[index] || {};
      const originChanged =
        route.fromCountry !== previousRoute.fromCountry ||
        route.fromState !== previousRoute.fromState ||
        route.fromCity !== previousRoute.fromCity;
      const destinationChanged =
        route.toCountry !== previousRoute.toCountry ||
        route.toState !== previousRoute.toState ||
        route.toCity !== previousRoute.toCity;

      const originAirports = route.fromCity
        ? airportsByCity.value(route.fromCountry, route.fromState, route.fromCity)
        : [];
      const destinationAirports = route.toCity
        ? airportsByCity.value(route.toCountry, route.toState, route.toCity)
        : [];

      const validOriginCodes = new Set(
        originAirports.map((airport) =>
          getAirportOptionValue(airport).toUpperCase(),
        ),
      );
      const validDestinationCodes = new Set(
        destinationAirports.map((airport) =>
          getAirportOptionValue(airport).toUpperCase(),
        ),
      );

      if (
        route.fromAirport &&
        !validOriginCodes.has((route.fromAirport || "").toUpperCase())
      ) {
        route.fromAirport = "";
      }

      if (
        route.toAirport &&
        !validDestinationCodes.has((route.toAirport || "").toUpperCase())
      ) {
        route.toAirport = "";
      }

      if (
        originChanged &&
        !route.fromAirport &&
        originAirports.length === 1
      ) {
        route.fromAirport = getAirportOptionValue(originAirports[0]);
      }

      if (
        destinationChanged &&
        !route.toAirport &&
        destinationAirports.length === 1
      ) {
        route.toAirport = getAirportOptionValue(destinationAirports[0]);
      }
    });
  },
  { deep: true },
);
watch(
  () =>
    routes.value.map((r) => ({
      toCountry: r.toCountry,
      toState: r.toState,
      toCity: r.toCity,
      toAirport: r.toAirport,
    })),
  (newRoutes) => {
    newRoutes.forEach((r, i) => {
      const next = routes.value[i + 1];

      if (!next) return;

      // 🔥 PASAR DESTINO → ORIGEN DEL SIGUIENTE
      next.fromCountry = r.toCountry;
      next.fromState = r.toState;
      next.fromCity = r.toCity;
      next.fromAirport = r.toAirport;

      // 🔥 también sincroniza el input visual
      searchFromCityFrom.value[i + 1] = r.toCity;
    });
  },
  { deep: true },
);

watch(
  () => routes.value.length,
  (newLength, oldLength) => {
    if (
      newLength <= oldLength ||
      newLength <= 1 ||
      returnToBaseEnabled.value
    ) {
      return;
    }

    const previousRoute = routes.value[newLength - 2];
    const currentRoute = routes.value[newLength - 1];

    if (!previousRoute || !currentRoute) return;

    currentRoute.fromCountry = previousRoute.toCountry || "";
    currentRoute.fromState = previousRoute.toState || "";
    currentRoute.fromCity = previousRoute.toCity || "";
    currentRoute.fromAirport = previousRoute.toAirport || "";

    searchFromCityFrom.value[newLength - 1] = currentRoute.fromCity || "";
  },
);
/* ===============================
   EMITS
=============================== */
const emit = defineEmits([
  "update:routeType",
  "preview",
  "addRoute",
  "closeAtBase",
  "removeRoute",
  "reopenRoutes",
]);

/* ===============================
   ERRORS
=============================== */
const errors = ref({});

const getAirportOptionValue = (airport) =>
  (airport?.iata || airport?.IATA || airport?.aeropuerto || "").trim();

const normalize = (str) =>
  str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const allKnownAirports = computed(() => {
  const collected = [];

  states.value.forEach((state) => {
    const cities = citiesByState.value(state);
    cities.forEach((city) => {
      collected.push(...airportsByCity.value(null, state, city));
    });
  });

  countries.value.forEach((country) => {
    const cities = props.citiesByCountry(country);
    cities.forEach((city) => {
      collected.push(...airportsByCity.value(country, null, city));
    });
  });

  return collected;
});

const getAircraftBaseLabel = (aircraft) => {
  if (!aircraft) return "-";

  const baseCity = String(aircraft.base_city || aircraft.ciudad || aircraft.city || "").trim();
  const baseCode = String(aircraft.iata || aircraft.home_base || "").trim().toUpperCase();

  if (baseCity) return baseCity;

  const match = allKnownAirports.value.find((airport) => {
    const airportCode = String(airport?.iata || airport?.IATA || "").trim().toUpperCase();
    return airportCode && airportCode === baseCode;
  });

  if (match) {
    const matchCity = String(match?.ciudad || match?.city || "").trim();
    if (matchCity && baseCode) return `${matchCity} (${baseCode})`;
    if (matchCity) return matchCity;
  }

  if (baseCode) return baseCode;

  const baseName = String(aircraft.home_base || "").trim();
  if (!baseName) return "-";

  const airportByName = allKnownAirports.value.find(
    (airport) => normalize(airport?.aeropuerto || airport?.name) === normalize(baseName),
  );

  if (airportByName) {
    const airportCity = String(airportByName?.ciudad || airportByName?.city || "").trim();
    const airportCode = String(airportByName?.iata || airportByName?.IATA || "").trim().toUpperCase();
    if (airportCity && airportCode) return `${airportCity} (${airportCode})`;
    if (airportCity) return airportCity;
  }

  return baseName;
};

const clearAirportError = (type, index) => {
  delete errors.value[`${type}Airport_${index}`];
};

const getErrorFieldLabel = (key) => {
  if (key === "name") return t.value.fullName;
  if (key === "email") return t.value.email;
  if (key === "phone") return t.value.phone;
  if (key === "flightType") return t.value.flightType;
  if (key === "routeType") return t.value.routeType;
  if (key === "aircraft_0") return t.value.aircraft;
  if (key === "start_0") return t.value.departureDate;
  if (key === "end_0") return t.value.returnDate;

  if (key.startsWith("fromAirport_")) {
    const index = Number(key.split("_")[1] || 0) + 1;
    return `${t.value.fromAirport} (${t.value.routeLabel} ${index})`;
  }

  if (key.startsWith("toAirport_")) {
    const index = Number(key.split("_")[1] || 0) + 1;
    return `${t.value.toAirport} (${t.value.routeLabel} ${index})`;
  }

  if (key.startsWith("passengers_")) {
    const index = Number(key.split("_")[1] || 0) + 1;
    return `${t.value.passengers} (${t.value.routeLabel} ${index})`;
  }

  return "";
};

const buildValidationMessage = () => {
  const fields = Object.keys(errors.value)
    .map((key) => getErrorFieldLabel(key))
    .filter(Boolean);

  const uniqueFields = [...new Set(fields)];

  if (!uniqueFields.length) return "";

  return `${t.value.missingFieldsIntro} ${uniqueFields.join(", ")}.`;
};

const isBlocked = (date, aircraftId) => {
  if (!date || !aircraftId) return false;

  const selectedDay = new Date(date).toISOString().split("T")[0];

  return activeReservations.value.some((r) => {
    if (String(r.aircraft_id) !== String(aircraftId)) return false;

    const startDay = new Date(r.start_datetime).toISOString().split("T")[0];
    const endDay = new Date(r.end_datetime).toISOString().split("T")[0];

    return selectedDay >= startDay && selectedDay <= endDay;
  });
};

const isRangeBlocked = (startDate, endDate, aircraftId) => {
  if (!startDate || !aircraftId) return false;

  const newStart = new Date(startDate).toISOString().split("T")[0];
  const newEnd = endDate
    ? new Date(endDate).toISOString().split("T")[0]
    : newStart;

  return activeReservations.value.some((r) => {
    if (String(r.aircraft_id) !== String(aircraftId)) return false;

    const existingStart = new Date(r.start_datetime)
      .toISOString()
      .split("T")[0];
    const existingEnd = new Date(r.end_datetime).toISOString().split("T")[0];

    return newStart <= existingEnd && newEnd >= existingStart;
  });
};
// console.log("BLOCKED:", blockedDates.value)

/* ===============================
   VALIDATION
=============================== */

const validateForm = () => {
  errors.value = {};
  validationMessage.value = "";

  if (!form.value.name?.trim()) errors.value.name = t.value.fullNameRequired;

  if (!form.value.email?.trim()) errors.value.email = t.value.emailRequired;

  if (!form.value.phone?.trim()) errors.value.phone = t.value.phoneRequired;

  if (!form.value.flightType)
    errors.value.flightType = t.value.flightTypeRequired;

  if (!routeType.value) errors.value.routeType = t.value.routeTypeRequired;

  // 🔥 SOLO validar aircraft y fechas en la primera ruta
  const firstRoute = routes.value[0];

  if (!firstRoute.aircraft_id) errors.value.aircraft_0 = t.value.selectAircraftError;

  if (!firstRoute.start_date) errors.value.start_0 = t.value.departureDateRequired;

  if (!firstRoute.end_date) errors.value.end_0 = t.value.returnDateRequired;

  // 🔥 Validar solo aeropuertos por cada ruta
  // routes.value.forEach((r, i) => {
  //   if (!r.fromAirport)
  //     errors.value[`fromAirport_${i}`] = "Origin airport required";

  //   if (!r.toAirport)
  //     errors.value[`toAirport_${i}`] = "Destination airport required";
  // });
  routes.value.forEach((r, i) => {
    const airports =
      routeType.value === "INTERNATIONAL"
        ? airportsByCity.value(r.toCountry, null, r.toCity)
        : airportsByCity.value(null, r.toState, r.toCity);

    const validIatas = new Set(
      airports.map((a) => getAirportOptionValue(a).toUpperCase()),
    );

    if (airports.length && !validIatas.has((r.toAirport || "").toUpperCase())) {
      errors.value[`toAirport_${i}`] = t.value.invalidAirport;
    }
    if (!r.fromAirport) {
      errors.value[`fromAirport_${i}`] = t.value.originAirportRequired;
    }

    if (!r.toAirport) {
      errors.value[`toAirport_${i}`] = t.value.destinationAirportRequired;
    }
  });

  routes.value.forEach((r, i) => {
    const max = selectedAircraft.value?.capacity_passengers || 1;

    if (r.passengers > max) {
      errors.value[`passengers_${i}`] = t.value.maxPassengers(max);
    }

    if (r.passengers < 1) {
      errors.value[`passengers_${i}`] = t.value.atLeastOnePassenger;
    }
  });

  const isValid = Object.keys(errors.value).length === 0;

  if (!isValid) {
    validationMessage.value = buildValidationMessage();
  }

  return isValid;
};

/* ===============================
   PREVIEW
=============================== */
const handlePreview = async () => {
  if (!validateForm()) return;

  validationMessage.value = "";
  emit("preview");
};

watch(
  () => ({
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    flightType: form.value.flightType,
    routeType: routeType.value,
    routes: routes.value.map((route) => ({
      aircraft_id: route.aircraft_id,
      start_date: route.start_date,
      end_date: route.end_date,
      fromAirport: route.fromAirport,
      toAirport: route.toAirport,
      passengers: route.passengers,
    })),
  }),
  () => {
    if (validationMessage.value) {
      validationMessage.value = "";
    }
  },
  { deep: true },
);

/* ===============================
   ROUTE TYPE SYNC
=============================== */

const localRouteType = computed({
  get: () => routeType.value,

  set: (value) => {
    if (value === routeType.value) return; // 🔥 IMPORTANTE

    emit("update:routeType", value);

    routes.value.forEach((r) => {
      r.fromCountry = "";
      r.fromState = "";
      r.fromCity = "";
      r.fromAirport = "";

      r.toCountry = "";
      r.toState = "";
      r.toCity = "";
      r.toAirport = "";
    });
  },
});
//console.log("✈️ FLEET:", aircraftFleet.value);

watch(
  () => [routes.value[0]?.aircraft_id, routeType.value],
  async ([newAircraftId]) => {
    if (!newAircraftId) return;
    return;

    const selectedAircraft = aircraftFleet.value.find(
      (a) => a.id === newAircraftId,
    );

    if (!selectedAircraft?.home_base) return;

    const airportIata = selectedAircraft.iata || selectedAircraft.home_base;

    let allAirports = [];

    if (routeType.value === "INTERNATIONAL") {
      countries.value.forEach((country) => {
        const cities = props.citiesByCountry(country);
        cities.forEach((city) => {
          allAirports.push(...airportsByCity.value(country, null, city));
        });
      });
    } else {
      states.value.forEach((state) => {
        const cities = citiesByState.value(state);
        cities.forEach((city) => {
          allAirports.push(...airportsByCity.value(null, state, city));
        });
      });
    }

    const normalize = (str) =>
      str
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    // let match = allAirports.find(
    //   (a) =>
    //     normalize(a.iata) === normalize(airportIata) ||
    //     normalize(a.IATA) === normalize(airportIata),
    // );
    const iataNormalized = (airportIata || "").toUpperCase().trim();

    let match = allAirports.find(
      (a) =>
        (a.iata || "").toUpperCase().trim() === iataNormalized ||
        (a.IATA || "").toUpperCase().trim() === iataNormalized,
    );

    // 🔥 fallback por estado + ciudad (CLAVE)
    if (!match) {
      match = allAirports.find(
        (a) => normalize(a.ciudad) === normalize(selectedAircraft.ciudad),
      );
    }

    // 🔥 debug (opcional pero recomendado)
    if (!match) {
      console.warn("❌ NO MATCH AIRPORT");
      console.log("Buscando IATA:", airportIata);
      console.log("Aircraft:", selectedAircraft);
      return;
    }

    if (!match) return;

    const iata = (match.iata || match.IATA || "").toUpperCase();

    routes.value[0].fromState = match.estado;
    // 🔥 FORZAR refresco de ciudades
    await nextTick();
    routes.value[0].fromCity = match.ciudad;

    if (routeType.value === "INTERNATIONAL") {
      routes.value[0].fromCountry =
        match.COUNTRY || match.country || match.pais || "";

      selectCityFrom(match.ciudad, routes.value[0], 0);
      searchFromCityFrom.value[0] = match.ciudad;
    }

    await nextTick();
    await nextTick();

    routes.value[0].fromAirport = iata;
  },
);

const onAircraftChange = (route) => {
  if (!route.aircraft_id) return;

  const selectedAircraft = aircraftFleet.value.find(
    (a) => a.id === route.aircraft_id,
  );

  if (!selectedAircraft?.home_base) return;

  const airportName = selectedAircraft.home_base;

  const allAirports = [];

  states.value.forEach((state) => {
    const cities = citiesByState.value(state);
    cities.forEach((city) => {
      const airports = airportsByCity.value(null, state, city);
      allAirports.push(...airports);
    });
  });

  const normalize = (str) =>
    str
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  // const match = allAirports.find(
  //   (a) => normalize(a.aeropuerto) === normalize(airportName),
  // );
  const match = allAirports.find(
    (a) =>
      normalize(a.estado) === normalize(selectedAircraft.estado) &&
      normalize(a.ciudad) === normalize(selectedAircraft.ciudad),
  );

  if (!match) return;

  // route.fromState = match.estado;
  // route.fromCity = match.ciudad;
  // route.fromAirport = match.aeropuerto;

  route.fromState = match.estado;
  route.fromCity = match.ciudad;
  route.fromAirport = match.iata;
};

const selectedAircraft = computed(() =>
  aircraftFleet.value.find(
    (a) => String(a.id) === String(routes.value[0].aircraft_id),
  ),
);

const canCloseAtBase = computed(
  () => Boolean(selectedAircraft.value?.home_base) && routes.value.length >= 1,
);

const isFirstRouteOriginLocked = () => false;

const isLastRouteDestinationLocked = (index) =>
  returnToBaseEnabled.value &&
  index === routes.value.length - 1 &&
  Boolean(
    routes.value[0]?.fromCountry ||
      routes.value[0]?.fromState ||
      routes.value[0]?.fromCity ||
      routes.value[0]?.fromAirport,
  );

onMounted(() => {
  loadReservations();
});

watch(
  () => [routes.value[0]?.passengers, selectedAircraft.value],
  () => {
    const max = selectedAircraft.value?.capacity_passengers || 1;

    routes.value.forEach((r) => {
      if (r.passengers > max) {
        r.passengers = max;
      }
    });
  },
  { deep: true },
);

watch(
  () => {
    const lastIndex = routes.value.length - 1;
    const lastRoute = routes.value[lastIndex] || {};

    return [
      routeType.value,
      routes.value.length,
      lastIndex,
      lastRoute.toCountry,
      lastRoute.toState,
      lastRoute.toCity,
      lastRoute.toAirport,
    ];
  },
  () => {
    if (
      !returnToBaseEnabled.value ||
      routeType.value !== "INTERNATIONAL" ||
      routes.value.length <= 1
    ) {
      return;
    }

    const lastIndex = routes.value.length - 1;
    searchFromCity.value[lastIndex] = routes.value[lastIndex]?.toCity || "";
  },
  { immediate: true },
);
</script>
<style>
:root {
  --reservation-navy: #0f2747;
  --reservation-blue: #1d4f91;
  --reservation-gold: #caa96a;
  --reservation-ink: #162033;
  --reservation-muted: #5f6f86;
  --reservation-line: rgba(20, 39, 71, 0.12);
  --reservation-shadow: 0 28px 70px rgba(9, 24, 45, 0.16);
  --reservation-shadow-soft: 0 18px 40px rgba(15, 39, 71, 0.08);
}

/* ===============================
   FORM CONTAINER
=============================== */
.quote-form {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 2.75rem;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  background:
    radial-gradient(circle at top right, rgba(202, 169, 106, 0.14), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 250, 255, 0.96));
  box-shadow: var(--reservation-shadow);
  backdrop-filter: blur(10px);
}

/* ===============================
   ROWS
=============================== */

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 220px;
}

.form-group.full {
  flex: 100%;
}

/* ===============================
   LABELS
=============================== */

label {
  font-size: 0.76rem;
  font-weight: 700;
  margin-bottom: 0;
  color: var(--reservation-ink);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ===============================
   INPUTS & SELECTS
=============================== */

input,
select {
  min-height: 52px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--reservation-line);
  font-size: 0.96rem;
  color: var(--reservation-ink);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    background-color 0.25s ease,
    transform 0.25s ease;
}

input:focus,
select:focus {
  outline: none;
  border-color: rgba(29, 79, 145, 0.55);
  box-shadow: 0 0 0 4px rgba(29, 79, 145, 0.12);
  background-color: #ffffff;
  transform: translateY(-1px);
}

input::placeholder {
  color: #8a98ab;
}

select {
  appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--reservation-blue) 50%),
    linear-gradient(135deg, var(--reservation-blue) 50%, transparent 50%);
  background-position:
    calc(100% - 20px) calc(50% - 3px),
    calc(100% - 14px) calc(50% - 3px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
  padding-right: 42px;
}

.availability-error {
  color: #dc3545;
  font-size: 0.75rem;
  margin-top: 6px;
  font-weight: 500;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===============================
   INVALID
=============================== */

.invalid {
  border-color: #dc3545 !important;
  background-color: #fff5f5 !important;
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.09) !important;
}

.error-text {
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 2px;
  font-weight: 500;
}

.form-submit-error {
  display: block;
  margin-top: 0.9rem;
}

/* ===============================
   DATE STATES
=============================== */

input.blocked {
  border: 1px solid #dc3545 !important;
  background-color: #fff5f5 !important;
}

input.available {
  border: 1px solid #28a745 !important;
  background-color: #f4fff8 !important;
}

/* ===============================
   ROUTE BLOCK
=============================== */

.route-block {
  position: relative;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(242, 247, 255, 0.92));
  padding: 24px;
  border-radius: 22px;
  margin-bottom: 26px;
  border: 1px solid rgba(29, 79, 145, 0.1);
  box-shadow: var(--reservation-shadow-soft);
  overflow: hidden;
}

.route-block::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: linear-gradient(180deg, var(--reservation-gold), var(--reservation-blue));
}

.route-block h4 {
  display: inline-flex;
  align-items: center;
  margin-bottom: 18px;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(15, 39, 71, 0.07);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--reservation-blue);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ===============================
   HR
=============================== */

hr {
  border: none;
  height: 1px;
  background: #eaecef;
  margin: 25px 0;
}

/* ===============================
   BUTTONS
=============================== */

.btn-primary {
  background: linear-gradient(135deg, #1f3c88, #2949a8);
  color: white;
  border: none;
  padding: 14px 22px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 20px;
  width: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(31, 60, 136, 0.25);
}

.btn-secondary {
  min-height: 48px;
  background: linear-gradient(180deg, #ffffff, #f4f8fd);
  border: 1px solid rgba(29, 79, 145, 0.15);
  padding: 12px 18px;
  border-radius: 14px;
  font-weight: 700;
  color: var(--reservation-blue);
  cursor: pointer;
  margin-bottom: 18px;
  box-shadow: 0 10px 22px rgba(15, 39, 71, 0.08);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.btn-secondary:hover {
  background: linear-gradient(180deg, #ffffff, #edf4ff);
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(15, 39, 71, 0.12);
}

.btn-secondary--danger {
  color: #8a1c1c;
  border-color: rgba(138, 28, 28, 0.16);
  background: linear-gradient(180deg, #fffefe, #fff5f5);
}

.btn-secondary--danger:hover {
  background: linear-gradient(180deg, #fff5f5, #ffe9e9);
  box-shadow: 0 16px 30px rgba(138, 28, 28, 0.12);
}

.route-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  width: 100%;
  min-height: 56px;
  padding: 0.9rem 2.2rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--reservation-navy), var(--reservation-blue));
  color: #fff;
  text-decoration: none;
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 22px 38px rgba(15, 39, 71, 0.22);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    filter 0.3s ease;
}

.btn-outline:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: saturate(1.06);
  box-shadow: 0 28px 42px rgba(15, 39, 71, 0.28);
}

.btn-outline:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

.conversion-card {
  margin-top: 1rem;
  padding: 1.3rem 1.35rem;
  border-radius: 22px;
  border: 1px solid rgba(29, 79, 145, 0.12);
  background:
    radial-gradient(circle at top right, rgba(202, 169, 106, 0.18), transparent 34%),
    linear-gradient(180deg, rgba(15, 39, 71, 0.98), rgba(19, 55, 102, 0.94));
  color: #ffffff;
  box-shadow: 0 20px 42px rgba(15, 39, 71, 0.16);
}

.conversion-card__eyebrow {
  display: inline-block;
  margin-bottom: 0.7rem;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.74);
}

.conversion-card h3 {
  margin: 0;
  font-size: 1.08rem;
  letter-spacing: -0.02em;
}

.conversion-card p {
  margin: 0.7rem 0 0;
  color: rgba(241, 245, 249, 0.82);
  font-size: 0.92rem;
  line-height: 1.6;
}

.conversion-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1rem;
}

.conversion-pill {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.conversion-pill--accent {
  color: #ffe6af;
  border-color: rgba(255, 230, 175, 0.22);
  background: rgba(202, 169, 106, 0.16);
}

@media (max-width: 768px) {
  .quote-form {
    max-width: 100%;
    padding: 20px;
    border-radius: 22px;
  }

  .form-row {
    flex-direction: column;
    gap: 14px;
  }

  .form-group {
    min-width: 100%;
  }

  .route-block {
    padding: 18px;
    margin-bottom: 22px;
  }

  input,
  select {
    min-height: 48px;
    padding: 11px 12px;
    font-size: 0.9rem;
  }

  .btn-outline {
    margin-top: 1.5rem;
  }

  .conversion-card {
    padding: 1.15rem;
  }

  .route-actions {
    grid-template-columns: 1fr;
  }
}
/* ===============================
   AIRCRAFT DISPLAY CARD
=============================== */

.aircraft-display-card {
  background:
    radial-gradient(circle at top right, rgba(202, 169, 106, 0.16), transparent 30%),
    linear-gradient(145deg, #ffffff, #f5f9ff);
  border: 1px solid rgba(29, 79, 145, 0.12);
  border-radius: 22px;
  padding: 22px;
  box-shadow: var(--reservation-shadow-soft);
  transition: all 0.35s ease;
}

.aircraft-display-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 55px rgba(15, 39, 71, 0.15);
}

/* ===============================
   HEADER
=============================== */

.aircraft-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.aircraft-name {
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--reservation-ink);
  letter-spacing: 0.4px;
}

.change-aircraft-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(29, 79, 145, 0.15);
  padding: 8px 14px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
}

.change-aircraft-btn:hover {
  background: var(--reservation-navy);
  color: #ffffff;
  border-color: var(--reservation-navy);
}

/* ===============================
   META GRID
=============================== */

.aircraft-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(29, 79, 145, 0.1);
}

/* Each block */
.aircraft-meta div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Label */
.aircraft-meta span {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--reservation-muted);
}

/* Value */
.aircraft-meta strong {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--reservation-blue);
  letter-spacing: 0.3px;
}

.autocomplete {
  position: relative;
}

.autocomplete-list {
  position: absolute;
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(29, 79, 145, 0.12);
  border-radius: 16px;
  max-height: 220px;
  overflow-y: auto;
  z-index: 999; /* 🔥 importante */

  top: calc(100% + 8px); /* 🔥 separación real */
  left: 0;

  box-shadow: 0 18px 40px rgba(15, 39, 71, 0.16);
}

.autocomplete-list li {
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.autocomplete-list li:hover {
  background: #f5f9ff;
}
.autocomplete-list li.active {
  background: #e8f0ff;
}
.autocomplete-wrapper {
  position: relative;
}

.city-name {
  font-weight: 600;
  color: var(--reservation-ink);
}

.city-meta {
  margin-top: 3px;
  font-size: 0.75rem;
  color: var(--reservation-muted);
}
/* ===============================
   RESPONSIVE
=============================== */

@media (max-width: 768px) {
  .aircraft-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .aircraft-meta {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .aircraft-display-card {
    padding: 18px;
  }
}
</style>
