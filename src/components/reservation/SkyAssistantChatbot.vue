<template>
  <div class="sky-chatbot-floating">
    <button
      v-if="!isOpen"
      type="button"
      class="sky-chatbot-launcher"
      :aria-label="copy.launcher"
      @click="openChatbot"
    >
      <span class="sky-chatbot-launcher__mobile-icon" aria-hidden="true">
        <Headset />
      </span>

      <div class="sky-chatbot-launcher__bar">
        <span class="sky-chatbot-launcher__agent-icon" aria-hidden="true">
          <Headset />
        </span>

        <div class="sky-chatbot-launcher__bar-copy">
          <small>{{ copy.launcherEyebrow }}</small>
          <strong>{{ copy.launcher }}</strong>
        </div>
      </div>
    </button>

    <section v-else class="sky-chatbot" aria-labelledby="sky-assistant-title">
      <div class="sky-chatbot__topbar">
        <div class="sky-chatbot__profile">
          <div class="sky-chatbot__profile-avatar" aria-hidden="true">
            <Headset />
          </div>

          <div class="sky-chatbot__topbar-copy">
            <span>{{ copy.eyebrow }}</span>
            <strong id="sky-assistant-title">{{ copy.title }}</strong>
            <small class="sky-chatbot__status">
              <span class="sky-chatbot__status-dot" aria-hidden="true"></span>
              {{ copy.online }}
            </small>
          </div>
        </div>

        <button
          type="button"
          class="sky-chatbot__close"
          :aria-label="copy.close"
          @click="closeChatbot"
        >
          <X aria-hidden="true" />
        </button>
      </div>

      <div ref="bodyRef" class="sky-chatbot__body">
        <div class="sky-chatbot__thread">
          <article
            v-for="message in messages"
            :key="message.id"
            class="sky-chatbot__message-row"
            :class="
              message.sender === 'user'
                ? 'sky-chatbot__message-row--user'
                : 'sky-chatbot__message-row--bot'
            "
          >
            <div v-if="message.sender === 'bot'" class="sky-chatbot__avatar" aria-hidden="true">
              <Headset />
            </div>

            <div class="sky-chatbot__message-block" :class="{ 'sky-chatbot__message-block--user': message.sender === 'user' }">
              <div
                class="sky-chatbot__message"
                :class="
                  message.sender === 'user'
                    ? 'sky-chatbot__message--user'
                    : 'sky-chatbot__message--bot'
                "
              >
                <p>{{ message.text }}</p>
              </div>
              <span class="sky-chatbot__meta" :class="{ 'sky-chatbot__meta--user': message.sender === 'user' }">
                {{ message.time }}
                <CheckCheck v-if="message.sender === 'user'" aria-hidden="true" />
              </span>
            </div>
          </article>
        </div>
      </div>

      <div class="sky-chatbot__footer">
        <div v-if="isAirportStep" class="sky-chatbot__composer sky-chatbot__composer--stacked">
          <input
            v-model.trim="airportSearch.query"
            type="text"
            class="sky-chatbot__composer-input"
            :placeholder="copy.airportPlaceholder"
            autocomplete="off"
            autocapitalize="characters"
            autocorrect="off"
            spellcheck="false"
            @input="handleAirportInput"
            @focus="airportSearch.open = true"
            @keydown.enter.prevent="handleAirportSubmitAttempt"
          />

          <div v-if="showAirportDropdown" class="sky-chatbot__airport-dropdown">
            <p v-if="airportSearch.loading" class="sky-chatbot__airport-status">
              {{ copy.searchingAirports }}
            </p>
            <p
              v-else-if="airportSearch.query.length > 0 && airportSearch.query.length < 3"
              class="sky-chatbot__airport-status"
            >
              {{ copy.airportSearchHint }}
            </p>
            <ul v-else-if="airportSearch.results.length" class="sky-chatbot__airport-results">
              <li v-for="airport in airportSearch.results" :key="airport.value">
                <button
                  type="button"
                  class="sky-chatbot__airport-option"
                  @click="selectAirport(airport)"
                >
                  {{ airport.label }}
                </button>
              </li>
            </ul>
            <p v-else class="sky-chatbot__airport-status">
              {{ copy.noAirportResults }}
            </p>
          </div>
        </div>

        <div v-else-if="currentStep === 'tripType'" class="sky-chatbot__choice-grid">
          <button
            v-for="option in copy.tripTypes"
            :key="option.value"
            type="button"
            class="sky-chatbot__choice"
            @click="submitTripType(option.value)"
          >
            {{ option.label }}
          </button>
        </div>

        <div v-else-if="currentStep === 'passengers'" class="sky-chatbot__composer">
          <select v-model.number="lead.passengers" class="sky-chatbot__composer-input sky-chatbot__composer-input--select">
            <option v-for="count in 12" :key="count" :value="count">
              {{ count }} {{ count === 1 ? copy.passenger : copy.passengers }}
            </option>
          </select>

          <button type="button" class="sky-chatbot__composer-send" @click="submitPassengers">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div v-else-if="currentStep === 'comments'" class="sky-chatbot__composer sky-chatbot__composer--stacked">
          <textarea
            v-model.trim="fieldInput"
            class="sky-chatbot__composer-textarea"
            :placeholder="copy.commentsPlaceholder"
          ></textarea>

          <div class="sky-chatbot__composer-actions">
            <button type="button" class="sky-chatbot__ghost" @click="submitComments(true)">
              {{ copy.skip }}
            </button>
            <button type="button" class="sky-chatbot__composer-send sky-chatbot__composer-send--wide" @click="submitComments(false)">
              <SendHorizonal aria-hidden="true" />
            </button>
          </div>
        </div>

        <div v-else class="sky-chatbot__composer">
          <input
            v-if="isDateStep"
            v-model="fieldInput"
            type="date"
            class="sky-chatbot__composer-input"
            :min="minDate"
            @keydown.enter.prevent="submitCurrentStep"
          />

          <input
            v-else
            v-model.trim="fieldInput"
            :type="inputType"
            class="sky-chatbot__composer-input"
            :placeholder="inputPlaceholder"
            :autocomplete="inputAutocomplete"
            @keydown.enter.prevent="submitCurrentStep"
          />

          <button
            type="button"
            class="sky-chatbot__composer-send"
            :disabled="isSending"
            @click="submitCurrentStep"
          >
            <SendHorizonal aria-hidden="true" />
          </button>
        </div>

        <p class="sky-chatbot__powered">Powered by RedSky Concierge</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onUnmounted, reactive, ref, watch } from "vue";
