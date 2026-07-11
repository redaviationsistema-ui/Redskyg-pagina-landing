<template>
  <MainLayout>
    <div class="home-page">
      <div
        class="scroll-progress"
        :style="{ transform: `scaleX(${scrollProgress})` }"
      ></div>

      <section class="hero" aria-labelledby="home-hero-title">
        <video
          ref="heroVideo"
          class="hero-media"
          :style="{ transform: `scale(1.04) translateY(${heroParallax}px)` }"
          :autoplay="enableHeroVideo"
          muted
          loop
          playsinline
          preload="metadata"
          :poster="assetUrl(content.hero.poster)"
        >
          <source
            v-if="enableHeroVideo"
            :src="assetUrl(content.hero.video)"
            type="video/mp4"
          />
        </video>
        <div class="hero-overlay"></div>

        <div class="shell hero-shell">
          <div class="hero-copy reveal">
            <span class="eyebrow eyebrow--light">{{ content.hero.eyebrow }}</span>
            <h1 id="home-hero-title">{{ content.hero.title }}</h1>
            <p>{{ content.hero.description }}</p>

            <div class="hero-actions" aria-label="Primary actions">
              <button class="action action--primary" type="button" @click="goToReservation">
                <PlaneTakeoff aria-hidden="true" />
                <span>{{ content.hero.primaryCta }}</span>
              </button>
              <a
                class="action action--ghost"
                :href="content.whatsapp.href"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle aria-hidden="true" />
                <span>{{ content.hero.secondaryCta }}</span>
              </a>
            </div>
          </div>

          <div class="hero-brief reveal" aria-label="Flight coordination summary">
            <div
              v-for="item in content.hero.metrics"
              :key="item.label"
              class="brief-item"
            >
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="signal-band" aria-label="Core benefits">
        <div class="shell signal-row">
          <div
            v-for="item in content.signals"
            :key="item"
            class="signal-item reveal"
          >
            <CheckCircle2 aria-hidden="true" />
            <span>{{ item }}</span>
          </div>
        </div>
      </section>

      <section class="section fleet-preview">
        <div class="fleet-sky" aria-hidden="true">
          <span class="sky-cloud sky-cloud--one"></span>
          <span class="sky-cloud sky-cloud--two"></span>
          <span class="sky-cloud sky-cloud--three"></span>
          <span class="flight-path flight-path--one"></span>
          <span class="flight-path flight-path--two"></span>
          <span class="flying-aircraft flying-aircraft--one"></span>
          <span class="flying-aircraft flying-aircraft--two"></span>
        </div>

        <div class="shell fleet-grid">
          <div class="fleet-head reveal">
            <div class="fleet-copy">
              <span class="eyebrow">{{ content.fleet.eyebrow }}</span>
              <h2>{{ content.fleet.title }}</h2>
              <p>{{ content.fleet.description }}</p>

              <RouterLink class="text-link" :to="localizedPath('fleet')">
                {{ content.fleet.cta }}
                <ArrowRight aria-hidden="true" />
              </RouterLink>
            </div>

            <div class="fleet-filters" aria-label="Fleet categories">
              <button
                class="fleet-filter"
                :class="{ active: activeFleetFilter === 'all' }"
                type="button"
                @click="activeFleetFilter = 'all'"
              >
                {{ content.fleet.allLabel || "Todas" }}
              </button>
              <button
                v-for="item in content.fleet.items"
                :key="`filter-${item.name}`"
                class="fleet-filter"
                :class="{ active: activeFleetFilter === item.name }"
                type="button"
                @click="activeFleetFilter = item.name"
              >
                <component :is="fleetIconFor(item.icon)" aria-hidden="true" />
                <span>{{ item.name }}</span>
              </button>
            </div>
          </div>

          <div class="fleet-strip reveal">
            <article
              v-for="item in filteredFleetItems"
              :key="item.name"
              class="fleet-card"
            >
              <img
                :src="assetUrl(item.image)"
                :alt="item.alt"
                loading="lazy"
                decoding="async"
              />
              <div class="fleet-card-body">
                <span class="fleet-card-icon">
                  <component :is="fleetIconFor(item.icon)" aria-hidden="true" />
                </span>
                <div>
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.meta }}</p>
                </div>
              </div>

              <dl class="fleet-stats">
                <div v-for="stat in item.stats" :key="stat.label">
                  <component :is="statIconFor(stat.icon)" aria-hidden="true" />
                  <dt>{{ stat.value }}</dt>
                  <dd>{{ stat.label }}</dd>
                </div>
              </dl>

              <RouterLink class="fleet-card-link" :to="fleetRouteFor(item)">
                {{ item.cta || content.fleet.modelCta || "Ver modelos" }}
                <ArrowRight aria-hidden="true" />
              </RouterLink>
            </article>
          </div>

          <div class="fleet-assurance reveal">
            <ShieldCheck aria-hidden="true" />
            <div>
              <strong>{{ content.fleet.assurance?.title }}</strong>
              <span>{{ content.fleet.assurance?.description }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section flow">
        <div class="shell">
          <div class="section-copy section-copy--center reveal">
            <span class="eyebrow">{{ content.flow.eyebrow }}</span>
            <h2>{{ content.flow.title }}</h2>
            <p>{{ content.flow.description }}</p>
          </div>

          <div class="flow-steps">
            <article
              v-for="(item, index) in content.flow.steps"
              :key="item.title"
              class="flow-step reveal"
            >
              <span class="step-number">0{{ index + 1 }}</span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section narrative">
        <div class="shell narrative-grid">
          <div class="section-copy reveal">
            <span class="eyebrow">{{ content.why.eyebrow }}</span>
            <h2>{{ content.why.title }}</h2>
          </div>

          <div class="feature-list">
            <article
              v-for="item in content.why.items"
              :key="item.title"
              class="feature-row reveal"
            >
              <component :is="iconFor(item.icon)" class="feature-icon" aria-hidden="true" />
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="section experience">
        <div class="experience-media reveal">
          <img
            :src="assetUrl(content.experience.image)"
            :alt="content.experience.alt"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div class="shell experience-copy reveal">
          <span class="eyebrow eyebrow--light">{{ content.experience.eyebrow }}</span>
          <h2>{{ content.experience.title }}</h2>
          <p>{{ content.experience.description }}</p>
        </div>
      </section>

      <section class="section trust">
        <div class="shell trust-grid">
          <div class="trust-mark reveal">
            <img
              :src="assetUrl(content.trust.badge)"
              :alt="content.trust.badgeAlt"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div class="section-copy reveal">
            <span class="eyebrow">{{ content.trust.eyebrow }}</span>
            <h2>{{ content.trust.title }}</h2>
            <p>{{ content.trust.description }}</p>

            <div class="trust-lines">
              <div v-for="item in content.trust.items" :key="item">
                <ShieldCheck aria-hidden="true" />
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LookbooksView v-if="showLookbooksSection" embedded />

      <section class="final-cta">
        <div class="shell final-grid reveal">
          <div>
            <span class="eyebrow eyebrow--light">{{ content.cta.eyebrow }}</span>
            <h2>{{ content.cta.title }}</h2>
            <p>{{ content.cta.description }}</p>
          </div>

          <div class="final-actions">
            <button class="action action--primary" type="button" @click="goToReservation">
              <CalendarCheck aria-hidden="true" />
              <span>{{ content.cta.primary }}</span>
            </button>
            <a class="phone-link" :href="content.cta.phoneHref">
              {{ content.cta.phoneLabel }}
            </a>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Gauge,
  Globe2,
  Handshake,
  Helicopter,
  MapPin,
  MessageCircle,
  Plane,
  PlaneTakeoff,
  Route,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-vue-next";
import MainLayout from "../layouts/MainLayout.vue";
import LookbooksView from "../views/LookbooksView.vue";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const { localizedPath } = useLocalizedNavigation();
const heroVideo = ref(null);
const enableHeroVideo = ref(false);
const scrollProgress = ref(0);
const heroParallax = ref(0);
const activeFleetFilter = ref("all");

const iconMap = {
  clock: Clock3,
  globe: Globe2,
  handshake: Handshake,
  route: Route,
  shield: ShieldCheck,
  sparkles: Sparkles,
};

const assetUrl = (path = "") =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

const iconFor = (name) => iconMap[name] ?? Sparkles;

const fleetIconMap = {
  helicopter: Helicopter,
  turboprop: Plane,
  light: Plane,
  mid: Plane,
  super: Plane,
  heavy: Plane,
};

const fleetCategoryQueryMap = {
  helicopter: "helicopter",
  turboprop: "turboprop",
  light: "light-jet",
  mid: "mid-jet",
  super: "super-mid-jet",
  heavy: "heavy-jet",
};

const statIconMap = {
  passengers: UsersRound,
  range: MapPin,
  speed: Gauge,
};

const fleetIconFor = (name) => fleetIconMap[name] ?? Plane;
const statIconFor = (name) => statIconMap[name] ?? Gauge;
const fleetRouteFor = (item) => ({
  path: localizedPath("fleet"),
  query: item?.icon
    ? { category: fleetCategoryQueryMap[item.icon] || item.icon }
    : {},
});

const filteredFleetItems = computed(() => {
  const items = props.content.fleet.items || [];
  if (activeFleetFilter.value === "all") return items;
  return items.filter((item) => item.name === activeFleetFilter.value);
});
const showLookbooksSection = computed(() => props.content.lookbooks?.enabled !== false);

const goToReservation = () => {
  router.push(localizedPath("reserva"));
};

let observer;

const handleScrollMotion = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;

  scrollProgress.value = scrollable > 0 ? scrollTop / scrollable : 0;
  heroParallax.value = Math.min(scrollTop * 0.06, 34);
};

