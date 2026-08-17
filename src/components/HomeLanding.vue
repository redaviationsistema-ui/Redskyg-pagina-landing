<template>
  <MainLayout>
    <div class="home-page">
      <div
        class="scroll-progress"
        :style="{ transform: `scaleX(${scrollProgress})` }"
      ></div>

      <section class="hero" aria-labelledby="home-hero-title">
        <div
          class="hero-media-wrap"
          :style="{ transform: `translateY(${heroParallax}px)` }"
        >
          <video
            ref="heroVideo"
            class="hero-media"
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
        </div>
        <div class="hero-overlay"></div>

        <div class="shell hero-shell">
          <div class="hero-copy reveal">
            <span class="eyebrow eyebrow--light">{{ content.hero.eyebrow }}</span>
            <h1 id="home-hero-title" v-html="renderHeroTitle(content.hero.title)"></h1>
            <p>{{ content.hero.description }}</p>
            <div class="hero-benefits" aria-label="Hero benefits">
              <div
                v-for="item in content.hero.benefits"
                :key="item"
                class="hero-benefit"
              >
                <CheckCircle2 aria-hidden="true" />
                <span>{{ item }}</span>
              </div>
            </div>

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

      <div class="section-divider" aria-hidden="true"><i></i><i></i><i></i></div>
      <section class="section fleet-preview">
        <div class="fleet-showcase__background" aria-hidden="true">
          <img
            class="fleet-showcase__backdrop"
            :src="assetUrl(content.fleet.backgroundImage || 'images/Home/FONDO/img fondo.png')"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>

        <div class="shell fleet-grid fleet-showcase__content">
          <div class="fleet-head reveal">
            <div class="fleet-copy">
              <span class="eyebrow">{{ content.fleet.eyebrow }}</span>
              <span class="fleet-emblem" aria-hidden="true"><Plane /></span>
              <h2 v-html="renderFleetTitle(content.fleet.title)"></h2>
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
                :aria-pressed="activeFleetFilter === 'all'"
                @click="activeFleetFilter = 'all'"
              >
                <Plane aria-hidden="true" />
                {{ content.fleet.allLabel || "Todas" }}
              </button>
              <button
                v-for="item in content.fleet.items"
                :key="`filter-${item.name}`"
                class="fleet-filter"
                :class="{ active: activeFleetFilter === item.name }"
                type="button"
                :aria-pressed="activeFleetFilter === item.name"
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
              :style="{ '--fleet-card-delay': `${(content.fleet.items.indexOf(item) + 1) * 80}ms` }"
            >
              <div class="fleet-card-media">
                <img
                  class="fleet-card-media__aircraft"
                  :src="assetUrl(item.image)"
                  :alt="item.alt"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div class="fleet-card-body">
                <div class="fleet-card-heading">
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
              </div>
            </article>
          </div>

          <div
            v-if="content.fleet.benefits?.length"
            class="fleet-benefits reveal"
            :aria-label="content.fleet.benefitsLabel || 'Fleet benefits'"
          >
            <article
              v-for="benefit in content.fleet.benefits"
              :key="benefit.title"
              class="fleet-benefit"
            >
              <span class="fleet-benefit__icon">
                <component :is="fleetBenefitIconFor(benefit.icon)" aria-hidden="true" />
              </span>
              <div>
                <span v-if="benefit.label" class="fleet-benefit__label">{{ benefit.label }}</span>
                <strong>{{ benefit.title }}</strong>
                <p>{{ benefit.description }}</p>
              </div>
            </article>
          </div>

          <div class="fleet-assurance reveal">
            <div class="fleet-assurance__inner">
              <ShieldCheck aria-hidden="true" />
              <div>
                <strong>{{ content.fleet.assurance?.title }}</strong>
                <span>{{ content.fleet.assurance?.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider" aria-hidden="true"><i></i><i></i><i></i></div>
      <section class="section flow" aria-labelledby="flow-title">
        <div class="shell flow-shell">
          <header class="section-copy section-copy--center flow-heading reveal">
            <span class="eyebrow">{{ content.flow.eyebrow }}</span>
            <span class="flow-emblem" aria-hidden="true"><Plane /></span>
            <h2 id="flow-title">{{ content.flow.title }}</h2>
            <p>{{ content.flow.description }}</p>
          </header>

          <div class="flow-steps" role="list">
            <article
              v-for="(item, index) in content.flow.steps"
              :key="item.title"
              class="flow-step reveal"
              :style="{ '--step-delay': `${index * 110}ms` }"
              role="listitem"
            >
              <span class="step-number">0{{ index + 1 }}</span>
              <div class="step-icon" aria-hidden="true">
                <span class="step-icon-orbit"></span>
                <span v-if="index === 0" class="writing-animation">
                  <File class="writing-animation__paper" />
                  <PenLine class="writing-animation__pen" />
                  <i class="writing-animation__stroke"></i>
                </span>
                <span v-else-if="index === 1" class="mail-animation">
                  <Mail class="mail-animation__closed" />
                  <MailOpen class="mail-animation__open" />
                </span>
                <span v-else class="plane-takeoff-animation">
                  <Plane class="plane-takeoff-animation__aircraft" />
                  <i class="plane-takeoff-animation__runway"></i>
                </span>
              </div>
              <div class="step-copy">
                <h3>{{ item.title }}</h3>
                <span class="step-rule" aria-hidden="true"></span>
                <p>{{ item.description }}</p>
              </div>
            </article>
            <div class="flow-connector" aria-hidden="true">
              <span></span><span></span>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider" aria-hidden="true"><i></i><i></i><i></i></div>
      <section class="section narrative">
        <div class="shell narrative-grid">
          <div class="section-copy premium-heading reveal">
            <span class="eyebrow">{{ content.why.eyebrow }}</span>
            <span class="section-emblem" aria-hidden="true"><Plane /></span>
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

      <div class="section-divider" aria-hidden="true"><i></i><i></i><i></i></div>
      <section class="section trust">
        <div class="shell trust-grid trust-grid--copy-only">
          <div class="section-copy premium-heading reveal">
            <span class="eyebrow">{{ content.trust.eyebrow }}</span>
            <span class="section-emblem" aria-hidden="true"><Plane /></span>
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

      <div class="section-divider" aria-hidden="true"><i></i><i></i><i></i></div>
      <section
        class="section experience"
        :class="{ 'experience--video': content.experience.videoUrl || content.experience.video }"
      >
        <div class="experience-media reveal">
          <video
            v-if="content.experience.video"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
          >
            <source :src="assetUrl(content.experience.video)" type="video/mp4" />
          </video>
          <iframe
            v-else-if="content.experience.videoUrl"
            :src="content.experience.videoUrl"
            :title="content.experience.videoTitle || content.experience.title"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowfullscreen
            scrolling="no"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
          <img
            v-else
            :src="assetUrl(content.experience.image)"
            :alt="content.experience.alt"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div class="shell experience-copy premium-heading premium-heading--dark reveal">
          <span class="eyebrow eyebrow--light">{{ content.experience.eyebrow }}</span>
          <span class="section-emblem" aria-hidden="true"><Plane /></span>
          <h2>{{ content.experience.title }}</h2>
          <p>{{ content.experience.description }}</p>
        </div>
      </section>

      <div class="section-divider" aria-hidden="true"><i></i><i></i><i></i></div>
      <section class="section catering" aria-labelledby="catering-title">
        <div class="shell catering-shell">
          <header class="premium-heading catering-heading reveal">
            <span class="eyebrow">{{ content.catering.eyebrow }}</span>
            <span class="section-emblem" aria-hidden="true"><Plane /></span>
            <h2 id="catering-title">{{ content.catering.title }}</h2>
            <p>{{ content.catering.description }}</p>
          </header>

          <div
            class="catering-carousel reveal"
            @mouseenter="stopCateringAutoplay"
            @mouseleave="startCateringAutoplay"
            @focusin="stopCateringAutoplay"
            @focusout="startCateringAutoplay"
          >
            <button
              class="catering-arrow catering-arrow--previous"
              type="button"
              :aria-label="content.catering.previousLabel"
              @click="moveCatering(-1)"
            >
              <ChevronLeft aria-hidden="true" />
            </button>

            <div
              ref="cateringTrack"
              class="catering-track"
              @scroll.passive="syncCateringIndex"
            >
              <figure
                v-for="(image, index) in cateringImages"
                :key="image"
                class="catering-slide"
              >
                <img
                  :src="assetUrl(image)"
                  :alt="`${content.catering.imageAlt} ${index + 1}`"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>

            <button
              class="catering-arrow catering-arrow--next"
              type="button"
              :aria-label="content.catering.nextLabel"
              @click="moveCatering(1)"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>

          <div class="catering-dots" :aria-label="content.catering.paginationLabel">
            <button
              v-for="(_, index) in cateringImages"
              :key="`catering-dot-${index}`"
              type="button"
              :class="{ active: activeCateringIndex === index }"
              :aria-label="`${content.catering.slideLabel} ${index + 1}`"
              :aria-current="activeCateringIndex === index ? 'true' : undefined"
              @click="scrollToCatering(index)"
            ></button>
          </div>
        </div>
      </section>

      <div class="section-divider" aria-hidden="true"><i></i><i></i><i></i></div>
      <HomeVillasSection />

      <div class="section-divider" aria-hidden="true"><i></i><i></i><i></i></div>
      <section class="section survey-entry">
        <div class="shell reveal">
          <SurveyCTA variant="light" source="home" />
        </div>
      </section>

      <div v-if="showLookbooksSection" class="section-divider" aria-hidden="true"><i></i><i></i><i></i></div>
      <LookbooksView v-if="showLookbooksSection" embedded />

      <div class="section-divider" aria-hidden="true"><i></i><i></i><i></i></div>
      <section class="final-cta">
        <div class="shell final-grid reveal">
          <div class="premium-heading premium-heading--dark">
            <span class="eyebrow eyebrow--light">{{ content.cta.eyebrow }}</span>
            <span class="section-emblem" aria-hidden="true"><Plane /></span>
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
          <p v-if="content.cta.supportingText" class="final-support">
            {{ content.cta.supportingText }}
          </p>
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
  ChevronLeft,
  ChevronRight,
  Clock3,
  File,
  Gauge,
  Globe2,
  Handshake,
  Helicopter,
  MapPin,
  MessageCircle,
  Mail,
  MailOpen,
  Plane,
  PlaneTakeoff,
  PenLine,
  Route,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-vue-next";
import MainLayout from "../layouts/MainLayout.vue";
import LookbooksView from "../views/LookbooksView.vue";
import HomeVillasSection from "./HomeVillasSection.vue";
import SurveyCTA from "./SurveyCTA.vue";
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
const cateringTrack = ref(null);
const activeCateringIndex = ref(0);
const cateringImages = [
  ...Array.from(
    { length: 6 },
    (_, index) => `images/Home/CATERIING/${index + 1}.png`,
  ),
  "images/Home/CATERIING/7.jpg",
];
let cateringAutoplay;

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

const fleetBenefitIconMap = {
  coverage: Globe2,
  operations: Clock3,
  secure: ShieldCheck,
  tailored: Handshake,
};

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
const fleetBenefitIconFor = (name) => fleetBenefitIconMap[name] ?? ShieldCheck;
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

const renderHeroTitle = (title = "") => {
  if (title.includes("Vuelo Privado")) {
    return title.replace(
      "Vuelo Privado",
      '<span class="hero-highlight">Vuelo Privado</span>',
    );
  }

  if (title.includes("Private Flights")) {
    return title.replace(
      "Private Flights",
      '<span class="hero-highlight">Private Flights</span>',
    );
  }

  return title;
};

const renderFleetTitle = (title = "") => {
  if (title.includes("who cannot lose time")) {
    return title.replace(
      "who cannot lose time",
      'who<br><span class="fleet-copy__emphasis">cannot lose time</span>',
    );
  }

  if (title.includes("quienes entienden el valor de su tiempo")) {
    return title.replace(
      "quienes entienden el valor de su tiempo",
      'quienes<br><span class="fleet-copy__emphasis">entienden el valor de su tiempo</span>',
    );
  }

  return title;
};

const goToReservation = () => {
  router.push(localizedPath("reserva"));
};

const scrollToCatering = (index, behavior = "smooth") => {
  const track = cateringTrack.value;
  const slides = track?.children;
  if (!track || !slides?.length) return;

  const normalizedIndex = (index + slides.length) % slides.length;
  track.scrollTo({ left: slides[normalizedIndex].offsetLeft, behavior });
  activeCateringIndex.value = normalizedIndex;
};

const moveCatering = (direction) => {
  scrollToCatering(activeCateringIndex.value + direction);
};

const syncCateringIndex = () => {
  const track = cateringTrack.value;
  const slides = Array.from(track?.children || []);
  if (!track || !slides.length) return;

  activeCateringIndex.value = slides.reduce((closest, slide, index) =>
    Math.abs(slide.offsetLeft - track.scrollLeft) <
    Math.abs(slides[closest].offsetLeft - track.scrollLeft)
      ? index
      : closest, 0);
};

const stopCateringAutoplay = () => {
  window.clearInterval(cateringAutoplay);
};

const startCateringAutoplay = () => {
  stopCateringAutoplay();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  cateringAutoplay = window.setInterval(() => moveCatering(1), 4500);
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
  startCateringAutoplay();

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
  stopCateringAutoplay();
  window.removeEventListener("scroll", handleScrollMotion);
});
</script>

<style scoped>
.section-divider {
  position: relative;
  z-index: 8;
  width: min(1540px, calc(100% - 32px));
  height: 34px;
  margin: -17px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 32%;
  box-sizing: border-box;
  pointer-events: none;
}

.section-divider::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a35a 8%, #c9a35a 92%, transparent);
}

