<template>
  <MainLayout>
    <section class="pricing-hero">
      <img
        class="hero-bg"
        src="/public/images/Pricing/pricing.webp"
        alt="Precios"
      />
      <div class="hero-overlay"></div>

      <div class="hero-content container animate">
        <h1>Precios</h1>
        <p>
          Planeación transparente de charter para vuelos ejecutivos, de placer
          y operaciones críticas.
        </p>
      </div>
    </section>

    <section class="pricing-section animate">
      <div class="container">
        <div class="section-intro">
          <h5 class="subtitle">PRECIOS</h5>
          <h2>Elige tu paquete</h2>
          <p>
            Soluciones flexibles de aviación privada diseñadas según
            frecuencia, nivel de servicio y complejidad operativa.
          </p>
        </div>

        <div class="pricing-grid">
          <div class="pricing-card">
            <h3>Bajo demanda</h3>
            <p class="price">Personalizado <span>/ por viaje</span></p>

            <ul>
              <li>Cabina premium</li>
              <li>Salas lounge</li>
              <li>Baños</li>
              <li>Cocina</li>
              <li>Descanso a bordo</li>
              <li>Espacio para reuniones</li>
              <li>Opciones pet friendly</li>
              <li>Tecnología</li>
            </ul>

            <RouterLink :to="localizedPath('reserva')" class="btn-outline pricing-link">
              Cotizar vuelo ahora
            </RouterLink>
          </div>

          <div class="pricing-card featured animate">
            <div class="recommended">RECOMENDADO</div>
            <h3>Acceso corporativo</h3>
            <p class="price">Prioridad <span>/ plan de servicio</span></p>

            <ul>
              <li>Cabina premium</li>
              <li>Salas lounge</li>
              <li>Baños</li>
              <li>Cocina</li>
              <li>Descanso a bordo</li>
              <li>Espacio para reuniones</li>
              <li>Opciones pet friendly</li>
              <li>Tecnología</li>
            </ul>

            <RouterLink :to="localizedPath('reserva')" class="btn-primary pricing-link">
              Recibir cotización en minutos
            </RouterLink>
          </div>

          <div class="pricing-card animate">
            <h3>Misiones especiales</h3>
            <p class="price">A medida <span>/ operación</span></p>

            <ul>
              <li>Cabina premium</li>
              <li>Salas lounge</li>
              <li>Baños</li>
              <li>Cocina</li>
              <li>Descanso a bordo</li>
              <li>Espacio para reuniones</li>
              <li>Opciones pet friendly</li>
              <li>Tecnología</li>
            </ul>

            <RouterLink :to="localizedPath('reserva')" class="btn-outline pricing-link">
              Cotizar vuelo ahora
            </RouterLink>
          </div>
        </div>

        <div class="pricing-note">
          <strong>Cotización en línea disponible.</strong>
          Inicia tu solicitud en nuestro formulario de vuelo para elegir ruta,
          aeronave, pasajeros y detalles del viaje sin salir del sitio.
        </div>
      </div>
    </section>

    <section class="strong-cta animate">
      <div class="cta-container">
        <h2>¿Listo para volar privado?</h2>
        <p>
          Nuestros asesores están disponibles 24/7 para preparar tu cotización
          personalizada en minutos.
        </p>

        <a
          href="https://wa.me/525586186576?text=Hola,%20quiero%20solicitar%20una%20cotizaci%C3%B3n%20de%20vuelo%20privado"
          target="_blank"
          class="cta-button"
        >
          Recibir cotización en minutos
        </a>
      </div>
    </section>

    <section class="services-section animate">
      <div class="container">
        <div class="section-intro section-intro-light">
          <h5 class="subtitle">ÁREAS DE SERVICIO</h5>
          <h2>Soluciones de aviación privada</h2>
          <p>
            Cada servicio se gestiona con discreción, disciplina operativa y
            acompañamiento personalizado de inicio a fin.
          </p>
        </div>

        <div class="services-grid">
          <div class="service-card animate">
            <img src="/images/Pricing/Pricing2.jpg" alt="Jet charter ejecutivo" />
            <div class="service-overlay">
              <h4>Jet charter ejecutivo</h4>
              <p>
                Vuelos privados ejecutivos para líderes que buscan eficiencia,
                discreción y movilidad global sin fricciones.
              </p>
            </div>
          </div>

          <div class="service-card animate">
            <img src="/images/Pricing/Pricing3.jpg" alt="Vuelos con mascotas" />
            <div class="service-overlay">
              <h4>Vuelos con mascotas</h4>
              <p>
                Soluciones seguras y cómodas para transportar a tus mascotas con
                el mayor nivel de cuidado.
              </p>
            </div>
          </div>

          <div class="service-card animate">
            <img src="/images/Pricing/Pricing4.jpg" alt="Carga aérea" />
            <div class="service-overlay">
              <h4>Carga aérea</h4>
              <p>
                Transporte de carga seguro y sensible al tiempo con entregas
                confiables en destinos nacionales e internacionales.
              </p>
            </div>
          </div>

          <div class="service-card animate">
            <img src="/images/Pricing/Pricing5.jpg" alt="Ambulancia aérea" />
            <div class="service-overlay">
              <h4>Ambulancia aérea</h4>
              <p>
                Transporte médico de respuesta rápida equipado para atención
                crítica y traslados de emergencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-section animate">
      <div class="container">
        <div class="section-intro section-intro-dark">
          <h5 class="subtitle">SERVICIOS</h5>
          <h2>Nuestros servicios de jet charter</h2>
          <p>
            Guía operativa clara para ayudarte a entender cómo se estructura el
            precio en aviación privada.
          </p>
        </div>

        <div class="accordion">
          <div
            class="accordion-item"
            v-for="(item, index) in faqs"
            :key="index"
          >
            <div class="accordion-header" @click="toggle(index)">
              <span>{{ item.title }}</span>
              <span>{{ activeIndex === index ? "-" : "+" }}</span>
            </div>

            <div class="accordion-body" v-if="activeIndex === index">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MainLayout from "../layouts/MainLayout.vue";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const activeIndex = ref(null);
