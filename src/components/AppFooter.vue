<template>
  <footer class="footer">
    <div class="footer-shell">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="/images/logoo.png" alt="Sky Group" />
          </div>

          <p>{{ copy.description }}</p>
          <small>{{ copy.rights }}</small>
        </div>

        <div class="footer-contact">
          <div class="footer-block">
            <h4>{{ copy.office }}</h4>
            <p>{{ copy.officeAddress }}</p>
          </div>

          <div class="footer-contact-grid">
            <div class="footer-block">
              <h4>{{ copy.customerService }}</h4>

              <a href="#" @click.prevent="handlePhone('+527221126671')">
                +52 722-112-6671
              </a>
              <a href="#" @click.prevent="handlePhone('+525586186576')">
                +52 558-618-6576
              </a>
              <a href="#" @click.prevent="handlePhone('+13054646394')">
                +1 (305) 464-6394
              </a>
            </div>

            <div class="footer-block">
              <h4>{{ copy.mail }}</h4>

              <a href="mailto:sales@redskyg.com">sales@redskyg.com</a>
              <a href="mailto:ventas@redskyg.com">ventas@redskyg.com</a>
            </div>
          </div>
        </div>

        <div class="footer-newsletter">
          <h3>{{ copy.newsletterTitle }}</h3>
          <p>{{ copy.newsletterCopy }}</p>

          <form class="newsletter-form">
            <input type="email" :placeholder="copy.emailPlaceholder" />
            <button type="submit">{{ copy.subscribe }}</button>
          </form>

          <div class="footer-actions">
            <div class="footer-social">
              <a
                href="https://www.facebook.com/profile.php?id=100089964423483"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                class="social-logo social-logo--facebook"
              >
                <img src="/images/social/facebook.svg" alt="" />
              </a>

              <a
                href="https://www.instagram.com/skygroup_llc/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                class="social-logo social-logo--instagram"
              >
                <img src="/images/social/instagram.svg" alt="" />
              </a>

              <a
                :href="whatsAppHref"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                class="social-logo social-logo--whatsapp"
              >
                <img src="/images/social/whatsapp.svg" alt="" />
              </a>

              <a
                href="https://www.tiktok.com/@redaviationcompany"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                class="social-logo social-logo--tiktok"
              >
                <img src="/images/social/tiktok.svg" alt="" />
              </a>
            </div>

            <a
              class="footer-whatsapp"
              :href="whatsAppHref"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              <span>{{ layoutCopy.whatsappCta }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import { MessageCircle } from "lucide-vue-next";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const { localeConfig } = useLocalizedNavigation();
const copy = computed(() => localeConfig.value.footer);
const layoutCopy = computed(
  () =>
    localeConfig.value.layout ?? {
      whatsappCta: "WhatsApp",
      whatsappMessage:
        "Hello, I would like to request a private flight quote.",
    },
);
const whatsAppHref = computed(
  () =>
    `https://wa.me/525586186576?text=${encodeURIComponent(
      layoutCopy.value.whatsappMessage,
    )}`,
);

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

<style scoped>
.footer {
  --footer-navy: #071624;
  --footer-navy-deep: #04111d;
  --footer-text: #f4f7fb;
  --footer-muted: #a8b6c7;
  --footer-line: rgba(255, 255, 255, 0.12);
  --footer-accent: #d0ac67;
  color: var(--footer-text);
  background:
    linear-gradient(180deg, var(--footer-navy) 0%, var(--footer-navy-deep) 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-shell {
  width: min(1220px, calc(100% - 40px));
  margin: 0 auto;
  padding: 64px 0 58px;
}

.footer-top {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(280px, 0.85fr) minmax(360px, 1.15fr);
  gap: 58px;
  align-items: start;
}

.footer-brand,
.footer-contact,
.footer-newsletter {
  min-width: 0;
}

.footer-logo img {
  display: block;
  width: min(170px, 62vw);
  height: auto;
  filter: brightness(0) invert(1);
}

.footer-brand p {
  max-width: 430px;
  margin: 1.35rem 0 1.6rem;
  color: var(--footer-muted);
  font-size: 0.94rem;
  line-height: 1.85;
}

.footer-brand small {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.footer-contact {
  display: grid;
  gap: 24px;
}

.footer-contact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}

.footer-block {
  display: grid;
  gap: 0.65rem;
}

.footer-block h4 {
  margin: 0 0 0.15rem;
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.footer-block p,
.footer-block a {
  margin: 0;
  color: var(--footer-muted);
  font-size: 0.92rem;
  line-height: 1.7;
  text-decoration: none;
  transition: color 0.22s ease;
}

.footer-block a {
  color: #ffffff;
  font-weight: 700;
}

.footer-block a:hover {
  color: var(--footer-accent);
}

.footer-newsletter h3 {
  max-width: 560px;
  margin: 0 0 0.85rem;
  color: #ffffff;
  font-size: clamp(1.8rem, 3vw, 2.65rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.footer-newsletter p {
  max-width: 580px;
  margin: 0 0 1.6rem;
  color: var(--footer-muted);
  line-height: 1.75;
}

.newsletter-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.newsletter-form input {
  width: 100%;
  min-height: 54px;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  outline: none;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font: inherit;
  transition:
    border-color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.42);
}

.newsletter-form input:focus {
  border-color: rgba(208, 172, 103, 0.58);
  background: rgba(255, 255, 255, 0.09);
  box-shadow: 0 0 0 4px rgba(208, 172, 103, 0.1);
}

.newsletter-form button,
.footer-whatsapp {
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0.95rem 1.3rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    background 0.22s ease,
    color 0.22s ease,
    box-shadow 0.22s ease;
}

.newsletter-form button {
  border: 0;
  background: var(--footer-accent);
  color: #07111f;
  cursor: pointer;
}

.newsletter-form button:hover,
.footer-whatsapp:hover,
.footer-social a:hover {
  transform: translateY(-2px);
}

.footer-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: 1.55rem;
}

.footer-social {
  display: flex;
  gap: 12px;
  align-items: center;
}

.footer-social a {
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 14px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.24);
  transition:
    transform 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;
}

.footer-social a:hover {
  box-shadow: 0 20px 38px rgba(0, 0, 0, 0.32);
}

.social-logo--facebook {
  background: linear-gradient(180deg, #2aa7ff, #0866ff) !important;
}

.social-logo--instagram {
  background:
    radial-gradient(circle at 28% 108%, #ffdd55 0 18%, transparent 38%),
    radial-gradient(circle at 12% 88%, #ff543e 0 18%, transparent 42%),
    radial-gradient(circle at 88% 12%, #c837ab 0 22%, transparent 46%),
    linear-gradient(135deg, #405de6, #c13584 52%, #fd1d1d 76%, #fcb045) !important;
}

.social-logo--whatsapp {
  background: linear-gradient(180deg, #35ee5f, #16c84d) !important;
}

.social-logo--tiktok {
  background: #050505 !important;
}

.footer-social img {
  display: block;
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.footer-whatsapp svg {
  width: 18px;
  height: 18px;
  color: #ffffff;
  stroke-width: 2.4;
}

.footer-whatsapp {
  border: 1px solid rgba(208, 172, 103, 0.7);
  background: transparent;
  color: #ffffff;
}

.footer-whatsapp:hover {
  background: rgba(208, 172, 103, 0.12);
  color: var(--footer-accent);
}

@media (max-width: 1080px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 38px;
  }

  .footer-contact-grid {
    max-width: 560px;
  }
}

@media (max-width: 768px) {
  .footer-shell {
    width: min(100% - 32px, 1220px);
    padding: 50px 0 110px;
  }

  .footer-contact-grid,
  .newsletter-form {
    grid-template-columns: 1fr;
  }

  .newsletter-form button,
  .footer-whatsapp {
    width: 100%;
  }

  .footer-actions {
    align-items: stretch;
  }
}
</style>