.section-divider i {
  position: relative;
  width: 12px;
  height: 12px;
  border: 2px solid #c9a35a;
  border-radius: 50%;
  background: #f8f7f4;
  box-shadow: 0 0 0 3px rgba(201, 163, 90, 0.12);
}

.section-divider i:nth-child(2) {
  display: none;
}

@media (max-width: 640px) {
  .section-divider {
    width: calc(100% - 20px);
    height: 24px;
    margin: -12px auto;
  }

  .section-divider i {
    width: 9px;
    height: 9px;
  }

  .survey-entry {
    padding-top: 62px;
    padding-bottom: 62px;
  }
}

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

.survey-entry {
  padding-top: 82px;
  padding-bottom: 82px;
  background:
    radial-gradient(circle at top left, rgba(208, 172, 103, 0.14), transparent 28%),
    linear-gradient(180deg, rgba(246, 248, 251, 0.85), rgba(255, 255, 255, 1));
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

.hero::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 21%;
  background: linear-gradient(180deg, rgba(7, 22, 36, 0), rgba(7, 22, 36, 0.92));
  pointer-events: none;
  z-index: 1;
}

.hero-media-wrap,
.hero-media,
.hero-overlay {
  position: absolute;
  inset: 0;
}

.hero-media-wrap {
  will-change: transform;
  transition: transform 0.18s linear;
}

