<template>
  <MainLayout>
    <section class="survey-page">
      <div class="survey-shell">
        <div v-if="isSuccess" class="survey-success">
          <span class="survey-success__eyebrow">{{ copy.success.eyebrow }}</span>
          <h1>{{ copy.success.title }}</h1>
          <p>{{ copy.success.description }}</p>
          <span class="survey-success__meta">{{ copy.success.autoReturn }}</span>
          <button class="survey-success__action" type="button" @click="goHome">
            {{ copy.success.cta }}
          </button>
        </div>

        <div v-else class="survey-card">
          <div class="survey-topline">
            <div>
              <span class="survey-topline__eyebrow">{{ copy.eyebrow }}</span>
              <h1>{{ copy.title }}</h1>
            </div>
            <p>{{ copy.description }}</p>
          </div>

          <div class="survey-progress">
            <div class="survey-progress__meta">
              <span>{{ currentStep.leg }}</span>
              <strong>{{ currentStep.counter }}</strong>
            </div>

            <div class="survey-progress__track" aria-hidden="true">
              <span
                class="survey-progress__line"
                :style="{ width: `${progressPercent}%` }"
              ></span>
              <span
                class="survey-progress__plane"
                :style="{ left: `${progressPercent}%` }"
              >
                <Plane aria-hidden="true" />
              </span>
            </div>

            <div class="survey-progress__labels">
              <span
                v-for="step in steps"
                :key="step.id"
                :class="{ active: step.id === currentStep.id }"
              >
                {{ step.shortLabel }}
              </span>
            </div>
          </div>

          <Transition name="survey-step" mode="out-in">
            <section :key="currentStep.id" class="survey-step">
              <header class="survey-step__header">
                <span>{{ currentStep.counter }}</span>
                <h2>{{ currentStep.question }}</h2>
                <p v-if="currentStep.helper">{{ currentStep.helper }}</p>
              </header>

              <div v-if="currentStep.id === 1" class="survey-options">
                <button
                  v-for="option in copy.questions.q1.options"
                  :key="option"
                  class="survey-option"
                  :class="{ active: answers.q1 === option }"
                  type="button"
                  :aria-pressed="answers.q1 === option"
                  @click="answers.q1 = option"
                >
                  <span class="survey-option__indicator" aria-hidden="true"></span>
                  {{ option }}
                </button>
              </div>

              <div v-else-if="currentStep.id === 2" class="survey-options survey-options--satisfaction">
                <button
                  v-for="option in copy.questions.q2.options"
                  :key="option"
                  class="survey-option"
                  :class="{ active: answers.q2 === option }"
                  type="button"
                  :aria-pressed="answers.q2 === option"
                  @click="answers.q2 = option"
                >
                  <span class="survey-option__indicator" aria-hidden="true"></span>
                  {{ option }}
                </button>
              </div>

              <div v-else-if="currentStep.id === 3" class="survey-options">
                <button
                  v-for="option in copy.questions.q3.options"
                  :key="option"
                  class="survey-option survey-option--multiple"
                  :class="{ active: answers.q3.includes(option) }"
                  type="button"
                  :aria-pressed="answers.q3.includes(option)"
                  @click="toggleSelection('q3', option)"
                >
                  <span class="survey-option__indicator" aria-hidden="true"></span>
                  {{ option }}
                </button>
              </div>

              <div v-else-if="currentStep.id === 4" class="survey-options">
                <button
                  v-for="option in copy.questions.q4.options"
                  :key="option"
                  class="survey-option survey-option--multiple"
                  :class="{ active: answers.q4.includes(option) }"
                  type="button"
                  :aria-pressed="answers.q4.includes(option)"
                  @click="toggleSelection('q4', option)"
                >
                  <span class="survey-option__indicator" aria-hidden="true"></span>
                  {{ option }}
                </button>
              </div>

              <div v-else-if="currentStep.id === 5" class="survey-stack">
                <div class="survey-options survey-options--satisfaction">
                  <button
                    v-for="option in copy.questions.q5.options"
                    :key="option"
                    class="survey-option"
                    :class="{ active: answers.q5 === option }"
                    type="button"
                    :aria-pressed="answers.q5 === option"
                    @click="answers.q5 = option"
                  >
                    <span class="survey-option__indicator" aria-hidden="true"></span>
                    {{ option }}
                  </button>
                </div>

                <div class="survey-lead">
                  <span class="survey-lead__eyebrow">{{ copy.optional.eyebrow }}</span>
                  <h3>{{ copy.optional.title }}</h3>
                  <p>{{ copy.optional.description }}</p>

                  <div class="survey-lead__fields">
                    <label class="survey-field">
                      <span>{{ copy.optional.name }}</span>
                      <input v-model="answers.leadName" type="text" :placeholder="copy.optional.namePlaceholder" />
                    </label>

                    <label class="survey-field">
                      <span>{{ copy.optional.contact }}</span>
                      <input
                        v-model="answers.leadContact"
                        type="text"
                        :placeholder="copy.optional.contactPlaceholder"
                      />
                    </label>
                  </div>

                  <button class="survey-skip" type="button" @click="skipOptionalLead">
                    {{ copy.optional.skip }}
                  </button>
                </div>
              </div>

              <div v-else class="survey-stack">
                <label class="survey-field survey-field--textarea">
                  <span>{{ copy.questions.q6.label }}</span>
                  <textarea
                    v-model="answers.q6"
                    rows="8"
                    :placeholder="copy.questions.q6.placeholder"
                  ></textarea>
                </label>
              </div>
            </section>
          </Transition>

          <p v-if="stepError" class="survey-message survey-message--error">
            {{ stepError }}
          </p>
          <p v-else-if="submitError" class="survey-message survey-message--error">
            {{ submitError }}
          </p>

          <div class="survey-actions">
            <button
              v-if="activeStepIndex > 0"
              class="survey-button survey-button--secondary"
              type="button"
              @click="goToPreviousStep"
            >
              {{ copy.actions.back }}
            </button>

            <button
              v-if="!isFinalStep"
              class="survey-button"
              type="button"
              @click="goToNextStep"
            >
              {{ copy.actions.next }}
            </button>

            <button
              v-else
              class="survey-button"
              type="button"
              :disabled="isSubmitting"
              @click="submitSurvey"
            >
              {{ isSubmitting ? copy.actions.submitting : copy.actions.submit }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Plane } from "lucide-vue-next";
