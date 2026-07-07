<template>
  <Teleport to="body">
    <div class="quote-modal-overlay" @click.self="$emit('close')">
      <div class="quote-modal-shell">
        <div class="quote-modal-card">
          <header class="quote-modal-header">
            <div class="quote-modal-copy">
              <span class="quote-modal-eyebrow">Red Sky Group</span>
              <h2>{{ t.executiveFlightQuote }}</h2>
              <p class="quote-modal-subtitle">
                {{ t.summaryFor }} {{ form.name || t.client }}.
              </p>
            </div>

            <div class="quote-modal-side">
              <div class="quote-modal-badge">
                {{ isInternational ? t.international : t.national }}
              </div>

              <div class="quote-modal-urgency">
                <span>{{ t.priceExpiresIn }}</span>
                <strong>{{ countdownLabel }}</strong>
              </div>

              <button class="quote-modal-close" type="button" @click="$emit('close')">
                {{ t.close }}
              </button>
            </div>
          </header>

          <div v-if="routes?.length" class="quote-modal-body">
            <section class="quote-modal-ribbon">
              <article class="quote-summary-card">
                <span class="quote-mini-label">{{ t.passenger }}</span>
                <strong>{{ form.name || t.client }}</strong>
                <p>{{ form.email || t.noEmailProvided }}</p>
              </article>

              <article class="quote-summary-card">
                <span class="quote-mini-label">{{ t.phone }}</span>
                <strong>{{ form.phone || "-" }}</strong>
                <p>{{ t.contact }}</p>
              </article>

              <article class="quote-summary-card">
                <span class="quote-mini-label">{{ t.routes }}</span>
                <strong>{{ routes.length }}</strong>
                <p>{{ routes.length === 1 ? t.flightLeg : t.flightLegs }}</p>
              </article>

              <article class="quote-summary-card quote-summary-card--dark">
                <span class="quote-mini-label">{{ t.delivery }}</span>
                <strong>{{ t.directPdf }}</strong>
                <p>{{ t.pdfIncludesPricing }}</p>
              </article>

            </section>

            <section class="quote-routes-stack">
              <div
                v-for="(route, index) in routes"
                :key="index"
                class="quote-route-card"
              >
                <div class="quote-route-top">
                  <div>
                    <span class="quote-route-index">{{ t.route }} {{ index + 1 }}</span>
                    <h4>{{ getAircraftName(route.aircraft_id) || t.aircraft }}</h4>
                    <p v-if="route.positioning" class="quote-route-note">
                      {{ getPositioningLabel(route) }}
                    </p>
                  </div>

                  <div class="quote-route-pills">
                    <span class="quote-pill">
                      {{ isInternational ? t.international : t.national }}
                    </span>
                    <span class="quote-pill quote-pill--muted">{{ t.pdfOnly }}</span>
                  </div>
                </div>

                <div class="quote-journey">
                  <div class="quote-airport">
                    <span class="quote-airport-label">{{ t.from }}</span>
                    <div class="quote-airport-title">{{ route.fromAirport || "-" }}</div>
                    <div class="quote-airport-meta">
                      {{ route.fromCity || "-" }},
                      {{ route.fromState || route.fromCountry || "-" }}
                    </div>
                  </div>

                  <div class="quote-journey-line">
                    <span class="quote-journey-dot"></span>
                    <span class="quote-journey-arrow">-></span>
                    <span class="quote-journey-dot"></span>
                  </div>

                  <div class="quote-airport">
                    <span class="quote-airport-label">{{ t.to }}</span>
                    <div class="quote-airport-title">{{ route.toAirport || "-" }}</div>
                    <div class="quote-airport-meta">
                      {{ route.toCity || "-" }},
                      {{ route.toState || route.toCountry || "-" }}
                    </div>
                  </div>
                </div>

                <div class="quote-metrics">
                  <div class="quote-metric">
                    <span>{{ t.distance }}</span>
                    <strong>{{ formatNumber(breakdowns?.[index]?.miles) }} nm</strong>
                  </div>

                  <div class="quote-metric">
                    <span>{{ t.flightTime }}</span>
                    <strong>{{ breakdowns?.[index]?.billableHHMM || formatHours(breakdowns?.[index]?.hours) }}</strong>
                  </div>

                  <div class="quote-metric">
                    <span>{{ t.passengers }}</span>
                    <strong>{{ route.passengers || 0 }}</strong>
                  </div>

                  <div class="quote-metric" v-if="getWholeNights(breakdowns?.[index]?.nights) > 0">
                    <span>{{ t.overnight }}</span>
                    <strong>
                      {{ getWholeNights(breakdowns?.[index]?.nights) }}
                      {{ getWholeNights(breakdowns?.[index]?.nights) === 1 ? t.night : t.nights }}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

          </div>

          <footer class="quote-modal-footer">
            <button class="quote-btn quote-btn--secondary" type="button" @click="$emit('close')">
              {{ t.continueEditing }}
            </button>

            <button class="quote-btn quote-btn--primary" type="button" @click="handlePrimaryAction">
              {{ t.sendQuotation }}
            </button>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

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
        summaryFor: "Resumen para",
        international: "Internacional",
        national: "Nacional",
        close: "Cerrar",
        passenger: "Pasajero",
        client: "Cliente",
        noEmailProvided: "Sin correo registrado",
        phone: "Telefono",
        contact: "Contacto",
        routes: "Rutas",
        flightLeg: "Vuelo",
        flightLegs: "Vuelos",
        route: "Ruta",
        aircraft: "Aeronave",
        delivery: "Entrega de cotizacion",
        pdfOnly: "Solo PDF",
        from: "Origen",
        to: "Destino",
        distance: "Distancia",
        flightTime: "Tiempo de vuelo",
        passengers: "Pasajeros",
        overnight: "Pernocta",
        night: "noche",
        nights: "noches",
        fullQuotation: "Cotizacion completa",
        directPdf: "",
        noPriceInModal: "No mostramos montos aqui. Se envian directo en el PDF.",
        aircraftAvailability: "Disponibilidad",
        availabilityLimited: "Limitada",
        quoteValidity: "Vigencia",
        noOnScreenPrice: "Sin precio en pantalla",
        pdfContainsTotals: "El desglose y el total estimado se envian en el PDF.",
        pdfIncludesPricing:"Se cobrara el cargo por reposicionamiento del avion.",
        repositioning: "Reposicionamiento desde base",
        returnToBase: "Regreso a base",
        priceExpiresIn: "Valido por",
        continueEditing: "Editar",
        sendQuotation: "Recibir cotizacion",
        customerFlight: "Vuelo del Cliente",
        ferryFlight: "Ferry Flight / Reposicionamiento",
        flightCost: "Costo de vuelo",
        repositioningCost: "Reposicionamiento",
        overnightCost: "Pernoctas",
        operationalExpenses: "Gastos operativos",
        otherCharges: "Otros cargos",
        subtotal: "Subtotal",
        commercialMargin: "Margen comercial",
        tax: "IVA / Impuesto",
        billableHours: "facturables",
        totalTime: "tiempo total",
        totalEstimated: "Total estimado",
      }
    : {
        executiveFlightQuote: "Executive Flight Quote",
        summaryFor: "Summary for",
        international: "International",
        national: "National",
        close: "Close",
        passenger: "Passenger",
        client: "Client",
        noEmailProvided: "No email provided",
        phone: "Phone",
        contact: "Contact",
        routes: "Routes",
        flightLeg: "Flight",
        flightLegs: "Flights",
        route: "Route",
        aircraft: "Aircraft",
        delivery: "Quotation delivery",
        pdfOnly: "PDF Only",
        from: "From",
        to: "To",
        distance: "Distance",
        flightTime: "Flight Time",
        passengers: "Passengers",
        overnight: "Overnight",
        night: "night",
        nights: "nights",
        fullQuotation: "Full quotation",
        directPdf: "Direct in PDF",
        noPriceInModal: "Prices are not shown here. They are sent directly in the PDF.",
        aircraftAvailability: "Availability",
        availabilityLimited: "Limited",
        quoteValidity: "Validity",
        noOnScreenPrice: "No on-screen price",
        pdfContainsTotals: "The breakdown and estimated total are sent in the PDF.",
        pdfIncludesPricing:
          "The PDF includes pricing, breakdown, estimated total, and aircraft repositioning charges when applicable.",
        repositioning: "Aircraft repositioning",
        returnToBase: "Return to base",
        priceExpiresIn: "Valid for",
        continueEditing: "Edit",
        sendQuotation: "Send quotation",
        customerFlight: "Client Flight",
        ferryFlight: "Ferry Flight / Repositioning",
        flightCost: "Flight Cost",
        repositioningCost: "Repositioning",
        overnightCost: "Overnights",
        operationalExpenses: "Operational Expenses",
        otherCharges: "Other Charges",
        subtotal: "Subtotal",
        commercialMargin: "Commercial Margin",
        tax: "VAT / Tax",
        billableHours: "billable",
        totalTime: "total time",
        totalEstimated: "Estimated total",
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

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
</script>

<style scoped>
.quote-modal-overlay {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at top, rgba(36, 62, 99, 0.25), transparent 38%),
    rgba(6, 11, 20, 0.78);
  backdrop-filter: blur(12px);
  z-index: 20020;
}