.hero-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transform-origin: center center;
  animation: heroVideoZoom 18s ease-in-out infinite alternate;
}

.hero-overlay {
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 48%, rgba(0, 0, 0, 0.4) 100%);
}

.hero-shell {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: end;
  min-height: 96vh;
  padding-top: 156px;
  padding-bottom: 64px;
}

.hero-copy {
  position: relative;
  isolation: isolate;
  max-width: 850px;
  padding: 16px 0 0;
}

.hero-copy::before {
  content: "";
  position: absolute;
  inset: -32px auto -42px -28px;
  width: min(35vw, 540px);
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.3), transparent);
  pointer-events: none;
  z-index: -1;
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
  margin: 0.8rem 0 0.9rem;
  color: #ffffff;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.9rem, 6.1vw, 5.8rem);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.05em;
  text-wrap: balance;
  max-width: 860px;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.hero :deep(.hero-highlight) {
  color: var(--gold);
}

.hero p {
  max-width: 620px;
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  font-size: clamp(0.98rem, 1.45vw, 1.12rem);
  line-height: 1.65;
  text-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
}

.hero-benefits {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 1.1rem;
  white-space: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
}

.hero-benefits::-webkit-scrollbar {
  display: none;
}

.hero-benefit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.hero-benefit svg {
  width: 16px;
  height: 16px;
  color: var(--gold);
  flex: 0 0 auto;
}

.hero-actions,
.final-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.final-support {
  margin: 14px 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-actions {
  margin-top: 1.35rem;
  width: min(940px, 100%);
}

.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 72px;
  flex: 1 1 320px;
  padding: 1.05rem 1.8rem;
  border-radius: 18px;
  border: 1px solid rgba(212, 163, 74, 0.56);
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    transform 250ms ease,
    border-color 250ms ease,
    background 250ms ease,
    box-shadow 250ms ease,
    filter 250ms ease;
}

.action svg,
.text-link svg {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
}