import MainLayout from "../layouts/MainLayout.vue";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";
import { supabase } from "../supabase";

const route = useRoute();
const router = useRouter();
const { localizedPath } = useLocalizedNavigation();

const allowedSources = ["home", "contacto"];
const source = computed(() =>
  allowedSources.includes(route.query.source) ? route.query.source : "directo",
);

const answers = reactive({
  q1: null,
  q2: null,
  q3: [],
  q4: [],
  q5: null,
  q6: "",
  leadName: "",
  leadContact: "",
});

const activeStepIndex = ref(0);
const isSubmitting = ref(false);
const submitError = ref("");
const isSuccess = ref(false);
const stepError = ref("");
let successRedirectTimer = null;
const pendingEmailRetryKey = ref(null);
const pendingEmailPayload = ref(null);

const surveyCopyByLocale = {
  "es-mx": {
    eyebrow: "ENCUESTA DE EXPERIENCIA",
    title: "Ayudanos a disenar una mejor forma de contratar vuelos privados.",
    description:
      "Tus respuestas nos ayudaran a entender como vives hoy el proceso de solicitud, cotizacion y reservacion.",
    actions: {
      back: "Volver",
      next: "Continuar",
      submit: "ENVIAR RESPUESTAS",
      submitting: "ENVIANDO...",
    },
    optional: {
      eyebrow: "ESCALA",
      title:
        "Estamos desarrollando una nueva herramienta para simplificar la contratacion y gestion de vuelos privados.",
      description:
        "Si te interesa conocerla o participar en una prueba inicial, dejanos tus datos. Es completamente opcional.",
      name: "Nombre",
      contact: "Correo o WhatsApp",
      namePlaceholder: "Tu nombre",
      contactPlaceholder: "Correo electronico o numero de WhatsApp",
      skip: "OMITIR",
    },
    success: {
      eyebrow: "VUELO REGISTRADO",
      title: "Gracias por compartir tu experiencia",
      description:
        "Tus respuestas nos ayudan a disenar una mejor forma de contratar y gestionar vuelos privados con Sky Group.",
      autoReturn: "Te regresaremos al inicio automaticamente.",
      cta: "VOLVER AL INICIO",
    },
    errors: {
      required: "Selecciona una respuesta para continuar.",
      requiredMultiple: "Selecciona al menos una opcion para continuar.",
      submit: "No pudimos enviar tus respuestas. Por favor, intenta nuevamente.",
      database: "No fue posible guardar tus respuestas.",
      email:
        "Las respuestas se guardaron, pero no fue posible enviar la notificacion por correo. Intenta nuevamente.",
    },
    steps: {
      request: "Solicitud",
      satisfaction: "Satisfaccion",
      friction: "Friccion",
      tools: "Herramientas",
      adoption: "Adopcion",
      comment: "Comentario",
    },
    questions: {
      q1: {
        question: "Como solicitas normalmente tus vuelos privados?",
        options: [
          "WhatsApp",
          "Llamada",
          "Correo electronico",
          "Con un asesor / ejecutivo",
          "Combinacion de los anteriores",
        ],
      },
      q2: {
        question: "Que tan satisfecho estas con el proceso actual?",
        options: [
          "Muy satisfecho",
          "Satisfecho",
          "Neutral",
          "Poco satisfecho",
          "Nada satisfecho",
        ],
      },
      q3: {
        question: "Que parte del proceso te gustaria que fuera mas sencilla o rapida?",
        helper: "Puedes seleccionar mas de una opcion.",
        options: [
          "Solicitar una cotizacion",
          "Consultar disponibilidad",
          "Comparar opciones",
          "Confirmar una reservacion",
          "Realizar el pago",
          "Recibir informacion y documentacion",
          "Todo el proceso funciona bien actualmente",
        ],
      },
      q4: {
        question:
          "Si pudieras realizar parte del proceso desde una aplicacion, que funciones te resultarian mas utiles?",
        helper: "Seleccion multiple.",
        options: [
          "Solicitar una cotizacion",
          "Consultar disponibilidad y opciones de aeronaves",
          "Reservar un vuelo",
          "Gestionar pasajeros y datos frecuentes",
          "Consultar mis vuelos y reservaciones",
          "Recibir confirmaciones y documentacion",
        ],
      },
      q5: {
        question:
          "Que tan probable seria que utilizaras una aplicacion para gestionar tus vuelos privados?",
        options: [
          "Definitivamente la utilizaria",
          "Probablemente la utilizaria",
          "No estoy seguro",
          "Probablemente no",
          "Definitivamente no",
        ],
      },
      q6: {
        question: "Que te gustaria que una aplicacion de vuelos privados hiciera por ti?",
        label: "Comentario final",
        placeholder: "Cuentanos con tus palabras...",
      },
    },
  },
  "en-us": {
    eyebrow: "EXPERIENCE SURVEY",
    title: "Help us design a better way to arrange private flights.",
    description:
      "Your answers will help us understand how you currently experience the request, quoting and booking process.",
    actions: {
      back: "Back",
      next: "Continue",
      submit: "SUBMIT RESPONSES",
      submitting: "SENDING...",
    },
    optional: {
      eyebrow: "SCALE",
      title:
        "We are developing a new tool to simplify private flight booking and management.",
      description:
        "If you would like to learn about it or participate in an initial test, leave us your details. It is completely optional.",
      name: "Name",
      contact: "Email or WhatsApp",
      namePlaceholder: "Your name",
      contactPlaceholder: "Email or WhatsApp number",
      skip: "SKIP",
    },
    success: {
      eyebrow: "FLIGHT REGISTERED",
      title: "Thank you for sharing your experience",
      description:
        "Your responses help us design a better way to book and manage private flights with Sky Group.",
      autoReturn: "We will return you to the home page automatically.",
      cta: "BACK TO HOME",
    },
    errors: {
      required: "Select an answer to continue.",
      requiredMultiple: "Select at least one option to continue.",
      submit: "We could not send your responses. Please try again.",
      database: "We could not save your responses.",
      email:
        "Your responses were saved, but we could not send the email notification. Please try again.",
    },
    steps: {
      request: "Request",
      satisfaction: "Satisfaction",
      friction: "Friction",
      tools: "Tools",
      adoption: "Adoption",
      comment: "Comment",
    },
    questions: {
      q1: {
        question: "How do you usually request your private flights?",
        options: [
          "WhatsApp",
          "Call",
          "Email",
          "Through an advisor / executive",
          "A combination of the above",
        ],
      },
      q2: {
        question: "How satisfied are you with the current process?",
        options: [
          "Very satisfied",
          "Satisfied",
          "Neutral",
          "Somewhat dissatisfied",
          "Not satisfied at all",
        ],
      },
      q3: {
        question: "Which part of the process would you like to be simpler or faster?",
        helper: "You can select more than one option.",
        options: [
          "Requesting a quote",
          "Checking availability",
          "Comparing options",
          "Confirming a booking",
          "Making the payment",
          "Receiving information and documentation",
          "The entire process already works well",
        ],
      },
      q4: {
        question:
          "If you could complete part of the process through an app, which features would be most useful to you?",
        helper: "Multiple selection.",
        options: [
          "Requesting a quote",
          "Checking availability and aircraft options",
          "Booking a flight",
          "Managing passengers and frequent traveler details",
          "Viewing my flights and reservations",
          "Receiving confirmations and documentation",
        ],
      },
      q5: {
        question:
          "How likely would you be to use an app to manage your private flights?",
        options: [
          "I would definitely use it",
          "I would probably use it",
          "I am not sure",
          "Probably not",
          "Definitely not",
        ],
      },
      q6: {
        question: "What would you like a private flights app to do for you?",
        label: "Final comment",
        placeholder: "Tell us in your own words...",
      },
    },
  },
};

