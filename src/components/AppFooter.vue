<template>
  <footer class="footer">
    <div class="footer-overlay">
      <div class="footer-bottom">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="footer-logo-icon">S</span>
            <span>Sky Group</span>
          </div>

          <p>{{ copy.description }}</p>
          <small>{{ copy.rights }}</small>
        </div>

        <div class="footer-office">
          <h4>{{ copy.office }}</h4>
          <p>{{ copy.officeAddress }}</p>

          <div class="office-grid">
            <div>
              <h4>{{ copy.customerService }}</h4>

              <p>
                <a href="#" @click.prevent="handlePhone('+527221126671')">
                  +52 722-112-6671
                </a>
              </p>

              <p>
                <a href="#" @click.prevent="handlePhone('+525586186576')">
                  +52 558-618-6576
                </a>
              </p>

              <p>
                <a href="#" @click.prevent="handlePhone('+13054646394')">
                  +1 (305) 464-6394
                </a>
              </p>
            </div>

            <div>
              <h4>{{ copy.mail }}</h4>

              <p>
                <a href="mailto:sales@redskyg.com">sales@redskyg.com</a>
              </p>

              <p>
                <a href="mailto:ventas@redskyg.com">ventas@redskyg.com</a>
              </p>
            </div>
          </div>
        </div>

        <div class="footer-newsletter">
          <h3>{{ copy.newsletterTitle }}</h3>
          <p>{{ copy.newsletterCopy }}</p>

          <div class="newsletter-form">
            <input type="email" :placeholder="copy.emailPlaceholder" />
            <button>{{ copy.subscribe }}</button>
          </div>

          <div class="footer-social">
            <a
              href="https://www.linkedin.com/company/red-aviation-corp/"
              target="_blank"
              aria-label="LinkedIn"
            >
              <Linkedin class="social-icon" />
            </a>

            <a
              href="https://www.instagram.com/redaviationcompany/"
              target="_blank"
              aria-label="Instagram"
            >
              <Instagram class="social-icon" />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=100089964423483"
              target="_blank"
              aria-label="Facebook"
            >
              <Facebook class="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import { Linkedin, Instagram, Facebook } from "lucide-vue-next";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const { localeConfig } = useLocalizedNavigation();
const copy = computed(() => localeConfig.value.footer);

const handlePhone = (number) => {
  const isMobile =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent,
    );

  if (isMobile) {
    window.location.href = `tel:${number}`;
    return;
  }

  window.open(`https://wa.me/${number.replace("+", "")}`, "_blank");
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

:root {
  --footer-navy: #071624;
  --footer-navy-deep: #04111d;
  --footer-text: #f4f7fb;
  --footer-muted: #a6b2c2;
  --footer-line: rgba(255, 255, 255, 0.1);
  --footer-accent: #d0ac67;
  --footer-accent-soft: rgba(208, 172, 103, 0.12);
}

.office-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.office-grid h4 {
  margin-bottom: 0.8rem;
}

@media (max-width: 768px) {
  .office-grid {
    grid-template-columns: 1fr;
  }
}

.footer {
  background:
    radial-gradient(circle at top right, rgba(208, 172, 103, 0.12), transparent 18%),
    linear-gradient(180deg, var(--footer-navy) 0%, var(--footer-navy-deep) 100%);
  color: #fff;
  font-family: "Inter", sans-serif;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-overlay {
  padding: 4.5rem 3rem 3.25rem;
  max-width: 1440px;
  margin: auto;
}

.footer-bottom {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.5fr;
  gap: 3rem;
  align-items: flex-start;
}

.footer-brand p {
  margin: 1.1rem 0 1.4rem;
  color: var(--footer-muted);
  font-size: 0.9rem;
  line-height: 1.8;
  max-width: 420px;
}

.footer-brand small {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.48);
  letter-spacing: 0.12em;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.footer-logo-icon {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--footer-accent-soft);
  color: var(--footer-accent);
  border: 1px solid rgba(208, 172, 103, 0.18);
}

.footer-office h4 {
  margin-bottom: 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
}

.footer-office p {
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
  color: var(--footer-muted);
  line-height: 1.7;
}

.footer-office a,
.footer-brand a,
.footer-newsletter a {
  color: var(--footer-text);
  text-decoration: none;
  transition: color 0.25s ease, opacity 0.25s ease;
}

.footer-office a:hover,
.footer-brand a:hover,
.footer-newsletter a:hover {
  color: var(--footer-accent);
}

.footer-newsletter h3 {
  font-size: 1.65rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.15;
}

.footer-newsletter p {
  color: var(--footer-muted);
  margin-bottom: 1.4rem;
  line-height: 1.7;
}

.newsletter-form {
  display: flex;
  gap: 0.6rem;
}

.newsletter-form input {
  flex: 1;
  min-height: 50px;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  outline: none;
  background: rgba(255, 255, 255, 0.05);
  color: var(--footer-text);
  font-family: "Inter", sans-serif;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.newsletter-form input:focus {
  border-color: rgba(208, 172, 103, 0.28);
  box-shadow: 0 0 0 4px rgba(208, 172, 103, 0.08);
  background: rgba(255, 255, 255, 0.08);
}

.newsletter-form button {
  min-height: 50px;
  padding: 0.75rem 1.4rem;
  background: linear-gradient(135deg, var(--footer-accent), #b58c44);
  color: #08131f;
  border: none;
  border-radius: 14px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.18);
}

.newsletter-form button:hover {
  transform: translateY(-2px);
  filter: brightness(1.03);
  box-shadow: 0 22px 38px rgba(0, 0, 0, 0.24);
}

@media (max-width: 1024px) {
  .footer-bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .footer-overlay {
    padding: 3rem 1.5rem;
  }

  .footer-bottom {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .footer-newsletter h3 {
    font-size: 1.25rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-form button {
    width: 100%;
  }
}

.footer-social {
  margin-top: 1.5rem;
  display: flex;
  gap: 1.2rem;
  align-items: center;
}

.footer-social a {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  transition: all 0.35s ease;
}

.social-icon {
  width: 18px;
  height: 18px;
  color: #ffffff;
  stroke: #ffffff;
}

.footer-social a:hover {
  background: var(--footer-accent);
  border-color: var(--footer-accent);
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.24);
}

.footer-social a:hover .social-icon {
  color: #000;
}
</style>