.action--primary {
  cursor: pointer;
  background: linear-gradient(135deg, #d4a34a, #efc66e);
  color: #11161f;
  box-shadow: 0 18px 44px rgba(212, 163, 74, 0.26);
}

.action--ghost {
  color: #11161f;
  background: linear-gradient(135deg, #d4a34a, #efc66e);
  box-shadow: 0 18px 44px rgba(212, 163, 74, 0.26);
}

.action:hover,
.text-link:hover,
.phone-link:hover {
  transform: translateY(-2px);
}

.action:hover {
  filter: brightness(1.04);
  box-shadow: 0 24px 48px rgba(212, 163, 74, 0.34);
}

.hero-brief {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  width: min(760px, 100%);
  margin-top: 12px;
  transform: translateY(-40px);
  padding: 10px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  background: rgba(10, 12, 18, 0.42);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(24px);
}

.brief-item {
  padding: 18px 24px;
}

.brief-item + .brief-item {
  border-left: 1px solid rgba(255, 255, 255, 0.08);
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
  color: rgba(255, 255, 255, 0.78);
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

.premium-heading .eyebrow {
  color: #005a9c;
  letter-spacing: 0.18em;
}

.section-emblem {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 112px;
  margin: 14px 0 24px;
  color: #c79a3b;
}

.section-emblem::before,
.section-emblem::after {
  content: "";
  flex: 1;
  height: 1px;
  background: currentColor;
}

.section-emblem svg {
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
  transform: rotate(-12deg);
}

.premium-heading h2 {
  margin-top: 0;
  color: #071a33;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 500;
}

.premium-heading--dark .eyebrow,
.premium-heading--dark .section-emblem {
  color: #d0ac67;
}

.premium-heading--dark h2 {
  color: #ffffff;
}

.catering {
  position: relative;
  background:
    radial-gradient(circle at 12% 14%, rgba(0, 90, 156, 0.08), transparent 28%),
    linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
  overflow: hidden;
}

.catering-heading {
  max-width: 900px;
  margin: 0 auto 58px;
  text-align: center;
}

.catering-heading .section-emblem {
  margin-inline: auto;
}

.catering-heading h2 {
  margin: 0 auto 22px;
  font-size: clamp(4rem, 5vw, 4.875rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.catering-heading p {
  max-width: 720px;
  margin: 0 auto;
}

.catering-carousel {
  position: relative;
}

.catering-track {
  display: grid;
  grid-auto-columns: calc((100% - 48px) / 3);
  grid-auto-flow: column;
  gap: 24px;
  padding: 14px 4px 34px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.catering-track::-webkit-scrollbar {
  display: none;
}

.catering-slide {
  position: relative;
  margin: 0;
  border: 1px solid rgba(7, 26, 51, 0.08);
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(7, 26, 51, 0.12);
  scroll-snap-align: start;
  overflow: hidden;
}

.catering-slide::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: inherit;
  pointer-events: none;
}

.catering-slide img {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4.35;
  object-fit: cover;
  transition: transform 450ms ease;
}

.catering-arrow {
  position: absolute;
  z-index: 2;
  top: 50%;
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border: 1px solid rgba(199, 154, 59, 0.7);
  border-radius: 50%;
  background: #071a33;
  color: #c79a3b;
  box-shadow: 0 12px 30px rgba(7, 26, 51, 0.2);
  cursor: pointer;
  transform: translateY(-50%);
  transition: transform 250ms ease, background 250ms ease;
}

.catering-arrow svg {
  width: 22px;
  height: 22px;
}

.catering-arrow--previous { left: -24px; }
.catering-arrow--next { right: -24px; }

.catering-dots {
  display: flex;
  justify-content: center;
  gap: 9px;
  margin-top: 8px;
}

.catering-dots button {
  width: 8px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(7, 26, 51, 0.22);
  cursor: pointer;
  transition: width 250ms ease, background 250ms ease;
}

.catering-dots button.active {
  width: 28px;
  background: #c79a3b;
}

@media (hover: hover) and (pointer: fine) {
  .catering-slide:hover img { transform: scale(1.025); }
  .catering-arrow:hover { transform: translateY(-50%) scale(1.07); background: #005a9c; }
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

.experience-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.experience--video {
  min-height: 780px;
  align-items: center;
  background:
    radial-gradient(circle at 78% 45%, rgba(23, 90, 143, 0.34), transparent 28%),
    linear-gradient(135deg, #071624 0%, #0b2137 100%);
}

.experience--video .experience-media {
  inset: 54px max(5vw, calc((100vw - 1200px) / 2)) 54px auto;
  width: min(430px, 38vw);
  border: 1px solid rgba(199, 154, 59, 0.34);
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.38);
  overflow: hidden;
}

.experience--video .experience-media::after {
  display: none;
}

.experience--video .experience-media iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #ffffff;
}

.experience--video .experience-media video {
  display: block;
}

.experience--video .experience-copy {
  width: min(1200px, calc(100% - 40px));
  padding-right: min(48%, 560px);
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
  position: relative;
  padding: clamp(96px, 9vw, 142px) 0;
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  isolation: isolate;
  overflow: hidden;
}

.flow::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.96) 45%, rgba(255, 255, 255, 0.38) 100%);
  pointer-events: none;
}

.flow-shell {
  width: min(1500px, calc(100% - 64px));
}

.section-copy--center {
  text-align: center;
  max-width: 820px;
  margin: 0 auto;
}

.flow-heading {
  max-width: 1050px;
}

.flow-heading .eyebrow {
  color: #005a9c;
  letter-spacing: 0.18em;
}

.flow-emblem {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 112px;
  margin: 14px auto 24px;
  color: #c79a3b;
}

.flow-emblem::before,
.flow-emblem::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #c79a3b;
}

.flow-emblem svg {
  width: 17px;
  height: 17px;
  transform: rotate(-12deg);
}

.flow-heading h2 {
  max-width: 1000px;
  margin: 0 auto 24px;
  color: #071a33;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(4rem, 5vw, 4.875rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.flow-heading p {
  max-width: 720px;
  color: #536176;
}

.section-copy--center p {
  margin: 0 auto;
}

.flow-steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(24px, 2.5vw, 40px);
  margin-top: 70px;
  padding-bottom: 30px;
}

.flow-step {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  min-height: 390px;
  flex-direction: column;
  align-items: center;
  padding: 48px 34px 40px;
  border: 1px solid rgba(7, 26, 51, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 45px rgba(7, 26, 51, 0.1);
  text-align: center;
  overflow: hidden;
  transition: transform 300ms ease, box-shadow 300ms ease;
  transition-delay: var(--step-delay, 0ms);
}

.flow-step::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 106px;
  height: 92px;
  background: #071a33;
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.step-number {
  position: absolute;
  z-index: 1;
  top: 19px;
  left: 18px;
  color: #c79a3b;
  font-size: 0.86rem;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.step-icon {
  position: relative;
  display: grid;
  width: 96px;
  height: 96px;
  place-items: center;
  margin: 13px 0 32px;
  border-radius: 50%;
  background: #071a33;
  color: #c79a3b;
}

.step-icon svg {
  width: 37px;
  height: 37px;
  stroke-width: 1.5;
  transition: transform 300ms ease;
  animation: stepIconFloat 3.2s ease-in-out infinite;
}

.step-icon-orbit {
  position: absolute;
  inset: -9px;
  border: 1px solid transparent;
  border-top-color: #c79a3b;
  border-right-color: #c79a3b;
  border-radius: 50%;
  transform: rotate(24deg);
  animation: stepOrbitRotate 7s linear infinite;
}

.flow-step:nth-child(2) .step-icon svg { animation-delay: -1.05s; }
.flow-step:nth-child(3) .step-icon svg { animation-delay: -2.1s; }
.flow-step:nth-child(2) .step-icon-orbit { animation-delay: -2.3s; }
.flow-step:nth-child(3) .step-icon-orbit { animation-delay: -4.6s; }

.flow-step:first-child .step-icon svg {
  transform-origin: 70% 72%;
  animation: penWriting 2.8s ease-in-out infinite;
}

.writing-animation {
  position: relative;
  display: block;
  width: 48px;
  height: 48px;
}

.step-icon .writing-animation__paper {
  position: absolute;
  inset: 2px auto auto 1px;
  width: 39px;
  height: 43px;
  animation: none !important;
}

.step-icon .writing-animation__pen {
  position: absolute;
  z-index: 2;
  right: -1px;
  bottom: 2px;
  width: 26px;
  height: 26px;
  transform-origin: 85% 85%;
  animation: pencilWrites 2.6s ease-in-out infinite !important;
}

.writing-animation__stroke {
  position: absolute;
  left: 11px;
  bottom: 9px;
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transform-origin: left center;
  animation: writtenStroke 2.6s ease-in-out infinite;
}

.flow-step:nth-child(2) .step-icon .mail-animation {
  position: relative;
  display: block;
  width: 40px;
  height: 40px;
}

.flow-step:nth-child(2) .step-icon .mail-animation svg {
  position: absolute;
  inset: 0;
  width: 40px;
  height: 40px;
  animation-duration: 3.4s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.mail-animation__closed { animation-name: mailClosedState !important; }
.mail-animation__open { animation-name: mailOpenState !important; }

.plane-takeoff-animation {
  position: relative;
  display: block;
  width: 48px;
  height: 42px;
}

.step-icon .plane-takeoff-animation__aircraft {
  position: absolute;
  z-index: 2;
  top: 1px;
  left: 5px;
  width: 34px;
  height: 34px;
  animation: aircraftTakeoff 3.6s cubic-bezier(0.45, 0, 0.25, 1) infinite;
}

.plane-takeoff-animation__runway {
  position: absolute;
  left: 2px;
  right: 2px;
  bottom: 2px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.9;
}

@keyframes stepIconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  45% { transform: translateY(-5px) rotate(-2deg); }
  70% { transform: translateY(-2px) rotate(1deg); }
}

@keyframes stepOrbitRotate {
  from { transform: rotate(24deg); }
  to { transform: rotate(384deg); }
}

@keyframes penWriting {
  0%, 18%, 100% { transform: translate(0, 0) rotate(0deg); }
  28% { transform: translate(3px, -2px) rotate(-4deg); }
  38% { transform: translate(-2px, 2px) rotate(3deg); }
  48% { transform: translate(4px, 1px) rotate(-3deg); }
  58% { transform: translate(-1px, 4px) rotate(4deg); }
  68% { transform: translate(3px, 3px) rotate(-2deg); }
  78% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes pencilWrites {
  0%, 18%, 100% { transform: translate(1px, 1px) rotate(-5deg); }
  32% { transform: translate(-7px, -2px) rotate(-10deg); }
  46% { transform: translate(-1px, 1px) rotate(-4deg); }
  60% { transform: translate(-8px, 3px) rotate(-11deg); }
  74%, 84% { transform: translate(0, 0) rotate(-5deg); }
}

@keyframes writtenStroke {
  0%, 24%, 100% { opacity: 0.25; transform: scaleX(0.08); }
  68%, 84% { opacity: 1; transform: scaleX(1); }
}

@keyframes mailClosedState {
  0%, 28%, 100% { opacity: 1; transform: translateY(0) scale(1); }
  40%, 82% { opacity: 0; transform: translateY(3px) scale(0.9); }
}

@keyframes mailOpenState {
  0%, 28%, 100% { opacity: 0; transform: translateY(4px) scale(0.88); }
  42%, 72% { opacity: 1; transform: translateY(-2px) scale(1.06); }
  82% { opacity: 0; transform: translateY(0) scale(0.96); }
}

@keyframes aircraftTakeoff {
  0%, 14% { opacity: 1; transform: translate(-8px, 7px) rotate(-10deg) scale(0.9); }
  52%, 72% { opacity: 1; transform: translate(8px, -8px) rotate(-18deg) scale(1.03); }
  82% { opacity: 0; transform: translate(16px, -15px) rotate(-18deg) scale(0.96); }
  83% { opacity: 0; transform: translate(-10px, 8px) rotate(-10deg) scale(0.88); }
  100% { opacity: 1; transform: translate(-8px, 7px) rotate(-10deg) scale(0.9); }
}

@media (prefers-reduced-motion: reduce) {
  .step-icon svg,
  .step-icon-orbit,
  .writing-animation__stroke {
    animation: none !important;
  }
}

.step-copy h3 {
  color: #071a33;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.45rem, 1.65vw, 1.8rem);
  font-weight: 500;
}

.step-rule {
  display: block;
  width: 42px;
  height: 2px;
  margin: 17px auto 18px;
  background: #c79a3b;
}

.step-copy p {
  max-width: 320px;
  color: #536176;
}

.flow-connector {
  position: absolute;
  right: 15%;
  bottom: 15px;
  left: 15%;
  height: 1px;
  background: rgba(199, 154, 59, 0.7);
}

.flow-connector span {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #c79a3b;
  box-shadow: 0 0 0 1px #c79a3b;
  transform: translate(-50%, -50%);
}

.flow-connector span:first-child { left: 33.333%; }
.flow-connector span:last-child { left: 66.666%; }

@media (hover: hover) and (pointer: fine) {
  .flow-step:hover {
    transform: translateY(-6px);
    box-shadow: 0 22px 55px rgba(7, 26, 51, 0.15);
  }

  .flow-step:hover .step-icon svg { transform: translateY(-3px) rotate(-2deg); }
}

.fleet-preview {
  position: relative;
  padding-top: clamp(72px, 7vw, 104px);
  padding-bottom: 0;
  overflow: hidden;
  background: #dcecf6;
}

.fleet-preview::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.08) 24%, rgba(255, 255, 255, 0.06) 68%, rgba(234, 243, 249, 0.22) 100%);
  pointer-events: none;
}

.fleet-showcase__background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.fleet-showcase__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  opacity: 1;
  filter: none;
}

