<template>
  <MainLayout>
    <div class="reservation-landing">
      <section class="reservation-hero" aria-labelledby="reservation-title">
        <img
          class="reservation-hero__image"
          src="/images/reserva/1.png"
          alt="Private jet ready for departure"
        />
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

            <div v-show="activeStep === 0" class="availability-grid">
              <div class="availability-field">
                <label :for="fieldIds.from">{{ copy.fromLabel }}</label>
                <div class="field-control">
                  <PlaneTakeoff aria-hidden="true" />
                  <select
                    :id="fieldIds.from"
                    v-model="routes[0].fromAirport"
                    required
                    :aria-describedby="`${fieldIds.from}-help`"
                    @change="setCompactAirport('from')"
                  >
                    <option value="">{{ copy.selectAirport }}</option>
                    <option
                      v-for="airport in compactAirportOptions"
                      :key="`from-${airport.iata || airport.aeropuerto}`"
                      :value="getAirportOptionValue(airport)"
                    >
                      {{ airport.ciudad }} ({{ getAirportOptionValue(airport) }})
                    </option>
                  </select>
                </div>
                <small :id="`${fieldIds.from}-help`">{{ compactFromMeta }}</small>
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
                <label :for="fieldIds.to">{{ copy.toLabel }}</label>
                <div class="field-control">
                  <PlaneTakeoff aria-hidden="true" />
                  <select
                    :id="fieldIds.to"
                    v-model="routes[0].toAirport"
                    required
                    :aria-describedby="`${fieldIds.to}-help`"
                    @change="setCompactAirport('to')"
                  >
                    <option value="">{{ copy.selectAirport }}</option>
                    <option
                      v-for="airport in compactAirportOptions"
                      :key="`to-${airport.iata || airport.aeropuerto}`"
                      :value="getAirportOptionValue(airport)"
                    >
                      {{ airport.ciudad }} ({{ getAirportOptionValue(airport) }})
                    </option>
                  </select>
                </div>
                <small :id="`${fieldIds.to}-help`">{{ compactToMeta }}</small>
              </div>

              <div class="availability-field">
                <label :for="fieldIds.date">{{ copy.departureLabel }}</label>
                <div
                  class="field-control field-control--picker"
                  @click="openDatePicker(departureDateInputRef)"
                >
                  <CalendarDays aria-hidden="true" />
                  <button
                    type="button"
                    class="field-control__overlay"
                    :aria-label="copy.departureLabel"
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
            </div>

            <template v-if="activeStep === 0 && hasReturnFlight">
            <div
              v-for="(extraRoute, extraIndex) in routes.slice(1)"
              :key="extraRoute.id || `extra-route-${extraIndex}`"
              class="return-flight-block"
            >
              <div class="return-flight-title">
                <span>{{ getExtraRouteTitle(extraIndex) }}</span>
                <button
                  class="remove-return-button"
                  type="button"
                  :aria-label="copy.removeReturnLabel"
                  @click="removeExtraFlight(extraIndex + 1)"
                >
                  ×
                </button>
              </div>

              <div class="availability-grid availability-grid--return">
                <div class="availability-field">
                  <label :for="`${fieldIds.returnFrom}-${extraIndex}`">{{ copy.fromLabel }}</label>
                  <div class="field-control">
                    <PlaneTakeoff aria-hidden="true" />
                    <select
                      :id="`${fieldIds.returnFrom}-${extraIndex}`"
                      v-model="extraRoute.fromAirport"
                      required
                      @change="setExtraAirport(extraIndex + 1, 'from')"
                    >
                      <option value="">{{ copy.selectAirport }}</option>
                      <option
                        v-for="airport in compactAirportOptions"
                        :key="`return-from-${airport.iata || airport.aeropuerto}`"
                        :value="getAirportOptionValue(airport)"
                      >
                        {{ airport.ciudad }} ({{ getAirportOptionValue(airport) }})
                      </option>
                    </select>
                  </div>
                  <small>{{ getCompactAirportMeta(extraRoute.fromAirport) }}</small>
                </div>

                <button
                  class="swap-button"
                  type="button"
                  :aria-label="copy.swapLabel"
                  @click="swapExtraRoute(extraIndex + 1)"
                >
                  <ArrowLeftRight aria-hidden="true" />
                </button>

                <div class="availability-field">
                  <label :for="`${fieldIds.returnTo}-${extraIndex}`">{{ copy.toLabel }}</label>
                  <div class="field-control">
                    <PlaneTakeoff aria-hidden="true" />
                    <select
                      :id="`${fieldIds.returnTo}-${extraIndex}`"
                      v-model="extraRoute.toAirport"
                      required
                      @change="setExtraAirport(extraIndex + 1, 'to')"
                    >
                      <option value="">{{ copy.selectAirport }}</option>
                      <option
                        v-for="airport in compactAirportOptions"
                        :key="`return-to-${airport.iata || airport.aeropuerto}`"
                        :value="getAirportOptionValue(airport)"
                      >
                        {{ airport.ciudad }} ({{ getAirportOptionValue(airport) }})
                      </option>
                    </select>
                  </div>
                  <small>{{ getCompactAirportMeta(extraRoute.toAirport) }}</small>
                </div>

                <div class="availability-field">
                  <label :for="`${fieldIds.returnDate}-${extraIndex}`">
                    {{ extraIndex === 0 ? copy.returnDateLabel : copy.departureLabel }}
                  </label>
                  <div
                    class="field-control field-control--picker"
                    @click="openDatePicker(extraRouteDateInputRefs[extraIndex + 1])"
                  >
                    <CalendarDays aria-hidden="true" />
                    <button
                      type="button"
                      class="field-control__overlay"
                      :aria-label="extraIndex === 0 ? copy.returnDateLabel : copy.departureLabel"
                      @click.stop="openDatePicker(extraRouteDateInputRefs[extraIndex + 1])"
                      @keydown.enter.prevent="openDatePicker(extraRouteDateInputRefs[extraIndex + 1])"
                      @keydown.space.prevent="openDatePicker(extraRouteDateInputRefs[extraIndex + 1])"
                    ></button>
                    <input
                      :ref="(element) => setExtraRouteDateInputRef(extraIndex + 1, element)"
                      :id="`${fieldIds.returnDate}-${extraIndex}`"
                      v-model="extraRoute.start_date"
                      type="datetime-local"
                      required
                      :min="getExtraRouteMinDate(extraIndex + 1)"
                      @change="syncExtraEndDate(extraIndex + 1)"
                    />
                  </div>
                  <small>{{ formatCompactDateMeta(extraRoute.start_date) }}</small>
                </div>

                <div class="availability-field">
                  <label :for="`${fieldIds.returnPassengers}-${extraIndex}`">{{ copy.passengersLabel }}</label>
                  <div class="field-control">
                    <UsersRound aria-hidden="true" />
                    <select
                      :id="`${fieldIds.returnPassengers}-${extraIndex}`"
                      v-model.number="extraRoute.passengers"
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
              v-show="activeStep === 0 && tripMode === 'round-trip'"
              class="add-flight-button"
              type="button"
              @click="addCompactFlight"
            >
              <span aria-hidden="true">+</span>
              {{ copy.addFlightLabel }}
            </button>

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
                    <option
                      v-for="aircraft in compactAircraftOptions"
                      :key="aircraft.id"
                      :value="aircraft.id"
                    >
                      {{ aircraft.name }} · {{ aircraft.capacity_passengers || "-" }} pax · {{ getCompactAircraftBaseLabel(aircraft) }}
                    </option>
                  </select>
                </div>
                <div v-if="selectedAircraft" class="compact-aircraft-summary">
                  <strong>{{ selectedAircraft.name }}</strong>
                  <span>
                    {{ getCompactAircraftTypeLabel(selectedAircraft) }} ·
                    {{ selectedAircraft.capacity_passengers || "-" }} pax ·
                    {{ getCompactAircraftBaseLabel(selectedAircraft) }}
                  </span>
                  <em>{{ formatCompactCurrency(getAircraftRentalRate(selectedAircraft)) }}</em>
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

            <button class="availability-submit" type="submit">
              <span>{{ compactSubmitLabel }}</span>
              <ChevronRight aria-hidden="true" />
            </button>
            <p id="reservation-card-note" class="availability-note">
              <LockKeyhole aria-hidden="true" />
              <span>{{ copy.secureNote }}</span>
            </p>
          </form>
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
import { ref, reactive, computed, onMounted, watch } from "vue";
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
import { generateReservationPDF } from "@/utils/pdfGenerator";

