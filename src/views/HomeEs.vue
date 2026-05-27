<template>
  <MainLayout>
    <div class="home-page">
      <div
        class="scroll-progress"
        :style="{ transform: `scaleX(${scrollProgress})` }"
      ></div>
      <section class="hero">
        <video
          ref="heroVideo"
          class="hero-media"
          :style="{ transform: `scale(1.06) translateY(${heroParallax}px)` }"
          :autoplay="enableHeroVideo"
          muted
          loop
          playsinline
          preload="metadata"
          poster="/images/Home/home2.jpg"
        >
          <source
            v-if="enableHeroVideo"
            src="/images/Home/home2.mp4"
            type="video/mp4"
          />
        </video>
        <div class="hero-overlay"></div>

        <div class="container hero-grid">
          <div class="hero-copy animate">
            <span class="section-tag">Aviacion privada en Mexico y el mundo</span>
            <h1>Vuelos privados con control ejecutivo de salida a llegada.</h1>
            <div class="hero-benefits">
              <span>Sin filas</span>
              <span>Sin escalas</span>
              <span>Aeropuertos privados</span>
              <span>Atencion personalizada</span>
            </div>
            <p>
              Sky Group coordina aeronave, tripulacion y ruta para ejecutivos,
              familias y viajes donde el tiempo no puede esperar.
            </p>

            <div class="hero-actions">
              <button class="btn-primary" @click="reserva">Cotizar vuelo ahora</button>
              <a
                class="btn-secondary"
                href="https://wa.me/525586186576"
                target="_blank"
                rel="noreferrer"
              >
                Recibir cotizacion en minutos
              </a>
            </div>

            <div class="hero-metrics">
              <article
                v-for="item in heroMetrics"
                :key="item.label"
                class="metric-card"
              >
                <strong>{{ item.value }}</strong>
                <span>{{ item.label }}</span>
              </article>
            </div>
          </div>

          <aside class="hero-panel animate">
            <span class="panel-tag">Resumen Operativo</span>
            <h2>Disenado para clientes que no pueden perder tiempo.</h2>
            <p>
              Seleccion de aeronave, revision de itinerario y seguimiento
              operativo en un flujo claro, discreto y agil.
            </p>

            <div class="panel-list">
              <div
                v-for="item in heroHighlights"
                :key="item.title"
                class="panel-item"
              >
                <span>{{ item.title }}</span>
                <strong>{{ item.description }}</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section class="proof section">
        <div class="container proof-grid">
          <div class="proof-copy animate">
            <span class="section-tag section-tag--dark">Por Que Sky Group</span>
            <h2>Aviacion privada disenada para velocidad, privacidad y certeza.</h2>
            <p>
              Opciones claras, comunicacion directa y disciplina operativa
              desde la primera solicitud hasta el despegue.
            </p>
          </div>

          <div class="proof-cards">
            <article
              v-for="item in proofCards"
              :key="item.title"
              class="proof-card animate"
            >
              <component :is="item.icon" class="proof-icon" />
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="social-proof section">
        <div class="container">
          <div class="section-head section-head--center animate">
            <div>
              <span class="section-tag section-tag--dark">Prueba Social</span>
              <h2>Momentos reales de vuelo con precision ejecutiva.</h2>
              <p class="social-proof-intro">
                Salidas ejecutivas, atencion en tierra y cabinas privadas.
              </p>
            </div>
          </div>

          <div class="social-proof-grid">
            <article
              v-for="item in socialProofGallery"
              :key="item.title"
              class="social-proof-card animate"
            >
              <img :src="item.image" :alt="item.alt" loading="lazy" decoding="async" />
              <div class="social-proof-copy">
                <strong>{{ item.title }}</strong>
                <span>{{ item.description }}</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="trust section">
        <div class="container trust-grid">
          <div class="trust-copy animate">
            <span class="section-tag section-tag--dark">Confianza Operativa</span>
            <h2>Estandares de seguridad y experiencia detras de cada operacion.</h2>
            <p>
              Cada vuelo se gestiona con enfoque en cumplimiento, coordinacion
              calificada y experiencia real en aviacion ejecutiva.
            </p>

            <div class="trust-points">
              <article v-for="item in trustPoints" :key="item.title" class="trust-point">
                <strong>{{ item.title }}</strong>
                <span>{{ item.description }}</span>
              </article>
            </div>
          </div>

          <aside class="trust-badge animate">
            <img :src="trustBadge" alt="Certificacion IS-BAO" loading="lazy" decoding="async" />
            <p>Referencia internacional para operaciones ejecutivas disciplinadas.</p>
          </aside>
        </div>
      </section>

      <section class="inline-cta section">
        <div class="container inline-cta__inner animate">
          <button class="btn-primary inline-cta__button" @click="reserva">Cotizar ahora</button>
        </div>
      </section>

      <section class="about section">
        <div class="container about-grid">
          <div class="about-visual animate">
            <img
              src="/images/Home/home3.jpg"
              alt="Servicio de aviacion privada"
              loading="eager"
              decoding="async"
            />

            <div class="about-badge">
              <span>Expertos En Aviacion Privada</span>
              <strong>Mas de 20 anos construyendo soluciones charter con disciplina operativa.</strong>
            </div>
          </div>

          <div class="about-copy animate">
            <span class="section-tag section-tag--dark">Sobre Sky Group</span>
            <h2>Soporte aeronautico profesional con servicio privado de alto nivel.</h2>
            <p>
              Evita aeropuertos saturados y resuelve vuelos ejecutivos,
              helicopteros y rutas urgentes con atencion directa.
            </p>
            <p>
              Seguridad, claridad comercial y seguimiento personalizado para
              moverte rapido sin sacrificar privacidad ni confianza.
            </p>

            <div class="about-points">
              <div
                v-for="item in aboutPoints"
                :key="item.title"
                class="about-point"
              >
                <strong>{{ item.title }}</strong>
                <span>{{ item.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="fleet section">
        <div class="container">
          <div class="section-head animate">
            <div>
              <span class="section-tag section-tag--dark">Acceso A Flota</span>
              <h2>Aeronaves alineadas con cada mision.</h2>
            </div>

            <RouterLink :to="localizedPath('fleet')" class="btn-tertiary">
              Ver Toda La Flota
            </RouterLink>
          </div>

          <div class="fleet-grid">
            <article
              v-for="item in fleetHighlights"
              :key="item.name"
              class="fleet-card animate"
            >
              <img
                :src="item.image"
                :alt="item.alt"
                loading="lazy"
                decoding="async"
              />
              <div class="fleet-body">
                <span>{{ item.type }}</span>
                <h3>{{ item.name }}</h3>
                <p>{{ item.description }}</p>

                <div class="fleet-meta">
                  <strong>{{ item.capacity }}</strong>
                  <strong>{{ item.range }}</strong>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="how-it-works section">
        <div class="container">
          <div class="section-head section-head--center animate">
            <div>
              <span class="section-tag section-tag--dark">Como Funciona</span>
              <h2>Solicita tu vuelo privado en tres pasos.</h2>
            </div>
          </div>

          <div class="how-it-works-grid">
            <article
              v-for="(item, index) in howItWorksSteps"
              :key="item.title"
              class="how-it-works-card animate"
            >
              <span class="how-it-works-number">0{{ index + 1 }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="inline-cta section">
        <div class="container inline-cta__inner animate">
          <button class="btn-primary inline-cta__button" @click="reserva">Cotizar ahora</button>
        </div>
      </section>

      <section class="process section">
        <div class="container process-grid">
          <div class="process-copy animate animate--instant">
            <span class="section-tag">Cotizacion Ejecutiva</span>
            <h2 class="process-copy-title">
              Cotizacion en minutos, seguimiento humano y ejecucion ejecutiva.
            </h2>
            <p class="process-copy-text">
              Comparte tu ruta y recibe opciones de aeronave, tiempos y
              soporte operativo directo.
            </p>
            <div class="process-copy-actions">
              <button class="btn-primary process-cta" @click="reserva">
                Recibir cotizacion en minutos
              </button>
              <div class="process-note">
                <strong>Respuesta en minutos</strong>
                <span>Atencion comercial y operativa en un solo flujo ejecutivo.</span>
              </div>
            </div>
          </div>

          <div class="process-steps">
            <article
              v-for="(item, index) in processSteps"
              :key="item.title"
              class="process-card animate animate--instant"
            >
              <div class="process-card-top">
                <span class="process-number">0{{ index + 1 }}</span>
                <span class="process-card-kicker">{{ item.kicker }}</span>
              </div>
              <h3 class="process-card-title">{{ item.title }}</h3>
              <p class="process-card-text">{{ item.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="contact-strip animate animate--instant">
        <div class="container contact-strip__inner">
          <div>
            <span class="section-tag">Contacto Directo</span>
            <h2>Necesitas una propuesta de vuelo privado de inmediato?</h2>
            <p>
              Habla directamente con nuestro equipo para rutas urgentes,
              disponibilidad de aeronaves y propuesta ejecutiva.
            </p>
          </div>

          <div class="contact-actions">
            <a class="contact-phone" href="tel:+525586186576">+52 55 8618 6576</a>
            <a
              class="btn-secondary btn-secondary--light"
              href="https://wa.me/525586186576?text=Hola,%20quiero%20solicitar%20una%20cotizacion%20de%20vuelo%20privado."
              target="_blank"
              rel="noreferrer"
            >
              Recibir cotizacion en minutos
            </a>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  Globe,
  Ticket,
  Flag,
  Handshake,
  Zap,
  ShieldCheck,
} from "lucide-vue-next";
import MainLayout from "../layouts/MainLayout.vue";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const router = useRouter();
const { localizedPath } = useLocalizedNavigation();
const heroVideo = ref(null);
const enableHeroVideo = ref(false);
const scrollProgress = ref(0);
const heroParallax = ref(0);
const assetUrl = (path) => `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;
const trustBadge = assetUrl("images/Home/ISBAO.png");

const heroMetrics = [
  { value: "24/7", label: "coordinacion de vuelo" },
  { value: "20+", label: "anos en aviacion" },
  { value: "MX / US", label: "soporte regional" },
];

const heroHighlights = [
  {
    title: "Respuesta rapida",
    description: "Ruta, aeronave y tiempos revisados con rapidez.",
  },
  {
    title: "Atencion discreta",
    description: "Servicio privado para viajes corporativos, personales o urgentes.",
  },
  {
    title: "Ejecucion clara",
    description: "Actualizaciones directas antes, durante y despues del vuelo.",
  },
];

const proofCards = [
  {
    title: "Cobertura global",
    description: "Acceso regional e internacional con un solo punto de contacto.",
    icon: Globe,
  },
  {
    title: "Propuestas claras",
    description: "Opciones alineadas con ruta, horario y perfil de mision.",
    icon: Ticket,
  },
  {
    title: "Flexibilidad aeroportuaria",
    description: "Soporte en rutas, aeropuertos y salidas mas eficientes.",
    icon: Flag,
  },
  {
    title: "Relacion ejecutiva",
    description: "Servicio pensado para viajes corporativos y privados recurrentes.",
    icon: Handshake,
  },
  {
    title: "Activacion inmediata",
    description: "Coordinacion agil para salidas urgentes e itinerarios sensibles.",
    icon: Zap,
  },
  {
    title: "Enfoque en seguridad",
    description: "Tripulaciones calificadas, cumplimiento y ejecucion disciplinada.",
    icon: ShieldCheck,
  },
];

const howItWorksSteps = [
  {
    title: "Solicitas cotizacion",
    description: "Comparte ruta, fecha y pasajeros para activar tu solicitud.",
  },
  {
    title: "Recibes opciones",
    description: "Recibe opciones de aeronave y horario segun tu mision.",
  },
  {
    title: "Confirmas y vuelas",
    description: "Confirma la mejor opcion y despega con coordinacion directa.",
  },
];

const socialProofGallery = [
  {
    image: assetUrl("images/Home/home2.jpg"),
    alt: "Salida de vuelo privado",
    title: "Salidas privadas, menos friccion",
    description: "Acceso mas agil desde instalaciones de aviacion privada.",
  },
  {
    image: assetUrl("images/Home/home3.jpg"),
    alt: "Cabina privada",
    title: "Cabinas para trabajar o descansar",
    description: "Privacidad y confort durante todo el trayecto.",
  },
  {
    image: assetUrl("images/Home/home4.jpg"),
    alt: "Operacion en pista",
    title: "Soporte en tierra siempre cerca",
    description: "Atencion agil para cambios e itinerarios sensibles.",
  },
];

const trustPoints = [
  {
    title: "Seguridad operacional",
    description: "Procesos disenados para elevar la confianza en cada salida.",
  },
  {
    title: "Estandares y cumplimiento",
    description: "Referencias internacionales que respaldan operaciones ejecutivas.",
  },
  {
    title: "Experiencia comprobada",
    description: "Mas de 20 anos coordinando vuelos privados e itinerarios urgentes.",
  },
];

const aboutPoints = [
  {
    title: "Estrategia a la medida",
    description: "Aeronaves recomendadas segun la mision, no soluciones genericas.",
  },
  {
    title: "Servicio privado",
    description: "Atencion rapida con cuidado en agenda, privacidad y preferencias.",
  },
  {
    title: "Consistencia operativa",
    description: "Un proceso claro desde la cotizacion hasta la ejecucion del vuelo.",
  },
];

const fleetHighlights = [
  {
    name: "Learjet 31",
    alt: "Learjet 31",
    type: "Jet Ligero",
    description: "Velocidad y eficiencia para misiones regionales ejecutivas.",
    capacity: "Hasta 8 pasajeros",
    range: "Perfil de alta velocidad",
    image: new URL("../../public/images/Home/165-artguru.png", import.meta.url).href,
  },
  {
    name: "Bell 407",
    alt: "Bell 407",
    type: "Helicoptero",
    description: "Traslados inmediatos, accesos urbanos y movilidad punto a punto.",
    capacity: "Hasta 6 pasajeros",
    range: "Opcion de traslado rapido",
    image: new URL("../../public/images/Home/2004bell407.png", import.meta.url).href,
  },
  {
    name: "Gulfstream G-IV",
    alt: "Gulfstream G-IV",
    type: "Jet De Largo Alcance",
    description: "Confort de cabina y alcance internacional para itinerarios exigentes.",
    capacity: "Hasta 14 pasajeros",
    range: "Misiones de largo alcance",
    image: new URL("../../public/images/Home/389-artguru.png", import.meta.url).href,
  },
];

const processSteps = [
  {
    kicker: "Solicitud inicial",
    title: "Comparte tu ruta",
    description: "Indica salida, destino, fecha, pasajeros y necesidades clave.",
  },
  {
    kicker: "Analisis operativo",
    title: "Recibe una propuesta precisa",
    description: "Evaluamos ruta, tiempos y perfil de vuelo para presentar la mejor opcion.",
  },
  {
    kicker: "Coordinacion final",
    title: "Confirma y activamos la salida",
    description: "Nuestro equipo te acompana hasta dejar la operacion lista.",
  },
];

const reserva = () => {
  router.push(localizedPath("reserva"));
};

let observer;

const handleScrollMotion = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;

  scrollProgress.value = scrollable > 0 ? scrollTop / scrollable : 0;
  heroParallax.value = Math.min(scrollTop * 0.08, 42);
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

  const elements = document.querySelectorAll(".animate");

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
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
  --home-navy: #07111b;
  --home-blue: #113a66;
  --home-gold: #c8a36a;
  --home-text: #152233;
  --home-muted: #627086;
  --home-line: rgba(21, 34, 51, 0.1);
  --home-shadow: 0 30px 80px rgba(7, 17, 27, 0.12);
  --home-shadow-strong: 0 34px 90px rgba(7, 17, 27, 0.2);
  color: var(--home-text);
  background:
    radial-gradient(circle at top left, rgba(200, 163, 106, 0.08), transparent 18%),
    linear-gradient(180deg, #f6f8fb 0%, #ffffff 18%, #f7f9fc 100%);
  overflow-x: clip;
}

.container {
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
}

.section {
  padding: 110px 0;
  scroll-margin-top: 88px;
}

.section:not(.hero) {
  content-visibility: auto;
  contain-intrinsic-size: 900px;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.84);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.section-tag--dark {
  background: rgba(17, 58, 102, 0.07);
  border-color: rgba(17, 58, 102, 0.08);
  color: var(--home-blue);
}

.hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.hero-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(7, 17, 27, 0.88), rgba(7, 17, 27, 0.44)),
    linear-gradient(180deg, rgba(7, 17, 27, 0.16), rgba(7, 17, 27, 0.7));
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 410px);
  gap: 34px;
  align-items: end;
  min-height: 100vh;
  padding-top: 140px;
  padding-bottom: 72px;
}

.hero-copy h1 {
  margin: 1rem 0 1.1rem;
  max-width: 760px;
  color: #fff;
  font-size: clamp(3rem, 6vw, 5.8rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.hero-copy p {
  max-width: 620px;
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.04rem;
  line-height: 1.85;
}

.hero-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0 0 1.4rem;
  max-width: 720px;
}

.hero-benefits span {
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(243, 205, 122, 0.28);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(12px);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary,
.btn-tertiary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  padding: 1.05rem 2rem;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease;
}

.btn-primary {
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #f3cd7a, #c9972f);
  color: #0b1622;
  box-shadow: 0 22px 40px rgba(201, 151, 47, 0.34);
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-tertiary:hover {
  transform: translateY(-2px);
}

.btn-secondary {
  border: 2px solid rgba(243, 205, 122, 0.9);
  background: rgba(7, 22, 36, 0.78);
  color: #fff;
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.28);
}

.btn-secondary--light {
  border-color: rgba(243, 205, 122, 0.92);
  background: rgba(7, 22, 36, 0.9);
}

.btn-tertiary {
  border: 1px solid var(--home-line);
  background: #fff;
  color: var(--home-text);
  box-shadow: var(--home-shadow);
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 2.25rem;
  max-width: 700px;
}

.metric-card {
  padding: 1rem 1.1rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px);
}

.metric-card strong {
  display: block;
  color: #fff;
  font-size: 1.2rem;
  letter-spacing: 0.03em;
}

.metric-card span {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.82rem;
  line-height: 1.5;
}

.hero-panel {
  padding: 28px;
  border-radius: 30px;
  background:
    radial-gradient(circle at top right, rgba(200, 163, 106, 0.18), transparent 26%),
    linear-gradient(180deg, rgba(8, 19, 30, 0.92), rgba(8, 19, 30, 0.82));
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--home-shadow-strong);
  backdrop-filter: blur(18px);
}

.panel-tag {
  color: var(--home-gold);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-panel h2 {
  margin: 0.9rem 0 0.8rem;
  color: #fff;
  font-size: 1.75rem;
  line-height: 1.12;
  letter-spacing: -0.04em;
}

.hero-panel p {
  margin: 0;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.8;
}

.panel-list {
  display: grid;
  gap: 12px;
  margin-top: 1.5rem;
}

.panel-item {
  padding: 1rem 1.05rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.panel-item span {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--home-gold);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.panel-item strong {
  color: #fff;
  font-size: 0.95rem;
  line-height: 1.6;
}

.proof {
  padding: 42px 0 105px;
}

.proof-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 28px;
  align-items: start;
}

.proof-copy h2,
.about-copy h2,
.section-head h2,
.process-copy h2,
.contact-strip h2 {
  margin: 0.9rem 0 1rem;
  color: var(--home-text);
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.03;
  letter-spacing: -0.05em;
}

.proof-copy p,
.about-copy p,
.process-copy p,
.contact-strip p {
  margin: 0;
  color: var(--home-muted);
  line-height: 1.85;
}

.proof-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.proof-card,
.process-card,
.fleet-card {
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--home-line);
  box-shadow: var(--home-shadow);
}

.proof-card {
  padding: 24px;
}

.proof-icon {
  width: 42px;
  height: 42px;
  color: var(--home-blue);
  margin-bottom: 1rem;
}

.proof-card h3,
.fleet-body h3,
.process-card h3 {
  margin: 0 0 0.65rem;
  color: var(--home-text);
  font-size: 1.16rem;
}

.proof-card p,
.fleet-body p,
.process-card p {
  margin: 0;
  color: var(--home-muted);
  line-height: 1.75;
}

.about {
  background:
    radial-gradient(circle at top right, rgba(200, 163, 106, 0.09), transparent 18%),
    linear-gradient(180deg, #ffffff 0%, #f5f8fb 100%);
}

.about-grid,
.process-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 34px;
  align-items: center;
}

.about-visual {
  position: relative;
}

.about-visual img {
  width: 100%;
  height: 620px;
  object-fit: cover;
  border-radius: 30px;
  box-shadow: var(--home-shadow-strong);
}

.about-badge {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
  padding: 1.3rem 1.35rem;
  border-radius: 22px;
  background: rgba(8, 19, 30, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

.about-badge span {
  display: block;
  margin-bottom: 0.55rem;
  color: var(--home-gold);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.about-badge strong {
  color: #fff;
  line-height: 1.6;
}

.about-copy p + p {
  margin-top: 1rem;
}

.about-points {
  display: grid;
  gap: 14px;
  margin-top: 1.8rem;
}

.about-point {
  padding: 1rem 1.1rem;
  border-left: 3px solid var(--home-gold);
  background: rgba(17, 58, 102, 0.04);
  border-radius: 0 18px 18px 0;
}

.about-point strong {
  display: block;
  margin-bottom: 0.3rem;
  color: var(--home-text);
}

.about-point span {
  color: var(--home-muted);
  line-height: 1.7;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 28px;
}

.section-head--center {
  justify-content: center;
  text-align: center;
}

.how-it-works {
  background:
    radial-gradient(circle at top left, rgba(200, 163, 106, 0.12), transparent 20%),
    linear-gradient(180deg, #fcf8f1, #ffffff);
}

.how-it-works-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.how-it-works-card {
  padding: 28px 26px;
  border-radius: 28px;
  background: #fff;
  border: 1px solid rgba(7, 22, 36, 0.08);
  box-shadow: var(--home-shadow);
}

.how-it-works-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  min-height: 52px;
  margin-bottom: 1rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #f3cd7a, #c9972f);
  color: #081321;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.how-it-works-card h3 {
  margin-bottom: 0.7rem;
}

.how-it-works-card p {
  color: var(--home-muted);
  line-height: 1.75;
}

.social-proof {
  background:
    radial-gradient(circle at top right, rgba(200, 163, 106, 0.12), transparent 22%),
    linear-gradient(180deg, #ffffff, #f7f3ec);
}

.social-proof-intro {
  max-width: 760px;
  margin: 0.9rem auto 0;
  color: var(--home-muted);
  line-height: 1.8;
}

.social-proof-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.social-proof-card {
  overflow: hidden;
  border-radius: 28px;
  background: #fff;
  border: 1px solid rgba(7, 22, 36, 0.08);
  box-shadow: var(--home-shadow);
}

.social-proof-card img {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.social-proof-copy {
  display: grid;
  gap: 0.45rem;
  padding: 22px 22px 24px;
}

.social-proof-copy strong {
  color: var(--home-text);
  font-size: 1.02rem;
}

.social-proof-copy span {
  color: var(--home-muted);
  line-height: 1.7;
}

.trust {
  background:
    radial-gradient(circle at top left, rgba(17, 58, 102, 0.08), transparent 20%),
    linear-gradient(180deg, #f8fbff, #ffffff);
}

.trust-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 380px);
  gap: 28px;
  align-items: center;
}

.trust-copy p {
  max-width: 720px;
}

.trust-points {
  display: grid;
  gap: 14px;
  margin-top: 1.8rem;
}

.trust-point {
  padding: 1rem 1.1rem;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(7, 22, 36, 0.08);
  box-shadow: var(--home-shadow);
}

.trust-point strong {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--home-text);
}

.trust-point span {
  color: var(--home-muted);
  line-height: 1.7;
}

.trust-badge {
  padding: 28px;
  border-radius: 30px;
  background: linear-gradient(180deg, #071624, #10283d);
  color: #fff;
  text-align: center;
  box-shadow: var(--home-shadow-strong);
}

.trust-badge img {
  width: min(100%, 220px);
  margin: 0 auto 1.2rem;
  display: block;
  padding: 14px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
}

.trust-badge p {
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
  margin: 0;
}

.inline-cta {
  padding-top: 0;
  padding-bottom: 0;
}

.inline-cta__inner {
  display: flex;
  justify-content: center;
}

.inline-cta__button {
  min-width: min(100%, 320px);
}

.fleet-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.fleet-card {
  overflow: hidden;
}

.fleet-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  background: linear-gradient(180deg, #eef2f7, #f9fbfc);
}

.fleet-body {
  padding: 24px;
}

.fleet-body span {
  display: inline-block;
  margin-bottom: 0.75rem;
  color: var(--home-blue);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.fleet-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
}

.fleet-meta strong {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(17, 58, 102, 0.06);
  color: var(--home-text);
  font-size: 0.8rem;
}

.process {
  background:
    radial-gradient(circle at top right, rgba(200, 163, 106, 0.18), transparent 22%),
    linear-gradient(135deg, #06101a, #0f2945 58%, #143c67);
  color: #fff;
}

.process .section-tag {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
}

.process .btn-primary {
  background: linear-gradient(135deg, var(--home-gold), #e0be8a);
  color: #081321;
  box-shadow: 0 20px 38px rgba(200, 163, 106, 0.22);
}

.process-copy h2,
.process-copy p {
  color: #fff;
}

.process-copy-title {
  color: #fff !important;
}

.process-copy-text {
  color: rgba(255, 255, 255, 0.84) !important;
}

.process-copy p {
  opacity: 0.78;
}

.process-copy-actions {
  display: grid;
  gap: 16px;
  margin-top: 2rem;
  max-width: 520px;
}

.process-note {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1rem 1.1rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.process-note strong {
  color: #fff;
  font-size: 0.95rem;
}

.process-note span {
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.65;
  font-size: 0.9rem;
}

.process-steps {
  display: grid;
  gap: 18px;
}

.process-card {
  padding: 26px 28px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18);
  color: var(--home-text);
}

.process-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 1rem;
}

.process .process-card,
.process .process-card *:not(.process-number) {
  color: var(--home-text) !important;
  opacity: 1 !important;
}

.process .process-card h3 {
  color: var(--home-text) !important;
  opacity: 1 !important;
}

.process .process-card p {
  color: var(--home-muted) !important;
  opacity: 1 !important;
  display: block !important;
  visibility: visible !important;
}

.process .process-number {
  color: #0b1622 !important;
}

.process .btn-primary {
  color: #081321 !important;
  opacity: 1 !important;
}

.process-cta {
  color: #081321 !important;
}

.process-card-title {
  color: var(--home-text) !important;
  margin: 0 0 0.6rem;
  font-size: 1.16rem;
  line-height: 1.3;
}

.process-card-text {
  color: var(--home-muted) !important;
  margin: 0;
  line-height: 1.75;
}

.process-card-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: rgba(17, 58, 102, 0.07);
  color: var(--home-blue) !important;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.process-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 0.95rem;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--home-gold), #e0be8a);
  color: #0b1622;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.contact-strip {
  padding: 40px 0 110px;
}

.contact-strip__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 34px;
  border-radius: 34px;
  background:
    radial-gradient(circle at top right, rgba(200, 163, 106, 0.15), transparent 22%),
    linear-gradient(135deg, #0d2137, #163f6f);
  box-shadow: var(--home-shadow-strong);
}

.contact-strip h2,
.contact-strip p,
.contact-strip .section-tag {
  color: #fff;
}

.contact-actions {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 14px;
}

.contact-phone {
  color: #fff;
  text-decoration: none;
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.animate {
  opacity: 0;
  transform: translateY(42px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.animate.show {
  opacity: 1;
  transform: translateY(0);
}

.animate--instant {
  opacity: 1;
  transform: none;
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 3px;
  transform-origin: left center;
  background: linear-gradient(90deg, var(--home-gold), #f2d28e, var(--home-blue));
  box-shadow: 0 0 18px rgba(200, 163, 106, 0.38);
  pointer-events: none;
}

.section {
  position: relative;
}

.section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: min(1240px, calc(100% - 40px));
  height: 1px;
  transform: translateX(-50%) scaleX(0);
  transform-origin: left center;
  background: linear-gradient(90deg, transparent, rgba(200, 163, 106, 0.52), transparent);
  transition: transform 0.85s ease;
}

.section:has(.show)::before {
  transform: translateX(-50%) scaleX(1);
}

.hero-media {
  will-change: transform;
  transition: transform 0.18s linear;
}

.hero-overlay {
  animation: premiumOverlay 7s ease-in-out infinite alternate;
}

.hero-benefits span,
.panel-item {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}

.hero-copy.show .hero-benefits span,
.hero-panel.show .panel-item {
  animation: benefitReveal 0.45s ease forwards;
}

.hero-copy.show .hero-benefits span:nth-child(1),
.hero-panel.show .panel-item:nth-child(1) {
  animation-delay: 0.12s;
}

.hero-copy.show .hero-benefits span:nth-child(2),
.hero-panel.show .panel-item:nth-child(2) {
  animation-delay: 0.22s;
}

.hero-copy.show .hero-benefits span:nth-child(3),
.hero-panel.show .panel-item:nth-child(3) {
  animation-delay: 0.32s;
}

.hero-copy.show .hero-benefits span:nth-child(4) {
  animation-delay: 0.42s;
}

.hero-copy .section-tag,
.hero-copy h1,
.hero-copy p,
.hero-actions,
.hero-metrics {
  opacity: 0;
  transform: translateY(18px);
}

.hero-copy.show .section-tag,
.hero-copy.show h1,
.hero-copy.show p,
.hero-copy.show .hero-actions,
.hero-copy.show .hero-metrics {
  animation: heroTextReveal 0.62s ease forwards;
}

.hero-copy.show h1 {
  animation-delay: 0.08s;
}

.hero-copy.show p {
  animation-delay: 0.18s;
}

.hero-copy.show .hero-actions {
  animation-delay: 0.28s;
}

.hero-copy.show .hero-metrics {
  animation-delay: 0.38s;
}

.btn-primary,
.btn-secondary,
.btn-tertiary {
  background-size: 220% 100%;
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-tertiary:hover {
  transform: translateY(-2px) scale(1.015);
}

.btn-primary:hover {
  background-position: 100% 50%;
  box-shadow: 0 24px 44px rgba(200, 163, 106, 0.34);
}

.metric-card,
.proof-card,
.process-card,
.fleet-card,
.social-proof-card,
.how-it-works-card,
.trust-point {
  transition:
    transform 0.32s ease,
    box-shadow 0.32s ease,
    border-color 0.32s ease;
}

.metric-card:hover,
.proof-card:hover,
.process-card:hover,
.fleet-card:hover,
.social-proof-card:hover,
.how-it-works-card:hover,
.trust-point:hover {
  transform: translateY(-7px) scale(1.02);
  border-color: rgba(200, 163, 106, 0.42);
  box-shadow: 0 34px 78px rgba(7, 17, 27, 0.18);
}

.metric-card strong {
  position: relative;
}

.metric-card strong::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 34px;
  height: 2px;
  transform: scaleX(0);
  transform-origin: left center;
  background: var(--home-gold);
  transition: transform 0.5s ease;
}

.hero-copy.show .metric-card strong::after {
  transform: scaleX(1);
}

.proof-icon {
  transition: transform 0.3s ease;
}

.proof-card:hover .proof-icon,
.how-it-works-card:hover .how-it-works-number,
.process-card:hover .process-number {
  animation: iconLift 0.34s ease;
}

.animate {
  will-change: opacity, transform;
}

@keyframes premiumOverlay {
  from {
    opacity: 0.86;
  }

  to {
    opacity: 1;
  }
}

@keyframes benefitReveal {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes heroTextReveal {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes iconLift {
  0% {
    transform: translateX(0) scale(1);
  }

  48% {
    transform: translateX(5px) translateY(-3px) scale(1.06);
  }

  100% {
    transform: translateX(0) scale(1);
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

  .hero-benefits span,
  .panel-item,
  .hero-copy .section-tag,
  .hero-copy h1,
  .hero-copy p,
  .hero-actions,
  .hero-metrics {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 1080px) {
  .hero-grid,
  .proof-grid,
  .about-grid,
  .trust-grid,
  .process-grid,
  .fleet-grid,
  .social-proof-grid,
  .how-it-works-grid {
    grid-template-columns: 1fr;
  }

  .section-head,
  .contact-strip__inner {
    align-items: start;
    flex-direction: column;
  }

  .contact-actions {
    align-items: start;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 68px 0;
  }

  .container {
    width: min(100% - 32px, 1240px);
  }

  .hero-grid {
    min-height: auto;
    padding-top: 124px;
    padding-bottom: 44px;
    gap: 24px;
  }

  .hero-copy h1 {
    font-size: 2.55rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary,
  .btn-secondary,
  .btn-tertiary,
  .inline-cta__button {
    width: 100%;
    min-height: 62px;
    padding: 1rem 1.2rem;
    font-size: 0.86rem;
  }

  .hero-benefits {
    gap: 10px;
  }

  .hero-benefits span {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .process-card-top {
    align-items: start;
    flex-direction: column;
  }

  .hero-metrics,
  .proof-cards,
  .social-proof-grid,
  .how-it-works-grid,
  .trust-points {
    grid-template-columns: 1fr;
  }

  .hero-panel,
  .proof-card,
  .process-card,
  .fleet-card,
  .social-proof-card,
  .how-it-works-card,
  .trust-badge,
  .about-visual img,
  .contact-strip__inner {
    border-radius: 24px;
  }

  .about-visual img {
    height: 420px;
  }

  .about-badge {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }

  .fleet-card img,
  .social-proof-card img {
    height: 220px;
  }

  .trust-grid {
    gap: 20px;
  }

  .trust-badge {
    padding: 22px;
  }

  .contact-strip {
    padding: 20px 0 82px;
  }

  .contact-strip__inner {
    padding: 24px;
  }

  .contact-phone {
    font-size: 1.9rem;
  }
}
</style>