.fleet-showcase__content {
  position: relative;
}

.fleet-grid {
  position: relative;
  z-index: 1;
  grid-template-columns: 1fr;
  gap: clamp(28px, 3vw, 42px);
}

.fleet-head {
  display: grid;
  justify-items: center;
  gap: 28px;
  text-align: center;
}

.fleet-copy {
  width: min(100%, 920px);
}

.fleet-copy .eyebrow {
  color: rgba(255, 255, 255, 0.96);
  font-size: 0.86rem;
  letter-spacing: 0.22em;
  text-shadow: 0 2px 18px rgba(7, 26, 51, 0.18);
}

.fleet-emblem {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 112px;
  margin: 14px auto 24px;
  color: #c79a3b;
}

.fleet-emblem::before,
.fleet-emblem::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(199, 154, 59, 0.9);
}

.fleet-emblem svg {
  width: 17px;
  height: 17px;
  transform: rotate(-12deg);
}

.fleet-copy h2 {
  max-width: 920px;
  margin: 0 auto 18px;
  color: #071a33;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(48px, 5vw, 82px);
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.05em;
  text-wrap: balance;
}

.fleet-copy__emphasis {
  color: #2b6db2;
  font-style: italic;
  font-weight: 400;
}

.fleet-copy p {
  max-width: 680px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.96);
  font-size: 1.04rem;
  line-height: 1.48;
  text-wrap: balance;
  text-shadow: 0 2px 18px rgba(7, 26, 51, 0.24);
}

