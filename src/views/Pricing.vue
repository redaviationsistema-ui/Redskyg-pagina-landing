<template>
  <MainLayout>
    <!-- HERO -->
    <section class="pricing-hero">
      <img
        class="hero-bg"
        src="/public/images/Pricing/pricing.webp"
        alt="Pricing"
      />
      <div class="hero-overlay"></div>

       <div class="hero-content container animate">
          <h1>Pricing</h1>
        <p>Transparent charter planning for executive, leisure and mission-critical flights.</p>
      </div>
    </section>

    <!-- PACKAGES -->
      <section class="pricing-section animate">
        <div class="container">
        <div class="section-intro">
        <h5 class="subtitle">PRICING</h5>
        <h2>Choose Your Package</h2>
        <p>
          Flexible private aviation solutions designed around frequency, service
          level and operational complexity.
        </p>
        </div>

        <div class="pricing-grid">
          <div class="pricing-card">
            <h3>On Demand</h3>
            <p class="price">Custom <span>/ per trip</span></p>

            <ul>
              <li>✔ First-class</li>
              <li>✔ Lounges</li>
              <li>✔ Bathrooms</li>
              <li>✔ Kitchens</li>
              <li>✔ Bedrooms</li>
              <li>✔ Meetings room</li>
              <li>✔ Pet rooms</li>
              <li>✔ Technology</li>
            </ul>

            <RouterLink :to="localizedPath('reserva')" class="btn-outline pricing-link">
              Request Quote
            </RouterLink>
          </div>

          <div class="pricing-card featured animate">
            <div class="recommended">RECOMMENDED</div>
            <h3>Corporate Access</h3>
            <p class="price">Priority <span>/ service plan</span></p>

            <ul>
              <li>✔ First-class</li>
              <li>✔ Lounges</li>
              <li>✔ Bathrooms</li>
              <li>✔ Kitchens</li>
              <li>✔ Bedrooms</li>
              <li>✔ Meetings room</li>
              <li>✔ Pet rooms</li>
              <li>✔ Technology</li>
            </ul>

            <RouterLink :to="localizedPath('reserva')" class="btn-primary pricing-link">
              Talk to an Advisor
            </RouterLink>
          </div>

         <div class="pricing-card animate">
            <h3>Special Missions</h3>
            <p class="price">Tailored <span>/ operation</span></p>

            <ul>
              <li>✔ First-class</li>
              <li>✔ Lounges</li>
              <li>✔ Bathrooms</li>
              <li>✔ Kitchens</li>
              <li>✔ Bedrooms</li>
              <li>✔ Meetings room</li>
              <li>✔ Pet rooms</li>
              <li>✔ Technology</li>
            </ul>

            <RouterLink :to="localizedPath('reserva')" class="btn-outline pricing-link">
              Plan My Flight
            </RouterLink>
          </div>
        </div>

        <div class="pricing-note">
          <strong>Online quote available.</strong>
          Start your request in our flight form to choose route, aircraft,
          passengers and trip details without leaving the website.
        </div>
      </div>
    </section> 
   <!-- ================= STRONG CTA SECTION ================= -->
    <section class="strong-cta animate">
      <div class="cta-container">
        <h2>Ready to Fly Private?</h2>
        <p>
          Our flight advisors are available 24/7 to prepare your personalized
          private jet quote within minutes.
        </p>

        <a
          href="https://wa.me/525586186576?text=Hello,%20I%20would%20like%20to%20request%20a%20private%20flight%20quote"
          target="_blank"
          class="cta-button"
        >
          Request Your Private Quote on WhatsApp
        </a>
      </div>
    </section>


    <!-- SERVICES -->
    <section class="services-section animate">
      <div class="container">
        <div class="section-intro section-intro-light">
          <h5 class="subtitle">SERVICE AREAS</h5>
          <h2>Private Aviation Solutions</h2>
          <p>
            Every service is managed with discretion, operational discipline and
            personalized support from departure to arrival.
          </p>
        </div>

        <div class="services-grid">
          <!-- Business Jet Charter -->
          <div class="service-card animate">
            <img
              src="/images/Pricing/Pricing2.jpg"
              alt="Business Jet Charter"
            />
            <div class="service-overlay">
              <h4>Business Jet Charter</h4>
              <p>
                Executive private flights tailored for business leaders seeking
                efficiency, discretion, and seamless global mobility.
              </p>
            </div>
          </div>

          <!-- Pet Flights -->
          <div class="service-card animate">
            <img src="/images/Pricing/Pricing3.jpg" alt="Pet Flights" />
            <div class="service-overlay">
              <h4>Pet Flights</h4>
              <p>
                Safe and comfortable private air travel solutions designed to
                transport your pets with the highest level of care.
              </p>
            </div>
          </div>

          <!-- Air Freight & Cargo -->
          <div class="service-card animate">
            <img src="/images/Pricing/Pricing4.jpg" alt="Air Freight & Cargo" />
            <div class="service-overlay">
              <h4>Air Freight & Cargo</h4>
              <p>
                Secure and time-sensitive cargo transport ensuring reliable
                delivery across national and international destinations.
              </p>
            </div>
          </div>

          <!-- Air Ambulance -->
          <div class="service-card animate">
            <img src="/images/Pricing/Pricing5.jpg" alt="Air Ambulance" />
            <div class="service-overlay">
              <h4>Air Ambulance</h4>
              <p>
                Rapid-response medical air transport equipped for critical care
                and emergency patient transfer worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ACCORDION -->
    <section class="faq-section animate">
      <div class="container">
        <div class="section-intro section-intro-dark">
        <h5 class="subtitle">SERVICES</h5>
        <h2>Our Services Jet Charter</h2>
        <p>
          Clear operational guidance to help you understand how private aviation
          pricing is structured.
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
import { ref ,onMounted} from "vue";
import MainLayout from "../layouts/MainLayout.vue";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const activeIndex = ref(null);
const { localizedPath } = useLocalizedNavigation();

const toggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

const faqs = [
  {
    title: "Acquisition Cost/Monthly Lease Payment",
    content:
      "Details about acquisition or monthly lease payment for aircraft services.",
  },
  {
    title: "Monthly Management Fee",
    content: "Information regarding monthly aircraft management fees.",
  },
  {
    title: "Fuel Variable Rate",
    content: "Fuel variable rates depending on flight hours and destination.",
  },
  {
    title: "No Positioning Costs",
    content: "We do not charge repositioning costs in selected packages.",
  },
  {
    title: "No Minimum Flight Charges",
    content: "No minimum flight hour charges for our clients.",
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
    }
  );

  elements.forEach((el) => observer.observe(el));
});
</script>

<style scoped>
/* ================= HERO ================= */

.pricing-hero {
  position: relative;
  height: 420px;
}

.hero-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.4)
  );
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 600;
  letter-spacing: 2px;
}

/* ================= PRICING ================= */

.pricing-section {
  padding: 120px 0;
  background: #f7f8fa;
  text-align: center;
}

.subtitle {
  font-size: 13px;
  letter-spacing: 3px;
  color: #777;
  margin-bottom: 10px;
}

.pricing-section h2 {
  font-size: 38px;
  font-weight: 600;
  margin-bottom: 60px;
}

.pricing-grid {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 40px;
}

/* CARD BASE */

.pricing-card {
  background: #ffffff;
  padding: 60px 40px;
  width: 340px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  position: relative;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
}

.pricing-card h3 {
  font-size: 22px;
  margin-bottom: 25px;
}

.price {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 35px;
}

.price span {
  font-size: 18px;
  font-weight: 400;
  color: #777;
}

.pricing-card ul {
  list-style: none;
  padding: 0;
  margin-bottom: 35px;
  text-align: left;
}

.pricing-card ul li {
  margin-bottom: 12px;
  font-size: 15px;
  position: relative;
  padding-left: 22px;
}

.pricing-card ul li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #0d6efd;
  font-weight: bold;
}

/* FEATURED CARD */