import { CheckCheck, ChevronRight, Headset, SendHorizonal, X } from "lucide-vue-next";
import { supabase } from "../../supabase";

const props = defineProps({
  locale: {
    type: String,
    default: "es-mx",
  },
  airportOptions: {
    type: Array,
    default: () => [],
  },
  aircraftFleet: {
    type: Array,
    default: () => [],
  },
  contactPath: {
    type: String,
    required: true,
  },
  fallbackImage: {
    type: String,
    default: "/images/Ourfleet/3.png",
  },
  whatsAppNumber: {
    type: String,
    required: true,
  },
  contactPhoneHref: {
    type: String,
    required: true,
  },
  contactPhoneLabel: {
    type: String,
    required: true,
  },
  contactEmailHref: {
    type: String,
    required: true,
  },
  contactEmailLabel: {
    type: String,
    required: true,
  },
  initialContact: {
    type: Object,
    default: () => ({
      name: "",
      phone: "",
      email: "",
    }),
  },
});

const emit = defineEmits(["sync-contact"]);
const CONTACT_ENDPOINT = "https://redskyg.com/send-contact.php";
const CHAT_RESET_DELAY_MS = 4000;

const isSpanish = computed(() => props.locale === "es-mx");
const isOpen = ref(false);
const isSending = ref(false);
const bodyRef = ref(null);
const fieldInput = ref("");
const currentStep = ref("origin");
const openedAt = ref(new Date());
const messageId = ref(0);
const resetTimer = ref(null);
const activeRequestController = ref(null);

const airportSearch = reactive({
  query: "",
  results: [],
  loading: false,
  open: false,
});
const selectedAirportState = reactive({
  origin: "",
  destination: "",
});

let airportSearchTimer = null;

