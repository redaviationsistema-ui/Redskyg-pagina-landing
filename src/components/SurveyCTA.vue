<template>
  <section
    class="survey-cta"
    :class="[`survey-cta--${variant}`, { 'survey-cta--compact': compact }]"
  >
    <div class="survey-cta__shell">
      <div class="survey-cta__copy">
        <span class="survey-cta__eyebrow">{{ copy.eyebrow }}</span>
        <h2>{{ copy.title }}</h2>
        <p>{{ copy.description }}</p>
        <span class="survey-cta__meta">{{ copy.meta }}</span>
      </div>

      <button class="survey-cta__action" type="button" @click="openSurvey">
        <span>{{ copy.cta }}</span>
        <ArrowRight aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { ArrowRight } from "lucide-vue-next";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const props = defineProps({
  variant: {
    type: String,
    default: "light",
    validator: (value) => ["light", "dark"].includes(value),
  },
  source: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const { locale, localizedPath } = useLocalizedNavigation();

const compact = computed(() => props.variant === "dark");

const copy = computed(() => {
  const translations = {
    "es-mx": {
      eyebrow: "AYÚDANOS A MEJORAR",
      cta: "COMPARTIR MI EXPERIENCIA",
      meta: "Toma menos de 2 minutos.",
      light: {
        title: "¿Cómo debería ser la próxima forma de contratar un vuelo privado?",
        description:
          "Queremos conocer tu experiencia al solicitar, cotizar y reservar vuelos privados. Tu opinión nos ayudará a diseñar una experiencia más simple y eficiente.",
      },
      dark: {
        title:
          "Tu experiencia puede ayudarnos a diseñar una mejor forma de contratar vuelos privados.",
        description:
          "Cuéntanos cómo solicitas tus vuelos hoy y qué te gustaría simplificar.",
      },
    },
    "en-us": {
      eyebrow: "HELP US IMPROVE",
      cta: "SHARE MY EXPERIENCE",
      meta: "It takes less than 2 minutes.",
      light: {
        title: "How should the next way to book a private flight feel?",
        description:
          "We want to understand your experience requesting, quoting and booking private flights. Your feedback will help us design a simpler, more efficient experience.",
      },
      dark: {
        title:
          "Your experience can help us design a better way to arrange private flights.",
        description:
          "Tell us how you request flights today and what you would most like to simplify.",
      },
    },
  };

  const activeLocale =
    translations[locale.value] ? locale.value : "es-mx";
  const localeCopy = translations[activeLocale];
  const variantCopy = localeCopy[props.variant] ?? localeCopy.light;

  return {
    eyebrow: localeCopy.eyebrow,
    cta: localeCopy.cta,
    meta: localeCopy.meta,
    title: variantCopy.title,
    description: variantCopy.description,
  };
});

const openSurvey = () => {
  router.push({
    path: localizedPath("survey"),
    query: {
      source: props.source,
    },
  });
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Manrope:wght@400;500;600;700;800&display=swap");

.survey-cta {
  --survey-paper: #fbf7ef;
  --survey-navy: #071624;
  --survey-gold: #d0ac67;
  --survey-ink: #112133;
  --survey-line: rgba(17, 33, 51, 0.12);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--survey-line);
  background:
    radial-gradient(circle at top right, rgba(208, 172, 103, 0.18), transparent 38%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(251, 247, 239, 0.98));
}

.survey-cta--light {
  border-radius: 28px;
  box-shadow: 0 30px 70px rgba(17, 33, 51, 0.08);
}

.survey-cta--dark {
  --survey-paper: rgba(255, 255, 255, 0.05);
  --survey-ink: #ffffff;
  --survey-line: rgba(255, 255, 255, 0.14);
  background:
    radial-gradient(circle at top right, rgba(208, 172, 103, 0.18), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(16px);
}

.survey-cta__shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 28px;
  align-items: center;
  padding: 42px 48px;
}

.survey-cta--compact .survey-cta__shell {
  padding: 30px 34px;
}

.survey-cta__eyebrow {
  display: inline-flex;
  margin-bottom: 14px;
  color: var(--survey-gold);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.survey-cta h2 {
  margin: 0;
  color: var(--survey-ink);
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2.3rem, 4vw, 4rem);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.04em;
}

.survey-cta--compact h2 {
  max-width: 840px;
  font-size: clamp(2rem, 3.5vw, 3.4rem);
}

.survey-cta p {
  max-width: 760px;
  margin: 1rem 0 0;
  color: color-mix(in srgb, var(--survey-ink) 72%, transparent);
  font-size: 1rem;
  line-height: 1.8;
}

.survey-cta__meta {
  display: inline-flex;
  margin-top: 1rem;
  color: var(--survey-ink);
  font-size: 0.84rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.survey-cta__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 58px;
  padding: 0 24px;
  border: 1px solid transparent;
  background: var(--survey-navy);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    border-color 0.24s ease,
    background 0.24s ease,
    color 0.24s ease;
}

.survey-cta--dark .survey-cta__action {
  background: var(--survey-gold);
  color: var(--survey-navy);
}

.survey-cta__action svg {
  width: 18px;
  height: 18px;
}

.survey-cta__action:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(7, 22, 36, 0.18);
}

@media (max-width: 900px) {
  .survey-cta__shell {
    grid-template-columns: 1fr;
    padding: 34px 28px;
  }

  .survey-cta__action {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .survey-cta {
    border-radius: 22px;
  }

  .survey-cta__shell {
    gap: 22px;
    padding: 28px 22px;
  }

  .survey-cta h2 {
    font-size: 2.5rem;
  }

  .survey-cta p {
    font-size: 0.95rem;
  }
}
</style>