const { localizedPath } = useLocalizedNavigation();

const toggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

const faqs = [
  {
    title: "Costo de adquisición o renta mensual",
    content:
      "Detalles sobre adquisición o pago mensual aplicable a determinados esquemas de servicio aeronáutico.",
  },
  {
    title: "Cuota mensual de administración",
    content: "Información sobre cargos de administración y coordinación operativa.",
  },
  {
    title: "Tarifa variable de combustible",
    content: "La tarifa de combustible puede variar según horas de vuelo, ruta y destino.",
  },
  {
    title: "Sin costos de posicionamiento",
    content: "En paquetes seleccionados no se aplican cargos de reposicionamiento.",
  },
  {
    title: "Sin cargos mínimos de vuelo",
    content: "No manejamos mínimos de horas de vuelo en planes seleccionados.",
  },
];

onMounted(() => {
  const elements = document.querySelectorAll(".animate");

  const observer = new IntersectionObserver(
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
    },
  );

  elements.forEach((el) => observer.observe(el));
});
</script>

<style scoped>
:root {
  --pricing-navy: #071624;
  --pricing-blue: #1d4f91;
  --pricing-gold: #d0ac67;
  --pricing-ink: #142033;
  --pricing-muted: #67778e;
  --pricing-line: rgba(20, 32, 51, 0.1);
  --pricing-shadow: 0 24px 60px rgba(7, 22, 36, 0.12);
  --pricing-shadow-strong: 0 32px 80px rgba(7, 22, 36, 0.2);
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

.pricing-hero {
  min-height: 480px;
  display: flex;
  align-items: center;
  isolation: isolate;
  position: relative;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(7, 22, 36, 0.82), rgba(7, 22, 36, 0.35)),
    linear-gradient(180deg, rgba(7, 22, 36, 0.16), rgba(7, 22, 36, 0.5));
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  text-align: left;
  padding-top: 84px;
}

.hero-content h1 {
  font-size: clamp(3.2rem, 6vw, 5.2rem);
  font-weight: 300;
  letter-spacing: -0.05em;
  line-height: 0.98;
  margin-bottom: 1rem;
  color: #08131f;
}

.hero-content p {
  max-width: 620px;
  margin: 0;
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.82);
}

.section-intro {
  max-width: 760px;
  margin: 0 auto 54px;
  text-align: center;
}

.section-intro p {
  margin: 14px auto 0;
  max-width: 620px;
  color: var(--pricing-muted);
  line-height: 1.8;
}

.section-intro-light h2,
.pricing-section h2 {
  color: #08131f;
}

.section-intro-dark p {
  color: rgba(255, 255, 255, 0.76);
}

.subtitle {
  font-size: 0.76rem;
  letter-spacing: 0.18em;
  color: var(--pricing-gold);
  font-weight: 700;
  text-transform: uppercase;
}

.pricing-section,
.services-section,
.faq-section {
  padding: 110px 0;
}

.pricing-section {
  background:
    radial-gradient(circle at top right, rgba(208, 172, 103, 0.08), transparent 18%),
    linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
}

.pricing-section h2,
.services-section h2,
.faq-section h2,
.strong-cta h2 {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  font-weight: 600;
  letter-spacing: -0.04em;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.pricing-card {
  width: 100%;
  padding: 42px 34px;
  border-radius: 28px;
  border: 1px solid var(--pricing-line);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(245, 249, 255, 0.96));
  box-shadow: var(--pricing-shadow);
  text-align: left;
  transition: all 0.4s ease;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--pricing-shadow-strong);
}

.pricing-card h3 {
  font-size: 1.45rem;
  margin-bottom: 16px;
  color: #08131f;
  letter-spacing: -0.03em;
}

