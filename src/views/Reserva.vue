<template>
  <MainLayout>
    <div class="reservation-landing">
      <section class="reservation-hero" aria-labelledby="reservation-title">
        <video
          class="reservation-hero__video reservation-hero__video--desktop"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          poster="/images/reserva/1.png"
          aria-hidden="true"
        >
          <source src="/images/reserva/Video.mp4" type="video/mp4" />
        </video>
        <div class="reservation-hero__shade"></div>

        <div class="reservation-shell reservation-hero__content">
          <div class="reservation-copy">
            <p class="reservation-kicker">{{ copy.heroEyebrow }}</p>
            <h1 id="reservation-title">{{ copy.heroTitle }}</h1>
            <p>{{ copy.heroDescription }}</p>
          </div>

          <form
            ref="compactFormRef"
            class="availability-card"
            novalidate
            :aria-describedby="compactError ? 'reservation-card-error reservation-card-note' : 'reservation-card-note'"
            @submit.prevent="handleCompactSubmit"
          >
            <div v-show="activeStep === 0" class="flight-card-header">
              <h2>{{ copy.selectFlightsTitle }}</h2>
              <div class="trip-toggle" role="group" :aria-label="copy.tripTypeLabel">
                <button
                  class="trip-toggle__button"
                  type="button"
                  :class="{ active: tripMode === 'one-way' }"
                  @click="setTripMode('one-way')"
                >
                  <span aria-hidden="true">×</span>
                  {{ copy.oneWayLabel }}
                </button>
                <button
                  class="trip-toggle__button"
                  type="button"
                  :class="{ active: tripMode === 'round-trip' }"
                  @click="setTripMode('round-trip')"
                >
                  <span aria-hidden="true">↻</span>
                  {{ copy.roundTripLabel }}
                </button>
                <button
                  class="trip-toggle__button"
                  type="button"
                  :class="{ active: tripMode === 'multi-city' }"
                  @click="setTripMode('multi-city')"
                >
                  <span aria-hidden="true">+</span>
                  {{ copy.multiCityLabel }}
                </button>
              </div>
            </div>

            <div v-show="activeStep > 0" class="steps" aria-label="Reservation steps" role="list">
              <button
                v-for="(step, index) in copy.steps"
                :key="step"
                class="step"
                type="button"
                role="listitem"
                :class="{
                  'step--active': index === activeStep,
                  'step--complete': index < activeStep,
                }"
                :aria-current="index === activeStep ? 'step' : undefined"
                :disabled="index > maxReachableStep"
                @click="goToStep(index)"
              >
                <span>{{ index + 1 }}</span>
                <small>{{ step }}</small>
              </button>
            </div>

            <div v-show="activeStep === 0 && tripMode !== 'multi-city'" class="availability-grid">
              <div class="availability-field">
                <AirportAutocomplete
                  v-model="routes[0].fromAirport"
                  :input-id="fieldIds.from"
                  :airports="compactAirportOptions"
                  :label="copy.fromLabel"
                  :placeholder="copy.selectAirport"
                  :meta="compactFromMeta"
                  @select="setCompactAirport('from', $event)"
                />
              </div>

              <button
                class="swap-button"
                type="button"
                :aria-label="copy.swapLabel"
                @click="swapCompactRoute"
              >
                <ArrowLeftRight aria-hidden="true" />
              </button>

              <div class="availability-field">
                <AirportAutocomplete
                  v-model="routes[0].toAirport"
                  :input-id="fieldIds.to"
                  :airports="compactAirportOptions"
                  :label="copy.toLabel"
                  :placeholder="copy.selectAirport"
                  :meta="compactToMeta"
                  @select="setCompactAirport('to', $event)"
                />
              </div>

              <div class="availability-field">
                <label :for="fieldIds.date">{{ copy.departureDateTimeLabel }}</label>
                <div
                  class="field-control field-control--picker"
                  @click="openDatePicker(departureDateInputRef)"
                >
                  <CalendarDays aria-hidden="true" />
                  <button
                    type="button"
                    class="field-control__overlay"
                    :aria-label="copy.departureDateTimeLabel"
                    @click.stop="openDatePicker(departureDateInputRef)"
                    @keydown.enter.prevent="openDatePicker(departureDateInputRef)"
                    @keydown.space.prevent="openDatePicker(departureDateInputRef)"
                  ></button>
                  <input
                    ref="departureDateInputRef"
                    :id="fieldIds.date"
                    v-model="routes[0].start_date"
                    type="datetime-local"
                    required
                    :min="minDateTime"
                    :aria-describedby="`${fieldIds.date}-help`"
                    @change="onOutboundDateChange"
                  />
                </div>
                <small :id="`${fieldIds.date}-help`">{{ compactDateMeta }}</small>
              </div>

              <div class="availability-field">
                <label :for="fieldIds.passengers">{{ copy.passengersLabel }}</label>
                <div class="field-control">
                  <UsersRound aria-hidden="true" />
                  <select
                    :id="fieldIds.passengers"
                    v-model.number="routes[0].passengers"
                    required
                    :aria-describedby="`${fieldIds.passengers}-help`"
                  >
                    <option v-for="count in passengerOptions" :key="count" :value="count">
                      {{ count }} {{ count === 1 ? copy.passenger : copy.passengers }}
                    </option>
                  </select>
                </div>
                <small :id="`${fieldIds.passengers}-help`">{{ copy.passengerMeta }}</small>
              </div>

              <div v-if="tripMode === 'round-trip'" class="availability-field">
                <label :for="fieldIds.returnDate">{{ copy.returnDateTimeLabel }}</label>
                <div
                  class="field-control field-control--picker"
                  @click="openDatePicker(extraRouteDateInputRefs[1])"
                >
                  <CalendarDays aria-hidden="true" />
                  <button
                    type="button"
                    class="field-control__overlay"
                    :aria-label="copy.returnDateTimeLabel"
                    @click.stop="openDatePicker(extraRouteDateInputRefs[1])"
                    @keydown.enter.prevent="openDatePicker(extraRouteDateInputRefs[1])"
                    @keydown.space.prevent="openDatePicker(extraRouteDateInputRefs[1])"
                  ></button>
                  <input
                    :ref="(element) => setExtraRouteDateInputRef(1, element)"
                    :id="fieldIds.returnDate"
                    v-model="returnRoute.start_date"
                    type="datetime-local"
                    required
                    :min="routes[0].start_date || minDateTime"
                    @change="syncExtraEndDate(1)"
                  />
                </div>
                <small>{{ formatCompactDateMeta(returnRoute.start_date) }}</small>
              </div>
            </div>

            <template v-if="activeStep === 0 && tripMode === 'multi-city'">
            <div
              v-for="(routeItem, routeIndex) in routes"
              :key="routeItem.id || `multi-city-route-${routeIndex}`"
              class="return-flight-block"
            >
              <div class="return-flight-title">
                <span>{{ getSegmentTitle(routeIndex) }}</span>
                <button
                  v-if="routeIndex > 0"
                  class="remove-return-button"
                  type="button"
                  :aria-label="copy.removeFlightLabel"
                  @click="removeExtraFlight(routeIndex)"
                >
                  ×
                </button>
              </div>

              <div class="availability-grid availability-grid--return">
                <div class="availability-field">
                  <AirportAutocomplete
                    v-model="routeItem.fromAirport"
                    :input-id="`${fieldIds.returnFrom}-${routeIndex}`"
                    :airports="compactAirportOptions"
                    :label="copy.fromLabel"
                    :placeholder="copy.selectAirport"
                    :meta="getCompactAirportMeta(routeItem.fromAirport)"
                    @select="setExtraAirport(routeIndex, 'from', $event)"
                  />
                </div>

                <button
                  class="swap-button"
                  type="button"
                  :aria-label="copy.swapLabel"
                  @click="swapExtraRoute(routeIndex)"
                >
                  <ArrowLeftRight aria-hidden="true" />
                </button>

                <div class="availability-field">
                  <AirportAutocomplete
                    v-model="routeItem.toAirport"
                    :input-id="`${fieldIds.returnTo}-${routeIndex}`"
                    :airports="compactAirportOptions"
                    :label="copy.toLabel"
                    :placeholder="copy.selectAirport"
                    :meta="getCompactAirportMeta(routeItem.toAirport)"
                    @select="setExtraAirport(routeIndex, 'to', $event)"
                  />
                </div>

                <div class="availability-field">
                  <label :for="`${fieldIds.returnDate}-${routeIndex}`">{{ copy.segmentDateTimeLabel }}</label>
                  <div
                    class="field-control field-control--picker"
                    @click="openDatePicker(extraRouteDateInputRefs[routeIndex])"
                  >
                    <CalendarDays aria-hidden="true" />
                    <button
                      type="button"
                      class="field-control__overlay"
                      :aria-label="copy.segmentDateTimeLabel"
                      @click.stop="openDatePicker(extraRouteDateInputRefs[routeIndex])"
                      @keydown.enter.prevent="openDatePicker(extraRouteDateInputRefs[routeIndex])"
                      @keydown.space.prevent="openDatePicker(extraRouteDateInputRefs[routeIndex])"
                    ></button>
                    <input
                      :ref="(element) => setExtraRouteDateInputRef(routeIndex, element)"
                      :id="`${fieldIds.returnDate}-${routeIndex}`"
                      v-model="routeItem.start_date"
                      type="datetime-local"
                      required
                      :min="getExtraRouteMinDate(routeIndex)"
                      @change="syncExtraEndDate(routeIndex)"
                    />
                  </div>
                  <small>{{ formatCompactDateMeta(routeItem.start_date) }}</small>
                </div>

                <div v-if="routeIndex === 0" class="availability-field">
                  <label :for="`${fieldIds.returnPassengers}-${routeIndex}`">{{ copy.passengersLabel }}</label>
                  <div class="field-control">
                    <UsersRound aria-hidden="true" />
                    <select
                      :id="`${fieldIds.returnPassengers}-${routeIndex}`"
                      v-model.number="routeItem.passengers"
                      required
                    >
                      <option v-for="count in passengerOptions" :key="count" :value="count">
                        {{ count }} {{ count === 1 ? copy.passenger : copy.passengers }}
                      </option>
                    </select>
                  </div>
                  <small>{{ copy.passengerMeta }}</small>
                </div>
              </div>
            </div>
            </template>

            <button
              v-show="activeStep === 0 && tripMode === 'multi-city'"
              class="add-flight-button"
              type="button"
              @click="addCompactFlight"
            >
              <span aria-hidden="true">+</span>
              {{ copy.addFlightLabel }}
            </button>

            <div v-if="activeStep === 0 && itinerarySummary.length" class="itinerary-summary">
              <div class="itinerary-summary__head">
                <span>{{ copy.itinerarySummaryLabel }}</span>
                <strong>{{ copy.tripModeLabels[tripMode] }}</strong>
              </div>
              <div class="itinerary-summary__body">
                <template v-if="tripMode === 'round-trip'">
                  <strong>{{ itinerarySummary[0]?.route }}</strong>
                  <span>{{ copy.departureSummaryLabel }}: {{ itinerarySummary[0]?.date }}</span>
                  <span>{{ copy.returnSummaryLabel }}: {{ itinerarySummary[1]?.date }}</span>
                  <em>{{ routes[0]?.passengers || 1 }} {{ (routes[0]?.passengers || 1) === 1 ? copy.passenger : copy.passengers }}</em>
                </template>
                <template v-else>
                  <div v-for="item in itinerarySummary" :key="item.key" class="itinerary-summary__leg">
                    <span v-if="tripMode === 'multi-city'">{{ item.title }}</span>
                    <strong>{{ item.route }}</strong>
                    <small>{{ item.date }}</small>
                  </div>
                  <em>{{ routes[0]?.passengers || 1 }} {{ (routes[0]?.passengers || 1) === 1 ? copy.passenger : copy.passengers }}</em>
                </template>
              </div>
            </div>

            <div v-show="activeStep === 1" class="step-panel">
              <div class="availability-field availability-field--wide">
                <label>{{ copy.selectAircraft }}</label>
                <div v-if="compactAircraftOptions.length" class="field-control">
                  <PlaneTakeoff aria-hidden="true" />
                  <select
                    :id="fieldIds.aircraft"
                    v-model="routes[0].aircraft_id"
                    @change="selectCompactAircraft(getAircraftById(routes[0].aircraft_id))"
                  >
                    <option :value="null">{{ copy.selectAircraft }}</option>
                    <optgroup
                      v-for="group in visibleAircraftOptionGroups"
                      :key="group.key"
                      :label="group.label"
                    >
                      <option
                        v-for="aircraft in group.aircraft"
                        :key="aircraft.id"
                        :value="aircraft.id"
                      >
                        {{ getAircraftOptionLabel(aircraft) }}
                      </option>
                    </optgroup>
                  </select>
                </div>
                <div v-if="compactAircraftOptions.length" class="aircraft-options-helper">
                  <span>{{ aircraftOptionsHelperText }}</span>
                  <button
                    v-if="hasHiddenAircraftOptions"
                    type="button"
                    @click="toggleAircraftOptionsVisibility"
                  >
                    {{ showAllAircraft ? copy.showLessAircraft : copy.showMoreAircraft }}
                  </button>
                </div>
                <div v-if="selectedAircraft" class="compact-aircraft-summary">
                  <strong>{{ selectedAircraft.name }}</strong>
                  <span>
                    {{ getCompactAircraftTypeLabel(selectedAircraft) }} ·
                    {{ selectedAircraft.capacity_passengers || "-" }} pax ·
                    {{ getCompactAircraftBaseLabel(selectedAircraft) }}
                  </span>
                </div>
                <p v-else-if="!compactAircraftOptions.length" class="compact-aircraft-empty">{{ copy.noAircraftOptions }}</p>
                <small>{{ aircraftHelpText }}</small>
              </div>
            </div>

            <div v-show="activeStep === 2" class="contact-grid">
              <div class="availability-field">
                <label :for="fieldIds.name">{{ copy.nameLabel }}</label>
                <input
                  :id="fieldIds.name"
                  v-model.trim="form.name"
                  class="plain-input"
                  type="text"
                  autocomplete="name"
                  required
                />
              </div>
              <div class="availability-field">
                <label :for="fieldIds.email">{{ copy.emailLabel }}</label>
                <input
                  :id="fieldIds.email"
                  v-model.trim="form.email"
                  class="plain-input"
                  type="email"
                  autocomplete="email"
                  required
                />
              </div>
              <div class="availability-field">
                <label :for="fieldIds.phone">{{ copy.phoneLabel }}</label>
                <input
                  :id="fieldIds.phone"
                  v-model.trim="form.phone"
                  class="plain-input"
                  type="tel"
                  autocomplete="tel"
                  required
                />
              </div>
            </div>

            <div v-show="activeStep === 3" class="review-panel" aria-live="polite">
              <div>
                <span>{{ copy.routeSummary }}</span>
                <strong>{{ routeSummary }}</strong>
              </div>
              <div>
                <span>{{ copy.aircraftLabel }}</span>
                <strong>{{ selectedAircraftSummary }}</strong>
              </div>
              <div>
                <span>{{ copy.contactSummary }}</span>
                <strong>{{ form.name || "-" }} / {{ form.email || "-" }}</strong>
              </div>
            </div>

            <p v-if="compactError" id="reservation-card-error" class="compact-error" role="alert">
              {{ compactError }}
            </p>

            <button class="availability-submit" type="submit" :disabled="isPrimaryButtonDisabled">
              <span>{{ compactSubmitLabel }}</span>
              <ChevronRight aria-hidden="true" />
            </button>
          <p id="reservation-card-note" class="availability-note">
            <LockKeyhole aria-hidden="true" />
            <span>{{ copy.secureNote }}</span>
          </p>
          </form>

          <video
            ref="mobileHeroVideoRef"
            class="reservation-hero__video reservation-hero__video--mobile-inline"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            poster="/images/reserva/1.png"
            aria-hidden="true"
          >
            <source src="/images/reserva/Video.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section class="next-steps">
        <div class="reservation-shell">
          <div class="process-card">
            <h2>{{ copy.nextTitle }}</h2>
            <div class="process-grid">
              <article v-for="item in copy.process" :key="item.title" class="process-item">
                <span class="icon-ring">
                  <component :is="item.icon" aria-hidden="true" />
                </span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </article>
            </div>
          </div>

          <div class="trust-strip">
            <article v-for="item in copy.trust" :key="item.title" class="trust-item">
              <component :is="item.icon" aria-hidden="true" />
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>

          <div class="why-grid">
            <article class="why-card why-card--wide">
              <div class="why-card__copy">
                <h2>{{ copy.whyTitle }}</h2>
                <p>{{ copy.whyDescription }}</p>
                <ul>
                  <li v-for="item in copy.whyBullets" :key="item">
                    <CheckCircle2 aria-hidden="true" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
              <div class="why-card__media" aria-hidden="true"></div>
            </article>

            <article class="why-card proposal-card">
              <span class="proposal-icon">
                <Mail aria-hidden="true" />
              </span>
              <h2>{{ copy.proposalTitle }}</h2>
              <p>{{ copy.proposalDescription }}</p>
              <button class="proposal-button" type="button" @click="goToFullForm">
                <span>{{ copy.readyCta }}</span>
                <ChevronRight aria-hidden="true" />
              </button>
            </article>
          </div>
        </div>
      </section>

    </div>

    <QuoteModal
      v-if="showQuoteModal"
      :form="form"
      :routes="pricedRoutes"
      :breakdowns="pricedBreakdowns"
      :pricingSummary="pricingSummary"
      :totalFlightCost="flightCostTotal"
      :totalOvernight="overnightTotal"
      :globalExpenses="operationalExpenses"
      :otherCharges="otherCharges"
      :subtotal="subtotal"
      :commercialMargin="commercialMargin"
      :commercialMarginRate="commercialMarginPercent / 100"
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
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { supabase } from "../supabase";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeftRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  Headphones,
  LockKeyhole,
  Mail,
  PlaneTakeoff,
  Radar,
  ShieldCheck,
  UsersRound,
} from "lucide-vue-next";