const activeLocale = route.meta?.locale ?? "es-mx";
const copy = surveyCopyByLocale[activeLocale] ?? surveyCopyByLocale["es-mx"];
const canonicalSpanishCopy = surveyCopyByLocale["es-mx"];

const steps = computed(() => [
  {
    id: 1,
    leg: "LEG 01 / Solicitud",
    counter: "01 / 06",
    shortLabel: copy.steps.request,
    question: copy.questions.q1.question,
  },
  {
    id: 2,
    leg: "LEG 02 / " + copy.steps.satisfaction,
    counter: "02 / 06",
    shortLabel: copy.steps.satisfaction,
    question: copy.questions.q2.question,
  },
  {
    id: 3,
    leg: "LEG 03 / " + copy.steps.friction,
    counter: "03 / 06",
    shortLabel: copy.steps.friction,
    question: copy.questions.q3.question,
    helper: copy.questions.q3.helper,
  },
  {
    id: 4,
    leg: "LEG 04 / " + copy.steps.tools,
    counter: "04 / 06",
    shortLabel: copy.steps.tools,
    question: copy.questions.q4.question,
    helper: copy.questions.q4.helper,
  },
  {
    id: 5,
    leg: "LEG 05 / " + copy.steps.adoption,
    counter: "05 / 06",
    shortLabel: copy.steps.adoption,
    question: copy.questions.q5.question,
  },
  {
    id: 6,
    leg: "LEG 06 / " + copy.steps.comment,
    counter: "06 / 06",
    shortLabel: copy.steps.comment,
    question: copy.questions.q6.question,
  },
]);