.price {
  font-size: 2.5rem;
  margin-bottom: 28px;
  color: var(--pricing-blue);
}

.price span {
  font-size: 1rem;
  font-weight: 500;
  color: var(--pricing-muted);
}

.pricing-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 30px;
}

.pricing-card ul li {
  margin-bottom: 13px;
  font-size: 0.95rem;
  padding-left: 24px;
  color: var(--pricing-muted);
  line-height: 1.6;
  position: relative;
}

.pricing-card ul li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--pricing-gold);
  font-weight: 700;
}

.pricing-card.featured {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(circle at top right, rgba(208, 172, 103, 0.16), transparent 26%),
    linear-gradient(180deg, #0c1f3d, #132f5f);
  box-shadow: 0 30px 70px rgba(7, 22, 36, 0.28);
}

.pricing-card.featured h3,
.pricing-card.featured .price,
.pricing-card.featured ul li {
  color: #08131f;
}

.pricing-card.featured .price span {
  color: rgba(255, 255, 255, 0.66);
}

.recommended {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(208, 172, 103, 0.96);
  color: #08131f;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 1rem 1.4rem;
  font-size: 0.92rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  letter-spacing: 0.16em;
}

.pricing-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.pricing-note {
  max-width: 840px;
  margin: 26px auto 0;
  padding: 18px 22px;
  border-radius: 20px;
  background: rgba(15, 39, 71, 0.05);
  border: 1px solid rgba(20, 32, 51, 0.08);
  color: var(--pricing-muted);
  line-height: 1.8;
}

.pricing-note strong {
  color: var(--pricing-ink);
}

.btn-outline,
.btn-primary {
  width: 100%;
  min-height: 64px;
  border-radius: 18px;
  font-weight: 800;
  padding: 1rem 1.4rem;
  font-size: 0.92rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.btn-outline {
  border: 2px solid #c9972f;
  background: #071624;
  color: #fff;
  box-shadow: 0 18px 34px rgba(7, 22, 36, 0.18);
}

.btn-outline:hover {
  background: #0d2338;
  color: #fff;
}

.btn-primary {
  background: linear-gradient(135deg, #f3cd7a, #c9972f);
  color: #08131f;
  box-shadow: 0 22px 40px rgba(201, 151, 47, 0.3);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.services-section {
  background: #fff;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin-top: 0;
}

.service-card {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--pricing-shadow);
  transition: all 0.4s ease;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--pricing-shadow-strong);
}

.service-card img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.service-card:hover img {
  transform: scale(1.1);
}

.service-overlay {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 22px;
  padding: 22px 24px;
  border-radius: 20px;
  background: rgba(7, 22, 36, 0.92);
  backdrop-filter: blur(14px);
  color: #fff;
}

.service-overlay h4 {
  font-size: 1.18rem;
  font-weight: 600;
  margin: 0 0 6px;
}

.service-overlay p {
  font-size: 0.88rem;
  line-height: 1.7;
  margin: 0;
}

.strong-cta {
  padding: 100px 20px;
  text-align: center;
  background:
    radial-gradient(circle at top right, rgba(208, 172, 103, 0.18), transparent 24%),
    linear-gradient(135deg, #0b1d3a, #1c3a70);
  color: #fff;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
}

.strong-cta p {
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 40px;
}

.cta-button {
  display: inline-block;
  min-height: 64px;
  border-radius: 18px;
  padding: 18px 34px;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, #f3cd7a, #c9972f);
  color: #08131f;
  text-decoration: none;
  box-shadow: 0 24px 44px rgba(201, 151, 47, 0.34);
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px rgba(201, 151, 47, 0.42);
}

.faq-section {
  background:
    radial-gradient(circle at top right, rgba(208, 172, 103, 0.1), transparent 20%),
    linear-gradient(180deg, #0b1d3a, #071624);
}

.accordion {
  max-width: 900px;
  margin: 0 auto;
}

.accordion-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  margin-bottom: 18px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.accordion-header {
  padding: 24px 28px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  text-align: left;
  color: #08131f;
}

.accordion-body {
  padding: 0 28px 24px 28px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
  text-align: left;
}

.animate {
  opacity: 0;
  transform: translateY(60px);
  transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate.show {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .pricing-card.featured {
    transform: none;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 18px;
  }

  .pricing-hero {
    min-height: 360px;
  }

  .hero-content {
    padding-top: 68px;
  }

  .pricing-section,
  .services-section,
  .faq-section {
    padding: 80px 0;
  }

  .pricing-card,
  .service-card,
  .accordion-item {
    border-radius: 22px;
  }

  .pricing-card {
    padding: 32px 24px;
  }

  .service-card img {
    height: 240px;
  }

  .service-overlay {
    left: 14px;
    right: 14px;
    bottom: 14px;
    padding: 16px 18px;
  }

  .strong-cta {
    padding: 80px 20px;
  }
}
</style>

