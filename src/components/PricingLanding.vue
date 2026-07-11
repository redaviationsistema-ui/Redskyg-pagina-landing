<template>
  <MainLayout>
    <div class="pricing-page">
      <section class="pricing-hero">
        <img
          class="pricing-hero__image"
          :src="assetUrl(content.hero.image)"
          :alt="content.hero.alt"
        />
        <div class="pricing-hero__overlay"></div>

        <div class="pricing-shell pricing-hero__content reveal">
          <span class="pricing-eyebrow pricing-eyebrow--light">
            {{ content.hero.eyebrow }}
          </span>
          <h1>{{ content.hero.title }}</h1>
          <p>{{ content.hero.subtitle }}</p>
        </div>
      </section>

      <section class="pricing-section">
        <div class="pricing-shell">
          <div class="section-heading reveal">
            <span class="pricing-eyebrow">{{ content.packages.kicker }}</span>
            <h2>{{ content.packages.title }}</h2>
            <p>{{ content.packages.description }}</p>
          </div>

          <div class="package-table">
            <article
              v-for="plan in content.packages.items"
              :key="plan.name"
              class="package-row reveal"
              :class="{ 'package-row--featured': plan.featured }"
            >
              <div class="package-name">
                <span v-if="plan.badge" class="recommended">{{ plan.badge }}</span>
                <h3>{{ plan.name }}</h3>
                <p>
                  <strong>{{ plan.price }}</strong>
                  <span>{{ plan.period }}</span>
                </p>
              </div>

              <ul class="package-features">
                <li v-for="feature in plan.features" :key="feature">
                  <Check aria-hidden="true" />
                  <span>{{ feature }}</span>
                </li>
              </ul>

              <RouterLink
                :to="localizedPath('reserva')"
                class="package-link"
                :class="{ 'package-link--featured': plan.featured }"
              >
                {{ plan.cta }}
              </RouterLink>
            </article>
          </div>

          <div class="pricing-note reveal">
            <strong>{{ content.packages.noteStrong }}</strong>
            {{ content.packages.note }}
          </div>
        </div>
      </section>

      <section class="quote-band">
        <div class="pricing-shell quote-band__grid reveal">
          <div>
            <span class="pricing-eyebrow pricing-eyebrow--light">
              {{ content.cta.kicker }}
            </span>
            <h2>{{ content.cta.title }}</h2>
            <p>{{ content.cta.description }}</p>
          </div>

          <a
            class="whatsapp-quote"
            :href="content.cta.href"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle aria-hidden="true" />
            <span>{{ content.cta.button }}</span>
          </a>
        </div>
      </section>

      <section class="services-section">
        <div class="pricing-shell">
          <div class="section-heading reveal">
            <span class="pricing-eyebrow">{{ content.services.kicker }}</span>
            <h2>{{ content.services.title }}</h2>
            <p>{{ content.services.description }}</p>
          </div>

          <div class="service-list">
            <article
              v-for="service in content.services.items"
              :key="service.title"
              class="service-row reveal"
            >
              <img
                :src="assetUrl(service.image)"
                :alt="service.alt"
                loading="lazy"
                decoding="async"
              />
              <div>
                <h3>{{ service.title }}</h3>
                <p>{{ service.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="faq-section">
        <div class="pricing-shell faq-grid">
          <div class="section-heading section-heading--left reveal">
            <span class="pricing-eyebrow pricing-eyebrow--light">
              {{ content.faq.kicker }}
            </span>
            <h2>{{ content.faq.title }}</h2>
            <p>{{ content.faq.description }}</p>
          </div>

          <div class="accordion reveal">
            <div
              v-for="(item, index) in content.faq.items"
              :key="item.title"
              class="accordion-item"
            >
              <button
                class="accordion-header"
                type="button"
                :aria-expanded="activeIndex === index"
                @click="toggle(index)"
              >
                <span>{{ item.title }}</span>
                <Plus v-if="activeIndex !== index" aria-hidden="true" />
                <Minus v-else aria-hidden="true" />
              </button>

              <div v-if="activeIndex === index" class="accordion-body">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Check, MessageCircle, Minus, Plus } from "lucide-vue-next";
import MainLayout from "../layouts/MainLayout.vue";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

defineProps({
  content: {
    type: Object,
    required: true,
  },
});

const activeIndex = ref(null);
const { localizedPath } = useLocalizedNavigation();
let observer;

const assetUrl = (path = "") =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

const toggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

onMounted(() => {
  const elements = document.querySelectorAll(".pricing-page .reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -36px 0px",
    },
  );

  elements.forEach((element) => observer.observe(element));
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
.pricing-page {
  --pricing-ink: #07111f;
  --pricing-navy: #071624;
  --pricing-blue: #175a8f;
  --pricing-gold: #d0ac67;
  --pricing-paper: #f5f7fa;
  --pricing-muted: #637086;
  --pricing-line: rgba(7, 17, 31, 0.12);
  color: var(--pricing-ink);
  background: #ffffff;
  overflow-x: clip;
}

.pricing-shell {
  width: min(1220px, calc(100% - 40px));
  margin: 0 auto;
}

.pricing-hero {
  position: relative;
  min-height: 78vh;
  display: flex;
  align-items: end;
  overflow: hidden;
  background: var(--pricing-navy);
}

.pricing-hero__image,
.pricing-hero__overlay {
  position: absolute;
  inset: 0;
}

.pricing-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pricing-hero__overlay {
  background:
    linear-gradient(90deg, rgba(7, 22, 36, 0.00), rgba(7, 22, 36, 0.18)),
    linear-gradient(180deg, rgba(7, 22, 36, 0.08), rgba(7, 22, 36, 0.64));
}

.pricing-hero__content {
  position: relative;
  z-index: 1;
  padding: 154px 0 76px;
  color: #ffffff;
}

.pricing-eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  color: var(--pricing-blue);
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.pricing-eyebrow--light {
  color: rgba(255, 255, 255, 0.78);
}

.pricing-hero h1 {
  max-width: 820px;
  margin: 0.9rem 0 1rem;
  color: #ffffff;
  font-size: clamp(3.2rem, 7vw, 6.8rem);
  line-height: 0.94;
  letter-spacing: -0.04em;
}

.pricing-hero p {
  max-width: 640px;
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.1rem;
  line-height: 1.75;
}

.pricing-section,
.services-section,
.faq-section {
  padding: 104px 0;
}

.pricing-section {
  background:
    linear-gradient(180deg, #ffffff 0%, var(--pricing-paper) 100%);
}

.section-heading {
  max-width: 820px;
  margin: 0 auto 52px;
  text-align: center;
}

.section-heading--left {
  margin: 0;
  text-align: left;
}

.section-heading h2,
.quote-band h2 {
  margin: 0.8rem 0 1rem;
  color: var(--pricing-ink);
  font-size: clamp(2.2rem, 4.8vw, 4.5rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.section-heading p,
.quote-band p {
  max-width: 650px;
  margin: 0 auto;
  color: var(--pricing-muted);
  line-height: 1.8;
}

.section-heading--left p {
  margin-left: 0;
}

.package-table {
  display: grid;
  border-top: 1px solid var(--pricing-line);
}

.package-row {
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.4fr) minmax(190px, 0.5fr);
  gap: 28px;
  align-items: center;
  padding: 34px 0;
  border-bottom: 1px solid var(--pricing-line);
}

.package-row--featured {
  position: relative;
}

.package-name h3 {
  margin: 0 0 0.9rem;
  color: var(--pricing-ink);
  font-size: clamp(1.5rem, 2.8vw, 2.6rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.package-name p {
  margin: 0;
}

.package-name strong {
  display: block;
  color: var(--pricing-blue);
  font-size: 1.25rem;
}

.package-name span {
  color: var(--pricing-muted);
  font-size: 0.92rem;
}

.recommended {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  margin-bottom: 0.9rem;
  padding: 0 10px;
  border-radius: 8px;
  background: rgba(208, 172, 103, 0.18);
  color: #9a6c22;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.package-features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.package-features li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: var(--pricing-muted);
  line-height: 1.55;
}

.package-features svg {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  color: var(--pricing-blue);
  flex: 0 0 auto;
}

.package-link,
.whatsapp-quote {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 54px;
  padding: 0.95rem 1.1rem;
  border-radius: 8px;
  border: 1px solid var(--pricing-line);
  background: #ffffff;
  color: var(--pricing-ink);
  text-decoration: none;
  text-align: center;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition:
    transform 0.22s ease,
    background 0.22s ease,
    color 0.22s ease,
    box-shadow 0.22s ease;
}

.package-link--featured,
.package-link:hover {
  background: var(--pricing-ink);
  color: #ffffff;
}

.package-link:hover,
.whatsapp-quote:hover {
  transform: translateY(-2px);
}

.pricing-note {
  max-width: 860px;
  margin: 28px auto 0;
  padding: 18px 0;
  border-bottom: 1px solid var(--pricing-line);
  color: var(--pricing-muted);
  line-height: 1.8;
  text-align: center;
}

.pricing-note strong {
  color: var(--pricing-ink);
}

.quote-band {
  padding: 92px 0;
  background:
    linear-gradient(90deg, rgba(7, 22, 36, 0.94), rgba(16, 58, 95, 0.88)),
    url("/images/Pricing/Pricing1.jpg") center / cover;
  color: #ffffff;
}

.quote-band__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 32px;
  align-items: center;
}

.quote-band h2 {
  max-width: 760px;
  color: #ffffff;
}

.quote-band p {
  margin-left: 0;
  color: rgba(255, 255, 255, 0.78);
}

.whatsapp-quote {
  border-color: transparent;
  background: #ffffff;
  color: var(--pricing-ink);
  white-space: nowrap;
}

.whatsapp-quote svg {
  width: 18px;
  height: 18px;
}

.services-section {
  background: #ffffff;
}

.service-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--pricing-line);
}

.service-row {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 22px;
  align-items: center;
  padding: 26px 24px 26px 0;
  border-bottom: 1px solid var(--pricing-line);
}

.service-row:nth-child(odd) {
  border-right: 1px solid var(--pricing-line);
}

.service-row:nth-child(even) {
  padding-left: 24px;
}

.service-row img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
}

.service-row h3 {
  margin: 0 0 0.65rem;
  color: var(--pricing-ink);
  font-size: 1.25rem;
  letter-spacing: -0.03em;
}

.service-row p {
  margin: 0;
  color: var(--pricing-muted);
  line-height: 1.7;
}

.faq-section {
  background:
    linear-gradient(180deg, #0b1d3a, #071624);
  color: #ffffff;
}

.faq-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: 56px;
  align-items: start;
}

.faq-section .section-heading h2 {
  color: #ffffff;
}

.faq-section .section-heading p {
  color: rgba(255, 255, 255, 0.74);
}

.accordion {
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.accordion-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}

.accordion-header {
  width: 100%;
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  text-align: left;
  font: inherit;
  font-weight: 800;
}

.accordion-header svg {
  width: 20px;
  height: 20px;
  color: var(--pricing-gold);
  flex: 0 0 auto;
}

.accordion-body {
  padding: 0 0 24px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.75;
}

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.72s ease,
    transform 0.72s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 1080px) {
  .package-row,
  .quote-band__grid,
  .faq-grid {
    grid-template-columns: 1fr;
  }

  .package-link {
    width: max-content;
    max-width: 100%;
  }

  .service-list {
    grid-template-columns: 1fr;
  }

  .service-row,
  .service-row:nth-child(even),
  .service-row:nth-child(odd) {
    padding-left: 0;
    padding-right: 0;
    border-right: 0;
  }
}

@media (max-width: 768px) {
  .pricing-shell {
    width: min(100% - 32px, 1220px);
  }

  .pricing-hero {
    min-height: 68vh;
  }

  .pricing-hero__content {
    padding: 128px 0 54px;
  }

  .pricing-hero h1 {
    font-size: 3rem;
  }

  .pricing-section,
  .services-section,
  .faq-section {
    padding: 74px 0;
  }

  .package-row {
    gap: 22px;
    padding: 28px 0;
  }

  .package-features {
    grid-template-columns: 1fr;
  }

  .package-link,
  .whatsapp-quote {
    width: 100%;
  }

  .quote-band {
    padding: 76px 0;
  }

  .service-row {
    grid-template-columns: 1fr;
  }

  .service-row img {
    aspect-ratio: 16 / 10;
  }
}
</style>
