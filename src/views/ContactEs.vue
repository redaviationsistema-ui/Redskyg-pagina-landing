<template>
  <MainLayout>
    <section class="contact-section">
      <div class="contact-shell">
        <div class="contact-copy">
          <span class="eyebrow">Soporte de aviación privada</span>
          <h1 class="title">Contáctanos</h1>
          <p class="lead">
            Cuéntanos lo que necesitas y nuestro equipo te ayudará a coordinar
            la aeronave correcta, los tiempos y el nivel de servicio ideal para
            tu viaje.
          </p>

          <div class="contact-highlights">
            <div class="highlight-card">
              <span>Respuesta</span>
              <strong>Seguimiento rápido</strong>
              <p>Revisamos cada solicitud y te contactamos lo antes posible.</p>
            </div>

            <div class="highlight-card">
              <span>Cobertura</span>
              <strong>México y el mundo</strong>
              <p>Soluciones de aviación privada para operaciones nacionales e internacionales.</p>
            </div>

            <div class="highlight-card">
              <span>Servicio</span>
              <strong>Asistencia a la medida</strong>
              <p>Planeación charter, vuelos ejecutivos y acompañamiento personalizado.</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="sendEmail" class="contact-form">
          <div class="form-group floating">
            <input v-model="form.name" type="text" placeholder=" " required />
            <label>Nombre completo</label>
          </div>

          <div class="form-group floating">
            <input v-model="form.email" type="email" placeholder=" " required />
            <label>Correo electrónico</label>
          </div>

          <div class="form-group floating">
            <input v-model="form.phone" type="text" placeholder=" " required />
            <label>Teléfono</label>
          </div>

          <div class="form-group floating">
            <textarea
              v-model="form.message"
              rows="5"
              placeholder=" "
              required
            ></textarea>
            <label>Mensaje</label>
          </div>

          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

          <button type="submit" :disabled="loading" class="submit-btn">
            <span v-if="!loading">Enviar mensaje</span>
            <span v-else class="spinner"></span>
          </button>

          <div v-if="showModal" class="modal-overlay">
            <div class="modal-box">
              <h2>Mensaje recibido</h2>
              <p>
                Gracias por contactar a RedSky Aviation. Nuestro equipo revisará
                tu solicitud y se pondrá en contacto contigo lo antes posible.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import MainLayout from "../layouts/MainLayout.vue";
import { ref } from "vue";
import axios from "axios";

const form = ref({
  name: "",
  email: "",
  phone: "",
  message: "",
});

const loading = ref(false);
const errorMsg = ref("");
const showModal = ref(false);

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

      setTimeout(() => {
        showModal.value = false;
      }, 5000);
    } else {
      errorMsg.value = `Error del servidor: ${response.data.error}`;
    }
  } catch (error) {
    errorMsg.value = "Error al enviar el mensaje. Inténtalo de nuevo.";
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:root {
  --contact-navy: #071624;
  --contact-blue: #1d4f91;
  --contact-gold: #d0ac67;
  --contact-text: #f5f8fc;
  --contact-muted: #b8c7da;
}

.contact-shell {
  width: min(1180px, 100%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
  align-items: stretch;
}

.contact-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.eyebrow {
  display: inline-flex;
  align-self: flex-start;
  margin-bottom: 18px;
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  background: rgba(208, 172, 103, 0.12);
  border: 1px solid rgba(208, 172, 103, 0.2);
  color: var(--contact-gold);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.lead {
  max-width: 560px;
  margin: 0 0 26px;
  color: var(--contact-muted);
  font-size: 1rem;
  line-height: 1.85;
}

.contact-highlights {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  max-width: 520px;
}

.highlight-card {
  padding: 18px 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.14);
}

.highlight-card span {
  display: block;
  margin-bottom: 8px;
  color: var(--contact-gold);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.highlight-card strong {
  display: block;
  margin-bottom: 6px;
  color: var(--contact-text);
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}

.highlight-card p {
  margin: 0;
  color: var(--contact-muted);
  font-size: 0.92rem;
  line-height: 1.7;
}

.form-group.floating {
  position: relative;
}

.form-group.floating input,
.form-group.floating textarea {
  width: 100%;
  padding: 1.35rem 1rem 0.7rem 1rem;
}

.form-group.floating label {
  position: absolute;
  top: 16px;
  left: 16px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  pointer-events: none;
  transition: 0.25s ease;
}

.form-group.floating input:focus + label,
.form-group.floating textarea:focus + label,
.form-group.floating input:not(:placeholder-shown) + label,
.form-group.floating textarea:not(:placeholder-shown) + label {
  top: 6px;
  font-size: 0.66rem;
  color: var(--contact-gold);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(7, 18, 40, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

.modal-box {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 500px;
  text-align: center;
  color: #ffffff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s ease;
}

.modal-box h2 {
  margin-bottom: 15px;
  font-weight: 400;
  letter-spacing: 1px;
}

.modal-box p {
  font-size: 0.95rem;
  color: #d6e2ff;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.contact-section {
  padding: 140px 20px 110px;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(29, 79, 145, 0.22), transparent 24%),
    radial-gradient(circle at bottom right, rgba(208, 172, 103, 0.12), transparent 20%),
    linear-gradient(rgba(7, 18, 40, 0.94), rgba(7, 18, 40, 0.96));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: clamp(2.8rem, 5vw, 4.6rem);
  margin-bottom: 1rem;
  font-weight: 300;
  color: #ffffff;
  letter-spacing: -0.04em;
}

.contact-form {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(14px);
  padding: 38px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.form-group {
  display: flex;
  flex-direction: column;
}

input,
textarea {
  padding: 0.95rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.25s ease;
}

input::placeholder,
textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

input:focus,
textarea:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(208, 172, 103, 0.5);
  box-shadow: 0 0 0 4px rgba(208, 172, 103, 0.12);
}

button {
  background: linear-gradient(135deg, #0f2747, #1d4f91);
  color: white;
  padding: 1rem;
  border: none;
  min-height: 54px;
  border-radius: 16px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(15, 39, 71, 0.28);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  margin: 0;
  color: #ff8787;
  font-weight: 500;
  font-size: 0.92rem;
}

.submit-btn {
  position: relative;
  overflow: hidden;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 960px) {
  .contact-shell {
    grid-template-columns: 1fr;
  }

  .contact-copy {
    max-width: 680px;
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 118px 18px 84px;
  }

  .contact-form {
    padding: 24px;
    border-radius: 22px;
  }

  .lead {
    font-size: 0.96rem;
  }

  .highlight-card {
    padding: 16px 18px;
  }
}
</style>
