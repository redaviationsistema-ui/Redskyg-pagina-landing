<template>
  <Teleport to="body">
    <div class="quote-modal-overlay" @click.self="$emit('close')">
      <div class="quote-modal-shell">
        <div class="quote-modal-card">
          <header class="quote-modal-header">
            <div class="quote-modal-copy">
              <span class="quote-modal-eyebrow">Red Sky Group</span>
              <h2>{{ t.executiveFlightQuote }}</h2>
              <p class="quote-modal-subtitle">{{ t.requestSummary }}</p>
            </div>

            <div class="quote-modal-side">
              <div class="quote-modal-badge">
                {{ isInternational ? t.international : t.national }}
              </div>

              <div class="quote-modal-urgency">
                <span>{{ t.priceExpiresIn }} {{ countdownLabel }}</span>
              </div>

              <button
                class="quote-modal-close"
                type="button"
                :aria-label="t.close"
                @click="$emit('close')"
              >
                <X aria-hidden="true" />
              </button>
            </div>
          </header>

          <div v-if="routes?.length" class="quote-modal-body">
            <section class="quote-client-card">
              <div class="quote-client-item">
                <UserRound aria-hidden="true" />
                <span>{{ form.name || t.client }}</span>
              </div>

              <div class="quote-client-item">
                <Mail aria-hidden="true" />
                <span>{{ form.email || t.noEmailProvided }}</span>
              </div>

              <div class="quote-client-item">
                <Phone aria-hidden="true" />
                <span>{{ form.phone || "-" }}</span>
              </div>

              <div class="quote-client-divider" aria-hidden="true"></div>

              <div class="quote-client-routes">
                <Plane aria-hidden="true" />
                <span>{{ routes.length }} {{ routes.length === 1 ? t.flightLegSelected : t.flightLegsSelected }}</span>
              </div>
            </section>

            <section class="quote-info-banner">
              <Info aria-hidden="true" />
              <span>{{ t.pdfIncludesPricing }}</span>
            </section>

            <section class="quote-routes-stack">
              <div
                v-for="(route, index) in routes"
                :key="index"
                class="quote-route-card"
              >
                <div class="quote-route-top">
                  <div class="quote-route-heading">
                    <span class="quote-route-index">{{ t.route }} {{ index + 1 }}</span>
                    <h4 v-if="shouldShowAircraftName(index, route)">
                      {{ getAircraftName(route.aircraft_id) || t.aircraft }}
                    </h4>
                    <p v-if="route.positioning" class="quote-route-note">
                      {{ getPositioningLabel(route) }}
                    </p>
                  </div>

                  <div class="quote-route-pills">
                    <span class="quote-pill">
                      {{ isInternational ? t.international : t.national }}
                    </span>
                  </div>
                </div>

                <div class="quote-journey">
                  <div class="quote-journey-line">
                    <span class="quote-airport-title">{{ route.fromAirport || "-" }}</span>
                    <span class="quote-journey-track" aria-hidden="true"></span>
                    <Plane aria-hidden="true" />
                    <span class="quote-journey-track" aria-hidden="true"></span>
                    <div class="quote-airport-title">{{ route.toAirport || "-" }}</div>
                  </div>
                </div>

                <div class="quote-metrics">
                  <div class="quote-metric">
                    <strong>{{ formatNumber(breakdowns?.[index]?.miles) }} nm</strong>
                  </div>

                  <div class="quote-metric">
                    <strong>{{ breakdowns?.[index]?.estimatedHHMM || formatHours(breakdowns?.[index]?.hours) }}</strong>
                  </div>

                  <div class="quote-metric">
                    <strong>{{ formatPassengerCount(route.passengers) }}</strong>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <footer class="quote-modal-footer">
            <div class="quote-modal-actions">
              <button class="quote-btn quote-btn--secondary" type="button" @click="$emit('close')">
                <PencilLine aria-hidden="true" />
                <span>{{ t.continueEditing }}</span>
              </button>

              <button class="quote-btn quote-btn--primary" type="button" @click="handlePrimaryAction">
                <Mail aria-hidden="true" />
                <span>{{ t.sendQuotation }}</span>
              </button>
            </div>
            <p class="quote-modal-security">
              <LockKeyhole aria-hidden="true" />
              <span>{{ t.secureNote }}</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  Info,
  LockKeyhole,
  Mail,
  PencilLine,
  Phone,
  Plane,
  UserRound,
  X,
} from "lucide-vue-next";