const copy = computed(() =>
  isSpanish.value
    ? {
        launcher: "Chatear ahora",
        launcherEyebrow: "Asistencia inmediata",
        eyebrow: "Sky concierge",
        title: "Sky en linea",
        online: "En linea",
        close: "Cerrar asistente",
        welcome: "¡Bienvenido a RedSky! Soy Sky, tu asistente de aviacion privada.",
        intro: "Estoy aqui para recopilar los datos de tu vuelo y enviar tu solicitud al equipo comercial.",
        airportPlaceholder: "Escribe aeropuerto o ciudad",
        airportSearchHint: "Escribe al menos 3 letras para buscar en la base de datos",
        searchingAirports: "Buscando aeropuertos...",
        noAirportResults: "No encontramos aeropuertos con esa busqueda",
        tripTypes: [
          { value: "one-way", label: "Viaje sencillo" },
          { value: "round-trip", label: "Viaje redondo" },
        ],
        passenger: "pasajero",
        passengers: "pasajeros",
        commentsPlaceholder: "Comentarios adicionales (opcional)",
        skip: "Omitir",
        prompts: {
          origin: "1. Desde que aeropuerto saldra el vuelo?",
          destination: "2. Cual es el aeropuerto de destino?",
          departureDate: "3. Que fecha de salida necesitas?",
          tripType: "4. El viaje sera sencillo o redondo?",
          returnDate: "5. Cual es la fecha de regreso?",
          passengers: "6. Cuantos pasajeros viajaran?",
          name: "7. Cual es tu nombre?",
          email: "8. Cual es tu correo electronico?",
          phone: "9. Cual es tu telefono?",
          comments: "10. Deseas agregar comentarios adicionales?",
        },
        placeholders: {
          name: "Nombre completo",
          email: "Correo electronico",
          phone: "Telefono",
        },
        validation: {
          airport: "Selecciona un aeropuerto de la lista para continuar.",
          airportSelectionRequired:
            "Debes elegir un aeropuerto de la lista. Escribirlo no es suficiente.",
          date: "Selecciona una fecha valida.",
          returnDate: "La fecha de regreso debe ser posterior a la salida.",
          email: "Ingresa un correo valido.",
          phone: "Ingresa un telefono valido.",
          required: "Completa este campo para continuar.",
          sameAirport: "El origen y el destino deben ser diferentes.",
        },
        success:
          "✅ Gracias. Hemos recibido tu solicitud.\nUno de nuestros asesores preparara una cotizacion personalizada y la enviara al correo proporcionado en los proximos minutos.",
        error:
          "No pudimos enviar tu solicitud en este momento. Intenta nuevamente en unos minutos o escribenos a ventas@redskyg.com.",
        summaryCommentsEmpty: "Sin comentarios adicionales",
      }
    : {
        launcher: "Chat now",
        launcherEyebrow: "Instant support",
        eyebrow: "Sky concierge",
        title: "Sky online",
        online: "Online",
        close: "Close assistant",
        welcome: "Welcome to RedSky! I'm Sky, your private aviation assistant.",
        intro: "I'm here to collect your flight details and send your request to our commercial team.",
        airportPlaceholder: "Type airport or city",
        airportSearchHint: "Type at least 3 letters to search the database",
        searchingAirports: "Searching airports...",
        noAirportResults: "No airports found for that search",
        tripTypes: [
          { value: "one-way", label: "One way" },
          { value: "round-trip", label: "Round trip" },
        ],
        passenger: "passenger",
        passengers: "passengers",
        commentsPlaceholder: "Additional comments (optional)",
        skip: "Skip",
        prompts: {
          origin: "1. Which airport will the flight depart from?",
          destination: "2. What is the destination airport?",
          departureDate: "3. What is the departure date?",
          tripType: "4. Will this be one way or round trip?",
          returnDate: "5. What is the return date?",
          passengers: "6. How many passengers will be traveling?",
          name: "7. What is your name?",
          email: "8. What is your email address?",
          phone: "9. What is your phone number?",
          comments: "10. Would you like to add any additional comments?",
        },
        placeholders: {
          name: "Full name",
          email: "Email address",
          phone: "Phone number",
        },
        validation: {
          airport: "Please select an airport from the list to continue.",
          airportSelectionRequired:
            "You must choose an airport from the list. Typing it is not enough.",
          date: "Please select a valid date.",
          returnDate: "The return date must be after the departure date.",
          email: "Please enter a valid email address.",
          phone: "Please enter a valid phone number.",
          required: "Please complete this field to continue.",
          sameAirport: "Origin and destination must be different.",
        },
        success:
          "✅ Thank you. We have received your request.\nOne of our advisors will prepare a personalized quotation and send it to the email provided within the next few minutes.",
        error:
          "We could not send your request right now. Please try again in a few minutes or email ventas@redskyg.com.",
        summaryCommentsEmpty: "No additional comments",
      },
);

const createEmptyLead = () => ({
  originCode: "",
  originLabel: "",
  destinationCode: "",
  destinationLabel: "",
  departureDate: "",
  tripType: "",
  returnDate: "",
  passengers: 4,
  name: props.initialContact?.name || "",
  email: props.initialContact?.email || "",
  phone: props.initialContact?.phone || "",
  comments: "",
});

const lead = reactive(createEmptyLead());
const messages = ref([]);

