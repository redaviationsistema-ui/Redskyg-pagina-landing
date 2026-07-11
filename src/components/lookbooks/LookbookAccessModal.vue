<template>
  <Teleport to="body">
    <div v-if="visible" class="lookbook-access" @click.self="$emit('close')">
      <div class="lookbook-access__shell">
        <div class="lookbook-access__card">
          <header class="lookbook-access__header">
            <span class="lookbook-access__eyebrow">Acceso a eBook</span>
            <h2>Descarga este eBook</h2>
            <p>
              Inicia sesión y registra tu usuario de Instagram para acceder a la
              documentación.
            </p>
          </header>

          <div class="lookbook-access__body">
            <div v-if="errorMessage" class="lookbook-access__error">
              {{ errorMessage }}
            </div>

            <label v-if="!isAuthenticated" class="lookbook-access__field">
              <span>Correo electrónico</span>
              <input
                :value="email"
                type="email"
                placeholder="correo@empresa.com"
                autocomplete="email"
                @input="$emit('update:email', $event.target.value)"
              />
            </label>

            <label class="lookbook-access__field">
              <span>Usuario de Instagram</span>
              <input
                :value="instagramUsername"
                type="text"
                placeholder="@usuario"
                autocomplete="off"
                @input="$emit('update:instagramUsername', $event.target.value)"
              />
            </label>

            <label class="lookbook-access__consent">
              <input
                :checked="consentAccepted"
                type="checkbox"
                @change="$emit('update:consentAccepted', $event.target.checked)"
              />
              <span>
                Acepto recibir información relacionada con aeronaves, vuelos privados y
                novedades de RedSky.
              </span>
            </label>
          </div>

          <footer class="lookbook-access__footer">
            <button
              type="button"
              class="lookbook-access__button lookbook-access__button--primary"
              :disabled="loading"
              @click="$emit('submit')"
            >
              {{ loading ? "Procesando..." : isAuthenticated ? "Continuar descarga" : "Iniciar sesión" }}
            </button>

            <button
              v-if="showInstagramComingSoon"
              type="button"
              class="lookbook-access__button lookbook-access__button--soon"
              disabled
            >
              Continuar con Instagram (Próximamente)
            </button>

            <p v-if="instagramNotice" class="lookbook-access__soon-note">
              {{ instagramNotice }}
            </p>

            <button
              v-if="facebookEnabled"
              type="button"
              class="lookbook-access__button lookbook-access__button--secondary"
              :disabled="loading"
              @click="$emit('facebook')"
            >
              Continuar con Facebook
            </button>

            <button
              type="button"
              class="lookbook-access__button lookbook-access__button--ghost"
              :disabled="loading"
              @click="$emit('close')"
            >
              Cancelar
            </button>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, watch } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    default: "",
  },
  instagramUsername: {
    type: String,
    default: "",
  },
  consentAccepted: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  facebookEnabled: {
    type: Boolean,
    default: false,
  },
  showInstagramComingSoon: {
    type: Boolean,
    default: true,
  },
  instagramNotice: {
    type: String,
    default: "",
  },
});

defineEmits([
  "close",
  "submit",
  "facebook",
  "update:email",
  "update:instagramUsername",
  "update:consentAccepted",
]);

const setBodyScrollLock = (locked) => {
  document.body.style.overflow = locked ? "hidden" : "";
};

watch(
  () => props.visible,
  (visible) => {
    setBodyScrollLock(Boolean(visible));
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  setBodyScrollLock(false);
});
</script>

<style scoped>
.lookbook-access {
  position: fixed;
  inset: 0;
  z-index: 12000;
  background: rgba(4, 12, 20, 0.78);
  backdrop-filter: blur(10px);
}

.lookbook-access__shell {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 100%;
  padding: 24px;
}

.lookbook-access__card {
  width: min(620px, 100%);
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(238, 244, 249, 0.96));
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.3);
}

.lookbook-access__eyebrow {
  color: #175a8f;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  font-weight: 800;
}

.lookbook-access__header h2 {
  margin: 0.7rem 0 0.85rem;
  color: #081a2a;
  font-size: clamp(1.9rem, 3vw, 2.5rem);
  line-height: 1.02;
}

.lookbook-access__header p {
  margin: 0;
  color: #5d697b;
  line-height: 1.7;
}

.lookbook-access__body {
  display: grid;
  gap: 18px;
  margin-top: 26px;
}

.lookbook-access__error {
  padding: 14px 16px;
  border: 1px solid rgba(168, 55, 48, 0.18);
  border-radius: 16px;
  background: rgba(168, 55, 48, 0.08);
  color: #8d231d;
  font-weight: 600;
}

.lookbook-access__field {
  display: grid;
  gap: 8px;
}

.lookbook-access__field span {
  color: #081a2a;
  font-size: 0.88rem;
  font-weight: 700;
}

.lookbook-access__field input {
  width: 100%;
  min-height: 52px;
  padding: 0 16px;
  border: 1px solid rgba(8, 26, 42, 0.12);
  border-radius: 14px;
  background: #ffffff;
  color: #081a2a;
  font: inherit;
}

.lookbook-access__field input:focus {
  outline: 2px solid rgba(23, 90, 143, 0.18);
  border-color: #175a8f;
}

.lookbook-access__consent {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  color: #5d697b;
  line-height: 1.6;
}

.lookbook-access__consent input {
  margin-top: 2px;
}

.lookbook-access__footer {
  display: grid;
  gap: 12px;
  margin-top: 28px;
}

.lookbook-access__button {
  min-height: 50px;
  border-radius: 14px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.lookbook-access__button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.lookbook-access__button:disabled {
  cursor: wait;
  opacity: 0.72;
}

.lookbook-access__button--primary {
  background: linear-gradient(135deg, #081a2a 0%, #175a8f 100%);
  color: #ffffff;
}

.lookbook-access__button--secondary {
  border-color: rgba(8, 26, 42, 0.12);
  background: #ffffff;
  color: #081a2a;
}

.lookbook-access__button--soon {
  border-style: dashed;
  border-color: rgba(23, 90, 143, 0.2);
  background: rgba(23, 90, 143, 0.06);
  color: #175a8f;
  opacity: 1;
}

.lookbook-access__soon-note {
  margin: -2px 2px 0;
  color: #5d697b;
  font-size: 0.88rem;
  line-height: 1.6;
  text-align: center;
}

.lookbook-access__button--ghost {
  background: transparent;
  color: #5d697b;
}

@media (max-width: 640px) {
  .lookbook-access__shell {
    padding: 16px;
  }

  .lookbook-access__card {
    padding: 24px 20px;
  }
}
</style>