const currentStep = computed(() => steps.value[activeStepIndex.value]);
const isFinalStep = computed(
  () => activeStepIndex.value === steps.value.length - 1,
);
const progressPercent = computed(() => {
  if (steps.value.length === 1) return 100;
  return (activeStepIndex.value / (steps.value.length - 1)) * 100;
});

const toggleSelection = (key, option) => {
  const bucket = answers[key];
  const index = bucket.indexOf(option);

  if (index >= 0) {
    bucket.splice(index, 1);
    return;
  }

  bucket.push(option);
};

const canonicalizeSingleAnswer = (questionKey, answer) => {
  if (!answer) return answer;

  const localizedOptions = copy.questions[questionKey]?.options ?? [];
  const canonicalOptions = canonicalSpanishCopy.questions[questionKey]?.options ?? [];
  const answerIndex = localizedOptions.indexOf(answer);

  if (answerIndex === -1) {
    return answer;
  }

  return canonicalOptions[answerIndex] ?? answer;
};

const canonicalizeMultipleAnswers = (questionKey, answersList) =>
  (answersList || []).map((answer) =>
    canonicalizeSingleAnswer(questionKey, answer),
  );

const validateStep = () => {
  stepError.value = "";

  if (currentStep.value.id === 1 && !answers.q1) {
    stepError.value = copy.errors.required;
    return false;
  }

  if (currentStep.value.id === 2 && !answers.q2) {
    stepError.value = copy.errors.required;
    return false;
  }

  if (currentStep.value.id === 3 && !answers.q3.length) {
    stepError.value = copy.errors.requiredMultiple;
    return false;
  }

  if (currentStep.value.id === 4 && !answers.q4.length) {
    stepError.value = copy.errors.requiredMultiple;
    return false;
  }

  if (currentStep.value.id === 5 && !answers.q5) {
    stepError.value = copy.errors.required;
    return false;
  }

  return true;
};