onMounted(() => {
  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const saveData = Boolean(connection?.saveData);
  const slowConnection = ["slow-2g", "2g", "3g"].includes(
    connection?.effectiveType,
  );
  const smallScreen = window.innerWidth < 768;

  enableHeroVideo.value = !(
    prefersReducedMotion ||
    saveData ||
    slowConnection ||
    smallScreen
  );

  if (enableHeroVideo.value && heroVideo.value) {
    heroVideo.value.play().catch(() => {});
  }

  handleScrollMotion();
  window.addEventListener("scroll", handleScrollMotion, { passive: true });

  const elements = document.querySelectorAll(".home-page .reveal");

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
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  elements.forEach((element) => observer.observe(element));
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener("scroll", handleScrollMotion);
});
</script>

<style scoped>
.home-page {
  --ink: #0b1220;
  --navy: #071624;
  --blue: #175a8f;
  --cyan: #2d9cdb;
  --gold: #d0ac67;
  --paper: #f6f8fb;
  --muted: #5d697b;
  --line: rgba(11, 18, 32, 0.12);
  --soft-line: rgba(255, 255, 255, 0.16);
  color: var(--ink);
  background: #ffffff;
  overflow-x: clip;
}

.shell {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
}

.section {
  padding: 108px 0;
  scroll-margin-top: 90px;
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10001;
  width: 100%;
  height: 3px;
  transform-origin: left center;
  background: linear-gradient(90deg, var(--gold), var(--cyan), var(--blue));
  pointer-events: none;
}