.quote-modal-shell {
  position: fixed;
  inset: 0;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  z-index: 20021;
}

.quote-modal-card {
  display: flex;
  flex-direction: column;
  width: min(720px, calc(100vw - 48px));
  max-height: min(82vh, 760px);
  margin: auto;
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.98));
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 28px 80px rgba(2, 8, 23, 0.32);
  font-family:
    "Segoe UI",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.quote-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  color: white;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98)),
    linear-gradient(90deg, rgba(185, 28, 28, 0.16), transparent);
}

.quote-modal-copy {
  max-width: 430px;
}

.quote-modal-eyebrow {
  display: inline-block;
  font-size: 0.62rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.8);
  margin-bottom: 0.35rem;
}

.quote-modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.quote-modal-subtitle {
  display: block;
  margin-top: 0.28rem;
  max-width: 58ch;
  font-size: 0.74rem;
  line-height: 1.35;
  color: rgba(226, 232, 240, 0.82);
}

.quote-modal-side {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 0.45rem;
  flex-shrink: 0;
}

.quote-modal-badge {
  padding: 0.35rem 0.58rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.64rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.quote-modal-urgency {
  min-width: 90px;
  padding: 0.32rem 0.56rem;
  border: 1px solid rgba(251, 191, 36, 0.24);
  border-radius: 13px;
  background: rgba(251, 191, 36, 0.14);
  text-align: right;
}

.quote-modal-urgency span {
  display: block;
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(254, 240, 138, 0.84);
}

.quote-modal-urgency strong {
  display: block;
  margin-top: 0.1rem;
  font-size: 0.74rem;
  color: #fef3c7;
}

.quote-modal-close {
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border-radius: 999px;
  padding: 0.34rem 0.7rem;
  font-size: 0.64rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.quote-modal-close:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.14);
}