.fleet-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  width: 100%;
}

.fleet-filter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 18px;
  border: 1px solid rgba(43, 109, 178, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: #295f97;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  box-shadow: 0 10px 26px rgba(23, 90, 143, 0.08);
  backdrop-filter: blur(10px);
  transition:
    background 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease,
    color 0.28s ease,
    transform 0.28s ease;
}

.fleet-filter svg {
  width: 15px;
  height: 15px;
}

.fleet-filter:hover,
.fleet-filter.active,
.fleet-filter[aria-pressed="true"] {
  transform: translateY(-2px);
  border-color: rgba(23, 90, 143, 0.38);
  background: #145b96;
  color: #ffffff;
  box-shadow: 0 16px 36px rgba(23, 90, 143, 0.18);
}

.fleet-filter:focus-visible,
.fleet-card-link:focus-visible,
.text-link:focus-visible {
  outline: 2px solid rgba(20, 91, 150, 0.46);
  outline-offset: 3px;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.98);
  font-size: 0.84rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  text-shadow: 0 2px 16px rgba(7, 26, 51, 0.22);
  transition: transform 0.22s ease, color 0.22s ease;
}

.fleet-strip {
  width: min(100%, 1180px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.fleet-card {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 100%;
  flex-direction: column;
  margin: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(20, 47, 76, 0.82) 0%, rgba(5, 24, 45, 0.96) 100%);
  box-shadow: 0 18px 45px rgba(4, 24, 45, 0.22);
  backdrop-filter: blur(14px);
  isolation: isolate;
  overflow: hidden;
  transition:
    border-color 0.32s ease,
    box-shadow 0.32s ease,
    transform 0.32s ease;
  animation: fleetCardAppear 560ms ease both;
  animation-delay: var(--fleet-card-delay, 0ms);
}

.fleet-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 42%);
  opacity: 0.68;
  pointer-events: none;
}

.fleet-card::after {
  content: "";
  position: absolute;
  inset: 1px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: inherit;
  pointer-events: none;
}

.fleet-card-media {
  position: relative;
  display: flex;
  min-height: 190px;
  align-items: center;
  justify-content: center;
  padding: 18px 20px 4px;
}

.fleet-card-media::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(7, 26, 46, 0.08) 100%);
  z-index: 0;
}

.fleet-card-media::after {
  content: "";
  position: absolute;
  right: 14%;
  bottom: 18px;
  left: 14%;
  height: 20px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(8, 20, 36, 0.34) 0%, transparent 72%);
  filter: blur(10px);
  opacity: 0.8;
}

.fleet-card-media__aircraft {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 168px;
  object-fit: contain;
  filter: drop-shadow(0 18px 24px rgba(5, 18, 32, 0.26));
  transform: scale(1);
  transition: transform 0.32s ease, filter 0.32s ease;
}