.hero {
  position: relative;
  min-height: 96vh;
  overflow: hidden;
  background: var(--navy);
}

.hero-media,
.hero-overlay {
  position: absolute;
  inset: 0;
}

.hero-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  transition: transform 0.18s linear;
}

.hero-overlay {
  background:
    linear-gradient(90deg, rgba(7, 22, 36, 0.4) 0%, rgba(7, 22, 36, 0.4) 54%, rgba(7, 22, 36, 0.4) 90%),
    linear-gradient(180deg, rgba(7, 22, 36, 0.0), rgba(7, 22, 36, 0.0));
}

.hero-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: end;
  min-height: 96vh;
  padding-top: 156px;
  padding-bottom: 64px;
}

.hero-copy {
  max-width: 850px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  color: var(--blue);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.eyebrow--light {
  color: rgba(255, 255, 255, 0.78);
}

.hero h1 {
  margin: 1rem 0 1.1rem;
  color: #ffffff;
  font-size: clamp(3.1rem, 7vw, 6.7rem);
  line-height: 0.94;
  letter-spacing: -0.04em;
  max-width: 960px;
}

.hero p {
  max-width: 680px;
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  line-height: 1.75;
}

.hero-actions,
.final-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-actions {
  margin-top: 2rem;
}

.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 56px;
  padding: 0.95rem 1.25rem;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;
}