const steps = [
  "origin",
  "destination",
  "departureDate",
  "tripType",
  "returnDate",
  "passengers",
  "name",
  "email",
  "phone",
  "comments",
];

const isAirportStep = computed(
  () => currentStep.value === "origin" || currentStep.value === "destination",
);
const isDateStep = computed(
  () => currentStep.value === "departureDate" || currentStep.value === "returnDate",
);

const inputType = computed(() => {
  if (currentStep.value === "email") return "email";
  if (currentStep.value === "phone") return "tel";
  return "text";
});

const inputPlaceholder = computed(() => {
  if (currentStep.value === "name") return copy.value.placeholders.name;
  if (currentStep.value === "email") return copy.value.placeholders.email;
  if (currentStep.value === "phone") return copy.value.placeholders.phone;
  return "";
});

const inputAutocomplete = computed(() => {
  if (currentStep.value === "name") return "name";
  if (currentStep.value === "email") return "email";
  if (currentStep.value === "phone") return "tel";
  return "off";
});

const minDate = computed(() => new Date().toISOString().slice(0, 10));
const showAirportDropdown = computed(
  () => isAirportStep.value && airportSearch.open && airportSearch.query.length > 0,
);

const normalizedAirportOptions = computed(() =>
  (props.airportOptions || [])
    .map((airport) =>
      airport?.value && airport?.label
        ? {
            value: String(airport.value).trim().toUpperCase(),
            label: String(airport.label).trim(),
          }
        : normalizeAirportOption(airport),
    )
    .filter(Boolean),
);

const normalizeAirportOption = (airport) => {
  const value = String(airport?.IATA || airport?.iata || airport?.aeropuerto || "")
    .trim()
    .toUpperCase();
  const city = String(airport?.CIUDAD || airport?.ciudad || "").trim();
  const airportName = String(airport?.AEROPUERTO || airport?.aeropuerto || "").trim();
  const region = String(
    airport?.ESTADO || airport?.estado || airport?.COUNTRY || airport?.country || "",
  ).trim();

  if (!value) return null;

  return {
    value,
    label: [city ? `${city} (${value})` : value, airportName, region].filter(Boolean).join(" · "),
  };
};

