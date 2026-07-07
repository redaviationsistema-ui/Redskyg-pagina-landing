<template>
  <MainLayout>
    <div class="contact-page">
      <section class="contact-hero">
        <img
          class="contact-hero__image"
          :src="assetUrl(content.hero.image)"
          :alt="content.hero.alt"
        />
        <div class="contact-hero__overlay"></div>

        <div class="contact-shell contact-grid">
          <div class="contact-copy reveal">
            <span class="contact-eyebrow">{{ content.hero.eyebrow }}</span>
            <h1>{{ content.hero.title }}</h1>
            <p>{{ content.hero.description }}</p>

            <div class="contact-lines">
              <div v-for="item in content.highlights" :key="item.title">
                <span>{{ item.label }}</span>
                <strong>{{ item.title }}</strong>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>

          <form class="contact-form reveal" @submit.prevent="sendEmail">
            <div class="form-heading">
              <span>{{ content.form.kicker }}</span>
              <h2>{{ content.form.title }}</h2>
            </div>

            <label class="field">
              <span>{{ content.form.name }}</span>
              <input v-model="form.name" type="text" required />
            </label>

            <label class="field">
              <span>{{ content.form.email }}</span>
              <input v-model="form.email" type="email" required />
            </label>

            <label class="field">
              <span>{{ content.form.phone }}</span>
              <input v-model="form.phone" type="text" required />
            </label>

            <label class="field">
              <span>{{ content.form.message }}</span>
              <textarea v-model="form.message" rows="5" required></textarea>
            </label>

            <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

            <button class="submit-btn" type="submit" :disabled="loading">
              <Send v-if="!loading" aria-hidden="true" />
              <span v-if="!loading">{{ content.form.submit }}</span>
              <span v-else class="spinner"></span>
            </button>

            <div class="direct-contact">
              <a :href="content.direct.phoneHref">{{ content.direct.phone }}</a>
              <a :href="content.direct.emailHref">{{ content.direct.email }}</a>
            </div>
          </form>
        </div>
      </section>

      <section class="contact-strip">
        <div class="contact-shell strip-grid reveal">
          <div v-for="item in content.process" :key="item.title">
            <span>{{ item.label }}</span>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>

  <transition name="fade">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <CheckCircle2 aria-hidden="true" />
        <h2>{{ content.success.title }}</h2>
        <p>{{ content.success.message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import axios from "axios";
import { CheckCircle2, Send } from "lucide-vue-next";
import MainLayout from "../layouts/MainLayout.vue";

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
});

const form = ref({
  name: "",
  email: "",
  phone: "",
  message: "",
});

const loading = ref(false);
const errorMsg = ref("");
const showModal = ref(false);
let observer;
let modalTimer;

const assetUrl = (path = "") =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

const sendEmail = async () => {
  loading.value = true;
  errorMsg.value = "";

  try {
    const response = await axios.post(
      "https://redskyg.com/send-contact.php",
      form.value,
    );

    if (response.data.success) {
      showModal.value = true;

      form.value = {
        name: "",
        email: "",
        phone: "",
        message: "",
      };

      clearTimeout(modalTimer);
      modalTimer = setTimeout(() => {
        showModal.value = false;
      }, 5000);
    } else {
      errorMsg.value = `${props.content.errors.server} ${response.data.error}`;
    }
  } catch (error) {
    errorMsg.value = props.content.errors.send;
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const elements = document.querySelectorAll(".contact-page .reveal");

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

onBeforeUnmount(() => {
  observer?.disconnect();
  clearTimeout(modalTimer);
});
</script>

<style scoped>
.contact-page {
  --contact-ink: #07111f;
  --contact-navy: #071624;
  --contact-blue: #175a8f;
  --contact-gold: #d0ac67;
  --contact-paper: #f5f7fa;
  --contact-muted: #637086;
  --contact-line: rgba(255, 255, 255, 0.14);
  color: var(--contact-ink);
  background: var(--contact-navy);
  overflow-x: clip;
}

.contact-shell {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
}

.contact-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--contact-navy);
}

.contact-hero__image,
.contact-hero__overlay {
  position: absolute;
  inset: 0;
}

.contact-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-hero__overlay {
  background:
    linear-gradient(90deg, rgba(7, 22, 36, 0.94), rgba(7, 22, 36, 0.62)),
    linear-gradient(180deg, rgba(7, 22, 36, 0.18), rgba(7, 22, 36, 0.9));
}