.action svg,
.text-link svg {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}

.action--primary {
  cursor: pointer;
  background: #ffffff;
  color: var(--ink);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.24);
}

.action--ghost {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(14px);
}

.action:hover,
.text-link:hover,
.phone-link:hover {
  transform: translateY(-2px);
}

.hero-brief {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  width: min(760px, 100%);
  margin-top: 52px;
  border-top: 1px solid var(--soft-line);
  border-bottom: 1px solid var(--soft-line);
}

.brief-item {
  padding: 20px 24px 20px 0;
}

.brief-item + .brief-item {
  padding-left: 24px;
  border-left: 1px solid var(--soft-line);
}

.brief-item strong {
  display: block;
  color: #ffffff;
  font-size: clamp(1.4rem, 2.7vw, 2rem);
  line-height: 1;
}

.brief-item span {
  display: block;
  margin-top: 0.45rem;
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.88rem;
  line-height: 1.45;
}

.signal-band {
  background: var(--ink);
  color: #ffffff;
}

.signal-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.signal-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 94px;
  padding: 18px 22px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.92rem;
  font-weight: 700;
}

.signal-item svg {
  width: 20px;
  height: 20px;
  color: var(--gold);
  flex: 0 0 auto;
}

.narrative {
  background:
    linear-gradient(180deg, #ffffff 0%, var(--paper) 100%);
}

.narrative-grid,
.fleet-grid,
.trust-grid,
.final-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 64px;
  align-items: center;
}

.section-copy h2,
.experience-copy h2,
.final-cta h2 {
  margin: 0.8rem 0 1rem;
  font-size: clamp(2.25rem, 4.8vw, 4.7rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.section-copy p,
.experience-copy p,
.final-cta p {
  margin: 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.8;
  max-width: 650px;
}

.feature-list {
  border-top: 1px solid var(--line);
}

.feature-row {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  gap: 20px;
  padding: 28px 0;
  border-bottom: 1px solid var(--line);
}

.feature-icon {
  width: 34px;
  height: 34px;
  color: var(--blue);
}

.feature-row h3,
.flow-step h3 {
  margin: 0 0 0.5rem;
  color: var(--ink);
  font-size: 1.16rem;
  line-height: 1.25;
}

.feature-row p,
.flow-step p {
  margin: 0;
  color: var(--muted);
  line-height: 1.75;
}

.experience {
  position: relative;
  min-height: 720px;
  display: grid;
  align-items: end;
  padding: 0;
  overflow: hidden;
  background: var(--navy);
}

.experience-media {
  position: absolute;
  inset: 0;
}

.experience-media::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(7, 22, 36, 0.78), rgba(7, 22, 36, 0.26)),
    linear-gradient(180deg, transparent 35%, rgba(7, 22, 36, 0.86));
}

.experience-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.experience-copy {
  position: relative;
  z-index: 1;
  padding: 130px 0 96px;
  color: #ffffff;
}

.experience-copy h2 {
  max-width: 820px;
}

.experience-copy p,
.final-cta p {
  color: rgba(255, 255, 255, 0.78);
}

.flow {
  background: #ffffff;
}

.section-copy--center {
  text-align: center;
  max-width: 820px;
  margin: 0 auto;
}

.section-copy--center p {
  margin: 0 auto;
}

.flow-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin-top: 54px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.flow-step {
  min-height: 260px;
  padding: 34px 30px;
  border-right: 1px solid var(--line);
}

.flow-step:first-child {
  border-left: 1px solid var(--line);
}

.step-number {
  display: block;
  margin-bottom: 68px;
  color: var(--blue);
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.fleet-preview {
  position: relative;
  background:
    radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.92), transparent 24%),
    radial-gradient(circle at 82% 34%, rgba(45, 156, 219, 0.16), transparent 30%),
    linear-gradient(90deg, rgba(11, 18, 32, 0.028) 1px, transparent 1px),
    linear-gradient(180deg, #f8fcff 0%, #eaf5fc 48%, #dcecf6 100%);
  background-size: 72px 100%, 100% 100%;
  overflow: hidden;
}

