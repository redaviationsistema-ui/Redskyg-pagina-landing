<template>
  <MainLayout>
    <section class="thankyou">
      <div class="thankyou-card">
        <div class="icon-wrapper">
          &#9992;
        </div>

        <span class="eyebrow">{{ t.eyebrow }}</span>

        <h1>{{ t.title }}{{ guestName ? `, ${guestName}` : "" }}</h1>

        <p class="description">
          {{ t.descriptionLine1 }}
          <br />
          {{ t.descriptionLine2 }}
        </p>

        <div class="divider"></div>

        <RouterLink :to="homePath" class="btn-primary">
          {{ t.returnHome }}
        </RouterLink>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import { getLocalizedPath, normalizeLocale } from "@/i18n/site";

const route = useRoute();

const locale = computed(() => normalizeLocale(route.meta?.locale));

const translations = {
  "es-mx": {
    eyebrow: "Solicitud confirmada",
    title: "Gracias",
    descriptionLine1: "Recibimos correctamente tu solicitud de vuelo ejecutivo.",
    descriptionLine2:
      "Un integrante de nuestro equipo de aviacion se pondra en contacto contigo en breve para afinar los detalles operativos.",
    returnHome: "Volver al inicio",
  },
  "en-us": {
    eyebrow: "Reservation confirmed",
    title: "Thank you",
    descriptionLine1:
      "Your executive flight request has been successfully received.",
    descriptionLine2:
      "A member of our aviation team will contact you shortly to finalize operational details.",
    returnHome: "Return to homepage",
  },
};

const t = computed(() => translations[locale.value] ?? translations["es-mx"]);
const guestName = computed(() => String(route.query.name ?? "").trim());
const homePath = computed(() => getLocalizedPath(locale.value, "home"));
</script>

<style scoped>
.thankyou {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  background:
    linear-gradient(rgba(8, 15, 30, 0.75), rgba(8, 15, 30, 0.85)),
    url("/images/reserva/DSC03873.jpg") center / cover no-repeat;
}

.thankyou-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  max-width: 520px;
  width: 100%;
  padding: 3.5rem 3rem;
  border-radius: 18px;
  text-align: center;
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.55);
  animation: fadeInUp 0.5s ease-out;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  box-shadow: 0 15px 40px rgba(37, 99, 235, 0.4);
}

.eyebrow {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #0f172a;
}

.description {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 2rem;
}

.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  margin: 0 auto 2rem auto;
  border-radius: 4px;
}

.btn-primary {
  display: inline-block;
  text-decoration: none;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: #fff;
  padding: 0.85rem 2rem;
  border-radius: 10px;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
  transition: all 0.25s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 45px rgba(37, 99, 235, 0.35);
}

@media (max-width: 768px) {
  .thankyou-card {
    padding: 2.5rem 1.8rem;
    border-radius: 14px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .description {
    font-size: 0.85rem;
  }

  .btn-primary {
    width: 100%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