const emit = defineEmits(["close", "confirm"]);

const props = defineProps({
  breakdowns: {
    type: Array,
    default: () => [],
  },
  pricingSummary: {
    type: Object,
    default: null,
  },
  totalFlightCost: {
    type: Number,
    default: 0,
  },
  totalOvernight: {
    type: Number,
    default: 0,
  },
  globalExpenses: {
    type: Number,
    default: 0,
  },
  otherCharges: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  commercialMargin: {
    type: Number,
    default: 0,
  },
  commercialMarginRate: {
    type: Number,
    default: 0.15,
  },
  iva: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  form: {
    type: Object,
    default: () => ({}),
  },
  routes: {
    type: Array,
    default: () => [],
  },
  isInternational: {
    type: Boolean,
    default: false,
  },
  getAircraftName: {
    type: Function,
    default: () => "",
  },
  getAircraftById: {
    type: Function,
    default: () => null,
  },
  locale: {
    type: String,
    default: "es-mx",
  },
});

const t = computed(() =>
  props.locale === "es-mx"
    ? {
        executiveFlightQuote: "Cotizacion ejecutiva de vuelo",
        requestSummary: "Resumen de tu solicitud",
        international: "Internacional",
        national: "Nacional",
        close: "Cerrar",
        client: "Cliente",
        noEmailProvided: "Sin correo registrado",
        flightLegSelected: "ruta seleccionada",
        flightLegsSelected: "rutas seleccionadas",
        route: "Ruta",
        aircraft: "Aeronave",
        from: "Origen",
        to: "Destino",
        distance: "Distancia",
        flightTime: "Tiempo",
        passengerSingular: "pasajero",
        passengers: "Pasajeros",
        overnight: "Pernocta",
        night: "noche",
        nights: "noches",
        pdfIncludesPricing:
          "Esta cotizacion incluye costos de reposicionamiento cuando sean necesarios.",
        repositioning: "Reposicionamiento desde base",
        returnToBase: "Regreso a base",
        priceExpiresIn: "Valido por",
        continueEditing: "Editar solicitud",
        sendQuotation: "Recibir cotizacion",
        secureNote: "Tu informacion es segura y confidencial.",
      }
    : {
        executiveFlightQuote: "Executive Flight Quote",
        requestSummary: "Summary of your request",
        international: "International",
        national: "National",
        close: "Close",
        client: "Client",
        noEmailProvided: "No email provided",
        flightLegSelected: "selected route",
        flightLegsSelected: "selected routes",
        route: "Route",
        aircraft: "Aircraft",
        from: "From",
        to: "To",
        distance: "Distance",
        flightTime: "Time",
        passengerSingular: "passenger",
        passengers: "Passengers",
        overnight: "Overnight",
        night: "night",
        nights: "nights",
        pdfIncludesPricing:
          "This quote includes repositioning costs whenever they are required.",
        repositioning: "Aircraft repositioning",
        returnToBase: "Return to base",
        priceExpiresIn: "Valid for",
        continueEditing: "Edit request",
        sendQuotation: "Receive quote",
        secureNote: "Your information is secure and confidential.",
      },
);

const QUOTE_VALIDITY_SECONDS = 15 * 60;
const secondsLeft = ref(QUOTE_VALIDITY_SECONDS);

let countdownInterval = null;

const countdownLabel = computed(() => {
  const safeSeconds = Math.max(secondsLeft.value, 0);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
});

onMounted(() => {
  secondsLeft.value = QUOTE_VALIDITY_SECONDS;
  countdownInterval = window.setInterval(() => {
    if (secondsLeft.value <= 0) {
      window.clearInterval(countdownInterval);
      countdownInterval = null;
      return;
    }

    secondsLeft.value -= 1;
  }, 1000);
});

onUnmounted(() => {
  if (countdownInterval) {
    window.clearInterval(countdownInterval);
    countdownInterval = null;
  }
});