const formatChatTime = (date = new Date()) =>
  new Intl.DateTimeFormat(isSpanish.value ? "es-MX" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

const formatDateForMessage = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(isSpanish.value ? "es-MX" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const nextStepFor = (step) => {
  if (step === "tripType") {
    return lead.tripType === "round-trip" ? "returnDate" : "passengers";
  }

  if (step === "returnDate") return "passengers";

  const currentIndex = steps.indexOf(step);
  return steps[currentIndex + 1] || null;
};

const addMessage = async (sender, text) => {
  messages.value.push({
    id: `${sender}-${messageId.value++}`,
    sender,
    text,
    time: formatChatTime(),
  });
  await scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (!bodyRef.value) return;
  bodyRef.value.scrollTop = bodyRef.value.scrollHeight;
};

const clearAirportSearch = () => {
  airportSearch.query = "";
  airportSearch.results = [];
  airportSearch.loading = false;
  airportSearch.open = false;

  if (airportSearchTimer) {
    clearTimeout(airportSearchTimer);
    airportSearchTimer = null;
  }
};

const clearAirportSelectionForStep = (step) => {
  if (step === "origin") {
    selectedAirportState.origin = "";
    lead.originCode = "";
    lead.originLabel = "";
    return;
  }

  if (step === "destination") {
    selectedAirportState.destination = "";
    lead.destinationCode = "";
    lead.destinationLabel = "";
  }
};

const normalizeFreeText = (value) => String(value || "").trim().replace(/\s+/g, " ");

const normalizeEmail = (value) => normalizeFreeText(value).toLowerCase();

const normalizePhone = (value) => String(value || "").trim();

const isValidDateInput = (value) => {
  if (!value) return false;

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed >= today;
};

const isReturnDateValid = (departureDate, returnDate) => {
  if (!departureDate || !returnDate) return false;
  return new Date(`${returnDate}T00:00:00`) >= new Date(`${departureDate}T00:00:00`);
};

const hasMatchingAirport = (originCode, destinationCode) =>
  originCode &&
  destinationCode &&
  originCode.trim().toUpperCase() === destinationCode.trim().toUpperCase();

const getRequestPayload = () => ({
  to: "ventas@redskyg.com",
  recipient: "ventas@redskyg.com",
  subject: "Nueva solicitud de cotización - Chat Web",
  service: "Nueva solicitud de cotización - Chat Web",
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  message: buildEmailBody(),
});

const validateLeadBeforeSend = () => {
  if (!lead.originCode || !lead.destinationCode) return copy.value.validation.airport;
  if (hasMatchingAirport(lead.originCode, lead.destinationCode)) {
    return copy.value.validation.sameAirport;
  }
  if (!isValidDateInput(lead.departureDate)) return copy.value.validation.date;
  if (lead.tripType === "round-trip" && !isReturnDateValid(lead.departureDate, lead.returnDate)) {
    return copy.value.validation.returnDate;
  }
  if (!lead.name) return copy.value.validation.required;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return copy.value.validation.email;
  if (lead.phone.replace(/\D/g, "").length < 8) return copy.value.validation.phone;
  return "";
};

const resetLead = () => {
  Object.assign(lead, createEmptyLead());
  selectedAirportState.origin = "";
  selectedAirportState.destination = "";
  fieldInput.value = "";
  clearAirportSearch();
  currentStep.value = "origin";
};

const startConversation = async () => {
  messages.value = [];
  messageId.value = 0;
  resetLead();
  await addMessage("bot", copy.value.welcome);
  await addMessage("bot", copy.value.intro);
  await askCurrentStep();
};

const askCurrentStep = async () => {
  const prompt = copy.value.prompts[currentStep.value];
  if (!prompt) return;

  if (currentStep.value === "name") fieldInput.value = lead.name;
  if (currentStep.value === "email") fieldInput.value = lead.email;
  if (currentStep.value === "phone") fieldInput.value = lead.phone;
  if (currentStep.value === "comments") fieldInput.value = "";
  if (isDateStep.value) fieldInput.value = "";

  await addMessage("bot", prompt);
};

const openChatbot = () => {
  openedAt.value = new Date();
  if (resetTimer.value) {
    clearTimeout(resetTimer.value);
    resetTimer.value = null;
  }
  isOpen.value = true;
  startConversation();
};

const closeChatbot = () => {
  if (resetTimer.value) {
    clearTimeout(resetTimer.value);
    resetTimer.value = null;
  }
  if (activeRequestController.value) {
    activeRequestController.value.abort();
    activeRequestController.value = null;
  }
  isOpen.value = false;
  messages.value = [];
  resetLead();
};

const searchAirports = async () => {
  const term = airportSearch.query.trim();

  if (term.length < 3) {
    airportSearch.results = [];
    airportSearch.loading = false;
    return;
  }

  airportSearch.loading = true;

  try {
    const normalizedTerm = term.toLowerCase();
    const localMatches = normalizedAirportOptions.value
      .filter((airport) => airport.label.toLowerCase().includes(normalizedTerm))
      .slice(0, 10);

    if (localMatches.length || normalizedAirportOptions.value.length) {
      airportSearch.results = localMatches;
      return;
    }

    const likeTerm = `%${term}%`;
    const [{ data: national }, { data: international }] = await Promise.all([
      supabase
        .from("aeropuertos_mexico")
        .select("*")
        .or(`CIUDAD.ilike.${likeTerm},AEROPUERTO.ilike.${likeTerm},IATA.ilike.${likeTerm}`)
        .limit(8),
      supabase
        .from("airports_geo")
        .select("*")
        .or(`CIUDAD.ilike.${likeTerm},AEROPUERTO.ilike.${likeTerm},IATA.ilike.${likeTerm}`)
        .limit(8),
    ]);

    airportSearch.results = [...(national || []), ...(international || [])]
      .map((airport) => normalizeAirportOption(airport))
      .filter(Boolean)
      .filter(
        (airport, index, array) =>
          array.findIndex((item) => item.value === airport.value) === index,
      )
      .slice(0, 10);
  } catch (error) {
    console.error("Airport search failed", error);
    airportSearch.results = [];
  } finally {
    airportSearch.loading = false;
  }
};

const handleAirportInput = () => {
  clearAirportSelectionForStep(currentStep.value);
  airportSearch.open = true;

  if (airportSearchTimer) {
    clearTimeout(airportSearchTimer);
  }

  airportSearchTimer = setTimeout(() => {
    searchAirports();
  }, 250);
};

const handleAirportSubmitAttempt = async () => {
  await addMessage("bot", copy.value.validation.airportSelectionRequired);
  airportSearch.open = true;
};

const selectAirport = async (airport) => {
  if (currentStep.value === "origin") {
    selectedAirportState.origin = airport.value;
    lead.originCode = airport.value;
    lead.originLabel = airport.label;
  } else {
    if (hasMatchingAirport(lead.originCode, airport.value)) {
      await addMessage("bot", copy.value.validation.sameAirport);
      return;
    }
    selectedAirportState.destination = airport.value;
    lead.destinationCode = airport.value;
    lead.destinationLabel = airport.label;
  }

  await addMessage("user", airport.label);
  clearAirportSearch();
  await moveToNextStep();
};

const submitTripType = async (value) => {
  lead.tripType = value;
  const selectedOption = copy.value.tripTypes.find((option) => option.value === value);
  await addMessage("user", selectedOption?.label || value);
  await moveToNextStep();
};

const submitPassengers = async () => {
  if (!lead.passengers || lead.passengers < 1) {
    await addMessage("bot", copy.value.validation.required);
    return;
  }

  await addMessage(
    "user",
    `${lead.passengers} ${lead.passengers === 1 ? copy.value.passenger : copy.value.passengers}`,
  );
  await moveToNextStep();
};

const submitComments = async (skip = false) => {
  lead.comments = skip ? "" : normalizeFreeText(fieldInput.value);
  await addMessage("user", lead.comments || copy.value.summaryCommentsEmpty);
  fieldInput.value = "";
  await finalizeRequest();
};

const submitCurrentStep = async () => {
  const value = fieldInput.value.trim();

  if (isDateStep.value) {
    if (!isValidDateInput(value)) {
      await addMessage("bot", copy.value.validation.date);
      return;
    }

    if (currentStep.value === "departureDate") {
      lead.departureDate = value;
    } else {
      if (!isReturnDateValid(lead.departureDate, value)) {
        await addMessage("bot", copy.value.validation.returnDate);
        return;
      }
      lead.returnDate = value;
    }

    await addMessage("user", formatDateForMessage(value));
    fieldInput.value = "";
    await moveToNextStep();
    return;
  }

  if (currentStep.value === "name") {
    if (!value) {
      await addMessage("bot", copy.value.validation.required);
      return;
    }
    lead.name = normalizeFreeText(value);
    await addMessage("user", lead.name);
    fieldInput.value = "";
    await moveToNextStep();
    return;
  }

  if (currentStep.value === "email") {
    const normalizedValue = normalizeEmail(value);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)) {
      await addMessage("bot", copy.value.validation.email);
      return;
    }
    lead.email = normalizedValue;
    await addMessage("user", normalizedValue);
    fieldInput.value = "";
    await moveToNextStep();
    return;
  }

  if (currentStep.value === "phone") {
    const normalizedValue = normalizePhone(value);
    if (normalizedValue.replace(/\D/g, "").length < 8) {
      await addMessage("bot", copy.value.validation.phone);
      return;
    }
    lead.phone = normalizedValue;
    await addMessage("user", normalizedValue);
    fieldInput.value = "";
    await moveToNextStep();
  }
};