.fleet-card-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 0 22px 22px;
}

.fleet-card-heading {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.fleet-card-icon {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 999px;
  background: #1d6eb8;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(11, 72, 132, 0.26);
}

.fleet-card-icon svg {
  width: 18px;
  height: 18px;
}

.fleet-card h3 {
  margin: 0;
  color: #ffffff;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.04rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0.04em;
}

.fleet-card p {
  margin: 0.3rem 0 0;
  color: rgba(233, 242, 248, 0.82);
  font-size: 0.84rem;
  line-height: 1.45;
  max-width: 28ch;
}

.fleet-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
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
  width: 15px;
  height: 15px;
  color: #3e8dd3;
}

.fleet-stats dt {
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 900;
  line-height: 1.15;
}

.fleet-stats dd {
  margin: 0;
  color: rgba(219, 230, 238, 0.8);
  font-size: 0.68rem;
  line-height: 1.2;
}

.fleet-card-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 18px;
  color: #4f9ae0;
  font-size: 0.73rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-decoration: none;
  text-transform: uppercase;
}

.fleet-card-link svg {
  width: 15px;
  height: 15px;
}

.fleet-benefits {
  width: min(100%, 1180px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 16px 40px rgba(20, 50, 80, 0.12);
  backdrop-filter: blur(16px);
  overflow: hidden;
}

.fleet-benefit {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  padding: 22px 24px;
}

.fleet-benefit + .fleet-benefit {
  border-left: 1px solid rgba(18, 70, 114, 0.12);
}

.fleet-benefit__icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 50%;
  color: #2f74b4;
  background: rgba(47, 116, 180, 0.08);
}

.fleet-benefit__icon svg {
  width: 24px;
  height: 24px;
}

.fleet-benefit__label {
  display: block;
  margin-bottom: 0.38rem;
  color: #2f74b4;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  line-height: 1.25;
  text-transform: uppercase;
}

.fleet-benefit strong {
  display: block;
  color: #20344f;
  font-size: 1rem;
  line-height: 1.2;
}

.fleet-benefit p {
  margin: 0.28rem 0 0;
  color: #607083;
  font-size: 0.83rem;
  line-height: 1.45;
}