const goToNextStep = () => {
  if (!validateStep()) return;
  submitError.value = "";
  activeStepIndex.value += 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const goToPreviousStep = () => {
  stepError.value = "";
  submitError.value = "";
  activeStepIndex.value -= 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const skipOptionalLead = () => {
  answers.leadName = "";
  answers.leadContact = "";
};

const buildSurveyKey = () =>
  JSON.stringify({
    source: source.value,
    q1: answers.q1,
    q2: answers.q2,
    q3: [...answers.q3],
    q4: [...answers.q4],
    q5: answers.q5,
    q6: answers.q6.trim(),
    leadName: answers.leadName.trim(),
    leadContact: answers.leadContact.trim(),
  });

const submitSurvey = async () => {
  if (isSubmitting.value) return;

  submitError.value = "";
  stepError.value = "";
  const surveyKey = buildSurveyKey();
  const shouldRetryEmailOnly =
    pendingEmailRetryKey.value === surveyKey && pendingEmailPayload.value;
  const timestamp =
    pendingEmailPayload.value?.timestamp ?? new Date().toISOString();
  const databasePayload = {
    source: source.value,
    q1: canonicalizeSingleAnswer("q1", answers.q1),
    q2: canonicalizeSingleAnswer("q2", answers.q2),
    q3: canonicalizeMultipleAnswers("q3", answers.q3),
    q4: canonicalizeMultipleAnswers("q4", answers.q4),
    q5: canonicalizeSingleAnswer("q5", answers.q5),
    q6: answers.q6.trim() || null,
    lead_name: answers.leadName.trim() || null,
    lead_contact: answers.leadContact.trim() || null,
    status: "nuevo",
    notes: null,
    client_timestamp: timestamp,
  };
  const emailPayload =
    shouldRetryEmailOnly && pendingEmailPayload.value
      ? pendingEmailPayload.value
      : {
          source: source.value,
          timestamp,
          q1: canonicalizeSingleAnswer("q1", answers.q1),
          q2: canonicalizeSingleAnswer("q2", answers.q2),
          q3: canonicalizeMultipleAnswers("q3", answers.q3),
          q4: canonicalizeMultipleAnswers("q4", answers.q4),
          q5: canonicalizeSingleAnswer("q5", answers.q5),
          q6: answers.q6.trim() || "",
          leadName: answers.leadName.trim() || "",
          leadContact: answers.leadContact.trim() || "",
        };

  isSubmitting.value = true;

  try {
    if (!shouldRetryEmailOnly) {
      const { error: databaseError } = await supabase
        .from("survey_responses")
        .insert(databasePayload);

      if (databaseError) {
        console.error("Error guardando encuesta en Supabase:", databaseError);
        throw new Error(copy.errors.database);
      }
    }

    const response = await fetch(
      "https://redskyg.com/landing/enviar-encuesta.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(emailPayload),
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      pendingEmailRetryKey.value = surveyKey;
      pendingEmailPayload.value = emailPayload;
      throw new Error(result.message || copy.errors.email);
    }

    pendingEmailRetryKey.value = null;
    pendingEmailPayload.value = null;
    isSuccess.value = true;
    window.clearTimeout(successRedirectTimer);
    successRedirectTimer = window.setTimeout(() => {
      goHome();
    }, 2200);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    submitError.value = error?.message || copy.errors.submit;
  } finally {
    isSubmitting.value = false;
  }
};

const goHome = () => {
  window.clearTimeout(successRedirectTimer);
  router.push(localizedPath("home"));
};

onBeforeUnmount(() => {
  window.clearTimeout(successRedirectTimer);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Manrope:wght@400;500;600;700;800&display=swap");

.survey-page {
  min-height: 100vh;
  padding: 132px 0 88px;
  background:
    radial-gradient(circle at top left, rgba(208, 172, 103, 0.22), transparent 24%),
    linear-gradient(180deg, #071624 0%, #0d2133 36%, #f6f1e7 36%, #f8f7f4 100%);
}

.survey-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.survey-card,
.survey-success {
  border: 1px solid rgba(7, 22, 36, 0.08);
  border-radius: 30px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(249, 246, 239, 0.98));
  box-shadow: 0 30px 100px rgba(7, 22, 36, 0.14);
}

.survey-card {
  padding: 42px;
}

.survey-success {
  max-width: 760px;
  margin: 0 auto;
  padding: 58px 44px;
  text-align: center;
}

.survey-success__eyebrow,
.survey-topline__eyebrow,
.survey-step__header span,
.survey-lead__eyebrow {
  display: inline-flex;
  color: #b58a43;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.survey-success h1,
.survey-topline h1,
.survey-step__header h2,
.survey-lead h3 {
  margin: 0;
  color: #0f2233;
  font-family: "Cormorant Garamond", serif;
  letter-spacing: -0.04em;
}

.survey-success h1,
.survey-topline h1 {
  margin-top: 0.9rem;
  font-size: clamp(3rem, 5vw, 5rem);
  line-height: 0.94;
}

.survey-topline {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 28px;
  align-items: end;
}

.survey-topline p,
.survey-success p,
.survey-step__header p,
.survey-lead p {
  margin: 0;
  color: #5c6874;
  line-height: 1.8;
}

.survey-success__meta {
  display: inline-flex;
  margin-top: 1rem;
  color: #9c7a44;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.survey-progress {
  margin: 34px 0 28px;
  padding: 20px 22px 16px;
  border: 1px solid rgba(7, 22, 36, 0.08);
  border-radius: 22px;
  background: #fffdfa;
}

.survey-progress__meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  color: #0f2233;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.survey-progress__track {
  position: relative;
  height: 2px;
  background: rgba(7, 22, 36, 0.1);
}

.survey-progress__line {
  position: absolute;
  inset: 0 auto 0 0;
  background: linear-gradient(90deg, #d0ac67, #f0c878);
  transition: width 0.35s ease;
}

.survey-progress__plane {
  position: absolute;
  top: 50%;
  z-index: 1;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #0f2233;
  color: #d0ac67;
  box-shadow: 0 14px 30px rgba(7, 22, 36, 0.18);
  transform: translate(-50%, -50%);
  transition: left 0.35s ease;
}

.survey-progress__plane svg {
  width: 17px;
  height: 17px;
}

.survey-progress__labels {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.survey-progress__labels span {
  color: #7f8791;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.survey-progress__labels span.active {
  color: #0f2233;
  font-weight: 800;
}

.survey-step {
  min-height: 420px;
  padding: 18px 6px 0;
}

.survey-step__header {
  max-width: 860px;
  margin-bottom: 24px;
}

.survey-step__header h2 {
  margin-top: 0.8rem;
  font-size: clamp(2.4rem, 4vw, 3.9rem);
  line-height: 0.96;
}

.survey-step__header p {
  margin-top: 0.9rem;
}

.survey-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.survey-options--satisfaction {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.survey-option {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  min-height: 88px;
  padding: 20px 22px;
  border: 1px solid rgba(7, 22, 36, 0.12);
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff, #fcfaf5);
  color: #0f2233;
  cursor: pointer;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.5;
  text-align: left;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    color 0.22s ease,
    outline-color 0.22s ease;
}

.survey-option__indicator {
  position: relative;
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  border: 1.5px solid rgba(15, 34, 51, 0.24);
  border-radius: 999px;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.82);
  transition:
    border-color 0.22s ease,
    background 0.22s ease,
    transform 0.22s ease;
}

.survey-option__indicator::after {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: inherit;
  background: transparent;
  transform: scale(0.55);
  opacity: 0;
  transition:
    transform 0.22s ease,
    opacity 0.22s ease,
    background 0.22s ease;
}

.survey-option:hover {
  transform: translateY(-2px);
  border-color: rgba(208, 172, 103, 0.68);
  box-shadow: 0 18px 36px rgba(7, 22, 36, 0.08);
}

.survey-option:hover .survey-option__indicator {
  border-color: rgba(208, 172, 103, 0.88);
}

.survey-option:focus-visible {
  outline: 2px solid rgba(208, 172, 103, 0.36);
  outline-offset: 3px;
}

.survey-option.active {
  border-color: #d0ac67;
  background: linear-gradient(135deg, #0f2233, #17354f);
  color: #ffffff;
  box-shadow: 0 20px 40px rgba(7, 22, 36, 0.14);
}

.survey-option.active .survey-option__indicator {
  border-color: #f3d08a;
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.03);
}

.survey-option.active .survey-option__indicator::after {
  background: #f3d08a;
  transform: scale(1);
  opacity: 1;
}

.survey-option--multiple.active {
  background: linear-gradient(135deg, #faf3e4, #f5e5c2);
  color: #0f2233;
}

.survey-option--multiple .survey-option__indicator {
  border-radius: 6px;
}

.survey-option--multiple.active .survey-option__indicator {
  border-color: #c8933d;
  background: #fff9ea;
}

.survey-option--multiple.active .survey-option__indicator::after {
  background: linear-gradient(135deg, #c8933d, #e2b866);
}

.survey-stack {
  display: grid;
  gap: 28px;
}

.survey-lead {
  padding: 26px;
  border: 1px solid rgba(208, 172, 103, 0.28);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(245, 233, 208, 0.45), rgba(255, 255, 255, 0.9));
}

.survey-lead h3 {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1;
}

.survey-lead p {
  max-width: 740px;
  margin-top: 0.8rem;
}

.survey-lead__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.survey-field {
  display: grid;
  gap: 8px;
}

.survey-field span {
  color: #495561;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.survey-field input,
.survey-field textarea {
  width: 100%;
  border: 1px solid rgba(7, 22, 36, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  color: #0f2233;
  font: inherit;
  line-height: 1.6;
  outline: none;
  padding: 0.95rem 1rem;
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.survey-field textarea {
  min-height: 220px;
  resize: vertical;
}

.survey-field input:focus,
.survey-field textarea:focus {
  border-color: rgba(208, 172, 103, 0.62);
  box-shadow: 0 0 0 4px rgba(208, 172, 103, 0.14);
  background: #ffffff;
}

.survey-skip,
.survey-success__action,
.survey-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  border: 0;
  cursor: pointer;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    opacity 0.24s ease,
    background 0.24s ease,
    color 0.24s ease;
}

.survey-skip {
  margin-top: 18px;
  padding: 0;
  background: transparent;
  color: #7a6340;
}

.survey-button,
.survey-success__action {
  padding: 0 24px;
  background: #0f2233;
  color: #ffffff;
}

.survey-button:hover,
.survey-success__action:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(7, 22, 36, 0.18);
}

.survey-button:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.survey-button--secondary {
  border: 1px solid rgba(7, 22, 36, 0.12);
  background: transparent;
  color: #0f2233;
}

.survey-message {
  margin: 18px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.survey-message--error {
  color: #ad2d2d;
}

.survey-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 26px;
}

.survey-step-enter-active,
.survey-step-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}

.survey-step-enter-from,
.survey-step-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

@media (max-width: 1024px) {
  .survey-topline {
    grid-template-columns: 1fr;
  }

  .survey-options--satisfaction {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .survey-page {
    padding: 118px 0 72px;
  }

  .survey-card {
    padding: 26px 18px 22px;
    border-radius: 24px;
  }

  .survey-success {
    padding: 42px 24px;
    border-radius: 24px;
  }

  .survey-progress {
    padding: 18px 16px 14px;
  }

  .survey-progress__labels {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 12px;
  }

  .survey-options,
  .survey-options--satisfaction,
  .survey-lead__fields {
    grid-template-columns: 1fr;
  }

  .survey-option {
    min-height: 74px;
    padding: 18px;
  }

  .survey-step {
    min-height: auto;
    padding-inline: 0;
  }

  .survey-actions {
    flex-direction: column;
  }

  .survey-button,
  .survey-button--secondary,
  .survey-success__action {
    width: 100%;
  }
}

@media (max-width: 430px) {
  .survey-shell {
    width: calc(100% - 20px);
  }

  .survey-topline h1,
  .survey-success h1 {
    font-size: 2.7rem;
  }

  .survey-step__header h2,
  .survey-lead h3 {
    font-size: 2.25rem;
  }
}
</style>