const handlePrimaryAction = () => {
  emit("confirm");
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatHours = (value) => {
  const hours = Number(value || 0);

  if (!Number.isFinite(hours)) return "0 hrs";

  return `${hours.toFixed(2).replace(/\.?0+$/, "")} hrs`;
};

const getWholeNights = (value) => Math.max(0, Math.ceil(Number(value || 0)));

const getPositioningLabel = (route) =>
  route?.positioningType === "return_to_base"
    ? t.value.returnToBase
    : t.value.repositioning;

const formatLocation = (city, region) =>
  [city, region]
    .filter(Boolean)
    .join(", ") || "-";

const formatPassengerCount = (value) => {
  const count = Number(value || 0);
  return `${count} ${count === 1 ? t.value.passengerSingular : t.value.passengers}`;
};

const shouldShowAircraftName = (index, route) => {
  if (index === 0) return true;

  const currentName = String(props.getAircraftName?.(route?.aircraft_id) || "");
  const previousName = String(props.getAircraftName?.(props.routes?.[index - 1]?.aircraft_id) || "");

  return currentName !== previousName;
};
</script>

<style scoped>
.quote-modal-overlay {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at top, rgba(20, 32, 53, 0.42), transparent 36%),
    rgba(5, 9, 15, 0.82);
  backdrop-filter: blur(16px);
  z-index: 20020;
}

.quote-modal-shell {
  position: fixed;
  inset: 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  z-index: 20021;
}

.quote-modal-card {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: min(980px, calc(100vw - 40px));
  max-height: min(82vh, 760px);
  margin: auto;
  background: #0d111a;
  border: 1px solid #2b3342;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.28);
  font-family:
    "Georgia",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.quote-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  padding: 24px 28px 18px;
  color: #ffffff;
  border-bottom: 1px solid rgba(43, 51, 66, 0.72);
}

.quote-modal-copy {
  max-width: 520px;
}

.quote-modal-eyebrow {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 8px;
}

.quote-modal-header h2 {
  margin: 0;
  font-size: clamp(24px, 2.8vw, 32px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.04;
}

.quote-modal-subtitle {
  display: block;
  margin-top: 8px;
  max-width: 58ch;
  font-size: 14px;
  line-height: 1.4;
  color: #9ca3af;
}

.quote-modal-side {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.quote-modal-badge {
  padding: 8px 14px;
  border: 1px solid #2b3342;
  border-radius: 999px;
  background: rgba(22, 28, 39, 0.96);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ffffff;
}

.quote-modal-urgency {
  padding: 8px 14px;
  border: 1px solid rgba(212, 163, 74, 0.38);
  border-radius: 999px;
  background: rgba(212, 163, 74, 0.08);
}

.quote-modal-urgency span {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #d4a34a;
}

.quote-modal-close {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #2b3342;
  background: rgba(22, 28, 39, 0.96);
  color: #ffffff;
  border-radius: 999px;
  cursor: pointer;
  transition:
    transform 250ms ease,
    border-color 250ms ease,
    background 250ms ease;
}

.quote-modal-close svg {
  width: 15px;
  height: 15px;
}

.quote-modal-close:hover {
  transform: translateY(-1px);
  border-color: rgba(212, 163, 74, 0.36);
  background: rgba(27, 34, 46, 1);
}

.quote-modal-body {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 28px 18px;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.quote-client-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) auto minmax(220px, 0.9fr);
  gap: 16px;
  align-items: center;
  padding: 16px 18px;
  background: #161c27;
  border: 1px solid #2b3342;
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
  transition:
    transform 250ms ease,
    box-shadow 250ms ease,
    border-color 250ms ease;
}

.quote-client-card:hover,
.quote-route-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.16);
}

.quote-client-item,
.quote-client-routes {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.quote-client-item svg,
.quote-client-routes svg,
.quote-info-banner svg,
.quote-modal-security svg {
  width: 15px;
  height: 15px;
  color: #d4a34a;
  flex: 0 0 auto;
}

.quote-client-item span,
.quote-client-routes span {
  color: #ffffff;
  font-size: 12px;
  line-height: 1.4;
  word-break: break-word;
}

.quote-client-divider {
  width: 1px;
  min-height: 38px;
  background: linear-gradient(180deg, transparent, rgba(156, 163, 175, 0.32), transparent);
}

.quote-info-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 10px 14px;
  background: linear-gradient(180deg, rgba(12, 24, 42, 0.94), rgba(10, 20, 34, 0.94));
  border: 1px solid rgba(36, 70, 112, 0.48);
  border-radius: 18px;
  color: #b9c6d8;
  font-size: 12px;
}