.fleet-preview::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(11, 18, 32, 0.14), transparent);
}

.fleet-preview::after {
  content: "";
  position: absolute;
  right: -12vw;
  bottom: -34%;
  width: 48vw;
  height: 48vw;
  background: radial-gradient(circle, rgba(45, 156, 219, 0.18), transparent 66%);
  pointer-events: none;
}

.fleet-sky {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.sky-cloud {
  position: absolute;
  width: 34vw;
  height: 10vw;
  min-width: 300px;
  min-height: 90px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 18% 48%, rgba(255, 255, 255, 0.78) 0 22%, transparent 23%),
    radial-gradient(circle at 38% 38%, rgba(255, 255, 255, 0.72) 0 28%, transparent 29%),
    radial-gradient(circle at 62% 48%, rgba(255, 255, 255, 0.68) 0 24%, transparent 25%),
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.48), transparent);
  filter: blur(16px);
  opacity: 0.55;
  transform: translate3d(-20vw, 0, 0);
  animation: cloudDrift 42s linear infinite;
}

.sky-cloud--one {
  top: 18%;
  left: -18%;
}

.sky-cloud--two {
  top: 48%;
  left: -36%;
  width: 28vw;
  opacity: 0.42;
  animation-duration: 55s;
  animation-delay: -18s;
}

.sky-cloud--three {
  top: 76%;
  left: -24%;
  width: 40vw;
  opacity: 0.36;
  animation-duration: 68s;
  animation-delay: -32s;
}

.flight-path {
  position: absolute;
  left: -18%;
  width: 54vw;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(23, 90, 143, 0.34), transparent);
  opacity: 0.58;
  transform: rotate(-10deg);
  animation: flightPathDrift 13s linear infinite;
}

.flight-path--one {
  top: 36%;
}

.flight-path--two {
  top: 70%;
  width: 42vw;
  opacity: 0.38;
  animation-duration: 17s;
  animation-delay: -8s;
}

.flying-aircraft {
  position: absolute;
  left: -120px;
  width: 82px;
  height: 28px;
  opacity: 0.24;
  filter: blur(0.1px);
  transform: translate3d(-120px, 0, 0) rotate(-8deg);
  animation: aircraftFly 14s linear infinite;
}

.flying-aircraft::before {
  content: "";
  position: absolute;
  inset: 10px 5px 10px 0;
  border-radius: 999px 65% 65% 999px;
  background: linear-gradient(90deg, rgba(11, 18, 32, 0.28), rgba(23, 90, 143, 0.5));
}

.flying-aircraft::after {
  content: "";
  position: absolute;
  left: 26px;
  top: 1px;
  width: 38px;
  height: 26px;
  background: rgba(23, 90, 143, 0.42);
  clip-path: polygon(0 48%, 100% 0, 76% 48%, 100% 100%);
}

.flying-aircraft--one {
  top: 28%;
}

.flying-aircraft--two {
  top: 62%;
  width: 64px;
  opacity: 0.18;
  animation-duration: 19s;
  animation-delay: -13s;
}

.fleet-grid {
  position: relative;
  z-index: 1;
  grid-template-columns: 1fr;
  align-items: start;
  gap: clamp(44px, 5vw, 72px);
}

.fleet-head {
  position: static;
  display: grid;
  grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(28px, 5vw, 72px);
  padding-top: 0;
}

.fleet-copy h2 {
  max-width: 620px;
  margin: 0.55rem 0 0.85rem;
  font-size: clamp(2.25rem, 4.2vw, 4.45rem);
  line-height: 0.96;
  letter-spacing: -0.04em;
}

.fleet-copy p {
  max-width: 470px;
  margin: 0;
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.7;
}

.fleet-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
}

.fleet-filter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 18px;
  border: 1px solid rgba(23, 90, 143, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--blue);
  cursor: pointer;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 10px 26px rgba(23, 90, 143, 0.06);
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    color 0.22s ease,
    transform 0.22s ease;
}

.fleet-filter svg {
  width: 15px;
  height: 15px;
}