import MainLayout from "@/layouts/MainLayout.vue";
import QuoteModal from "@/components/reservation/QuoteModal.vue";
import AirportAutocomplete from "@/components/reservation/AirportAutocomplete.vue";
import {
  evaluateAircraftAirport,
  getWorstOperationalStatus,
} from "@/services/aircraftEligibility";
import { generateReservationPDF } from "@/utils/pdfGenerator";

const AIRCRAFT_TABLE = "aircraft_fleet";
const COMMERCIAL_MARGIN_RATE = 0.15;
const OTHER_CHARGES_DEFAULT = 0;
const AIRCRAFT_DISTANCE_LIMITS = {
  near: 150,
  regional: 350,
};
const INITIAL_AIRCRAFT_VISIBLE_LIMIT = 12;
const AIRCRAFT_TYPE_OPERATIONAL_MARGINS = {
  HELICOPTERO: {
    operationalMarginMinutes: 15,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
    overnightFeeUsd: 350,
  },
  "MONOMOTOR PISTON": {
    operationalMarginMinutes: 15,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
    overnightFeeUsd: 250,
  },
  TURBOHELICE: {
    operationalMarginMinutes: 20,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
    overnightFeeUsd: 450,
  },
  "JET LIGERO (LIGHT JET)": {
    operationalMarginMinutes: 30,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
    overnightFeeUsd: 650,
  },
  "MIDSIZE JET (MID JET)": {
    operationalMarginMinutes: 30,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
    overnightFeeUsd: 850,
  },
  "SUPER MIDSIZE JET": {
    operationalMarginMinutes: 35,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
    overnightFeeUsd: 1000,
  },
  "HEAVY JET": {
    operationalMarginMinutes: 40,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
    overnightFeeUsd: 1200,
  },
  "REGIONAL JET": {
    operationalMarginMinutes: 40,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
    overnightFeeUsd: 950,
  },
};
const AIRCRAFT_MODEL_PRICING_OVERRIDES = {
  "LEAR JET 31": {
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
    airportFeesUsd: 500,
    overnightFeeUsd: 0,
  },
};

const route = useRoute();
const router = useRouter();
const currentLocale = computed(() =>
  String(route.meta?.locale || "es-mx").toLowerCase(),
);
const isSpanish = computed(() => currentLocale.value === "es-mx");
const copy = computed(() =>
  isSpanish.value
    ? {
        heroEyebrow: "Aviacion privada. Disponibilidad real.",
        heroTitle: "Solicita una reservacion de vuelo privado",
        heroDescription:
          "Comparte tus planes de viaje y nuestro equipo preparara una propuesta personalizada.",
        selectFlightsTitle: "1. Selecciona tus vuelos",
        tripTypeLabel: "Tipo de viaje",
        oneWayLabel: "Solo ida",
        roundTripLabel: "Viaje redondo",
        multiCityLabel: "Multidestino",
        addFlightLabel: "Agregar otro vuelo",
        returnFlightLabel: "Vuelo de regreso",
        removeFlightLabel: "Quitar vuelo",
        removeReturnLabel: "Quitar vuelo de regreso",
        returnDateLabel: "Fecha de regreso",
        departureDateTimeLabel: "Fecha y hora de salida",
        returnDateTimeLabel: "Fecha y hora de regreso",
        segmentDateTimeLabel: "Fecha y hora",
        steps: ["Tu itinerario", "Opciones de aeronave", "Tus datos", "Recibe propuesta"],
        fromLabel: "Desde",
        toLabel: "Hacia",
        departureLabel: "Fecha de salida",
        passengersLabel: "Pasajeros",
        passenger: "Pasajero",
        passengers: "Pasajeros",
        passengerMeta: "Capacidad sujeta a aeronave",
        aircraftCategoryLabel: "Categoria de aeronave",
        selectAirport: "Selecciona aeropuerto",
        aircraftLabel: "Aeronave",
        selectAircraft: "Selecciona aeronave",
        selectAircraftCta: "Elegir aeronave",
        viewAircraftCta: "Ver aeronaves",
        noAircraftOptions: "No encontramos aeronaves disponibles con validación automática para esta ruta.",
        aircraftOptionsHelper: "Mostrando aeronaves más cercanas a tu punto de salida.",
        aircraftOptionsHelperAll: "Mostrando todas las aeronaves elegibles.",
        showMoreAircraft: "Ver más aeronaves",
        showLessAircraft: "Ver menos aeronaves",
        aircraftGroupAtOrigin: "En aeropuerto de salida",
        aircraftGroupNear: "Cercanos al origen",
        aircraftGroupRegional: "Opciones regionales",
        aircraftGroupOther: "Otras aeronaves",
        aircraftGroupUnknown: "Ubicación no determinada",
        aircraftBadgeAtOrigin: "EN ORIGEN",
        aircraftBadgeNear: "CERCANA",
        nameLabel: "Nombre completo",
        emailLabel: "Correo",
        phoneLabel: "Telefono",
        routeSummary: "Ruta",
        contactSummary: "Contacto",
        continueCta: "Continuar",
        searchAvailabilityCta: "Buscar disponibilidad",
        sendProposalCta: "Revisar propuesta",
        missingItinerary: "Selecciona origen, destino, fecha y pasajeros para continuar.",
        missingReturn: "Completa el vuelo de regreso o cambia a solo ida.",
        incompleteFlights: "Completa todos los vuelos antes de continuar.",
        invalidChronology: "La fecha y hora debe ser posterior al vuelo anterior.",
        invalidReturnDate: "La fecha y hora de regreso debe ser posterior a la salida.",
        sameAirport: "El origen y destino deben ser diferentes.",
        missingAircraft: "Selecciona una aeronave disponible.",
        missingContact: "Completa nombre, correo y telefono.",
        invalidEmail: "Ingresa un correo valido.",
        aircraftHelpFallback: "Elige una aeronave para calcular disponibilidad y propuesta.",
        swapLabel: "Intercambiar origen y destino",
        checkAvailability: "Consultar disponibilidad",
        searchingAvailabilityCta: "Buscando disponibilidad...",
        itinerarySummaryLabel: "Resumen",
        departureSummaryLabel: "Salida",
        returnSummaryLabel: "Regreso",
        tripModeLabels: {
          "one-way": "Solo ida",
          "round-trip": "Viaje redondo",
          "multi-city": "Multidestino",
        },
        secureNote: "Tu informacion es segura y confidencial.",
        nextTitle: "Que pasa despues?",
        process: [
          {
            icon: Radar,
            title: "Verificamos disponibilidad",
            description: "Nuestro equipo revisa disponibilidad real para tu ruta.",
          },
          {
            icon: PlaneTakeoff,
            title: "Preparamos opciones",
            description: "Recibiras aeronaves que se ajustan a tu mision.",
          },
          {
            icon: FileText,
            title: "Enviamos tu propuesta",
            description: "Una propuesta personalizada llega a tu correo en minutos.",
          },
          {
            icon: ShieldCheck,
            title: "Vuelas con confianza",
            description: "Nuestro equipo acompana cada etapa del viaje.",
          },
        ],
        trust: [
          {
            icon: CalendarDays,
            title: "Disponibilidad real",
            description: "Servicio concierge 24/7, 365 dias.",
          },
          {
            icon: ShieldCheck,
            title: "Seguridad primero",
            description: "Altos estandares en cada operacion.",
          },
          {
            icon: Headphones,
            title: "Soporte experto",
            description: "Asesoria de aviacion cuando la necesites.",
          },
          {
            icon: LockKeyhole,
            title: "Privacidad total",
            description: "Tu informacion nunca se comparte ni vende.",
          },
        ],
        whyTitle: "Por que volar con Sky Group?",
        whyDescription:
          "Con años de experiencia, ofrecemos soluciones privadas con seguridad, servicio y eficiencia.",
        whyBullets: [
          "Acceso a mas de 50 aeronaves en Mexico y el mundo",
          "Coordinacion on-demand de charter, manejo y mas",
          "Operaciones 24/7 y servicio personalizado",
          "Compania lider de aviacion privada en Mexico",
        ],
        proposalTitle: "Tu propuesta será enviada directamente a nuestros correos",
        proposalDescription:
          "Cuando verifiquemos disponibilidad, recibirás opciones de aeronave, detalles y precio privado.",
        readyCta: "Estoy listo para volar",
        formEyebrow: "Completa tu solicitud",
        formTitle: "Detalles finales para preparar tu propuesta",
        formDescription:
          "El formulario conserva tu itinerario inicial y permite seleccionar aeronave, datos de contacto y rutas adicionales.",
        noAircraft: "No se selecciono ninguna aeronave.",
        unavailableAircraft:
          "Esta aeronave ya esta reservada en el rango de tiempo seleccionado.",
        aircraftCategories: [
          {
            key: "helicopter",
            title: "Helicopteros",
            description: "Ideal para trayectos cortos y acceso a zonas sin aeropuerto.",
          },
          {
            key: "turboprop",
            title: "Turbohelices",
            description: "Excelente equilibrio entre eficiencia y costo para vuelos regionales.",
          },
          {
            key: "light-jet",
            title: "Light Jets",
            description: "Para 4-8 pasajeros en vuelos nacionales y regionales.",
          },
        ],
      }
    : {
        heroEyebrow: "Private aviation. Real availability.",
        heroTitle: "Request a Private Flight Reservation",
        heroDescription:
          "Tell us your travel plans and our team will prepare a personalized flight proposal.",
        selectFlightsTitle: "1. Select your flights",
        tripTypeLabel: "Trip type",
        oneWayLabel: "One way",
        roundTripLabel: "Round trip",
        multiCityLabel: "Multi-city",
        addFlightLabel: "Add another flight",
        returnFlightLabel: "Return flight",
        removeFlightLabel: "Remove flight",
        removeReturnLabel: "Remove return flight",
        returnDateLabel: "Return date",
        departureDateTimeLabel: "Departure date & time",
        returnDateTimeLabel: "Return date & time",
        segmentDateTimeLabel: "Date & time",
        steps: ["Your itinerary", "Aircraft options", "Your details", "Receive proposal"],
        fromLabel: "From",
        toLabel: "To",
        departureLabel: "Departure date",
        passengersLabel: "Passengers",
        passenger: "Passenger",
        passengers: "Passengers",
        passengerMeta: "Capacity depends on aircraft",
        aircraftCategoryLabel: "Aircraft category",
        selectAirport: "Select airport",
        aircraftLabel: "Aircraft",
        selectAircraft: "Select aircraft",
        selectAircraftCta: "Choose aircraft",
        viewAircraftCta: "View aircraft",
        noAircraftOptions: "No aircraft with automatic validation are available for this route.",
        aircraftOptionsHelper: "Showing aircraft closest to your departure point.",
        aircraftOptionsHelperAll: "Showing all eligible aircraft.",
        showMoreAircraft: "Show more aircraft",
        showLessAircraft: "Show fewer aircraft",
        aircraftGroupAtOrigin: "At departure airport",
        aircraftGroupNear: "Near origin",
        aircraftGroupRegional: "Regional options",
        aircraftGroupOther: "Other aircraft",
        aircraftGroupUnknown: "Location not determined",
        aircraftBadgeAtOrigin: "AT ORIGIN",
        aircraftBadgeNear: "NEARBY",
        nameLabel: "Full name",
        emailLabel: "Email",
        phoneLabel: "Phone",
        routeSummary: "Route",
        contactSummary: "Contact",
        continueCta: "Continue",
        searchAvailabilityCta: "Search availability",
        sendProposalCta: "Review proposal",
        missingItinerary: "Select origin, destination, date, and passengers to continue.",
        missingReturn: "Complete the return flight or switch to one way.",
        incompleteFlights: "Complete every flight before continuing.",
        invalidChronology: "Date and time must be later than the previous flight.",
        invalidReturnDate: "Return date and time must be later than departure.",
        sameAirport: "Origin and destination must be different.",
        missingAircraft: "Select an available aircraft.",
        missingContact: "Complete your name, email, and phone.",
        invalidEmail: "Enter a valid email address.",
        aircraftHelpFallback: "Choose an aircraft to calculate availability and proposal.",
        swapLabel: "Swap origin and destination",
        checkAvailability: "Check availability",
        searchingAvailabilityCta: "Searching availability...",
        itinerarySummaryLabel: "Summary",
        departureSummaryLabel: "Departure",
        returnSummaryLabel: "Return",
        tripModeLabels: {
          "one-way": "One way",
          "round-trip": "Round trip",
          "multi-city": "Multi-city",
        },
        secureNote: "Your information is secure and confidential.",
        nextTitle: "What happens next?",
        process: [
          {
            icon: Radar,
            title: "We verify availability",
            description: "Our team checks real-time availability for your route.",
          },
          {
            icon: PlaneTakeoff,
            title: "We prepare your options",
            description: "You will receive aircraft options for your mission.",
          },
          {
            icon: FileText,
            title: "We send your proposal",
            description: "A personalized quote will be emailed within minutes.",
          },
          {
            icon: ShieldCheck,
            title: "You fly with confidence",
            description: "Our team is with you every step of the way.",
          },
        ],
        trust: [
          {
            icon: CalendarDays,
            title: "Real Availability",
            description: "Live access to our fleet 24/7, 365 days.",
          },
          {
            icon: ShieldCheck,
            title: "Safety First",
            description: "Highest safety standards in every operation.",
          },
          {
            icon: Headphones,
            title: "Expert Support",
            description: "Aviation advisors available whenever you need us.",
          },
          {
            icon: LockKeyhole,
            title: "Total Privacy",
            description: "Your information is never shared or sold.",
          },
        ],
        whyTitle: "Why fly with Sky Group?",
        whyDescription:
          "With over 20 years of experience, we provide private aviation solutions tailored to your needs with safety, service, and efficiency.",
        whyBullets: [
          "Access to 50+ aircraft across Mexico and worldwide",
          "On-demand charter, aircraft management and more",
          "24/7 operations and personalized service",
          "Mexico's leading private aviation company",
        ],
        proposalTitle: "Your proposal will be sent directly to your inbox",
        proposalDescription:
          "Once we verify availability, you will receive a personalized flight proposal with aircraft options, details, and a private quote.",
        readyCta: "I'm ready to fly",
        formEyebrow: "Complete your request",
        formTitle: "Final details to prepare your proposal",
        formDescription:
          "Your initial itinerary is preserved below. Choose an aircraft, add contact details, and request your private proposal.",
        noAircraft: "No aircraft selected.",
        unavailableAircraft:
          "This aircraft is already reserved in that time range.",
        aircraftCategories: [
          {
            key: "helicopter",
            title: "Helicopters",
            description: "Ideal for short trips and access to locations without an airport.",
          },
          {
            key: "turboprop",
            title: "Turboprops",
            description: "A strong balance of efficiency and cost for regional flights.",
          },
          {
            key: "light-jet",
            title: "Light Jets",
            description: "For 4-8 passengers on domestic and regional flights.",
          },
        ],
      },
);