.quote-routes-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quote-route-card {
  padding: 16px 18px 14px;
  background: #161c27;
  border: 1px solid #2b3342;
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
  transition:
    transform 250ms ease,
    box-shadow 250ms ease,
    border-color 250ms ease;
}

.quote-route-card:hover {
  border-color: rgba(212, 163, 74, 0.28);
}

.quote-route-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.quote-route-index {
  display: inline-block;
  margin-bottom: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #9ca3af;
}

.quote-route-top h4 {
  margin: 0;
  font-size: clamp(26px, 2.8vw, 32px);
  color: #ffffff;
  font-weight: 700;
  line-height: 1.05;
}

.quote-route-note {
  margin: 6px 0 0;
  font-size: 15px;
  font-weight: 500;
  color: #7ea0cf;
}

.quote-route-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.quote-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(23, 42, 70, 0.65);
  border: 1px solid rgba(52, 86, 131, 0.34);
  color: #a8c5ef;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.quote-journey {
  display: block;
  padding: 0 0 10px;
  border-bottom: 1px solid rgba(43, 51, 66, 0.88);
}

.quote-airport-title {
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  flex: 0 0 auto;
}

.quote-journey-line {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  color: #d4a34a;
}

.quote-journey-line svg {
  width: 9px;
  height: 9px;
  transform: rotate(-90deg);
}

.quote-journey-track {
  height: 1px;
  flex: 1 1 auto;
  background: linear-gradient(90deg, rgba(212, 163, 74, 0.28), #d4a34a, rgba(212, 163, 74, 0.28));
}

.quote-metrics {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px 14px;
  margin-top: 8px;
}

.quote-metric {
  min-width: max-content;
}

.quote-metric strong {
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
}

.quote-modal-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 28px 18px;
  background: rgba(13, 17, 26, 0.98);
  border-top: 1px solid rgba(43, 51, 66, 0.9);
  backdrop-filter: blur(14px);
}

.quote-modal-actions {
  display: grid;
  grid-template-columns: minmax(240px, 0.85fr) minmax(320px, 1.35fr);
  gap: 12px;
}

.quote-btn {
  width: 100%;
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 250ms ease,
    box-shadow 250ms ease,
    border-color 250ms ease,
    background 250ms ease;
}

.quote-btn svg {
  width: 15px;
  height: 15px;
}

.quote-btn--primary {
  border: 1px solid rgba(212, 163, 74, 0.72);
  color: #11161f;
  background: linear-gradient(135deg, #c99634, #d4a34a 45%, #e4be72);
  box-shadow: 0 10px 28px rgba(212, 163, 74, 0.18);
}

.quote-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(212, 163, 74, 0.26);
  filter: brightness(1.03);
}

.quote-btn--secondary {
  border: 1px solid #2b3342;
  color: #ffffff;
  background: #161c27;
}

.quote-btn--secondary:hover {
  transform: translateY(-1px);
  background: #1a2230;
  border-color: rgba(212, 163, 74, 0.24);
}

.quote-modal-security {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;
  color: #9ca3af;
  font-size: 10px;
  line-height: 1.4;
}

@media (max-width: 900px) {
  .quote-modal-shell {
    padding: 14px;
    align-items: flex-start;
  }

  .quote-modal-card {
    width: min(100%, calc(100vw - 24px));
    max-height: calc(100vh - 24px);
  }

  .quote-modal-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 18px 16px;
  }

  .quote-modal-side {
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }

  .quote-modal-body {
    padding: 16px 18px;
  }

  .quote-client-card {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .quote-client-divider {
    width: 100%;
    min-height: 1px;
  }

  .quote-modal-footer {
    padding: 14px 18px 16px;
  }

  .quote-modal-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .quote-route-top {
    flex-direction: column;
  }

  .quote-route-pills {
    justify-content: flex-start;
  }

  .quote-journey {
    padding: 0 0 10px;
  }

  .quote-journey-line {
    justify-content: center;
    min-width: 0;
    gap: 6px;
  }

  .quote-journey-line svg {
    transform: rotate(-90deg);
  }

  .quote-airport-title {
    font-size: 18px;
  }

  .quote-metrics {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .quote-metric strong {
    font-size: 15px;
  }

  .quote-btn {
    min-height: 44px;
  }

  .quote-modal-header,
  .quote-modal-body,
  .quote-modal-footer {
    padding-left: 18px;
    padding-right: 18px;
  }

}
</style>