const moveToNextStep = async () => {
  const nextStep = nextStepFor(currentStep.value);

  if (!nextStep) {
    await finalizeRequest();
    return;
  }

  currentStep.value = nextStep;
  await askCurrentStep();
};

const buildEmailBody = () => {
  const requestedAt = new Intl.DateTimeFormat(isSpanish.value ? "es-MX" : "en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());

  return [
    `Nombre: ${lead.name}`,
    `Correo: ${lead.email}`,
    `Telefono: ${lead.phone}`,
    "",
    `Origen: ${lead.originLabel || lead.originCode}`,
    `Destino: ${lead.destinationLabel || lead.destinationCode}`,
    "",
    `Fecha salida: ${lead.departureDate ? formatDateForMessage(lead.departureDate) : "-"}`,
    `Fecha regreso: ${lead.returnDate ? formatDateForMessage(lead.returnDate) : "-"}`,
    "",
    `Pasajeros: ${lead.passengers}`,
    "",
    `Tipo de viaje: ${lead.tripType === "round-trip" ? "Redondo" : "Sencillo"}`,
    "",
    `Comentarios: ${lead.comments || copy.value.summaryCommentsEmpty}`,
    "",
    `Fecha y hora de la solicitud: ${requestedAt}`,
  ].join("\n");
};

const finalizeRequest = async () => {
  const validationError = validateLeadBeforeSend();
  if (validationError) {
    await addMessage("bot", validationError);
    return;
  }

  isSending.value = true;
  activeRequestController.value = new AbortController();

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(getRequestPayload()),
      signal: activeRequestController.value.signal,
    });

    const result = await response.json().catch(() => ({ success: response.ok }));

    if (!response.ok || result?.success === false) {
      throw new Error(result?.error || "send_failed");
    }

    await addMessage("bot", copy.value.success);
    emit("sync-contact", {
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
    });

    resetTimer.value = setTimeout(() => {
      startConversation();
    }, CHAT_RESET_DELAY_MS);
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error("Chat request send failed", error);
    await addMessage("bot", copy.value.error);
  } finally {
    activeRequestController.value = null;
    isSending.value = false;
  }
};