.fleet-assurance {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-top: 6px;
  background: linear-gradient(180deg, #102943 0%, #0a2138 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.fleet-assurance__inner {
  width: min(100% - 40px, 1180px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px 0 22px;
  color: #ffffff;
  text-align: left;
}

.fleet-assurance__inner > svg {
  width: 42px;
  height: 42px;
  color: #2f81ca;
  flex: 0 0 auto;
}

.fleet-assurance strong,
.fleet-assurance span {
  display: block;
}

.fleet-assurance strong {
  font-size: 1rem;
  line-height: 1.3;
}

.fleet-assurance span {
  margin-top: 0.18rem;
  color: rgba(230, 238, 246, 0.78);
  font-size: 0.86rem;
  line-height: 1.45;
}

@media (hover: hover) and (pointer: fine) {
  .fleet-filter:hover {
    transform: translateY(-2px);
  }

  .fleet-card:hover {
    transform: translateY(-6px);
    border-color: rgba(255, 255, 255, 0.28);
    box-shadow: 0 28px 62px rgba(4, 24, 45, 0.3);
  }

  .fleet-card:hover .fleet-card-media__aircraft {
    transform: scale(1.03);
    filter: drop-shadow(0 22px 30px rgba(5, 18, 32, 0.3));
  }

  .fleet-card-link:hover,
  .text-link:hover {
    transform: translateX(4px);
  }
}

.trust {
  background: #ffffff;
}

.trust-grid {
  grid-template-columns: minmax(260px, 420px) minmax(0, 1fr);
}

.trust-grid--copy-only {
  grid-template-columns: minmax(0, 1fr);
  max-width: 980px;
}

.trust-mark {
  display: grid;
  place-items: center;
  min-height: 420px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.trust-mark img {
  width: min(900%, 490px);
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

.flow-step.reveal {
  transition:
    opacity 0.55s ease var(--step-delay, 0ms),
    transform 0.55s ease var(--step-delay, 0ms),
    box-shadow 0.3s ease;
}

.flow-step.reveal.is-visible:hover {
  transition-delay: 0ms;
}

@media (hover: hover) and (pointer: fine) {
  .flow-step.reveal.is-visible:hover {
    transform: translateY(-6px);
    box-shadow: 0 22px 55px rgba(7, 26, 51, 0.15);
  }
}

@keyframes aircraftFly {
  0% {
    transform: translate3d(calc(100vw + 220px), 42px, 0) rotate(-8deg) scale(0.88);
  }

  48% {
    opacity: 0.28;
  }

  100% {
    transform: translate3d(-160px, -96px, 0) rotate(-8deg) scale(1.08);
  }
}

@keyframes flightPathDrift {
  0% {
    transform: translateX(128vw) rotate(-10deg);
  }

  100% {
    transform: translateX(-10vw) rotate(-10deg);
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

@keyframes fleetCardAppear {
  0% {
    opacity: 0;
    transform: translateY(22px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heroVideoZoom {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.05);
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
  .fleet-card,
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

  .flow-shell { width: min(100% - 40px, 1200px); }
  .flow-heading h2 { font-size: clamp(3rem, 5.5vw, 3.625rem); }
  .flow-step { min-height: 370px; padding-inline: 24px; }

  .final-actions {
    justify-content: flex-start;
  }

  .fleet-head {
    grid-template-columns: 1fr;
  }

  .fleet-filters {
    justify-content: center;
    padding-top: 0;
  }

  .fleet-copy h2 { font-size: clamp(3rem, 5.5vw, 3.625rem); }

  .fleet-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fleet-benefits {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fleet-benefit:nth-child(3),
  .fleet-benefit:nth-child(4) {
    border-top: 1px solid rgba(18, 70, 114, 0.12);
  }

  .fleet-benefit:nth-child(3) {
    border-left: 0;
  }

  .fleet-showcase__jet {
    right: -12vw;
    bottom: 18%;
    width: min(42vw, 520px);
    opacity: 0.16;
  }

  .catering-track { grid-auto-columns: calc((100% - 24px) / 2); }
}

@media (max-width: 768px) {
  .shell {
    width: min(100% - 32px, 1200px);
  }

  .section {
    padding: 74px 0;
  }

  .catering-heading {
    margin-bottom: 38px;
  }

  .catering-heading h2 {
    font-size: clamp(2.25rem, 10.5vw, 2.625rem);
    line-height: 1.02;
  }

  .catering-track {
    grid-auto-columns: 86%;
    gap: 16px;
    margin-inline: -16px;
    padding-inline: 16px;
    scroll-padding-inline: 16px;
  }

  .catering-arrow {
    width: 42px;
    height: 42px;
  }

  .catering-arrow--previous { left: -8px; }
  .catering-arrow--next { right: -8px; }

  .premium-heading {
    width: 100%;
    text-align: center;
  }

  .premium-heading .eyebrow {
    display: block;
    line-height: 1.45;
  }

  .premium-heading .section-emblem {
    margin: 14px auto 22px;
  }

  .premium-heading h2,
  .section-copy.premium-heading h2,
  .experience-copy.premium-heading h2,
  .final-cta .premium-heading h2 {
    max-width: 100%;
    margin: 0 auto 18px;
    font-size: clamp(2.25rem, 10.5vw, 2.625rem);
    line-height: 1.02;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }

  .premium-heading > p,
  .experience-copy.premium-heading > p {
    max-width: 36rem;
    margin-inline: auto;
  }

  .narrative-grid,
  .trust-grid,
  .final-grid {
    gap: 34px;
  }

  .fleet-preview {
    padding-top: 78px;
  }

  .fleet-showcase__jet {
    right: -22vw;
    bottom: 22%;
    width: min(60vw, 420px);
    opacity: 0.1;
  }

  .fleet-copy h2 {
    font-size: clamp(2.4rem, 10vw, 3rem);
    line-height: 1.02;
  }

  .fleet-strip {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .fleet-card-media {
    min-height: 170px;
    padding: 18px 18px 2px;
  }

  .fleet-card img {
    height: 150px;
  }

  .fleet-benefits {
    grid-template-columns: 1fr;
  }

  .fleet-benefit,
  .fleet-benefit + .fleet-benefit,
  .fleet-benefit:nth-child(3),
  .fleet-benefit:nth-child(4) {
    border-top: 1px solid rgba(18, 70, 114, 0.12);
    border-left: 0;
  }

  .fleet-benefit:first-child {
    border-top: 0;
  }

  .fleet-assurance__inner {
    width: min(100% - 32px, 1180px);
    align-items: flex-start;
    justify-content: flex-start;
  }

  .flow { padding: 78px 0; }
  .flow::after { background: rgba(250, 251, 252, 0.94); }
  .flow-shell { width: min(100% - 40px, 1200px); }
  .flow-heading h2 { font-size: clamp(2.25rem, 10.5vw, 2.625rem); line-height: 1.02; }
  .flow-steps { grid-template-columns: 1fr; gap: 24px; margin-top: 48px; padding-bottom: 0; }
  .flow-step { min-height: 300px; padding: 34px 24px 28px; }
  .flow-connector { display: none; }

  .experience--video {
    display: flex;
    min-height: auto;
    flex-direction: column-reverse;
    padding: 74px 20px;
  }

  .experience--video .experience-copy {
    width: 100%;
    padding: 0 0 38px;
  }

  .experience--video .experience-media {
    position: relative;
    inset: auto;
    width: min(100%, 430px);
    height: min(680px, 155vw);
    flex: 0 0 auto;
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

  .hero-copy::before {
    inset: -24px -16px -32px -16px;
    width: auto;
  }

  .hero-benefits {
    gap: 14px;
    margin-top: 1rem;
    padding-bottom: 4px;
  }

  .hero-actions,
  .final-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .action,
  .phone-link {
    width: 100%;
    min-height: 40px;
  }

  .action {
    flex: 0 0 auto;
    gap: 8px;
    padding: 0.68rem 0.9rem;
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    border-radius: 12px;
  }

  .action svg {
    width: 15px;
    height: 15px;
  }

  .phone-link {
    justify-content: center;
  }

  .hero-brief {
    grid-template-columns: 1fr;
    margin-top: 26px;
    transform: none;
  }

  .brief-item,
  .brief-item + .brief-item {
    padding: 18px 18px;
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .brief-item:first-child {
    border-top: 0;
  }

  .final-actions .action,
  .final-actions .phone-link {
    min-height: 42px;
  }

  .signal-row,
  .fleet-strip {
    grid-template-columns: 1fr;
  }

  .fleet-filters {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    margin-inline: -16px;
    padding: 0 16px 8px;
    scrollbar-width: none;
  }

  .fleet-copy h2 {
    font-size: clamp(2.25rem, 10.5vw, 2.625rem);
    line-height: 1.02;
  }

  .fleet-emblem,
  .flow-emblem {
    margin-inline: auto;
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

  .fleet-card-body {
    padding: 0 18px 18px;
  }

  .fleet-stats {
    gap: 8px;
  }

  .trust-mark {
    min-height: 260px;
  }

  .trust-lines {
    text-align: left;
  }

  .final-grid {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero-actions,
  .final-actions {
    gap: 6px;
  }

  .hero-actions {
    margin-top: 1.25rem;
  }

  .action,
  .phone-link {
    min-height: 36px;
  }

  .action {
    flex: 0 0 auto;
    gap: 7px;
    padding: 0.58rem 0.8rem;
    font-size: 0.56rem;
    letter-spacing: 0.06em;
    border-radius: 10px;
  }

  .action svg {
    width: 13px;
    height: 13px;
  }
}
</style>