.pricing-card.featured {
  background: #0b1d3a;
  color: white;
  transform: scale(1.08);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.pricing-card.featured ul li::before {
  color: #3fa9ff;
}

.pricing-card.featured .price span {
  color: #ccc;
}

/* RECOMMENDED BADGE */

.recommended {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2f52;
  color: white;
  font-size: 12px;
  padding: 6px 18px;
  border-radius: 20px;
  letter-spacing: 2px;
}

/* BUTTONS */

.btn-outline {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #0b1d3a;
  background: transparent;
  color: #0b1d3a;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn-outline:hover {
  background: #0b1d3a;
  color: white;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(90deg, #007bff, #00aaff);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn-primary:hover {
  transform: scale(1.05);
}

/* ================= SERVICES ================= */
/* ================= SERVICES ================= */

.services-section {
  padding: 140px 0;
  background: linear-gradient(to bottom, #ffffff, #f4f6f9);
  text-align: center;
}

.services-section h2 {
  font-size: 36px;
  margin-bottom: 70px;
  font-weight: 600;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 45px;
  margin-top: 60px;
}

.service-card {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
}

.service-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.service-card:hover img {
  transform: scale(1.1);
}

/* DARK OVERLAY */

.service-overlay {
  position: absolute;
  bottom: 25px;
  left: 25px;
  right: 25px;
  background: #071633;
  padding: 22px 24px;
  border-radius: 12px;
  color: white;
  text-align: left;
  transition: 0.3s ease;
}

.service-overlay h4 {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 500;
}

.service-overlay p {
  margin: 0;
  font-size: 13px;
  opacity: 0.8;
}
/* ================= ACCORDION ================= */
/* ================= ACCORDION ================= */

.faq-section {
  padding: 140px 0;
  background: #0b1d3a;
  text-align: center;
  color: white;
}

.faq-section .subtitle {
  color: #9fb3d9;
}

.faq-section h2 {
  font-size: 36px;
  margin-bottom: 70px;
  font-weight: 600;
}

.accordion {
  max-width: 900px;
  margin: 0 auto;
}

.accordion-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  margin-bottom: 18px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.accordion-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.accordion-header {
  padding: 22px 30px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  font-size: 16px;
  transition: 0.3s;
}

.accordion-header span:last-child {
  font-size: 22px;
  font-weight: 300;
  color: #3fa9ff;
}

.accordion-body {
  padding: 0 30px 25px 30px;
  text-align: left;
  color: #c7d3ec;
  line-height: 1.6;
}
/* ========================= */
/* ====== RESPONSIVE ======= */
/* ========================= */

/* Tablets */
@media (max-width: 1024px) {
  .pricing-grid {
    flex-wrap: wrap;
  }

  .pricing-card {
    width: 100%;
    max-width: 420px;
  }

  .pricing-card.featured {
    transform: scale(1);
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 768px) {
  /* HERO */
  .pricing-hero {
    height: 300px;
  }

  .hero-content h1 {
    font-size: 32px;
  }

  .hero-content p {
    font-size: 14px;
  }

  /* SECTIONS PADDING */
  .pricing-section,
  .services-section,
  .faq-section {
    padding: 80px 20px;
  }

  /* PRICING */
  .pricing-grid {
    flex-direction: column;
    align-items: center;
  }

  .pricing-card {
    width: 100%;
    max-width: 100%;
    padding: 40px 25px;
  }

  .price {
    font-size: 32px;
  }

  /* SERVICES */
  .services-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .service-card img {
    height: 240px;
  }

  .service-overlay {
    left: 15px;
    right: 15px;
    bottom: 15px;
    padding: 18px;
  }

  .service-overlay h4 {
    font-size: 16px;
  }

  .service-overlay p {
    font-size: 12px;
  }

  /* ACCORDION */
  .accordion-header {
    padding: 18px 20px;
    font-size: 14px;
  }

  .accordion-body {
    padding: 0 20px 20px 20px;
    font-size: 14px;
  }
}
/* ================= STRONG CTA ================= */

.strong-cta {
  background: linear-gradient(135deg, #0b1d3a, #1c3a70);
  color: white;
  text-align: center;
  padding: 120px 20px;
  position: relative;
  overflow: hidden;
}

.strong-cta::before {
  content: "";
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08), transparent);
  top: -200px;
  right: -200px;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.strong-cta h2 {
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.strong-cta p {
  font-size: 18px;
  opacity: 0.85;
  margin-bottom: 40px;
  line-height: 1.6;
}

/* BOTÓN PREMIUM */

.cta-button {
  display: inline-block;
  padding: 18px 40px;
  border-radius: 14px;
  text-decoration: none;

  background: linear-gradient(135deg, #25d366, #1ebe57);
  color: white;

  font-weight: 600;
  font-size: 16px;
  letter-spacing: 1px;

  box-shadow: 0 20px 40px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px rgba(37, 211, 102, 0.6);
}

.cta-button:active {
  transform: translateY(0);
}

/* Responsive */

@media (max-width: 768px) {
  .strong-cta {
    padding: 80px 20px;
  }

  .strong-cta h2 {
    font-size: 28px;
  }

  .strong-cta p {
    font-size: 15px;
  }
}

/* ===================================
   GLOBAL REVEAL ANIMATION
=================================== */

.animate {
  opacity: 0;
  transform: translateY(60px);
  transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate.show {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger automático */
.pricing-card:nth-child(1) { transition-delay: 0.1s; }
.pricing-card:nth-child(2) { transition-delay: 0.2s; }
.pricing-card:nth-child(3) { transition-delay: 0.3s; }

.service-card:nth-child(1) { transition-delay: 0.1s; }
.service-card:nth-child(2) { transition-delay: 0.2s; }
.service-card:nth-child(3) { transition-delay: 0.3s; }
.service-card:nth-child(4) { transition-delay: 0.4s; }

.accordion-item:nth-child(1) { transition-delay: 0.1s; }
.accordion-item:nth-child(2) { transition-delay: 0.2s; }
.accordion-item:nth-child(3) { transition-delay: 0.3s; }
.accordion-item:nth-child(4) { transition-delay: 0.4s; }
.accordion-item:nth-child(5) { transition-delay: 0.5s; }

/* HERO special animation */
.hero-content h1 {
  animation: heroFade 1.2s ease forwards;
  opacity: 0;
}

@keyframes heroFade {
  from {
    opacity: 0;
    transform: translateY(40px);
    letter-spacing: 5px;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    letter-spacing: 2px;
  }
}

/* ================= PREMIUM OVERRIDES ================= */

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
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-overlay {
  background:
    linear-gradient(90deg, rgba(7, 22, 36, 0.82), rgba(7, 22, 36, 0.35)),
    linear-gradient(180deg, rgba(7, 22, 36, 0.16), rgba(7, 22, 36, 0.5));
}

.hero-content {
  position: relative;
  top: auto;
  left: auto;
  transform: none;
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
  color: var(--pricing-ink);
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
}

.pricing-card:hover {
  box-shadow: var(--pricing-shadow-strong);
}

.pricing-card h3 {
  font-size: 1.45rem;
  margin-bottom: 16px;
  color: var(--pricing-ink);
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
  margin: 0 0 30px;
}

.pricing-card ul li {
  margin-bottom: 13px;
  font-size: 0.95rem;
  padding-left: 24px;
  color: var(--pricing-muted);
  line-height: 1.6;
}

.pricing-card ul li::before {
  content: "•";
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
  color: #fff;
}

.pricing-card.featured .price span {
  color: rgba(255, 255, 255, 0.66);
}

.recommended {
  top: -14px;
  background: rgba(208, 172, 103, 0.96);
  color: #08131f;
  font-size: 0.68rem;
  font-weight: 800;
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
  min-height: 52px;
  border-radius: 16px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.btn-outline {
  border: 1px solid rgba(20, 32, 51, 0.12);
  background: rgba(255, 255, 255, 0.8);
  color: var(--pricing-ink);
}

.btn-outline:hover {
  background: var(--pricing-navy);
}

.btn-primary {
  background: linear-gradient(135deg, var(--pricing-gold), #b68f4b);
  color: #08131f;
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.16);
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.services-section {
  background: #fff;
}

.services-grid {
  gap: 28px;
  margin-top: 0;
}

.service-card {
  border-radius: 28px;
  box-shadow: var(--pricing-shadow);
}

.service-card img {
  height: 320px;
}

.service-overlay {
  left: 22px;
  right: 22px;
  bottom: 22px;
  padding: 22px 24px;
  border-radius: 20px;
  background: rgba(7, 22, 36, 0.92);
  backdrop-filter: blur(14px);
}

.service-overlay h4 {
  font-size: 1.18rem;
  font-weight: 600;
}

.service-overlay p {
  font-size: 0.88rem;
  line-height: 1.7;
}

.strong-cta {
  padding: 100px 20px;
  background:
    radial-gradient(circle at top right, rgba(208, 172, 103, 0.18), transparent 24%),
    linear-gradient(135deg, #0b1d3a, #1c3a70);
}

.strong-cta p {
  font-size: 1rem;
  line-height: 1.8;
}

.cta-button {
  border-radius: 18px;
  padding: 18px 34px;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
}

.faq-section {
  background:
    radial-gradient(circle at top right, rgba(208, 172, 103, 0.1), transparent 20%),
    linear-gradient(180deg, #0b1d3a, #071624);
}

.accordion-item {
  border-radius: 20px;
}

.accordion-header {
  padding: 24px 28px;
  font-weight: 600;
  text-align: left;
}

.accordion-body {
  padding: 0 28px 24px 28px;
}

@media (max-width: 1024px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .pricing-card.featured {
    transform: none;
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