.quote-modal-body {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0.85rem 1rem 0.75rem;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.quote-modal-ribbon {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  gap: 0.5rem;
}

.quote-summary-card {
  padding: 0.7rem 0.72rem;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 15px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
}

.quote-summary-card strong {
  display: block;
  margin: 0;
  color: #0f172a;
  font-size: 0.84rem;
  font-weight: 700;
}

.quote-summary-card p {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.67rem;
  line-height: 1.25;
}

.quote-summary-card--dark {
  color: white;
  background:
    linear-gradient(160deg, #0f172a, #172554 68%, #1e3a8a);
  border-color: rgba(191, 219, 254, 0.14);
}

.quote-summary-card--dark .quote-mini-label,
.quote-summary-card--accent .quote-mini-label {
  color: rgba(226, 232, 240, 0.82);
}

.quote-summary-card--dark strong,
.quote-summary-card--accent strong {
  color: #ffffff;
}

.quote-summary-card--dark p,
.quote-summary-card--accent p {
  color: rgba(226, 232, 240, 0.8);
}

.quote-summary-card--accent {
  color: white;
  background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
  border-color: rgba(191, 219, 254, 0.14);
}

.quote-mini-label {
  display: inline-block;
  margin-bottom: 0.25rem;
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
}

.quote-routes-stack {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.quote-route-card {
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 18px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
}

.quote-route-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.55rem;
}

.quote-route-index {
  display: inline-block;
  margin-bottom: 0.24rem;
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #94a3b8;
}

.quote-route-top h4 {
  margin: 0;
  font-size: 0.84rem;
  color: #0f172a;
  font-weight: 650;
}

.quote-route-note {
  margin: 0.18rem 0 0;
  font-size: 0.68rem;
  font-weight: 600;
  color: #1d4f91;
}

.quote-route-pills {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.quote-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.28rem 0.5rem;
  border-radius: 999px;
  background: #e0ecff;
  color: #1d4ed8;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.quote-pill--muted {
  background: #eff4fb;
  color: #475569;
}

.quote-journey {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.58rem;
  background: linear-gradient(180deg, #fff, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.quote-airport {
  min-width: 0;
}

.quote-airport-label {
  display: inline-block;
  margin-bottom: 0.22rem;
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #94a3b8;
}

.quote-airport-title {
  font-size: 0.8rem;
  font-weight: 650;
  color: #0f172a;
  word-break: break-word;
}

.quote-airport-meta {
  margin-top: 0.12rem;
  color: #64748b;
  font-size: 0.68rem;
}

.quote-journey-line {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: #94a3b8;
}

.quote-journey-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #cbd5e1;
}

.quote-journey-arrow {
  font-size: 0.9rem;
  line-height: 1;
}

.quote-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.42rem;
  margin-top: 0.55rem;
}

.quote-metric {
  padding: 0.48rem 0.52rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.quote-metric span {
  display: block;
  margin-bottom: 0.18rem;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
}

.quote-metric strong {
  color: #0f172a;
  font-size: 0.76rem;
}

.quote-modal-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  padding: 0.8rem 1rem 1rem;
  background: rgba(248, 250, 252, 0.98);
  border-top: 1px solid #e2e8f0;
}

.quote-btn {
  width: 100%;
  border-radius: 13px;
  font-weight: 650;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.quote-btn--primary {
  border: none;
  padding: 0.72rem 0.85rem;
  color: white;
  background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
  box-shadow: 0 14px 35px rgba(37, 99, 235, 0.24);
}

.quote-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 35px rgba(37, 99, 235, 0.28);
}

.quote-btn--secondary {
  border: 1px solid #cbd5e1;
  padding: 0.72rem 0.85rem;
  color: #0f172a;
  background: white;
}

.quote-btn--secondary:hover {
  transform: translateY(-1px);
  background: #f8fafc;
}

@media (max-width: 900px) {
  .quote-modal-shell {
    padding: 14px;
    align-items: flex-start;
  }

  .quote-modal-card {
    width: min(100%, calc(100vw - 24px));
    max-height: calc(100vh - 24px);
    border-radius: 22px;
  }

  .quote-modal-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1rem 0.9rem;
  }

  .quote-modal-side {
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .quote-modal-urgency {
    text-align: left;
  }

  .quote-modal-body {
    padding: 0.85rem;
  }
}

@media (max-width: 640px) {
  .quote-modal-copy {
    max-width: 100%;
  }

  .quote-route-top {
    flex-direction: column;
  }

  .quote-route-pills {
    justify-content: flex-start;
  }

  .quote-journey {
    grid-template-columns: 1fr;
  }

  .quote-journey-line {
    justify-content: center;
  }

  .quote-modal-footer {
    grid-template-columns: 1fr;
    padding: 0.85rem;
  }

  .quote-modal-side {
    align-items: stretch;
    justify-content: flex-start;
  }
}
</style>