const showQuoteModal = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const compactError = ref("");
const compactFormRef = ref(null);
const mobileHeroVideoRef = ref(null);
const departureDateInputRef = ref(null);
const extraRouteDateInputRefs = ref({});
const activeStep = ref(0);
const tripMode = ref("one-way");
const showAllAircraft = ref(false);
const routeType = ref("NATIONAL");
const aircraftAvailability = ref(true);
const returnToBaseEnabled = ref(false);
const fieldIds = {
  from: "reservation-from-airport",
  to: "reservation-to-airport",
  date: "reservation-departure-date",
  passengers: "reservation-passengers",
  returnFrom: "reservation-return-from-airport",
  returnTo: "reservation-return-to-airport",
  returnDate: "reservation-return-date",
  returnPassengers: "reservation-return-passengers",
  aircraft: "reservation-aircraft",
  name: "reservation-name",
  email: "reservation-email",
  phone: "reservation-phone",
};

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

const MOBILE_HERO_LOOP_SECONDS = 26;

const syncMobileHeroVideoLoop = () => {
  const video = mobileHeroVideoRef.value;
  if (!video) return;

  const limit = Math.min(MOBILE_HERO_LOOP_SECONDS, video.duration || MOBILE_HERO_LOOP_SECONDS);

  if (video.currentTime >= limit) {
    video.currentTime = 0;
    video.play().catch(() => {});
  }
};

const openDatePicker = (inputRef) => {
  const input =
    inputRef?.value && typeof inputRef.value.focus === "function"
      ? inputRef.value
      : inputRef;

  if (!input || typeof input.focus !== "function") return;

  input.focus({ preventScroll: true });

  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
    } catch {
      input.focus({ preventScroll: true });
    }
  }
};

const setExtraRouteDateInputRef = (routeIndex, element) => {
  if (element) {
    extraRouteDateInputRefs.value[routeIndex] = element;
    return;
  }

  delete extraRouteDateInputRefs.value[routeIndex];
};

const getExtraRouteTitle = (extraIndex) => {
  if (extraIndex === 0) return copy.value.returnFlightLabel;
  return isSpanish.value ? `Vuelo ${extraIndex + 2}` : `Flight ${extraIndex + 2}`;
};

const getExtraRouteMinDate = (routeIndex) =>
  routes.value[routeIndex - 1]?.start_date || routes.value[0]?.start_date || minDateTime.value;

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

const getAircraftPricingDefaults = (aircraft) => {
  if (!aircraft) {
    return {
      operationalMarginMinutes: 20,
      applyCommercialMargin: true,
      commercialMarginPercent: COMMERCIAL_MARGIN_RATE * 100,
      airportFeesUsd: 0,
      overnightFeeUsd: 0,
      otherChargesUsd: 0,
    };
  }

  const normalizedName = String(aircraft.name || "").trim().toUpperCase();
  const normalizedType = norm(aircraft.aircraft_type || aircraft.type || "");
  const typeDefaults =
    AIRCRAFT_TYPE_OPERATIONAL_MARGINS[normalizedType] ||
    getOperationalRuleByAircraftType(aircraft.aircraft_type || aircraft.type || "");
  const namedDefaults = AIRCRAFT_MODEL_PRICING_OVERRIDES[normalizedName] || {};

  const fallbackOperationalMarginMinutes =
    toNumber(typeDefaults.operationalMarginMinutes) || 30;
  const fallbackApplyCommercialMargin =
    namedDefaults.applyCommercialMargin ??
    typeDefaults.applyCommercialMargin ??
    true;
  const fallbackCommercialMarginPercent =
    toNumber(namedDefaults.commercialMarginPercent) ||
    toNumber(typeDefaults.commercialMarginPercent) ||
    COMMERCIAL_MARGIN_RATE * 100;
  const fallbackAirportFeesUsd =
    toNumber(namedDefaults.airportFeesUsd) ||
    toNumber(typeDefaults.airportFeesUsd);
  const fallbackOvernightFeeUsd =
    toNumber(namedDefaults.overnightFeeUsd) ||
    toNumber(typeDefaults.overnightFeeUsd);
  const fallbackOtherChargesUsd =
    toNumber(namedDefaults.otherChargesUsd) ||
    toNumber(typeDefaults.otherChargesUsd);
  const rentalRateUsd = getAircraftRentalRate(aircraft);
  const derivedOvernightFeeUsd =
    rentalRateUsd > 0 ? Number((rentalRateUsd / 2).toFixed(2)) : 0;
  const aircraftOvernightFeeUsd = toNumber(
    aircraft?.overnight_fee_usd ??
      aircraft?.overnightFeeUsd ??
      aircraft?.crew_overnight_usd ??
      aircraft?.crewOvernightUsd,
  );

  return {
    operationalMarginMinutes: fallbackOperationalMarginMinutes,
    applyCommercialMargin:
      aircraft?.apply_commercial_margin ??
      aircraft?.applyCommercialMargin ??
      fallbackApplyCommercialMargin,
    commercialMarginPercent: toNumber(
      aircraft?.commercial_margin_percent ??
        aircraft?.commercialMarginPercent,
      fallbackCommercialMarginPercent,
    ),
    airportFeesUsd: toNumber(
      aircraft?.airport_fees_usd ??
        aircraft?.airportFeesUsd ??
        aircraft?.national_expenses_usd ??
        aircraft?.international_expenses_usd,
      fallbackAirportFeesUsd,
    ),
    overnightFeeUsd:
      aircraftOvernightFeeUsd > 0
        ? aircraftOvernightFeeUsd
        : derivedOvernightFeeUsd || fallbackOvernightFeeUsd,
    otherChargesUsd: toNumber(
      aircraft?.other_charges_usd ??
        aircraft?.otherChargesUsd,
      fallbackOtherChargesUsd,
    ),
  };
};

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
const aircraftEligibilityByKey = ref({});
const aircraftRangeEligibilityByKey = ref({});
const eligibleAircraftByRouteKey = ref({});
const aircraftEligibilityLoading = ref(false);
let aircraftEligibilityRequestId = 0;

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

const getAirportEligibilityId = (airport) =>
  airport?.ID ?? null;

const allAirports = computed(() => [
  ...airportsNational.value.map((airport) => ({
    id: airport.id || airport.ID || airport.IATA || airport.AEROPUERTO,
    ID: airport.ID || airport.id || null,
    source: "NATIONAL",
    name: airport.AEROPUERTO,
    aeropuerto: airport.AEROPUERTO,
    AEROPUERTO: airport.AEROPUERTO,
    iata: (airport.IATA || airport.iata || "").toUpperCase(),
    IATA: (airport.IATA || airport.iata || "").toUpperCase(),
    icao: (airport.ICAO || airport.icao || "").toUpperCase(),
    ICAO: (airport.ICAO || airport.icao || "").toUpperCase(),
    city: airport.CIUDAD,
    ciudad: airport.CIUDAD,
    estado: airport.ESTADO,
    country: "MEXICO",
    latitude: airport.LATITUDE ?? airport.latitude ?? airport.lat,
    longitude: airport.LONGITUDE ?? airport.longitude ?? airport.lng ?? airport.lon,
    LATITUDE: airport.LATITUDE ?? airport.latitude ?? airport.lat,
    LONGITUDE: airport.LONGITUDE ?? airport.longitude ?? airport.lng ?? airport.lon,
    lat: airport.LATITUDE ?? airport.latitude ?? airport.lat,
    lng: airport.LONGITUDE ?? airport.longitude ?? airport.lng ?? airport.lon,
    type: norm(airport.TYPE),
    TYPE: airport.TYPE || airport.type || "",
  })),
  ...airportsInternational.value.map((airport) => ({
    id: airport.id || airport.ID || airport.IATA || airport.AEROPUERTO,
    ID: airport.ID || airport.id || null,
    source: "INTERNATIONAL",
    name: airport.AEROPUERTO,
    aeropuerto: airport.AEROPUERTO,
    AEROPUERTO: airport.AEROPUERTO,
    iata: (airport.IATA || "").toUpperCase(),
    IATA: (airport.IATA || "").toUpperCase(),
    icao: (airport.ICAO || airport.icao || "").toUpperCase(),
    ICAO: (airport.ICAO || airport.icao || "").toUpperCase(),
    city: airport.CIUDAD,
    ciudad: airport.CIUDAD,
    country: airport.COUNTRY,
    latitude: airport.LATITUDE ?? airport.latitude ?? airport.lat,
    longitude: airport.LONGITUDE ?? airport.longitude ?? airport.lng ?? airport.lon,
    LATITUDE: airport.LATITUDE ?? airport.latitude ?? airport.lat,
    LONGITUDE: airport.LONGITUDE ?? airport.longitude ?? airport.lng ?? airport.lon,
    lat: airport.LATITUDE ?? airport.latitude ?? airport.lat,
    lng: airport.LONGITUDE ?? airport.longitude ?? airport.lng ?? airport.lon,
    type: norm(airport.TYPE),
    TYPE: airport.TYPE || airport.type || "",
  })),
]);

const validAirports = computed(() => {
  return routeType.value === "NATIONAL"
    ? allAirports.value.filter((airport) => airport.source === "NATIONAL")
    : allAirports.value.filter((airport) => airport.source === "INTERNATIONAL");
});

const compactAirportOptions = computed(() =>
  validAirports.value
    .filter((airport) => getAirportOptionValue(airport))
    .slice()
    .sort((left, right) =>
      `${left.ciudad} ${getAirportOptionValue(left)}`.localeCompare(
        `${right.ciudad} ${getAirportOptionValue(right)}`,
      ),
    ),
);

const minDateTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
});

const findCompactAirport = (airportCode) =>
  allAirports.value.find(
    (airport) => norm(getAirportOptionValue(airport)) === norm(airportCode),
  );

const getCompactAirportMeta = (airportCode) => {
  const airport = findCompactAirport(airportCode);
  if (!airport) return isSpanish.value ? "Selecciona aeropuerto" : "Select airport";
  return [airport.aeropuerto, airport.estado || airport.country]
    .filter(Boolean)
    .join(", ");
};

const compactFromMeta = computed(() =>
  getCompactAirportMeta(routes.value[0]?.fromAirport),
);
const compactToMeta = computed(() =>
  getCompactAirportMeta(routes.value[0]?.toAirport),
);
const hasReturnFlight = computed(() => tripMode.value === "round-trip" && routes.value.length > 1);
const returnRoute = computed(() => routes.value[1] || emptyRoute());

const formatCompactDateMeta = (value) => {
  if (!value) return isSpanish.value ? "Selecciona fecha" : "Select date";

  return new Intl.DateTimeFormat(isSpanish.value ? "es-MX" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};
const compactDateMeta = computed(() =>
  formatCompactDateMeta(routes.value[0]?.start_date),
);

const normalizeAirportComparable = (value) =>
  String(value || "").trim().toUpperCase();

const getAirportComparableValues = (airport) => {
  if (!airport) return [];

  return [
    airport.id,
    airport.ID,
    getAirportOptionValue(airport),
    airport.iata,
    airport.IATA,
    airport.icao,
    airport.ICAO,
  ]
    .map(normalizeAirportComparable)
    .filter(Boolean);
};

const isSameAirport = (leftAirport, rightAirport) => {
  const leftValues = getAirportComparableValues(leftAirport);
  const rightValues = new Set(getAirportComparableValues(rightAirport));

  if (!leftValues.length || !rightValues.size) return false;

  return leftValues.some((value) => rightValues.has(value));
};

const getAirportCoordinates = (airport) => {
  if (!airport) return null;

  const lat = Number(airport.lat ?? airport.latitude ?? airport.LATITUDE);
  const lng = Number(airport.lng ?? airport.longitude ?? airport.LONGITUDE);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
};

const getAircraftPositioningDistanceNM = (aircraft) => {
  const originAirport = findCompactAirport(routes.value[0]?.fromAirport);
  const baseAirport = getAircraftBaseAirport(aircraft?.id);

  if (!originAirport || !baseAirport) return Number.POSITIVE_INFINITY;
  if (isSameAirport(baseAirport, originAirport)) return 0;

  const baseCoordinates = getAirportCoordinates(baseAirport);
  const originCoordinates = getAirportCoordinates(originAirport);

  if (!baseCoordinates || !originCoordinates) return Number.POSITIVE_INFINITY;

  return getDistanceNM(
    baseCoordinates.lat,
    baseCoordinates.lng,
    originCoordinates.lat,
    originCoordinates.lng,
  );
};

const getCustomerRoutesForAircraft = (aircraftId) =>
  routes.value
    .filter(
      (routeItem) =>
        Number(routeItem.passengers) > 0 &&
        routeItem.fromAirport &&
        routeItem.toAirport,
    )
    .map((routeItem) => ({
      ...routeItem,
      aircraft_id: aircraftId,
    }));

const buildOperationalRoutesForAircraft = (aircraftId, routeItems = getCustomerRoutesForAircraft(aircraftId)) => {
  const customerRoutes = routeItems.filter(
    (routeItem) =>
      Number(routeItem.passengers) > 0 &&
      routeItem.aircraft_id &&
      routeItem.fromAirport &&
      routeItem.toAirport,
  );

  if (!customerRoutes.length) return [];

  const firstRoute = customerRoutes[0];
  const lastRoute = customerRoutes[customerRoutes.length - 1];
  const aircraftBase = getAircraftBaseAirport(aircraftId);
  const firstRouteOrigin = findAirportForRoute(firstRoute, "from");
  const lastRouteDestination = findAirportForRoute(lastRoute, "to");

  if (!aircraftBase) return [...customerRoutes];

  if (itineraryStartsAndEndsAtBase(customerRoutes, aircraftBase)) {
    return [...customerRoutes];
  }

  const operationalRoutes = [];

  if (!isRouteEndpointAtBase(firstRoute, "from", aircraftBase)) {
    operationalRoutes.push(
      buildPositioningRoute(
        aircraftId,
        aircraftBase,
        firstRouteOrigin || firstRoute.fromAirport,
        "repositioning",
      ),
    );
  }

  operationalRoutes.push(...customerRoutes);

  if (!isRouteEndpointAtBase(lastRoute, "to", aircraftBase)) {
    operationalRoutes.push(
      buildPositioningRoute(
        aircraftId,
        lastRouteDestination || lastRoute.toAirport,
        aircraftBase,
        "return_to_base",
      ),
    );
  }

  return operationalRoutes;
};

const getAircraftOperationalProfile = (aircraft) => {
  const aircraftId = aircraft?.id;
  const operationalRoutes = buildOperationalRoutesForAircraft(aircraftId);
  const ferryLegCount = operationalRoutes.filter((routeItem) => routeItem.positioning).length;
  const baseAirport = getAircraftBaseAirport(aircraftId);
  const originAirport = findCompactAirport(routes.value[0]?.fromAirport);

  return {
    operationalRoutes,
    isAtOrigin: originAirport ? isSameAirport(baseAirport, originAirport) : false,
    positioningDistanceNM: getAircraftPositioningDistanceNM(aircraft),
    requiresPositioning: operationalRoutes.some(
      (routeItem) => routeItem.positioningType === "repositioning",
    ),
    requiresReturnToBase: operationalRoutes.some(
      (routeItem) => routeItem.positioningType === "return_to_base",
    ),
    ferryLegCount,
  };
};

const getRouteAirportEligibilityIds = (routeItem) => {
  const originAirport = findCompactAirport(routeItem?.fromAirport);
  const destinationAirport = findCompactAirport(routeItem?.toAirport);
  const originAirportId = getAirportEligibilityId(originAirport);
  const destinationAirportId = getAirportEligibilityId(destinationAirport);

  if (!originAirportId || !destinationAirportId) return null;

  return {
    originAirport,
    destinationAirport,
    originAirportId,
    destinationAirportId,
  };
};

const currentEligibilityRoutePairs = computed(() =>
  routes.value
    .filter(
      (routeItem) =>
        Number(routeItem.passengers) > 0 &&
        routeItem.fromAirport &&
        routeItem.toAirport,
    )
    .map(getRouteAirportEligibilityIds)
    .filter(Boolean),
);

const currentEligibilityRouteKey = computed(() =>
  currentEligibilityRoutePairs.value
    .map(
      ({ originAirportId, destinationAirportId }) =>
        `${originAirportId}:${destinationAirportId}`,
    )
    .join("|"),
);

const getAircraftEligibilityKey = (aircraftId) =>
  currentEligibilityRouteKey.value
    ? `${aircraftId}|${currentEligibilityRouteKey.value}`
    : "";

const getAircraftOperationalEligibility = (aircraft) => {
  const key = getAircraftEligibilityKey(aircraft?.id);
  return key ? aircraftEligibilityByKey.value[key] : null;
};

const getAircraftRangeEligibility = (aircraft) => {
  const key = getAircraftEligibilityKey(aircraft?.id);
  return key ? aircraftRangeEligibilityByKey.value[key] : null;
};

const isAircraftOperationallyAllowed = (aircraft) => {
  if (!currentEligibilityRouteKey.value) return true;

  const operationalEligibility = getAircraftOperationalEligibility(aircraft);
  const rangeEligibility = getAircraftRangeEligibility(aircraft);

  if (!operationalEligibility || !rangeEligibility) return false;

  return (
    operationalEligibility.routeStatus === "ALLOWED_WITH_VALIDATION" &&
    rangeEligibility.status !== "RANGE_BLOCKED"
  );
};

const toRadians = (value) => (Number(value) * Math.PI) / 180;

const calculateDistanceNm = (lat1, lon1, lat2, lon2) => {
  const earthRadiusNm = 3440.065;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusNm * c;
};

const getAirportCoordinatePair = (airport) => {
  const lat = Number(airport?.LATITUDE ?? airport?.latitude ?? airport?.lat);
  const lon = Number(
    airport?.LONGITUDE ??
      airport?.longitude ??
      airport?.lng ??
      airport?.lon,
  );

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return null;
  }

  return { lat, lon };
};