const AIRCRAFT_TABLE = "aircraft_fleet";
const COMMERCIAL_MARGIN_RATE = 0.15;
const OTHER_CHARGES_DEFAULT = 0;
const AIRCRAFT_TYPE_OPERATIONAL_MARGINS = {
  HELICOPTERO: {
    operationalMarginMinutes: 15,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
  },
  "MONOMOTOR PISTON": {
    operationalMarginMinutes: 15,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
  },
  TURBOHELICE: {
    operationalMarginMinutes: 20,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
  },
  "JET LIGERO (LIGHT JET)": {
    operationalMarginMinutes: 30,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
  },
  "MIDSIZE JET (MID JET)": {
    operationalMarginMinutes: 30,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
  },
  "SUPER MIDSIZE JET": {
    operationalMarginMinutes: 35,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
  },
  "HEAVY JET": {
    operationalMarginMinutes: 40,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
  },
  "REGIONAL JET": {
    operationalMarginMinutes: 40,
    applyCommercialMargin: true,
    commercialMarginPercent: 15,
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
        roundTripLabel: "Redondo",
        addFlightLabel: "Agregar otro vuelo",
        returnFlightLabel: "Vuelo de regreso",
        removeReturnLabel: "Quitar vuelo de regreso",
        returnDateLabel: "Fecha de regreso",
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
        noAircraftOptions: "No hay aeronaves disponibles para esa cantidad de pasajeros.",
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
        sameAirport: "El origen y destino deben ser diferentes.",
        missingAircraft: "Selecciona una aeronave disponible.",
        missingContact: "Completa nombre, correo y telefono.",
        invalidEmail: "Ingresa un correo valido.",
        aircraftHelpFallback: "Elige una aeronave para calcular disponibilidad y propuesta.",
        swapLabel: "Intercambiar origen y destino",
        checkAvailability: "Consultar disponibilidad",
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
        addFlightLabel: "Add another flight",
        returnFlightLabel: "Return flight",
        removeReturnLabel: "Remove return flight",
        returnDateLabel: "Return date",
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
        noAircraftOptions: "No aircraft are available for that passenger count.",
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
        sameAirport: "Origin and destination must be different.",
        missingAircraft: "Select an available aircraft.",
        missingContact: "Complete your name, email, and phone.",
        invalidEmail: "Enter a valid email address.",
        aircraftHelpFallback: "Choose an aircraft to calculate availability and proposal.",
        swapLabel: "Swap origin and destination",
        checkAvailability: "Check availability",
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
const departureDateInputRef = ref(null);
const extraRouteDateInputRefs = ref({});
const activeStep = ref(0);
const tripMode = ref("one-way");
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
    overnightFeeUsd: toNumber(
      aircraft?.overnight_fee_usd ??
        aircraft?.overnightFeeUsd ??
        aircraft?.crew_overnight_usd ??
        aircraft?.crewOvernightUsd,
      fallbackOvernightFeeUsd,
    ),
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

const compactAircraftOptions = computed(() => {
  const passengers = toNumber(routes.value[0]?.passengers, 1);
  const seen = new Set();

  return aircraftFleet.value
    .filter((aircraft) => toNumber(aircraft.capacity_passengers, 0) >= passengers)
    .filter((aircraft) => {
      const key = [
        norm(aircraft.name),
        toNumber(aircraft.capacity_passengers, 0),
      ].join("|");

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice()
    .sort((left, right) =>
      String(left.name || "").localeCompare(String(right.name || "")),
    );
});

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

const routeSummary = computed(() => {
  const routeItem = routes.value[0] || {};
  return `${routeItem.fromAirport || "-"} -> ${routeItem.toAirport || "-"} / ${routeItem.passengers || 1} ${copy.value.passengers}`;
});

const maxReachableStep = computed(() => {
  if (!isItineraryComplete.value) return 0;
  if (!routes.value[0]?.aircraft_id) return 1;
  if (!isContactComplete.value) return 2;
  return 3;
});

const compactSubmitLabel = computed(() =>
  activeStep.value === 0
    ? copy.value.searchAvailabilityCta
    : activeStep.value === 3
      ? copy.value.sendProposalCta
      : copy.value.continueCta,
);

const isItineraryComplete = computed(() => {
  const routeItem = routes.value[0] || {};
  return Boolean(
    routeItem.fromAirport &&
      routeItem.toAirport &&
      norm(routeItem.fromAirport) !== norm(routeItem.toAirport) &&
      routeItem.start_date &&
      toNumber(routeItem.passengers) > 0,
  );
});

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

const setCompactAirport = (direction) => {
  const routeItem = routes.value[0];
  const code = direction === "from" ? routeItem.fromAirport : routeItem.toAirport;
  assignAirportToRoute(direction, findCompactAirport(code));
  compactError.value = "";
  if (tripMode.value === "round-trip") {
    syncReturnRouteFromOutbound();
  }
};

const setExtraAirport = (routeIndex, direction) => {
  const routeItem = routes.value[routeIndex];
  if (!routeItem) return;

  const code = direction === "from" ? routeItem.fromAirport : routeItem.toAirport;
  assignAirportToSpecificRoute(routeItem, direction, findCompactAirport(code));
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
  tripMode.value = "round-trip";
  compactError.value = "";

  if (routes.value.length <= 1) {
    routes.value.push({
      id: Date.now() + Math.random(),
      ...emptyRoute(),
    });
    syncReturnRouteFromOutbound();
    return;
  }

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

  if (!inbound.start_date && outbound.start_date) {
    const date = new Date(outbound.start_date);
    date.setDate(date.getDate() + 2);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    inbound.start_date = date.toISOString().slice(0, 16);
  }

  syncExtraEndDate(1);
};

const setTripMode = (mode) => {
  tripMode.value = mode;
  compactError.value = "";

  if (mode === "one-way" && routes.value.length > 1) {
    routes.value = [routes.value[0]];
  }
};

const removeExtraFlight = (routeIndex) => {
  if (routeIndex <= 0 || !routes.value[routeIndex]) return;

  routes.value.splice(routeIndex, 1);
  delete extraRouteDateInputRefs.value[routeIndex];

  if (routes.value.length <= 1) {
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
    const routeItem = routes.value[0] || {};
    if (!routeItem.fromAirport || !routeItem.toAirport || !routeItem.start_date || !routeItem.passengers) {
      compactError.value = copy.value.missingItinerary;
      return false;
    }
    if (norm(routeItem.fromAirport) === norm(routeItem.toAirport)) {
      compactError.value = copy.value.sameAirport;
      return false;
    }
    if (hasReturnFlight.value) {
      for (let index = 1; index < routes.value.length; index += 1) {
        const extraRoute = routes.value[index] || {};
        if (!extraRoute.fromAirport || !extraRoute.toAirport || !extraRoute.start_date || !extraRoute.passengers) {
          compactError.value = copy.value.missingReturn;
          return false;
        }
        if (norm(extraRoute.fromAirport) === norm(extraRoute.toAirport)) {
          compactError.value = copy.value.sameAirport;
          return false;
        }
        syncExtraEndDate(index);
      }
    }
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

const calculatePrice = (routeItem) => {
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
  const nights = getRouteNights(routeItem);
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

const pricedRoutes = computed(() => {
  if (!validRoutes.value.length) return [];

  const firstRoute = validRoutes.value[0];
  const lastRoute = validRoutes.value[validRoutes.value.length - 1];
  const aircraftId = firstRoute?.aircraft_id;
  const aircraftBase = getAircraftBaseAirport(aircraftId);
  const firstRouteOrigin = findAirportForRoute(firstRoute, "from");
  const lastRouteDestination = findAirportForRoute(lastRoute, "to");

  if (!aircraftBase) {
    return [...validRoutes.value];
  }

  if (itineraryStartsAndEndsAtBase(validRoutes.value, aircraftBase)) {
    return [...validRoutes.value];
  }

  const calculatedRoutes = [];

  if (!isRouteEndpointAtBase(firstRoute, "from", aircraftBase)) {
    calculatedRoutes.push(
      buildPositioningRoute(
        aircraftId,
        aircraftBase,
        firstRouteOrigin || firstRoute.fromAirport,
        "repositioning",
      ),
    );
  }

  calculatedRoutes.push(...validRoutes.value);

  if (!isRouteEndpointAtBase(lastRoute, "to", aircraftBase)) {
    calculatedRoutes.push(
      buildPositioningRoute(
        aircraftId,
        lastRouteDestination || lastRoute.toAirport,
        aircraftBase,
        "return_to_base",
      ),
    );
  }

  return calculatedRoutes;
});

const pricedBreakdowns = computed(() =>
  pricedRoutes.value.map((routeItem) => calculatePrice(routeItem)),
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
    });

    const pdfBase64 = await blobToBase64(pdfBlob);
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

.reservation-hero__image,
.reservation-hero__shade {
  position: absolute;
  inset: 0;
}

.reservation-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 42%;
}

.reservation-hero__shade {
  background:
    linear-gradient(90deg, rgba(5, 9, 13, 0.9) 0%, rgba(5, 9, 13, 0.58) 42%, rgba(5, 9, 13, 0.14) 100%),
    linear-gradient(180deg, rgba(5, 9, 13, 0.18), rgba(5, 9, 13, 0.28) 44%, rgba(5, 9, 13, 0.72) 100%);
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
  font-size: clamp(2.1rem, 4vw, 3.55rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
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
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.trip-toggle {
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  min-width: 340px;
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
  font-size: 1.18rem;
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
    width: min(100%, 340px);
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
    padding-bottom: 32px;
  }

  .reservation-copy {
    padding-bottom: 34px;
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