.fleet-filter:hover,
.fleet-filter.active {
  transform: translateY(-2px);
  border-color: rgba(23, 90, 143, 0.36);
  background: var(--blue);
  color: #ffffff;
  box-shadow: 0 14px 30px rgba(23, 90, 143, 0.18);
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 1.6rem;
  color: var(--blue);
  font-size: 0.84rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  transition: transform 0.22s ease, color 0.22s ease;
}

.fleet-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  padding-top: 4px;
}

.fleet-card {
  position: relative;
  min-width: 0;
  margin: 0;
  padding: 20px 20px 18px;
  border: 1px solid rgba(23, 90, 143, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 60px rgba(17, 44, 71, 0.08);
  isolation: isolate;
  overflow: hidden;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.fleet-card:hover {
  transform: translateY(-6px);
  border-color: rgba(23, 90, 143, 0.2);
  box-shadow: 0 30px 72px rgba(17, 44, 71, 0.14);
}

.fleet-card img {
  width: 100%;
  aspect-ratio: 16 / 8.8;
  object-fit: contain;
  padding: 0;
  background: transparent;
  border: 0;
  filter: drop-shadow(0 22px 18px rgba(23, 90, 143, 0.18));
  transform: translateY(0) scale(1.08);
  animation: fleetFloat 4.8s ease-in-out infinite;
  transition:
    filter 0.28s ease,
    transform 0.28s ease;
}

.fleet-card:nth-child(2n) img {
  transform: translateY(5px) scale(1.08);
  animation-delay: -1.4s;
}

.fleet-card:nth-child(3n) img {
  transform: translateY(-4px) scale(1.1);
  animation-delay: -2.8s;
}

.fleet-card:nth-child(4n) img {
  animation-delay: -4.2s;
}

.fleet-card:nth-child(5n) img {
  animation-delay: -5.1s;
}

.fleet-card:hover img {
  filter: drop-shadow(0 30px 24px rgba(23, 90, 143, 0.24));
  transform: translateY(-10px) scale(1.16);
  animation-play-state: paused;
}

.fleet-card-body {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  margin-top: 8px;
}

.fleet-card-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--blue);
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(23, 90, 143, 0.22);
}

.fleet-card-icon svg {
  width: 19px;
  height: 19px;
}

.fleet-card h3 {
  margin: 0;
  color: var(--ink);
  font-size: 1.05rem;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.04em;
}

.fleet-card p {
  margin: 0.24rem 0 0;
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.35;
}

.fleet-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 18px 0 0;
}

.fleet-stats div {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  column-gap: 7px;
  align-items: center;
  min-width: 0;
}

.fleet-stats svg {
  grid-row: span 2;
  width: 16px;
  height: 16px;
  color: var(--blue);
}

.fleet-stats dt {
  color: var(--ink);
  font-size: 0.76rem;
  font-weight: 900;
  line-height: 1.1;
}

.fleet-stats dd {
  margin: 0;
  color: var(--muted);
  font-size: 0.66rem;
  line-height: 1.2;
}

.fleet-card-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 18px;
  color: var(--blue);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.fleet-card-link svg {
  width: 15px;
  height: 15px;
}

.fleet-assurance {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 2px;
  color: var(--ink);
  text-align: left;
}

.fleet-assurance > svg {
  width: 44px;
  height: 44px;
  color: var(--blue);
  flex: 0 0 auto;
}

.fleet-assurance strong,
.fleet-assurance span {
  display: block;
}

.fleet-assurance strong {
  font-size: 1rem;
  line-height: 1.25;
}

.fleet-assurance span {
  margin-top: 0.18rem;
  color: var(--muted);
  font-size: 0.84rem;
}

.trust {
  background: #ffffff;
}

.trust-grid {
  grid-template-columns: minmax(260px, 420px) minmax(0, 1fr);
}