const calculateRoutePairDistanceNm = ({ originAirport, destinationAirport }) => {
  const originCoords = getAirportCoordinatePair(originAirport);
  const destinationCoords = getAirportCoordinatePair(destinationAirport);
  const routeDistanceNm =
    originCoords && destinationCoords
      ? Number(
          calculateDistanceNm(
            originCoords.lat,
            originCoords.lon,
            destinationCoords.lat,
            destinationCoords.lon,
          ).toFixed(1),
        )
      : null;

  return {
    originCoords,
    destinationCoords,
    routeDistanceNm,
  };
};

const evaluateAircraftRangeForRoutePairs = (aircraft, routePairs) => {
  const aircraftRangeNm = Number(aircraft?.range_nm ?? aircraft?.rangeNm);

  if (!Number.isFinite(aircraftRangeNm) || aircraftRangeNm <= 0) {
    console.warn("[RANGE CHECK WARNING]", {
      aircraft: aircraft?.name,
      rangeNm: aircraft?.range_nm ?? aircraft?.rangeNm,
      reason: "Missing aircraft range data",
    });

    return {
      status: "RANGE_UNKNOWN",
      reason: "Missing aircraft range data",
      routeDistanceNm: null,
      aircraftRangeNm: Number.isFinite(aircraftRangeNm) ? aircraftRangeNm : null,
      legs: [],
    };
  }

  const legs = [];

  for (const { originAirport, destinationAirport } of routePairs) {
    const { originCoords, destinationCoords, routeDistanceNm } =
      calculateRoutePairDistanceNm({ originAirport, destinationAirport });

    if (!originCoords || !destinationCoords || routeDistanceNm === null) {
      console.warn("[RANGE CHECK WARNING]", {
        aircraft: aircraft?.name,
        origin: originAirport?.ICAO,
        destination: destinationAirport?.ICAO,
        reason: "Missing valid airport coordinates",
      });

      return {
        status: "RANGE_UNKNOWN",
        reason: "Missing valid airport coordinates",
        routeDistanceNm: null,
        aircraftRangeNm,
        legs,
      };
    }

    const leg = {
      routeDistanceNm,
      aircraftRangeNm,
      originAirportId: originAirport?.ID,
      destinationAirportId: destinationAirport?.ID,
    };

    legs.push(leg);

    if (routeDistanceNm > aircraftRangeNm) {
      return {
        status: "RANGE_BLOCKED",
        routeDistanceNm,
        aircraftRangeNm,
        legs,
      };
    }
  }

  return {
    status: "ALLOWED",
    routeDistanceNm: legs.length
      ? Math.max(...legs.map((leg) => leg.routeDistanceNm))
      : null,
    aircraftRangeNm,
    legs,
  };
};

const withOperationalEligibility = (aircraft) => {
  const eligibility = getAircraftOperationalEligibility(aircraft);
  const rangeEligibility = getAircraftRangeEligibility(aircraft);
  if (!eligibility && !rangeEligibility) return aircraft;

  return {
    ...aircraft,
    ...(eligibility
      ? {
          operationalEligibility: {
            status: eligibility.routeStatus,
            origin: eligibility.origin,
            destination: eligibility.destination,
            ...(eligibility.error ? { error: true } : {}),
          },
        }
      : {}),
    ...(rangeEligibility ? { rangeEligibility } : {}),
  };
};

const getAircraftDistanceGroupKey = (rankedAircraft) => {
  if (rankedAircraft.isAtOrigin) return "atOrigin";
  if (!Number.isFinite(rankedAircraft.positioningDistanceNM)) return "unknown";
  if (rankedAircraft.positioningDistanceNM <= AIRCRAFT_DISTANCE_LIMITS.near) return "near";
  if (rankedAircraft.positioningDistanceNM <= AIRCRAFT_DISTANCE_LIMITS.regional) return "regional";
  return "other";
};

const aircraftDistanceGroupOrder = ["atOrigin", "near", "regional", "other", "unknown"];

const aircraftDistanceGroupLabels = computed(() => ({
  atOrigin: copy.value.aircraftGroupAtOrigin,
  near: copy.value.aircraftGroupNear,
  regional: copy.value.aircraftGroupRegional,
  other: copy.value.aircraftGroupOther,
  unknown: copy.value.aircraftGroupUnknown,
}));

const rankedAircraftOptions = computed(() => {
  if (aircraftEligibilityLoading.value) return [];

  const passengers = toNumber(routes.value[0]?.passengers, 1);
  const originAirport = findCompactAirport(routes.value[0]?.fromAirport);
  const routeKey = currentEligibilityRouteKey.value;
  const eligibleAircraft = routeKey
    ? eligibleAircraftByRouteKey.value[routeKey] || []
    : [];

  const ranked = eligibleAircraft
    .filter((aircraft) => toNumber(aircraft.capacity_passengers, 0) >= passengers)
    .map((aircraft) => {
      const operationalProfile = getAircraftOperationalProfile(aircraft);

      return {
        aircraft,
        ...operationalProfile,
      };
    })
    .map((rankedAircraft) => ({
      ...rankedAircraft,
      groupKey: originAirport ? getAircraftDistanceGroupKey(rankedAircraft) : "unknown",
    }))
    .sort((left, right) => {
      if (!originAirport) {
        const nameCompare = String(left.aircraft.name || "").localeCompare(
          String(right.aircraft.name || ""),
        );
        if (nameCompare !== 0) return nameCompare;

        return String(getCompactAircraftBaseLabel(left.aircraft) || "").localeCompare(
          String(getCompactAircraftBaseLabel(right.aircraft) || ""),
        );
      }

      const leftGroupIndex = aircraftDistanceGroupOrder.indexOf(left.groupKey);
      const rightGroupIndex = aircraftDistanceGroupOrder.indexOf(right.groupKey);
      if (leftGroupIndex !== rightGroupIndex) return leftGroupIndex - rightGroupIndex;

      if (left.isAtOrigin !== right.isAtOrigin) {
        return left.isAtOrigin ? -1 : 1;
      }

      if (left.ferryLegCount !== right.ferryLegCount) {
        return left.ferryLegCount - right.ferryLegCount;
      }

      if (left.positioningDistanceNM !== right.positioningDistanceNM) {
        return left.positioningDistanceNM - right.positioningDistanceNM;
      }

      const nameCompare = String(left.aircraft.name || "").localeCompare(
        String(right.aircraft.name || ""),
      );
      if (nameCompare !== 0) return nameCompare;

      return String(getCompactAircraftBaseLabel(left.aircraft) || "").localeCompare(
        String(getCompactAircraftBaseLabel(right.aircraft) || ""),
      );
    });

  console.log(
    "[D] rankedAircraftOptions",
    ranked.map((item) => ({
      id: item.aircraft.id,
      name: item.aircraft.name,
      type: item.aircraft.aircraft_type,
      status: item.aircraft.operationalEligibility?.status,
      rangeStatus: item.aircraft.rangeEligibility?.status,
    })),
  );

  return ranked;
});

const compactAircraftOptions = computed(() => {
  const options = rankedAircraftOptions.value.map((rankedAircraft) => rankedAircraft.aircraft);

  console.log(
    "[E] finalAircraftOptions",
    options.map((aircraft) => ({
      name: aircraft.name,
      type: aircraft.aircraft_type,
      status: aircraft.operationalEligibility?.status,
      rangeStatus: aircraft.rangeEligibility?.status,
    })),
  );

  const leakedBlocked = options.filter(
    (aircraft) => aircraft.operationalEligibility?.status === "BLOCKED",
  );

  if (leakedBlocked.length > 0) {
    console.error("[BLOCKED LEAK INTO SELECTOR]", leakedBlocked);
  }

  return options;
});

const priorityAircraftOptions = computed(() => {
  const originAirport = findCompactAirport(routes.value[0]?.fromAirport);
  if (!originAirport) return rankedAircraftOptions.value;

  const mustShow = rankedAircraftOptions.value.filter((item) =>
    ["atOrigin", "near"].includes(item.groupKey),
  );
  const fillable = rankedAircraftOptions.value.filter((item) =>
    ["regional", "other"].includes(item.groupKey),
  );

  if (mustShow.length >= INITIAL_AIRCRAFT_VISIBLE_LIMIT) return mustShow;

  return [
    ...mustShow,
    ...fillable.slice(0, INITIAL_AIRCRAFT_VISIBLE_LIMIT - mustShow.length),
  ];
});

const visibleRankedAircraftOptions = computed(() => {
  const originAirport = findCompactAirport(routes.value[0]?.fromAirport);
  if (!originAirport) return rankedAircraftOptions.value;
  if (showAllAircraft.value) return rankedAircraftOptions.value;
  if (!rankedAircraftOptions.value.length) return [];

  let visible = priorityAircraftOptions.value;
  if (!visible.length) {
    visible = rankedAircraftOptions.value.slice(0, INITIAL_AIRCRAFT_VISIBLE_LIMIT);
  }

  const selectedAircraftId = routes.value[0]?.aircraft_id;
  if (
    selectedAircraftId &&
    !visible.some((item) => String(item.aircraft.id) === String(selectedAircraftId))
  ) {
    const selected = rankedAircraftOptions.value.find(
      (item) => String(item.aircraft.id) === String(selectedAircraftId),
    );
    if (selected) visible = [...visible, selected];
  }

  return visible;
});

const visibleAircraftOptionGroups = computed(() =>
  aircraftDistanceGroupOrder
    .map((key) => ({
      key,
      label: aircraftDistanceGroupLabels.value[key],
      aircraft: visibleRankedAircraftOptions.value
        .filter((item) => item.groupKey === key)
        .map((item) => item.aircraft),
    }))
    .filter((group) => group.aircraft.length),
);

const hasHiddenAircraftOptions = computed(
  () => visibleRankedAircraftOptions.value.length < rankedAircraftOptions.value.length || showAllAircraft.value,
);

const aircraftOptionsHelperText = computed(() =>
  showAllAircraft.value ? copy.value.aircraftOptionsHelperAll : copy.value.aircraftOptionsHelper,
);

const getAircraftOptionLabel = (aircraft) => {
  return [
    aircraft.name,
    `${aircraft.capacity_passengers || "-"} pax`,
    getCompactAircraftBaseLabel(aircraft),
  ]
    .filter(Boolean)
    .join(" · ");
};

const toggleAircraftOptionsVisibility = () => {
  showAllAircraft.value = !showAllAircraft.value;
};

const selectedAircraft = computed(() => getAircraftById(routes.value[0]?.aircraft_id));

const aircraftHelpText = computed(() => {
  const aircraft = selectedAircraft.value;
  if (!aircraft) return copy.value.aircraftHelpFallback;
  return [
    aircraft.aircraft_type || aircraft.type,
    `${aircraft.capacity_passengers || "-"} pax`,
    aircraft.home_base || aircraft.base,
  ]
    .filter(Boolean)
    .join(" / ");
});

const selectedAircraftSummary = computed(() =>
  selectedAircraft.value
    ? `${selectedAircraft.value.name} (${selectedAircraft.value.capacity_passengers || "-"} pax)`
    : "-",
);

const getCompactAircraftTypeLabel = (aircraft) =>
  aircraft?.aircraft_type || aircraft?.type || (isSpanish.value ? "Aeronave privada" : "Private aircraft");

const getCompactAircraftBaseLabel = (aircraft) =>
  aircraft?.home_base ||
  aircraft?.base ||
  aircraft?.iata ||
  (isSpanish.value ? "Base por confirmar" : "Base to be confirmed");