watch(
  () => props.initialContact,
  (value) => {
    if (!value) return;
    lead.name = value.name || "";
    lead.phone = value.phone || "";
    lead.email = value.email || "";
  },
  { deep: true },
);

watch(
  () => ({
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
  }),
  (value) => {
    emit("sync-contact", value);
  },
  { deep: true },
);

onUnmounted(() => {
  if (airportSearchTimer) {
    clearTimeout(airportSearchTimer);
    airportSearchTimer = null;
  }

  if (resetTimer.value) {
    clearTimeout(resetTimer.value);
    resetTimer.value = null;
  }

  if (activeRequestController.value) {
    activeRequestController.value.abort();
    activeRequestController.value = null;
  }
});
</script>

<style scoped>
.sky-chatbot-floating {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 60;
}

.sky-chatbot-launcher {
  width: min(94vw, 340px);
  padding: 0;
  border: 0;
  border-radius: 24px;
  overflow: hidden;
  background: transparent;
  box-shadow: 0 22px 44px rgba(0, 0, 0, 0.28);
  cursor: pointer;
}

.sky-chatbot-launcher__mobile-icon {
  display: none;
}

.sky-chatbot-launcher__agent-icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  border: 1px solid rgba(240, 200, 117, 0.34);
  border-radius: 18px;
  background: rgba(212, 166, 79, 0.08);
  color: #f0c875;
}

.sky-chatbot-launcher__agent-icon svg {
  width: 26px;
  height: 26px;
}

.sky-chatbot-launcher__bar {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 88px;
  padding: 0 24px 0 28px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.03), transparent 40%),
    linear-gradient(135deg, #12314b, #1b4465);
  color: #ffffff;
}

.sky-chatbot-launcher__bar-copy {
  display: grid;
  gap: 4px;
  text-align: left;
}