.contact-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 520px);
  gap: 62px;
  align-items: center;
  padding: 150px 0 82px;
}

.contact-eyebrow,
.form-heading span,
.contact-lines span,
.strip-grid span {
  display: inline-flex;
  color: var(--contact-gold);
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.contact-copy h1 {
  max-width: 820px;
  margin: 0.9rem 0 1rem;
  color: #ffffff;
  font-size: clamp(3.2rem, 7vw, 6.8rem);
  line-height: 0.94;
  letter-spacing: -0.04em;
}

.contact-copy > p {
  max-width: 650px;
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.08rem;
  line-height: 1.8;
}

.contact-lines {
  display: grid;
  gap: 0;
  max-width: 680px;
  margin-top: 42px;
  border-top: 1px solid var(--contact-line);
}

.contact-lines div {
  display: grid;
  gap: 0.42rem;
  padding: 22px 0;
  border-bottom: 1px solid var(--contact-line);
}

.contact-lines strong,
.strip-grid strong {
  color: #ffffff;
  font-size: 1.08rem;
}

.contact-lines p,
.strip-grid p {
  max-width: 560px;
  margin: 0;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.7;
}

.contact-form {
  display: grid;
  gap: 18px;
  padding: 34px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
}

.form-heading h2 {
  margin: 0.5rem 0 0;
  color: #ffffff;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.field {
  display: grid;
  gap: 8px;
}

.field span {
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font: inherit;
  outline: none;
  padding: 0.95rem 1rem;
  transition:
    border-color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;
}

.field textarea {
  resize: vertical;
  min-height: 136px;
}

.field input:focus,
.field textarea:focus {
  border-color: rgba(208, 172, 103, 0.62);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 0 4px rgba(208, 172, 103, 0.12);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 56px;
  border: 0;
  border-radius: 8px;
  background: #ffffff;
  color: var(--contact-ink);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    opacity 0.22s ease;
}

.submit-btn svg {
  width: 18px;
  height: 18px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.22);
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(7, 17, 31, 0.22);
  border-top-color: var(--contact-ink);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.error-msg {
  margin: 0;
  color: #ff9c9c;
  font-size: 0.92rem;
  line-height: 1.5;
}

.direct-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 4px;
}

.direct-contact a {
  color: rgba(255, 255, 255, 0.76);
  text-decoration: none;
  font-size: 0.9rem;
}

.direct-contact a:hover {
  color: var(--contact-gold);
}

.contact-strip {
  padding: 58px 0;
  background: var(--contact-ink);
}

.strip-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--contact-line);
  border-bottom: 1px solid var(--contact-line);
}

.strip-grid div {
  display: grid;
  gap: 0.45rem;
  padding: 24px 28px 24px 0;
}

.strip-grid div + div {
  padding-left: 28px;
  border-left: 1px solid var(--contact-line);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10002;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(7, 17, 31, 0.78);
  backdrop-filter: blur(10px);
}

.modal-box {
  width: min(500px, 100%);
  padding: 38px;
  border-radius: 8px;
  background: #ffffff;
  color: var(--contact-ink);
  text-align: center;
  box-shadow: 0 34px 90px rgba(0, 0, 0, 0.34);
}

.modal-box svg {
  width: 44px;
  height: 44px;
  color: #1e7e34;
}

.modal-box h2 {
  margin: 1rem 0 0.75rem;
  font-size: 1.8rem;
  letter-spacing: -0.04em;
}

.modal-box p {
  margin: 0;
  color: var(--contact-muted);
  line-height: 1.7;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
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
}

@media (max-width: 1020px) {
  .contact-grid,
  .strip-grid {
    grid-template-columns: 1fr;
  }

  .strip-grid div,
  .strip-grid div + div {
    padding-left: 0;
    padding-right: 0;
    border-left: 0;
    border-top: 1px solid var(--contact-line);
  }

  .strip-grid div:first-child {
    border-top: 0;
  }
}

@media (max-width: 768px) {
  .contact-shell {
    width: min(100% - 32px, 1200px);
  }

  .contact-hero {
    min-height: auto;
  }

  .contact-grid {
    gap: 36px;
    padding: 126px 0 56px;
  }

  .contact-copy h1 {
    font-size: 3rem;
  }

  .contact-form {
    padding: 24px;
  }

  .contact-lines {
    margin-top: 30px;
  }
}
</style>