const formatCompactCurrency = (value) =>
  new Intl.NumberFormat(isSpanish.value ? "es-MX" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(toNumber(value, 0));

const formatAirportSummary = (airportCode) => {
  const airport = findCompactAirport(airportCode);
  const code = getAirportOptionValue(airport) || airportCode || "-";
  const city = airport?.ciudad || airport?.city || "";
  return city && code ? `${city} (${code})` : code;
};

const formatSummaryDateTime = (value, includeYear = true) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const formattedDate = new Intl.DateTimeFormat(isSpanish.value ? "es-MX" : "en-US", {
    day: "2-digit",
    month: "short",
    ...(includeYear ? { year: "numeric" } : {}),
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat(isSpanish.value ? "es-MX" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${formattedDate.toUpperCase()} · ${formattedTime}`;
};

const getSegmentTitle = (index) =>
  isSpanish.value ? `Vuelo ${index + 1}` : `Flight ${index + 1}`;

const itinerarySummary = computed(() =>
  routes.value
    .filter((routeItem) => routeItem.fromAirport && routeItem.toAirport && routeItem.start_date)
    .map((routeItem, index) => ({
      key: `${index}-${routeItem.fromAirport}-${routeItem.toAirport}-${routeItem.start_date}`,
      title: getSegmentTitle(index),
      route:
        tripMode.value === "round-trip" && index === 0
          ? `${formatAirportSummary(routeItem.fromAirport)} ⇄ ${formatAirportSummary(routeItem.toAirport)}`
          : `${formatAirportSummary(routeItem.fromAirport)} → ${formatAirportSummary(routeItem.toAirport)}`,
      date: formatSummaryDateTime(routeItem.start_date, tripMode.value !== "multi-city"),
    })),
);

const routeSummary = computed(() =>
  itinerarySummary.value.length
    ? itinerarySummary.value.map((item) => item.route).join(" / ")
    : `- / ${routes.value[0]?.passengers || 1} ${copy.value.passengers}`,
);

const maxReachableStep = computed(() => {
  if (!isItineraryComplete.value) return 0;
  if (!routes.value[0]?.aircraft_id) return 1;
  if (!isContactComplete.value) return 2;
  return 3;
});

const compactSubmitLabel = computed(() =>
  loading.value && activeStep.value === 0
    ? copy.value.searchingAvailabilityCta
    : activeStep.value === 0
      ? copy.value.searchAvailabilityCta
      : activeStep.value === 3
        ? copy.value.sendProposalCta
        : copy.value.continueCta,
);

const getItineraryValidationMessage = () => {
  const customerRoutes = routes.value;
  const requiredCount =
    tripMode.value === "one-way" ? 1 : tripMode.value === "round-trip" ? 2 : customerRoutes.length;

  if (customerRoutes.length < requiredCount) return copy.value.incompleteFlights;

  for (let index = 0; index < requiredCount; index += 1) {
    const routeItem = customerRoutes[index] || {};
    if (!routeItem.fromAirport || !routeItem.toAirport || !routeItem.start_date || !routeItem.passengers) {
      return tripMode.value === "round-trip" && index === 1
        ? copy.value.missingReturn
        : copy.value.incompleteFlights;
    }
    if (norm(routeItem.fromAirport) === norm(routeItem.toAirport)) {
      return copy.value.sameAirport;
    }
    if (toNumber(routeItem.passengers) <= 0) {
      return copy.value.incompleteFlights;
    }
  }

  if (tripMode.value === "round-trip") {
    const departure = new Date(customerRoutes[0].start_date);
    const returnDate = new Date(customerRoutes[1].start_date);
    if (!(returnDate > departure)) return copy.value.invalidReturnDate;
  }

  if (tripMode.value === "multi-city") {
    for (let index = 1; index < customerRoutes.length; index += 1) {
      const previousDate = new Date(customerRoutes[index - 1].start_date);
      const currentDate = new Date(customerRoutes[index].start_date);
      if (!(currentDate > previousDate)) return copy.value.invalidChronology;
    }
  }

  return "";
};

const isItineraryComplete = computed(() => !getItineraryValidationMessage());

const canSearchAvailability = computed(() =>
  activeStep.value !== 0 || (isItineraryComplete.value && !loading.value),
);

const isPrimaryButtonDisabled = computed(() =>
  loading.value || (activeStep.value === 0 && !canSearchAvailability.value),
);

const isContactComplete = computed(() =>
  Boolean(form.name && form.email && form.phone),
);

const passengerOptions = computed(() => {
  const capacity = toNumber(getAircraftById(routes.value[0]?.aircraft_id)?.capacity_passengers, 8);
  return Array.from({ length: Math.max(1, Math.min(capacity, 12)) }, (_, index) => index + 1);
});

const assignAirportToRoute = (direction, airport) => {
  if (!airport) return;

  const prefix = direction === "from" ? "from" : "to";
  const target = routes.value[0];
  target[`${prefix}Airport`] = getAirportOptionValue(airport);
  target[`${prefix}City`] = airport.ciudad || "";
  target[`${prefix}State`] = airport.estado || "";
  target[`${prefix}Country`] = airport.country || "";
};

const assignAirportToSpecificRoute = (routeItem, direction, airport) => {
  if (!routeItem || !airport) return;

  const prefix = direction === "from" ? "from" : "to";
  routeItem[`${prefix}Airport`] = getAirportOptionValue(airport);
  routeItem[`${prefix}City`] = airport.ciudad || "";
  routeItem[`${prefix}State`] = airport.estado || "";
  routeItem[`${prefix}Country`] = airport.country || "";
};

const setCompactAirport = (direction, selectedAirport = null) => {
  const routeItem = routes.value[0];
  const code = direction === "from" ? routeItem.fromAirport : routeItem.toAirport;
  assignAirportToRoute(direction, selectedAirport || findCompactAirport(code));
  compactError.value = "";
  if (tripMode.value === "round-trip") {
    syncReturnRouteFromOutbound();
  }
};

const setExtraAirport = (routeIndex, direction, selectedAirport = null) => {
  const routeItem = routes.value[routeIndex];
  if (!routeItem) return;

  const code = direction === "from" ? routeItem.fromAirport : routeItem.toAirport;
  assignAirportToSpecificRoute(routeItem, direction, selectedAirport || findCompactAirport(code));
  compactError.value = "";
};

const swapCompactRoute = () => {
  const routeItem = routes.value[0];
  const from = {
    airport: routeItem.fromAirport,
    city: routeItem.fromCity,
    state: routeItem.fromState,
    country: routeItem.fromCountry,
  };

  routeItem.fromAirport = routeItem.toAirport;
  routeItem.fromCity = routeItem.toCity;
  routeItem.fromState = routeItem.toState;
  routeItem.fromCountry = routeItem.toCountry;
  routeItem.toAirport = from.airport;
  routeItem.toCity = from.city;
  routeItem.toState = from.state;
  routeItem.toCountry = from.country;
  compactError.value = "";
  if (tripMode.value === "round-trip") {
    syncReturnRouteFromOutbound();
  }
};

const swapExtraRoute = (routeIndex) => {
  const routeItem = routes.value[routeIndex];
  swapRouteAirports(routeItem);
};

const swapRouteAirports = (routeItem) => {
  if (!routeItem) return;

  const from = {
    airport: routeItem.fromAirport,
    city: routeItem.fromCity,
    state: routeItem.fromState,
    country: routeItem.fromCountry,
  };

  routeItem.fromAirport = routeItem.toAirport;
  routeItem.fromCity = routeItem.toCity;
  routeItem.fromState = routeItem.toState;
  routeItem.fromCountry = routeItem.toCountry;
  routeItem.toAirport = from.airport;
  routeItem.toCity = from.city;
  routeItem.toState = from.state;
  routeItem.toCountry = from.country;
  compactError.value = "";
};

const goToFullForm = () => {
  compactFormRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const addCompactFlight = () => {
  tripMode.value = "multi-city";
  compactError.value = "";

  const lastRoute = routes.value[routes.value.length - 1];
  routes.value.push({
    id: Date.now() + Math.random(),
    ...emptyRoute(),
    fromAirport: lastRoute?.toAirport || "",
    fromCity: lastRoute?.toCity || "",
    fromState: lastRoute?.toState || "",
    fromCountry: lastRoute?.toCountry || "",
    passengers: lastRoute?.passengers || routes.value[0]?.passengers || 1,
    aircraft_id: lastRoute?.aircraft_id || routes.value[0]?.aircraft_id || null,
  });
};

const syncReturnRouteFromOutbound = () => {
  const outbound = routes.value[0];
  const inbound = routes.value[1];
  if (!inbound) return;

  assignAirportToSpecificRoute(inbound, "from", findCompactAirport(outbound.toAirport));
  assignAirportToSpecificRoute(inbound, "to", findCompactAirport(outbound.fromAirport));
  inbound.passengers = outbound.passengers || 1;
  inbound.aircraft_id = outbound.aircraft_id || null;

  if (inbound.start_date && outbound.start_date) {
    const returnDate = new Date(inbound.start_date);
    const departureDate = new Date(outbound.start_date);

    if (!(returnDate > departureDate)) {
      inbound.start_date = "";
      inbound.end_date = "";
      compactError.value = copy.value.invalidReturnDate;
      return;
    }
  }

  syncExtraEndDate(1);
};

const ensureRouteCountForTripMode = (mode) => {
  const firstRoute = routes.value[0] || emptyRoute();

  if (mode === "one-way") {
    routes.value = [firstRoute];
    return;
  }

  if (mode === "round-trip") {
    const existingReturn = routes.value[1] || {
      id: Date.now() + Math.random(),
      ...emptyRoute(),
    };
    routes.value = [firstRoute, existingReturn];
    syncReturnRouteFromOutbound();
    return;
  }

  if (mode === "multi-city") {
    if (routes.value.length < 2) {
      const lastRoute = routes.value[routes.value.length - 1] || firstRoute;
      routes.value.push({
        id: Date.now() + Math.random(),
        ...emptyRoute(),
        fromAirport: lastRoute?.toAirport || "",
        fromCity: lastRoute?.toCity || "",
        fromState: lastRoute?.toState || "",
        fromCountry: lastRoute?.toCountry || "",
        passengers: lastRoute?.passengers || firstRoute?.passengers || 1,
        aircraft_id: lastRoute?.aircraft_id || firstRoute?.aircraft_id || null,
      });
    }
  }
};

const setTripMode = (mode) => {
  if (!["one-way", "round-trip", "multi-city"].includes(mode)) return;
  tripMode.value = mode;
  compactError.value = "";
  ensureRouteCountForTripMode(mode);
};

const removeExtraFlight = (routeIndex) => {
  if (routeIndex <= 0 || !routes.value[routeIndex]) return;
  if (tripMode.value === "multi-city" && routes.value.length <= 2) return;

  routes.value.splice(routeIndex, 1);
  delete extraRouteDateInputRefs.value[routeIndex];

  if (tripMode.value !== "multi-city" && routes.value.length <= 1) {
    tripMode.value = "one-way";
  }

  compactError.value = "";
};

const syncCompactEndDate = () => {
  const routeItem = routes.value[0];
  if (!routeItem?.start_date) return;
  routeItem.end_date = routeItem.end_date && routeItem.end_date >= routeItem.start_date
    ? routeItem.end_date
    : routeItem.start_date;
  compactError.value = "";
};

const onOutboundDateChange = () => {
  syncCompactEndDate();
  if (hasReturnFlight.value) {
    syncReturnRouteFromOutbound();
  }
};

const syncExtraEndDate = (routeIndex) => {
  const routeItem = routes.value[routeIndex];
  if (!routeItem?.start_date) return;
  routeItem.end_date = routeItem.start_date;
  compactError.value = "";
};

const selectCompactAircraft = (aircraft) => {
  if (!aircraft?.id) return;

  routes.value[0].aircraft_id = aircraft.id;

  routes.value.slice(1).forEach((routeItem) => {
    routeItem.aircraft_id = aircraft.id;
  });

  compactError.value = "";
};

const validateCompactStep = (step = activeStep.value) => {
  compactError.value = "";

  if (step === 0) {
    ensureRouteCountForTripMode(tripMode.value);
    if (tripMode.value === "round-trip") syncReturnRouteFromOutbound();

    const itineraryError = getItineraryValidationMessage();
    if (itineraryError) {
      compactError.value = itineraryError;
      return false;
    }

    routes.value.forEach((_, index) => syncExtraEndDate(index));
    syncCompactEndDate();
  }

  if (step === 1 && !routes.value[0]?.aircraft_id) {
    compactError.value = copy.value.missingAircraft;
    return false;
  }

  if (step === 2) {
    if (!isContactComplete.value) {
      compactError.value = copy.value.missingContact;
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      compactError.value = copy.value.invalidEmail;
      return false;
    }
  }

  return true;
};

const goToStep = (step) => {
  if (step > maxReachableStep.value) return;
  activeStep.value = step;
  compactError.value = "";
};

const handleCompactSubmit = () => {
  if (loading.value) return;
  if (!validateCompactStep()) return;

  if (activeStep.value < 3) {
    activeStep.value += 1;
    return;
  }

  if (!validateCompactStep(0) || !validateCompactStep(1) || !validateCompactStep(2)) {
    activeStep.value = Math.min(activeStep.value, maxReachableStep.value);
    return;
  }

  submitForm();
  if (errorMessage.value) {
    compactError.value = errorMessage.value;
  }
};

const applyDefaultRouteSelection = () => {
  if (!routes.value[0] || routes.value[0].fromAirport || routes.value[0].toAirport) {
    return;
  }

  const findByCode = (code) =>
    validAirports.value.find(
      (airport) => norm(getAirportOptionValue(airport)) === norm(code),
    );

  const from = findByCode("TLC") || validAirports.value[0];
  const to =
    findByCode("CUN") ||
    validAirports.value.find((airport) => norm(airport.ciudad).includes("CANCUN")) ||
    validAirports.value[1];

  assignAirportToRoute("from", from);
  assignAirportToRoute("to", to);
};

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

const getTripDateValue = (routeItem, type = "start") => {
  if (!routeItem) return "";

  if (type === "end") {
    return routeItem.end_date || routeItem.start_date || "";
  }

  return routeItem.start_date || routeItem.end_date || "";
};

const getSortedTripLegs = (routeItems = []) =>
  [...routeItems]
    .filter((routeItem) => !routeItem?.positioning)
    .sort((left, right) => {
      const leftValue = getTripDateValue(left);
      const rightValue = getTripDateValue(right);

      if (!leftValue && !rightValue) return 0;
      if (!leftValue) return 1;
      if (!rightValue) return -1;

      return new Date(leftValue) - new Date(rightValue);
    });

const getTripDateBounds = (routeItems = []) => {
  const sortedLegs = getSortedTripLegs(routeItems);
  const firstLeg = sortedLegs[0] || null;
  const lastLeg = sortedLegs[sortedLegs.length - 1] || null;

  return {
    tripStartDate: getTripDateValue(firstLeg, "start") || routes.value[0]?.start_date || null,
    tripEndDate:
      getTripDateValue(lastLeg, "end") ||
      routes.value[0]?.end_date ||
      routes.value[0]?.start_date ||
      null,
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

const shortenAirportName = (value = "") =>
  String(value || "")
    .replace(/\bInternational Airport\b/gi, "")
    .replace(/\bAeropuerto Internacional\b/gi, "")
    .replace(/\bInternacional\b/gi, "")
    .replace(/\bLicenciado\b/gi, "Lic.")
    .replace(/\bGeneral\b/gi, "Gral.")
    .replace(/\bHermanos\b/gi, "Hnos.")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+-\s+/g, " - ")
    .trim();

const formatAirportDisplay = (airport) => {
  if (!airport) return "-";

  const airportName = shortenAirportName(airport.aeropuerto || airport.ciudad || "");
  const airportCode = getAirportOptionValue(airport);

  if (airportName && airportCode) return `${airportName} - ${airportCode}`;
  return airportName || airportCode || "-";
};

const getRouteAirportDisplay = (routeItem, direction) => {
  const airport = findAirportForRoute(routeItem, direction);
  if (airport) return formatAirportDisplay(airport);

  const rawCode =
    direction === "from" ? routeItem?.fromAirport : routeItem?.toAirport;
  return rawCode || "-";
};

const getAircraftBaseAirport = (aircraftId) => {
  const aircraft = getAircraftById(aircraftId);
  if (!aircraft) return null;

  const baseReference = aircraft.iata || aircraft.home_base || aircraft.base;
  if (!baseReference) return null;

  const iata = norm(baseReference);

  let match = allAirports.value.find(
    (airport) => norm(getAirportOptionValue(airport)) === iata,
  );

  if (match) return match;

  match = allAirports.value.find(
    (airport) =>
      norm(airport.aeropuerto) === iata ||
      norm(airport.ciudad) === iata,
  );

  if (match) return match;

  match = allAirports.value.find(
    (airport) =>
      norm(airport.ciudad) === norm(aircraft.ciudad || aircraft.city) &&
      (!(aircraft.estado || aircraft.state) ||
        norm(airport.estado) === norm(aircraft.estado || aircraft.state)),
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

const itineraryStartsAndEndsAtBase = (routeItems, baseAirport) => {
  if (!routeItems?.length || !baseAirport) return false;

  const firstRoute = routeItems[0];
  const lastRoute = routeItems[routeItems.length - 1];

  return (
    isRouteEndpointAtBase(firstRoute, "from", baseAirport) &&
    isRouteEndpointAtBase(lastRoute, "to", baseAirport)
  );
};

const buildPositioningRoute = (
  aircraftId,
  fromAirport,
  toAirport,
  positioningType = "repositioning",
) => {
  const resolveAirportCode = (airport) =>
    typeof airport === "string" ? airport : getAirportOptionValue(airport);

  return {
  aircraft_id: aircraftId,
  fromAirport: resolveAirportCode(fromAirport),
  fromCity: fromAirport?.ciudad || "",
  fromState: fromAirport?.estado || "",
  fromCountry: fromAirport?.country || "",
  toAirport: resolveAirportCode(toAirport),
  toCity: toAirport?.ciudad || "",
  toState: toAirport?.estado || "",
  toCountry: toAirport?.country || "",
  passengers: 1,
  start_date: "",
  end_date: "",
  positioning: true,
  positioningType,
  };
};

const getRouteNights = (routeItem, routeIndex, routeList = []) => {
  if (!routeItem?.start_date || routeItem?.positioning) return 0;

  const nextRoute = routeList[routeIndex + 1];
  if (!nextRoute?.start_date || nextRoute?.positioning) return 0;

  const start = new Date(routeItem.start_date);
  const nextStart = new Date(nextRoute.start_date);

  if (Number.isNaN(start.getTime()) || Number.isNaN(nextStart.getTime())) return 0;

  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);

  const nextStartDay = new Date(nextStart);
  nextStartDay.setHours(0, 0, 0, 0);

  return Math.max(0, Math.round((nextStartDay - startDay) / 86400000));
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
      .from(AIRCRAFT_TABLE)
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

  mobileHeroVideoRef.value?.addEventListener("timeupdate", syncMobileHeroVideoLoop);
});

onBeforeUnmount(() => {
  mobileHeroVideoRef.value?.removeEventListener("timeupdate", syncMobileHeroVideoLoop);
});

const toRad = (deg) => (deg * Math.PI) / 180;

function minutesToHHMM(minutes) {
  const totalMinutes = Math.round(minutes);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs}:${String(mins).padStart(2, "0")} hrs`;
}

function formatoHoras(minutos) {
  const totalMinutes = Math.round(minutos);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (m === 0) return `${h}:00 hrs`;
  return `${h}:${String(m).padStart(2, "0")} hrs`;
}

const getOperationalRuleByAircraftType = (aircraftType) => {
  const normalizedType = norm(aircraftType);

  if (AIRCRAFT_TYPE_OPERATIONAL_MARGINS[normalizedType]) {
    return AIRCRAFT_TYPE_OPERATIONAL_MARGINS[normalizedType];
  }

  if (normalizedType.includes("HELIC")) {
    return AIRCRAFT_TYPE_OPERATIONAL_MARGINS.HELICOPTERO;
  }

  if (normalizedType.includes("MONOMOTOR") || normalizedType.includes("PISTON")) {
    return AIRCRAFT_TYPE_OPERATIONAL_MARGINS["MONOMOTOR PISTON"];
  }

  if (normalizedType.includes("TURBOH")) {
    return AIRCRAFT_TYPE_OPERATIONAL_MARGINS.TURBOHELICE;
  }

  if (normalizedType.includes("LIGHT JET") || normalizedType.includes("JET LIGERO")) {
    return AIRCRAFT_TYPE_OPERATIONAL_MARGINS["JET LIGERO (LIGHT JET)"];
  }

  if (normalizedType.includes("MIDSIZE JET") || normalizedType.includes("MID JET")) {
    return AIRCRAFT_TYPE_OPERATIONAL_MARGINS["MIDSIZE JET (MID JET)"];
  }

  if (normalizedType.includes("SUPER MIDSIZE")) {
    return AIRCRAFT_TYPE_OPERATIONAL_MARGINS["SUPER MIDSIZE JET"];
  }

  if (normalizedType.includes("HEAVY")) {
    return AIRCRAFT_TYPE_OPERATIONAL_MARGINS["HEAVY JET"];
  }

  if (normalizedType.includes("REGIONAL")) {
    return AIRCRAFT_TYPE_OPERATIONAL_MARGINS["REGIONAL JET"];
  }

  return {
    operationalMarginMinutes: 30,
  };
};

function calcularTiempoVuelo({
  distanciaNm,
  velocidadKnots,
  aircraftType,
  margenOperativoMin = null,
}) {
  const reglaBase = getOperationalRuleByAircraftType(aircraftType);
  const margenMin = toNumber(margenOperativoMin, reglaBase.operationalMarginMinutes);
  const tiempoRealMin = (distanciaNm / velocidadKnots) * 60;
  const tiempoEstimadoMin = tiempoRealMin + margenMin;
  const minutosEstimados = Math.ceil(tiempoEstimadoMin);

  return {
    tiempoRealMin: Math.ceil(tiempoRealMin),
    tiempoEstimadoMin: minutosEstimados,
    minutosEstimados,
    horasEstimadas: minutosEstimados / 60,
    tiempoMostrar: formatoHoras(minutosEstimados),
    margenOperativoMin: margenMin,
    baseMinutes: Math.ceil(tiempoRealMin),
    estimatedMinutes: minutosEstimados,
    baseDecimalHours: tiempoRealMin / 60,
    estimatedDecimalHours: minutosEstimados / 60,
    baseHHMM: formatoHoras(Math.ceil(tiempoRealMin)),
    estimatedHHMM: formatoHoras(minutosEstimados),
  };
}

const getDistanceNM = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) / 1.852;
};

const calculatePrice = (routeItem, routeIndex = 0, routeList = []) => {
  const aircraft = getAircraftById(getRouteAircraftId(routeItem));
  const from = findAirportForRoute(routeItem, "from");
  const to = findAirportForRoute(routeItem, "to");

  if (!aircraft) {
    return {
      ready: false,
      reason: "missing_aircraft",
      flightCost: 0,
      overnightCost: 0,
      operationalCost: 0,
      nights: 0,
      total: 0,
      hours: 0,
      miles: 0,
    };
  }

  if (!from || !to) {
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

  const pricingDefaults = getAircraftPricingDefaults(aircraft);
  const flightTime = calcularTiempoVuelo({
    distanciaNm: distanceNm,
    velocidadKnots: speed,
    aircraftType: aircraft.aircraft_type || aircraft.type,
    margenOperativoMin: pricingDefaults.operationalMarginMinutes,
  });
  const airTime = flightTime.baseDecimalHours;
  const hours = flightTime.estimatedDecimalHours;

  const flightCostRaw = hours * getAircraftRentalRate(aircraft);
  const flightCost = Number(flightCostRaw.toFixed(2));
  const nights = getRouteNights(routeItem, routeIndex, routeList);
  const overnightRate = pricingDefaults.overnightFeeUsd;
  const overnightCost = Number((nights * overnightRate).toFixed(2));
  const operationalCost = pricingDefaults.airportFeesUsd;
  const total = Number((flightCost + overnightCost).toFixed(2));

  return {
    ready: true,
    reason: "",
    flightCost,
    flightCostRaw,
    overnightCost,
    operationalCost,
    nights,
    total,
    airTime: Number(airTime.toFixed(4)),
    hours,
    marginMinutes: flightTime.margenOperativoMin,
    baseMinutes: flightTime.baseMinutes,
    estimatedMinutes: flightTime.estimatedMinutes,
    baseHHMM: flightTime.baseHHMM,
    estimatedHHMM: flightTime.estimatedHHMM,
    miles: Number(distanceNm.toFixed(1)),
  };
};

const addMinutesToDate = (date, minutes) =>
  new Date(date.getTime() + Math.round(minutes) * 60000);

const subtractMinutesFromDate = (date, minutes) =>
  new Date(date.getTime() - Math.round(minutes) * 60000);

const getBreakdownDurationMinutes = (breakdown) => {
  const estimatedMinutes = toNumber(breakdown?.estimatedMinutes);
  if (estimatedMinutes > 0) return estimatedMinutes;

  const hours = toNumber(breakdown?.hours);
  return hours > 0 ? Math.round(hours * 60) : 0;
};

const getOperationalReservationBounds = (aircraftId, routeItems = validRoutes.value) => {
  const customerRoutes = routeItems
    .filter(
      (routeItem) =>
        Number(routeItem.passengers) > 0 &&
        routeItem.fromAirport &&
        routeItem.toAirport &&
        routeItem.start_date,
    )
    .map((routeItem) => ({
      ...routeItem,
      aircraft_id: aircraftId,
    }));

  if (!aircraftId || !customerRoutes.length) return getReservationBounds(routeItems);

  const operationalRoutes = buildOperationalRoutesForAircraft(aircraftId, customerRoutes);
  if (!operationalRoutes.length) return getReservationBounds(routeItems);

  const firstCustomerRoute = operationalRoutes.find((routeItem) => !routeItem.positioning);
  if (!firstCustomerRoute?.start_date) return getReservationBounds(routeItems);

  const firstCustomerStart = new Date(firstCustomerRoute.start_date);
  if (Number.isNaN(firstCustomerStart.getTime())) return getReservationBounds(routeItems);

  const routeBreakdowns = operationalRoutes.map((routeItem, index, routeList) =>
    calculatePrice(routeItem, index, routeList),
  );
  const starts = [];
  const ends = [];
  let cursorEnd = null;

  operationalRoutes.forEach((routeItem, index) => {
    const durationMinutes = getBreakdownDurationMinutes(routeBreakdowns[index]);
    if (!durationMinutes) return;

    let start = null;
    let end = null;

    if (routeItem.positioningType === "repositioning" && !routeItem.start_date) {
      end = firstCustomerStart;
      start = subtractMinutesFromDate(end, durationMinutes);
    } else if (routeItem.positioningType === "return_to_base" && !routeItem.start_date) {
      start = cursorEnd || firstCustomerStart;
      end = addMinutesToDate(start, durationMinutes);
    } else if (routeItem.start_date) {
      start = new Date(routeItem.start_date);
      if (Number.isNaN(start.getTime())) return;
      end = addMinutesToDate(start, durationMinutes);
    } else if (cursorEnd) {
      start = cursorEnd;
      end = addMinutesToDate(start, durationMinutes);
    }

    if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;

    starts.push(start);
    ends.push(end);
    cursorEnd = end;
  });

  if (!starts.length || !ends.length) return getReservationBounds(routeItems);

  starts.sort((left, right) => left - right);
  ends.sort((left, right) => left - right);

  return {
    startISO: starts[0].toISOString(),
    endISO: ends[ends.length - 1].toISOString(),
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
  validRoutes.value.map((routeItem, index, routeList) =>
    calculatePrice(routeItem, index, routeList),
  ),
);

const pricedRoutes = computed(() => {
  if (!validRoutes.value.length) return [];

  return buildOperationalRoutesForAircraft(
    getRouteAircraftId(validRoutes.value[0]),
    validRoutes.value,
  );
});

const pricedBreakdowns = computed(() =>
  pricedRoutes.value.map((routeItem, index, routeList) =>
    calculatePrice(routeItem, index, routeList),
  ),
);

const summarizeRouteBreakdowns = (routeItems, breakdownItems) =>
  routeItems.reduce(
    (summary, routeItem, index) => {
      const breakdown = breakdownItems[index];

      if (!breakdown?.ready) return summary;

      summary.miles += toNumber(breakdown.miles);
      summary.flightTime += toNumber(breakdown.airTime);
      summary.estimatedHours += toNumber(breakdown.hours);
      summary.flightTimeMinutes += toNumber(breakdown.baseMinutes);
      summary.estimatedMinutes += toNumber(breakdown.estimatedMinutes);
      summary.flightCost += toNumber(
        breakdown.flightCostRaw ?? breakdown.flightCost,
      );

      if (routeItem?.positioning) {
        summary.positioningCount += 1;
      } else {
        summary.customerCount += 1;
      }

      return summary;
    },
    {
      miles: 0,
      flightTime: 0,
      estimatedHours: 0,
      flightTimeMinutes: 0,
      estimatedMinutes: 0,
      flightCost: 0,
      customerCount: 0,
      positioningCount: 0,
    },
  );

const pricingSummary = computed(() => {
  const customerRoutes = pricedRoutes.value.filter((routeItem) => !routeItem.positioning);
  const ferryRoutes = pricedRoutes.value.filter((routeItem) => routeItem.positioning);
  const customerBreakdowns = pricedBreakdowns.value.filter(
    (_, index) => !pricedRoutes.value[index]?.positioning,
  );
  const ferryBreakdowns = pricedBreakdowns.value.filter(
    (_, index) => pricedRoutes.value[index]?.positioning,
  );

  const customer = summarizeRouteBreakdowns(customerRoutes, customerBreakdowns);
  const ferry = summarizeRouteBreakdowns(ferryRoutes, ferryBreakdowns);

  return {
    customer: {
      ...customer,
      miles: Number(customer.miles.toFixed(1)),
      flightTime: Number(customer.flightTime.toFixed(2)),
      estimatedHours: Number(customer.estimatedHours.toFixed(2)),
      flightTimeMinutes: Math.round(customer.flightTimeMinutes),
      estimatedMinutes: Math.round(customer.estimatedMinutes),
      flightTimeHHMM: minutesToHHMM(customer.flightTimeMinutes),
      estimatedHHMM: minutesToHHMM(customer.estimatedMinutes),
      flightCost: Number(customer.flightCost.toFixed(2)),
    },
    ferry: {
      ...ferry,
      miles: Number(ferry.miles.toFixed(1)),
      flightTime: Number(ferry.flightTime.toFixed(2)),
      estimatedHours: Number(ferry.estimatedHours.toFixed(2)),
      flightTimeMinutes: Math.round(ferry.flightTimeMinutes),
      estimatedMinutes: Math.round(ferry.estimatedMinutes),
      flightTimeHHMM: minutesToHHMM(ferry.flightTimeMinutes),
      estimatedHHMM: minutesToHHMM(ferry.estimatedMinutes),
      flightCost: Number(ferry.flightCost.toFixed(2)),
    },
    totals: {
      miles: Number((customer.miles + ferry.miles).toFixed(1)),
      flightTime: Number((customer.flightTime + ferry.flightTime).toFixed(2)),
      estimatedHours: Number(
        (customer.estimatedHours + ferry.estimatedHours).toFixed(2),
      ),
      flightTimeMinutes: Math.round(customer.flightTimeMinutes + ferry.flightTimeMinutes),
      estimatedMinutes: Math.round(customer.estimatedMinutes + ferry.estimatedMinutes),
      flightTimeHHMM: minutesToHHMM(customer.flightTimeMinutes + ferry.flightTimeMinutes),
      estimatedHHMM: minutesToHHMM(customer.estimatedMinutes + ferry.estimatedMinutes),
      flightCost: Number((customer.flightCost + ferry.flightCost).toFixed(2)),
    },
  };
});

const flightCostTotal = computed(() =>
  pricingSummary.value.totals.flightCost,
);

const overnightTotal = computed(() =>
  Number(
    priceBreakdowns.value
      .reduce(
        (sum, breakdown) => sum + toNumber(breakdown?.overnightCost),
        0,
      )
      .toFixed(2),
  ),
);
const otherCharges = computed(() => {
  const aircraft = getAircraftById(routes.value[0]?.aircraft_id);
  if (!aircraft) return OTHER_CHARGES_DEFAULT;

  return getAircraftPricingDefaults(aircraft).otherChargesUsd;
});

const applyCommercialMargin = computed(() => {
  const aircraft = getAircraftById(routes.value[0]?.aircraft_id);
  return Boolean(getAircraftPricingDefaults(aircraft).applyCommercialMargin);
});

const commercialMarginPercent = computed(() => {
  const aircraft = getAircraftById(routes.value[0]?.aircraft_id);
  return getAircraftPricingDefaults(aircraft).commercialMarginPercent;
});

const operationalExpenses = computed(() => {
  const aircraft = getAircraftById(routes.value[0]?.aircraft_id);
  if (!aircraft) return 0;

  return getAircraftPricingDefaults(aircraft).airportFeesUsd;
});

const subtotal = computed(
  () =>
    flightCostTotal.value +
    overnightTotal.value +
    operationalExpenses.value +
    otherCharges.value,
);

const commercialMargin = computed(() =>
  applyCommercialMargin.value
    ? Number(
        (
          subtotal.value *
          (commercialMarginPercent.value / 100)
        ).toFixed(2),
      )
    : 0,
);
const iva = computed(() => 0);
const totalFinal = computed(() =>
  Number((subtotal.value + commercialMargin.value).toFixed(2)),
);

const submitForm = () => {
  if (!validRoutes.value.length) {
    errorMessage.value =
      "Completa la aeronave, origen, destino y fechas válidas antes de continuar.";
    return;
  }

  const invalidBreakdown = pricedBreakdowns.value.find((item) => !item.ready);

  if (invalidBreakdown) {
    const aircraftName =
      getAircraftName(routes.value[0]?.aircraft_id) || "la aeronave seleccionada";
    const reasonMessages = {
      missing_aircraft:
        "No se pudo generar la cotización porque la aeronave seleccionada ya no coincide con el catálogo activo.",
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
    const selectedAircraft = getAircraftById(aircraftId);

    if (!aircraftId || !selectedAircraft) throw new Error(copy.value.noAircraft);

    const { startISO, endISO } = getOperationalReservationBounds(
      aircraftId,
      validRoutes.value,
    );

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

    if (routesError && routesError.code !== "23503") throw routesError;

    const blobToBase64 = (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

    const pdfBlob = await generateReservationPDF({
      form,
      routes: pricedRoutes.value,
      breakdowns: pricedBreakdowns.value,
      pricingSummary: pricingSummary.value,
      tripDates: getTripDateBounds(pricedRoutes.value),
      totals: {
        flight: flightCostTotal.value,
        customerFlight: pricingSummary.value.customer.flightCost,
        repositioning: pricingSummary.value.ferry.flightCost,
        overnight: overnightTotal.value,
        expenses: operationalExpenses.value,
        otherCharges: otherCharges.value,
        subtotal: subtotal.value,
        commercialMargin: commercialMargin.value,
        commercialMarginRate: commercialMarginPercent.value / 100,
        iva: iva.value,
        total: totalFinal.value,
      },
      getAircraftName,
      getAircraftById,
      getRouteAirportDisplay,
    });

    const pdfBase64 = await blobToBase64(pdfBlob);
    const tripDates = getTripDateBounds(pricedRoutes.value);
    const pricingPayload = {
      customerFlightCost: pricingSummary.value.customer.flightCost,
      ferryFlightCost: pricingSummary.value.ferry.flightCost,
      totalMiles: pricingSummary.value.totals.miles,
      totalFlightTime: pricingSummary.value.totals.flightTime,
      totalEstimatedHours: pricingSummary.value.totals.estimatedHours,
      flightCost: flightCostTotal.value,
      repositioningCost: pricingSummary.value.ferry.flightCost,
      overnightCost: overnightTotal.value,
      operationalExpenses: operationalExpenses.value,
      otherCharges: otherCharges.value,
      subtotal: subtotal.value,
      commercialMargin: commercialMargin.value,
      commercialMarginRate: commercialMarginPercent.value / 100,
      tax: iva.value,
      iva: iva.value,
      total: totalFinal.value,
      totalPrice: totalFinal.value,
      total_estimated_price: totalFinal.value,
    };

    const res = await fetch(
      "https://redskyg.com/landing/send-email_movil_cliente.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteId,
          quote_id: quoteId,
          form,
          routes: pricedRoutes.value,
          routeBreakdowns: pricedBreakdowns.value,
          priceBreakdowns: pricedBreakdowns.value,
          pricingSummary: pricingSummary.value,
          pricing: pricingPayload,
          totals: pricingPayload,
          subtotal: subtotal.value,
          commercialMargin: commercialMargin.value,
          commercialMarginRate: commercialMarginPercent.value / 100,
          iva: iva.value,
          tax: iva.value,
          total: totalFinal.value,
          totalPrice: totalFinal.value,
          total_estimated_price: totalFinal.value,
          trip_start_date: tripDates.tripStartDate,
          trip_end_date: tripDates.tripEndDate,
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

const getDistinctRouteAirportsForEligibility = (routePairs) => {
  const airportById = new Map();

  routePairs.forEach(({ originAirport, destinationAirport }) => {
    [originAirport, destinationAirport].forEach((airport) => {
      const airportId = Number(getAirportEligibilityId(airport));
      if (!Number.isFinite(airportId)) {
        console.warn("[AIRPORT RPC SKIPPED]", {
          airport: airport?.ICAO || airport?.IATA || airport?.AEROPUERTO,
          airportId: airport?.ID,
          reason: "Invalid airport.ID",
        });
        return;
      }

      airportById.set(airportId, airport);
    });
  });

  return [...airportById.entries()].map(([airportId, airport]) => ({
    airportId,
    airport,
  }));
};

const evaluateAircraftAirportsForRoute = async (aircraft, routeAirports) => {
  const results = await Promise.all(
    routeAirports.map(async ({ airportId, airport }) => {
      try {
        const result = await evaluateAircraftAirport(aircraft.id, airportId);
        const status = result?.resultado_operacional || "BLOCKED";

        console.log("[AIRPORT RPC]", {
          aircraft: aircraft.name,
          aircraftId: aircraft.id,
          airport: airport?.ICAO,
          airportId,
          status,
          reason: result?.reason || result?.motivo || result?.detalle || null,
        });

        return {
          airport,
          airportId,
          result,
          status,
        };
      } catch (error) {
        console.error("[AIRPORT RPC ERROR]", {
          aircraft_id: aircraft.id,
          airport_id: airportId,
          error,
        });

        return {
          airport,
          airportId,
          result: null,
          status: "RPC_ERROR",
          error: true,
        };
      }
    }),
  );

  const statuses = results.map((result) => result.status);
  const routeStatus = statuses.includes("RPC_ERROR")
    ? "RPC_ERROR"
    : getWorstOperationalStatus(statuses);

  console.log("[ROUTE ELIGIBILITY]", {
    aircraft: aircraft.name,
    statuses,
    routeStatus,
  });

  return {
    routeStatus,
    airportEvaluations: results,
    origin: results[0]?.result || null,
    destination: results[results.length - 1]?.result || null,
    error: statuses.includes("RPC_ERROR"),
  };
};

watch(
  () => [
    currentEligibilityRouteKey.value,
    aircraftFleet.value.map((aircraft) => aircraft.id).join("|"),
    routes.value.map((routeItem) => Number(routeItem.passengers) || 0).join("|"),
    tripMode.value,
  ],
  async ([routeKey]) => {
    const requestId = ++aircraftEligibilityRequestId;
    const routePairs = currentEligibilityRoutePairs.value;

    if (!routeKey || !routePairs.length || !aircraftFleet.value.length) {
      aircraftEligibilityLoading.value = false;
      return;
    }

    aircraftEligibilityLoading.value = true;
    eligibleAircraftByRouteKey.value = {
      ...eligibleAircraftByRouteKey.value,
      [routeKey]: [],
    };

    const nextEligibility = {};
    const nextRangeEligibility = {};

    const passengers = toNumber(routes.value[0]?.passengers, 1);
    const routeAirports = getDistinctRouteAirportsForEligibility(routePairs);
    const hasInvalidAirportIds = routePairs.some(
      ({ originAirport, destinationAirport }) =>
        !Number.isFinite(Number(originAirport?.ID)) ||
        !Number.isFinite(Number(destinationAirport?.ID)),
    );

    console.log("[ELIGIBILITY START]", {
      routeKey,
      origin: routePairs[0]?.originAirport,
      destination: routePairs[routePairs.length - 1]?.destinationAirport,
      passengers,
    });

    const activeAircraft = aircraftFleet.value.filter(
      (aircraft) => aircraft.is_active !== false,
    );

    const aircraftCandidates = activeAircraft.filter((aircraft) => {
      const capacity = toNumber(
        aircraft.capacity ?? aircraft.capacity_passengers,
        0,
      );
      const allowed = capacity >= passengers;

      if (!allowed) {
        nextEligibility[`${aircraft.id}|${routeKey}`] = {
          routeStatus: "CAPACITY_BLOCKED",
          origin: null,
          destination: null,
        };
      }

      return allowed;
    });

    console.log(
      "[A] aircraftCandidates",
      aircraftCandidates.map((aircraft) => ({
        id: aircraft.id,
        name: aircraft.name,
        type: aircraft.aircraft_type,
        range_nm: aircraft.range_nm,
      })),
    );

    routePairs.forEach(({ originAirport, destinationAirport }) => {
      console.log("[AIRPORT COORDINATES RAW]", {
        origin: {
          id: originAirport?.ID,
          name: originAirport?.AEROPUERTO,
          LATITUDE: originAirport?.LATITUDE,
          LONGITUDE: originAirport?.LONGITUDE,
          latitude: originAirport?.latitude,
          longitude: originAirport?.longitude,
        },
        destination: {
          id: destinationAirport?.ID,
          name: destinationAirport?.AEROPUERTO,
          LATITUDE: destinationAirport?.LATITUDE,
          LONGITUDE: destinationAirport?.LONGITUDE,
          latitude: destinationAirport?.latitude,
          longitude: destinationAirport?.longitude,
        },
      });

      const { originCoords, destinationCoords, routeDistanceNm } =
        calculateRoutePairDistanceNm({ originAirport, destinationAirport });

      console.log("[ROUTE DISTANCE]", {
        originCoords,
        destinationCoords,
        routeDistanceNm,
      });

      console.log("Origin:", {
        id: originAirport?.ID,
        icao: originAirport?.ICAO,
        iata: originAirport?.IATA,
      });

      console.log("Destination:", {
        id: destinationAirport?.ID,
        icao: destinationAirport?.ICAO,
        iata: destinationAirport?.IATA,
      });

      console.log("ROUTE TYPES", {
        origin: {
          id: originAirport?.ID,
          name: originAirport?.AEROPUERTO,
          type: originAirport?.TYPE,
        },
        destination: {
          id: destinationAirport?.ID,
          name: destinationAirport?.AEROPUERTO,
          type: destinationAirport?.TYPE,
        },
      });
    });

    const rangeEligibleAircraft = [];

    aircraftCandidates.forEach((aircraft) => {
      const eligibilityKey = `${aircraft.id}|${routeKey}`;
      const rangeEligibility = evaluateAircraftRangeForRoutePairs(aircraft, routePairs);
      nextRangeEligibility[eligibilityKey] = rangeEligibility;

      console.log("[RANGE CHECK]", {
        aircraft: aircraft.name,
        aircraftId: aircraft.id,
        aircraftType: aircraft.aircraft_type,
        routeDistanceNm: rangeEligibility.routeDistanceNm,
        aircraftRangeRaw: aircraft.range_nm,
        aircraftRangeNm: rangeEligibility.aircraftRangeNm,
        result: rangeEligibility.status,
      });

      if (rangeEligibility.status === "RANGE_BLOCKED") {
        console.log("[RANGE BLOCKED]", aircraft.name, {
          routeDistanceNm: rangeEligibility.routeDistanceNm,
          aircraftRangeNm: rangeEligibility.aircraftRangeNm,
        });

        nextEligibility[eligibilityKey] = {
          routeStatus: "RANGE_BLOCKED",
          origin: null,
          destination: null,
          rangeBlocked: true,
        };

        return;
      }

      rangeEligibleAircraft.push(aircraft);
    });

    console.log(
      "[B] rangeEligibleAircraft",
      rangeEligibleAircraft.map((aircraft) => ({
        id: aircraft.id,
        name: aircraft.name,
        type: aircraft.aircraft_type,
        range_nm: aircraft.range_nm,
      })),
    );

    console.log(
      "[AFTER RANGE DETAIL]",
      rangeEligibleAircraft.map((aircraft) => ({
        id: aircraft.id,
        name: aircraft.name,
        type: aircraft.aircraft_type,
        range_nm: aircraft.range_nm,
        rangeEligibility: nextRangeEligibility[`${aircraft.id}|${routeKey}`],
      })),
    );

    const eligibleAircraft = [];

    await Promise.all(
      rangeEligibleAircraft.map(async (aircraft) => {
        const eligibilityKey = `${aircraft.id}|${routeKey}`;

        if (hasInvalidAirportIds || !routeAirports.length) {
          nextEligibility[eligibilityKey] = {
            routeStatus: "RPC_ERROR",
            origin: null,
            destination: null,
            error: true,
          };
          return;
        }

        const routeEvaluation = await evaluateAircraftAirportsForRoute(
          aircraft,
          routeAirports,
        );
        nextEligibility[eligibilityKey] = routeEvaluation;
        const routeStatus = nextEligibility[eligibilityKey].routeStatus;
        const visible = routeStatus === "ALLOWED_WITH_VALIDATION";

        console.log("[SELECTOR VISIBILITY]", {
          aircraft: aircraft.name,
          routeStatus,
          visible,
        });

        if (!visible) {
          console.log(
            "[OPERATIONAL_FILTERED]",
            aircraft.name,
            routeStatus,
          );
        } else {
          eligibleAircraft.push({
            ...aircraft,
            operationalEligibility: {
              status: routeStatus,
              origin: nextEligibility[eligibilityKey].origin,
              destination: nextEligibility[eligibilityKey].destination,
            },
            rangeEligibility: nextRangeEligibility[eligibilityKey],
          });

          console.log(
            "[ADDED TO SELECTOR]",
            aircraft.name,
            routeStatus,
          );
        }
      }),
    );

    if (requestId !== aircraftEligibilityRequestId) return;

    aircraftEligibilityByKey.value = {
      ...aircraftEligibilityByKey.value,
      ...nextEligibility,
    };
    aircraftRangeEligibilityByKey.value = {
      ...aircraftRangeEligibilityByKey.value,
      ...nextRangeEligibility,
    };
    eligibleAircraftByRouteKey.value = {
      ...eligibleAircraftByRouteKey.value,
      [routeKey]: eligibleAircraft,
    };

    const eligibleAircraftLog = eligibleAircraft.map((aircraft) => ({
      id: aircraft.id,
      name: aircraft.name,
      type: aircraft.aircraft_type,
      status: aircraft.operationalEligibility?.status,
      rangeStatus: aircraft.rangeEligibility?.status,
    }));

    console.log(
      "[C] eligibleAircraft",
      eligibleAircraftLog,
    );

    console.log(
      "[ELIGIBLE AIRCRAFT FINAL]",
      eligibleAircraft.map((aircraft) => ({
        name: aircraft.name,
        type: aircraft.aircraft_type,
        operationalStatus: aircraft.operationalEligibility?.status,
        rangeStatus: aircraft.rangeEligibility?.status,
      })),
    );

    console.log(
      "[AFTER RPC DETAIL]",
      eligibleAircraft.map((aircraft) => ({
        id: aircraft.id,
        name: aircraft.name,
        type: aircraft.aircraft_type,
        status: aircraft.operationalEligibility?.status,
      })),
    );

    console.log(
      "[ELIGIBILITY COUNTS]",
      {
        candidates: aircraftCandidates.length,
        afterRange: rangeEligibleAircraft.length,
        eligibleAfterRpc: eligibleAircraft.length,
      },
    );

    console.log("[ELIGIBLE AIRCRAFT FINAL]", {
      candidates: aircraftCandidates.length,
      eligible: eligibleAircraft.length,
      blocked: Object.values(nextEligibility).filter((eligibility) =>
        ["BLOCKED", "RANGE_BLOCKED", "CAPACITY_BLOCKED", "RPC_ERROR"].includes(
          eligibility?.routeStatus,
        ),
      ).length,
    });

    const selectedAircraft = getAircraftById(routes.value[0]?.aircraft_id);
    if (selectedAircraft && !isAircraftOperationallyAllowed(selectedAircraft)) {
      routes.value[0].aircraft_id = null;
      routes.value.slice(1).forEach((routeItem) => {
        routeItem.aircraft_id = null;
      });
    }

    aircraftEligibilityLoading.value = false;
  },
  { immediate: true },
);

watch(
  () =>
    routes.value.map((routeItem) =>
      [
        routeItem.fromAirport,
        routeItem.toAirport,
        routeItem.start_date,
        routeItem.end_date,
        routeItem.aircraft_id,
      ].join("|"),
    ),
  async () => {
    const currentRoute = routes.value[0];
    if (!currentRoute.start_date || !currentRoute.aircraft_id) return;

    const { startISO, endISO } = getOperationalReservationBounds(
      currentRoute.aircraft_id,
      validRoutes.value,
    );

    if (!startISO || !endISO) return;

    const { data } = await supabase
      .from("reservations")
      .select("id")
      .eq("aircraft_id", currentRoute.aircraft_id)
      .lt("start_datetime", endISO)
      .gt("end_datetime", startISO);

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
  () => routes.value[0]?.passengers,
  (passengers) => {
    routes.value.forEach((routeItem, index) => {
      if (index === 0) return;
      routeItem.passengers = passengers || 1;
    });
  },
);

watch(
  () => [routes.value[0]?.fromAirport, routes.value[0]?.passengers, tripMode.value],
  () => {
    showAllAircraft.value = false;
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

<style scoped>
.reservation-landing {
  --bg: #060b0f;
  --panel: rgba(8, 14, 18, 0.92);
  --panel-soft: rgba(13, 22, 28, 0.9);
  --line: rgba(255, 255, 255, 0.1);
  --line-strong: rgba(210, 168, 89, 0.28);
  --text: #f8f4ec;
  --muted: rgba(248, 244, 236, 0.68);
  --gold: #d4a64f;
  --gold-2: #f0c875;
  min-height: 100vh;
  background: #05090d;
  color: var(--text);
}

.reservation-shell {
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
}

.reservation-hero {
  position: relative;
  min-height: 720px;
  overflow: hidden;
  padding-top: 132px;
}

.reservation-hero__video,
.reservation-hero__shade {
  position: absolute;
  inset: 0;
}

.reservation-hero__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  filter: brightness(0.78) contrast(1.12) saturate(0.92);
}

.reservation-hero__video--mobile {
  display: none;
}

.reservation-hero__video--mobile-inline {
  display: none;
}

.reservation-hero__shade {
  background:
    linear-gradient(90deg, rgba(5, 9, 13, 0.12) 0%, rgba(5, 9, 13, 0.12) 28%, rgba(5, 9, 13, 0) 52%),
    linear-gradient(180deg, rgba(5, 9, 13, 0) 0%, rgba(5, 9, 13, 0.1) 22%, rgba(5, 9, 13, 0.42) 100%);
}

.reservation-hero__content {
  position: relative;
  z-index: 1;
  display: grid;
  align-content: end;
  min-height: 588px;
  padding-bottom: 48px;
}

.reservation-copy {
  display: block;
  max-width: 520px;
  padding-bottom: 54px;
}

.reservation-kicker {
  margin: 0 0 10px;
  color: var(--gold-2);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.reservation-copy h1,
.full-request__copy h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.1rem, 4vw, 3.55rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.05em;
  text-wrap: balance;
}

.reservation-copy > p:last-child,
.full-request__copy > p {
  max-width: 460px;
  margin: 14px 0 0;
  color: var(--muted);
  line-height: 1.65;
}

.availability-card,
.process-card,
.trust-strip,
.why-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(7, 13, 17, 0.68), rgba(4, 9, 12, 0.58));
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(8px);
}

.availability-card {
  background:
    linear-gradient(180deg, rgba(7, 13, 17, 0.66), rgba(4, 9, 12, 0.52));
  backdrop-filter: none;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 34px 26px;
}

.flight-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.flight-card-header h2 {
  margin: 0;
  color: #ffffff;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.trip-toggle {
  display: inline-grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  min-width: 520px;
  min-height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.025);
}

.trip-toggle__button,
.add-flight-button {
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.86);
  cursor: pointer;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
}

.trip-toggle__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 18px;
}

.trip-toggle__button + .trip-toggle__button {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.trip-toggle__button.active {
  background: linear-gradient(135deg, #d7aa5a, #edc879);
  color: #11100d;
}

.trip-toggle__button:focus-visible,
.add-flight-button:focus-visible {
  outline: 2px solid rgba(240, 200, 117, 0.9);
  outline-offset: 2px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 26px;
  margin-bottom: 34px;
  padding: 0 72px;
}

.step {
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  display: grid;
  justify-items: center;
  gap: 7px;
  border: 0;
  min-width: 0;
  min-height: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
  color: rgba(255, 255, 255, 0.42);
  cursor: pointer;
  font: inherit;
  text-align: center;
}

.step:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.step:focus-visible {
  outline: 2px solid var(--gold-2);
  outline-offset: 8px;
  border-radius: 8px;
}

.step::after {
  content: "";
  position: absolute;
  top: 16px;
  left: calc(50% + 24px);
  width: calc(100% - 48px);
  height: 1px;
  background: rgba(255, 255, 255, 0.18);
}

.step:last-child::after {
  display: none;
}

.step span {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #111920;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.78rem;
  font-weight: 800;
}

.step small {
  color: inherit;
  font-size: 0.68rem;
  font-weight: 800;
}

.step--active {
  color: var(--gold);
}

.step--active span,
.step--complete span {
  border-color: var(--gold);
  background: var(--gold);
  color: #11100d;
}

.step--complete {
  color: rgba(255, 255, 255, 0.72);
}

.availability-grid {
  display: grid;
  grid-template-columns: minmax(190px, 1fr) 42px minmax(190px, 1fr) minmax(250px, 1.3fr) minmax(230px, 1.12fr);
  gap: 24px;
  align-items: start;
  padding-bottom: 22px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.availability-grid--return {
  border-bottom: 0;
  padding-bottom: 0;
}

.return-flight-block {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.return-flight-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.return-flight-title span {
  color: var(--gold-2);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.remove-return-button {
  appearance: none;
  -webkit-appearance: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.4rem;
  line-height: 1;
}

.remove-return-button:focus-visible {
  outline: 2px solid rgba(240, 200, 117, 0.9);
  outline-offset: 2px;
}

.availability-field {
  display: grid;
  gap: 8px;
  align-content: start;
  min-width: 0;
}

.availability-field label {
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.field-control {
  position: relative;
  min-width: 0;
}

.field-control--picker {
  cursor: pointer;
}

.field-control__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  border: 0;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
}

.field-control__overlay:focus-visible {
  outline: 2px solid rgba(240, 200, 117, 0.82);
  outline-offset: 2px;
}

.field-control > svg {
  position: absolute;
  left: 16px;
  top: 50%;
  z-index: 3;
  width: 18px;
  height: 18px;
  color: #ffffff;
  opacity: 0.92;
  transform: translateY(-50%);
  pointer-events: none;
}

.availability-field select,
.availability-field input,
.plain-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 54px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.035);
  color: #ffffff;
  padding: 0 42px 0 46px;
  font-size: 0.88rem;
  font-weight: 800;
}

.availability-field input[type="datetime-local"] {
  padding-right: 14px;
  font-size: 0.82rem;
  letter-spacing: 0;
  color-scheme: dark;
  pointer-events: none;
}

.availability-field input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  cursor: pointer;
}

.plain-input {
  padding: 0 16px;
}

.availability-field select:focus,
.availability-field input:focus,
.plain-input:focus {
  outline: 2px solid rgba(240, 200, 117, 0.82);
  outline-offset: 2px;
  border-color: rgba(240, 200, 117, 0.72);
}

.availability-field option {
  background: #101820;
  color: #ffffff;
}

.availability-field small,
.availability-note {
  color: rgba(255, 255, 255, 0.56);
  font-size: 0.72rem;
}

.availability-field small {
  display: block;
  min-height: 34px;
  max-width: 230px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1.22;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.step-panel,
.contact-grid,
.review-panel {
  max-width: 820px;
  margin: 8px auto 0;
}

.step-panel {
  display: grid;
}

.availability-field--wide {
  max-width: 620px;
  margin: 0 auto;
  width: 100%;
}

.compact-aircraft-summary {
  display: grid;
  gap: 6px;
  margin-top: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
}

.aircraft-options-helper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.aircraft-options-helper button {
  appearance: none;
  -webkit-appearance: none;
  flex: none;
  border: 0;
  background: transparent;
  color: var(--gold-2);
  cursor: pointer;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.aircraft-options-helper button:focus-visible {
  outline: 2px solid rgba(240, 200, 117, 0.82);
  outline-offset: 4px;
}

.compact-aircraft-summary strong {
  color: #ffffff;
  font-size: 0.96rem;
}

.compact-aircraft-summary span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.84rem;
  line-height: 1.4;
}

.compact-aircraft-summary em {
  color: var(--gold-2);
  font-size: 0.84rem;
  font-style: normal;
  font-weight: 800;
}

.compact-aircraft-empty {
  margin: 0;
  padding: 18px 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.78);
  text-align: center;
  font-size: 0.95rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.review-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.review-panel > div {
  min-height: 72px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.035);
}

.review-panel span,
.review-panel strong {
  display: block;
}

.review-panel span {
  color: rgba(255, 255, 255, 0.56);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.review-panel strong {
  margin-top: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  line-height: 1.35;
}

.compact-error {
  max-width: 620px;
  margin: 14px auto 0;
  padding: 10px 12px;
  border: 1px solid rgba(255, 119, 119, 0.36);
  border-radius: 6px;
  background: rgba(130, 29, 29, 0.2);
  color: #ffd0d0;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 700;
}

.swap-button {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  margin-top: 36px;
  margin-bottom: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--gold);
  cursor: pointer;
}

.swap-button svg,
.availability-submit svg,
.proposal-button svg {
  width: 16px;
  height: 16px;
}

.availability-submit,
.proposal-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  border: 0;
  border-radius: 6px;
  background: linear-gradient(135deg, #d7aa5a, #edc879);
  color: #11100d;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.availability-submit {
  width: min(100%, 480px);
  min-height: 50px;
  margin: 22px auto 0;
  display: flex;
  font-size: 0.82rem;
}

.availability-submit:disabled {
  cursor: not-allowed;
  filter: grayscale(0.45);
  opacity: 0.58;
}

.add-flight-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 42px;
  margin-top: 16px;
  padding: 0 18px;
  border: 1px solid rgba(212, 166, 79, 0.7);
  border-radius: 4px;
  color: var(--gold-2);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.itinerary-summary {
  display: grid;
  gap: 12px;
  max-width: 720px;
  margin: 18px auto 0;
  padding: 14px 16px;
  border: 1px solid rgba(240, 200, 117, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
}

.itinerary-summary__head,
.itinerary-summary__body,
.itinerary-summary__leg {
  display: grid;
  gap: 6px;
}

.itinerary-summary__head {
  grid-template-columns: 1fr auto;
  align-items: center;
}

.itinerary-summary__head span,
.itinerary-summary__leg span,
.itinerary-summary__body span {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.itinerary-summary__head strong,
.itinerary-summary__body strong {
  color: var(--gold-2);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.itinerary-summary__body {
  color: #ffffff;
}

.itinerary-summary__body em {
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.76rem;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.itinerary-summary__leg {
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.itinerary-summary__leg:first-child {
  padding-top: 0;
  border-top: 0;
}

.itinerary-summary__leg small {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.availability-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin: 18px 0 0;
}

.availability-note svg {
  width: 12px;
  height: 12px;
}

.next-steps {
  padding: 26px 0 70px;
}

.process-card {
  padding: 28px 30px;
}

.process-card h2,
.why-card h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.18rem;
  font-weight: 500;
  letter-spacing: -0.03em;
}

.process-grid,
.trust-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}

.process-grid {
  margin-top: 22px;
}

.process-item {
  position: relative;
  text-align: center;
}

.icon-ring,
.proposal-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 14px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  color: var(--gold);
}

.icon-ring svg,
.proposal-icon svg,
.trust-item > svg,
.why-card li svg {
  width: 20px;
  height: 20px;
}

.process-item h3,
.trust-item h3 {
  margin: 0 0 6px;
  font-size: 0.82rem;
}

.process-item p,
.trust-item p,
.why-card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.55;
}

.trust-strip {
  margin-top: 18px;
  padding: 22px;
}

.trust-item {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.trust-item > svg {
  color: var(--gold);
}

.process-item:nth-child(1) .icon-ring svg { animation: reserveRadar 3s linear infinite; }
.process-item:nth-child(2) .icon-ring svg { animation: reserveTakeoff 3.5s ease-in-out infinite; }
.process-item:nth-child(3) .icon-ring svg { animation: reserveDocument 3.2s ease-in-out infinite; }
.process-item:nth-child(4) .icon-ring svg { animation: reserveShield 2.8s ease-in-out infinite; }

.trust-item:nth-child(1) > svg { animation: reserveCalendar 3s ease-in-out infinite; }
.trust-item:nth-child(2) > svg { animation: reserveShield 2.8s ease-in-out -0.8s infinite; }
.trust-item:nth-child(3) > svg { animation: reserveSupport 2.6s ease-in-out infinite; }
.trust-item:nth-child(4) > svg { animation: reserveLock 3.2s ease-in-out infinite; }

@keyframes reserveRadar {
  0% { transform: rotate(0deg) scale(0.92); }
  50% { transform: rotate(180deg) scale(1.08); }
  100% { transform: rotate(360deg) scale(0.92); }
}

@keyframes reserveTakeoff {
  0%, 18%, 100% { opacity: 1; transform: translate(-4px, 4px) rotate(-8deg); }
  55%, 72% { opacity: 1; transform: translate(5px, -5px) rotate(-16deg); }
  82% { opacity: 0; transform: translate(10px, -10px) rotate(-16deg); }
  83% { opacity: 0; transform: translate(-6px, 5px) rotate(-8deg); }
}

@keyframes reserveDocument {
  0%, 22%, 100% { transform: translateY(0) scaleY(0.94); }
  45%, 68% { transform: translateY(-3px) scaleY(1.06); }
}

@keyframes reserveShield {
  0%, 100% { transform: scale(0.94); filter: drop-shadow(0 0 0 rgba(201,163,90,0)); }
  50% { transform: scale(1.1); filter: drop-shadow(0 0 5px rgba(201,163,90,0.48)); }
}

@keyframes reserveCalendar {
  0%, 100% { transform: translateY(0); }
  45% { transform: translateY(-3px); }
  60% { transform: translateY(1px); }
}

@keyframes reserveSupport {
  0%, 100% { transform: rotate(0deg) scale(1); }
  35% { transform: rotate(-5deg) scale(1.06); }
  65% { transform: rotate(5deg) scale(1.06); }
}

@keyframes reserveLock {
  0%, 28%, 100% { transform: translateY(0) scale(1); }
  42% { transform: translateY(-3px) scale(1.08); }
  58% { transform: translateY(1px) scale(0.96); }
}

@media (prefers-reduced-motion: reduce) {
  .process-item .icon-ring svg,
  .trust-item > svg {
    animation: none !important;
  }
}

.why-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
  gap: 18px;
  margin-top: 18px;
}

.why-card {
  min-height: 290px;
  padding: 34px;
}

.why-card--wide {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(190px, 32%);
  gap: 22px;
  padding: 0 0 0 34px;
  background: linear-gradient(180deg, rgba(7, 13, 17, 0.74), rgba(4, 9, 12, 0.64));
  overflow: hidden;
}

.why-card__copy {
  position: relative;
  z-index: 1;
  align-self: center;
  padding: 28px 0;
}

.why-card__media {
  min-height: 100%;
  align-self: stretch;
  background:
    linear-gradient(90deg, rgba(4, 9, 12, 0.18), transparent 34%),
    url("/images/reserva/2.jpg") 72% center / cover no-repeat;
  border-radius: 0 8px 8px 0;
}

.why-card p {
  max-width: 520px;
  margin-top: 12px;
}

.why-card ul {
  display: grid;
  gap: 9px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.why-card li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 0.82rem;
}

.why-card li svg {
  color: var(--gold);
}

.proposal-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.proposal-icon {
  margin: 0 0 18px;
}

.proposal-button {
  align-self: stretch;
  margin-top: 24px;
  background: transparent;
  color: var(--gold-2);
  border: 1px solid var(--line-strong);
}

@media (max-width: 1180px) {
  .flight-card-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .trip-toggle {
    width: min(100%, 520px);
    min-width: 0;
  }

  .availability-grid {
    grid-template-columns: minmax(0, 1fr) 42px minmax(0, 1fr);
  }

  .availability-field:nth-of-type(3),
  .availability-field:nth-of-type(4) {
    grid-column: span 1;
  }

  .availability-submit {
    margin-top: 24px;
  }
}

@media (max-width: 1040px) {
  .availability-grid,
  .process-grid,
  .trust-strip,
  .why-grid,
  .contact-grid,
  .review-panel {
    grid-template-columns: 1fr;
  }

  .swap-button {
    margin: 0;
    justify-self: start;
  }

  .step::after {
    display: none;
  }

}

@media (max-width: 720px) {
  .reservation-shell {
    width: min(100% - 28px, 1120px);
  }

  .reservation-hero {
    min-height: auto;
    padding-top: 112px;
  }

  .reservation-hero__content {
    min-height: auto;
    align-content: start;
    padding-bottom: 40px;
  }

  .reservation-copy {
    position: relative;
    z-index: 2;
    max-width: none;
    padding-bottom: 0;
  }

  .reservation-hero__video--desktop {
    display: none;
  }

  .reservation-hero__video--mobile {
    display: none;
  }

  .reservation-hero__video--mobile-inline {
    display: block;
    position: relative;
    inset: auto;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    object-position: center 34%;
    border-radius: 18px;
    background: #05090d;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.34);
    margin-top: 18px;
  }

  .reservation-hero__shade {
    background:
      linear-gradient(180deg, rgba(5, 9, 13, 0.14) 0%, rgba(5, 9, 13, 0) 18%, rgba(5, 9, 13, 0.52) 100%);
  }

  .availability-card {
    margin-top: 18px;
  }

  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
    padding: 0;
  }

  .trip-toggle {
    width: 100%;
  }

  .availability-card,
  .process-card,
  .trust-strip,
  .why-card {
    padding: 22px 18px;
  }

  .aircraft-options-helper {
    align-items: flex-start;
    flex-direction: column;
  }

  .availability-field small {
    max-width: none;
    min-height: auto;
  }

  .why-card--wide {
    grid-template-columns: 1fr;
    padding: 22px 18px;
  }

  .why-card__media {
    min-height: 180px;
    border-radius: 8px;
  }

}
</style>