.trust-mark {
  display: grid;
  place-items: center;
  min-height: 420px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.trust-mark img {
  width: min(72%, 270px);
  height: auto;
}

.trust-lines {
  display: grid;
  gap: 14px;
  margin-top: 1.8rem;
}

.trust-lines div {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  line-height: 1.6;
}

.trust-lines svg {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  color: var(--blue);
  flex: 0 0 auto;
}

.final-cta {
  padding: 94px 0;
  background:
    linear-gradient(90deg, rgba(7, 22, 36, 0.94), rgba(13, 54, 88, 0.92)),
    url("/images/Home/home18.jpg") center / cover;
  color: #ffffff;
}

.final-grid {
  grid-template-columns: minmax(0, 1fr) auto;
}

.final-cta h2 {
  max-width: 780px;
}

.final-actions {
  justify-content: flex-end;
  align-items: center;
}

.phone-link {
  display: inline-flex;
  align-items: center;
  min-height: 56px;
  color: #ffffff;
  font-weight: 900;
  text-decoration: none;
  transition: transform 0.22s ease, color 0.22s ease;
}

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes aircraftFly {
  0% {
    transform: translate3d(-160px, 42px, 0) rotate(-8deg) scale(0.88);
  }

  48% {
    opacity: 0.28;
  }

  100% {
    transform: translate3d(calc(100vw + 220px), -96px, 0) rotate(-8deg) scale(1.08);
  }
}

@keyframes flightPathDrift {
  0% {
    transform: translateX(-10vw) rotate(-10deg);
  }

  100% {
    transform: translateX(128vw) rotate(-10deg);
  }
}

@keyframes cloudDrift {
  0% {
    transform: translate3d(-22vw, 0, 0);
  }

  100% {
    transform: translate3d(140vw, -18px, 0);
  }
}

@keyframes fleetFloat {
  0%,
  100% {
    translate: -4px 0;
  }

  50% {
    translate: 10px -20px;
  }
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

  .flight-path,
  .flying-aircraft,
  .sky-cloud,
  .fleet-card img {
    animation: none;
  }
}

@media (max-width: 1080px) {
  .signal-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .narrative-grid,
  .fleet-grid,
  .trust-grid,
  .final-grid {
    grid-template-columns: 1fr;
    gap: 38px;
  }

  .flow-steps {
    grid-template-columns: 1fr;
  }

  .flow-step,
  .flow-step:first-child {
    min-height: auto;
    border-left: 1px solid var(--line);
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .step-number {
    margin-bottom: 34px;
  }

  .final-actions {
    justify-content: flex-start;
  }

  .fleet-head {
    grid-template-columns: 1fr;
  }

  .fleet-filters {
    justify-content: flex-start;
    padding-top: 0;
  }

  .fleet-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .shell {
    width: min(100% - 32px, 1200px);
  }

  .section {
    padding: 74px 0;
  }

  .hero {
    min-height: auto;
  }

  .hero-shell {
    min-height: auto;
    padding-top: 128px;
    padding-bottom: 44px;
  }

  .hero h1 {
    font-size: 2.72rem;
    line-height: 1;
  }

  .hero-actions,
  .final-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .action,
  .phone-link {
    width: 100%;
    min-height: 58px;
  }

  .phone-link {
    justify-content: center;
  }

  .hero-brief {
    grid-template-columns: 1fr;
    margin-top: 36px;
  }

  .brief-item,
  .brief-item + .brief-item {
    padding: 18px 0;
    border-left: 0;
    border-top: 1px solid var(--soft-line);
  }

  .brief-item:first-child {
    border-top: 0;
  }

  .signal-row,
  .fleet-strip {
    grid-template-columns: 1fr;
  }

  .fleet-filters {
    overflow-x: auto;
    flex-wrap: nowrap;
    margin-inline: -16px;
    padding: 0 16px 8px;
    scrollbar-width: none;
  }

  .fleet-filters::-webkit-scrollbar {
    display: none;
  }

  .fleet-filter {
    flex: 0 0 auto;
  }

  .signal-item {
    min-height: 74px;
  }

  .feature-row {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .experience {
    min-height: 620px;
  }

  .experience-copy {
    padding: 92px 0 70px;
  }

  .fleet-card {
    padding: 18px;
  }

  .fleet-card img {
    aspect-ratio: 16 / 10;
    padding: 0;
  }

  .fleet-stats {
    gap: 8px;
  }

  .fleet-assurance {
    align-items: flex-start;
    justify-content: flex-start;
  }

  .trust-mark {
    min-height: 260px;
  }
}
</style>