.sky-chatbot-launcher__bar-copy small {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.sky-chatbot-launcher__bar-copy strong {
  font-size: 1.16rem;
  font-weight: 900;
}

.sky-chatbot {
  width: min(92vw, 420px);
  max-height: min(82vh, 740px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  overflow: hidden;
  background: #f8fbff;
  box-shadow: 0 30px 80px rgba(10, 23, 40, 0.32);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.sky-chatbot__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 20px;
  background: linear-gradient(135deg, #071d34, #12314b);
}

.sky-chatbot__profile {
  display: flex;
  align-items: center;
  gap: 14px;
}

.sky-chatbot__profile-avatar {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border: 2px solid rgba(255, 255, 255, 0.42);
  border-radius: 999px;
  color: #ffffff;
}

.sky-chatbot__profile-avatar svg {
  width: 24px;
  height: 24px;
}

.sky-chatbot__topbar-copy {
  display: grid;
  gap: 4px;
}

.sky-chatbot__topbar-copy span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.sky-chatbot__topbar-copy strong {
  color: #ffffff;
  font-size: 1.26rem;
  line-height: 1.1;
}

.sky-chatbot__status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #5bd56f;
  font-size: 0.76rem;
  font-weight: 700;
}

.sky-chatbot__status-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #5bd56f;
  box-shadow: 0 0 0 4px rgba(91, 213, 111, 0.18);
}

.sky-chatbot__close {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
}

.sky-chatbot__close svg {
  width: 22px;
  height: 22px;
}

.sky-chatbot__body {
  overflow: auto;
  padding: 16px 14px 8px;
}

.sky-chatbot__thread {
  display: grid;
  gap: 14px;
}

.sky-chatbot__message-row {
  display: grid;
  gap: 10px;
}

.sky-chatbot__message-row--bot {
  grid-template-columns: 36px minmax(0, 1fr);
}

.sky-chatbot__message-row--user {
  grid-template-columns: minmax(0, 1fr);
  justify-items: end;
}

.sky-chatbot__avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: linear-gradient(135deg, #071d34, #12314b);
  color: #ffffff;
}

.sky-chatbot__avatar svg {
  width: 18px;
  height: 18px;
}

.sky-chatbot__message-block {
  display: grid;
  gap: 6px;
  max-width: 92%;
}

.sky-chatbot__message-block--user {
  justify-items: end;
}

.sky-chatbot__message {
  margin: 0;
  padding: 14px 16px;
  border-radius: 20px;
  line-height: 1.45;
}

.sky-chatbot__message p {
  margin: 0;
  white-space: pre-line;
}

.sky-chatbot__message--bot {
  border-top-left-radius: 8px;
  background: linear-gradient(180deg, #f9fbff, #eef4fb);
  color: #112035;
  box-shadow: 0 14px 28px rgba(155, 175, 202, 0.16);
}

.sky-chatbot__message--user {
  max-width: min(88%, 300px);
  border-top-right-radius: 8px;
  background: linear-gradient(135deg, #071d34, #12314b);
  color: #ffffff;
  box-shadow: 0 14px 24px rgba(18, 49, 75, 0.18);
}

.sky-chatbot__meta {
  padding: 0 4px;
  color: #8a9ab0;
  font-size: 0.74rem;
}

.sky-chatbot__meta--user {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sky-chatbot__meta--user svg {
  width: 14px;
  height: 14px;
}

.sky-chatbot__footer {
  padding: 10px 14px 12px;
  background: linear-gradient(180deg, rgba(248, 251, 255, 0.96), #ffffff);
  border-top: 1px solid rgba(120, 142, 168, 0.14);
}

.sky-chatbot__composer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}

.sky-chatbot__composer--stacked {
  grid-template-columns: 1fr;
}

.sky-chatbot__composer-input,
.sky-chatbot__composer-textarea,
.sky-chatbot__composer-input--select,
.sky-chatbot__airport-input {
  width: 100%;
  min-height: 46px;
  border: 1px solid rgba(120, 142, 168, 0.2);
  border-radius: 18px;
  background: #ffffff;
  color: #12314b;
  padding: 0 16px;
  font: inherit;
  font-size: 0.92rem;
  box-shadow: 0 12px 26px rgba(155, 175, 202, 0.08);
}

.sky-chatbot__composer-textarea {
  min-height: 88px;
  padding: 12px 16px;
  resize: vertical;
}

.sky-chatbot__composer-input::placeholder,
.sky-chatbot__composer-textarea::placeholder,
.sky-chatbot__airport-input::placeholder {
  color: #94a4b7;
}

.sky-chatbot__composer-send {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #071d34, #12314b);
  color: #ffffff;
}

.sky-chatbot__composer-send--wide {
  width: 52px;
}

.sky-chatbot__composer-send svg {
  width: 20px;
  height: 20px;
}

.sky-chatbot__composer-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.sky-chatbot__composer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.sky-chatbot__ghost {
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid rgba(120, 142, 168, 0.2);
  border-radius: 16px;
  background: #ffffff;
  color: #12314b;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
}

.sky-chatbot__choice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.sky-chatbot__choice {
  min-height: 46px;
  border: 1px solid rgba(120, 142, 168, 0.2);
  border-radius: 16px;
  background: #ffffff;
  color: #12314b;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 800;
}

.sky-chatbot__airport-search {
  position: relative;
}

.sky-chatbot__airport-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 8;
  padding: 8px;
  border: 1px solid rgba(120, 142, 168, 0.18);
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 18px 36px rgba(18, 49, 75, 0.14);
}

.sky-chatbot__airport-results {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sky-chatbot__airport-option {
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: 12px;
  background: #f5f8fc;
  color: #12314b;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: left;
}

.sky-chatbot__airport-status {
  margin: 0;
  padding: 8px 10px;
  color: #70829a;
  font-size: 0.8rem;
  line-height: 1.4;
}

.sky-chatbot__powered {
  margin: 10px 0 0;
  text-align: center;
  color: #7d8ea4;
  font-size: 0.72rem;
}

@media (max-width: 720px) {
  .sky-chatbot-floating {
    right: 12px;
    bottom: 12px;
  }

  .sky-chatbot-launcher {
    width: 64px;
    height: 64px;
    border-radius: 999px;
    background: linear-gradient(135deg, #071d34, #12314b);
    box-shadow: 0 18px 36px rgba(18, 49, 75, 0.34);
    display: grid;
    place-items: center;
  }

  .sky-chatbot-launcher__mobile-icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    color: #ffffff;
  }

  .sky-chatbot-launcher__mobile-icon svg {
    width: 28px;
    height: 28px;
  }

  .sky-chatbot-launcher__bar,
  .sky-chatbot-launcher__agent-icon {
    display: none;
  }

  .sky-chatbot {
    width: min(92vw, 390px);
    max-height: min(82vh, 720px);
  }

  .sky-chatbot__choice-grid {
    grid-template-columns: 1fr;
  }
}
</style>
