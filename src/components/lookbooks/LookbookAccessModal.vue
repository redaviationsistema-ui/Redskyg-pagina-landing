<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="lookbook-access"
      role="presentation"
      @click.self="$emit('close')"
    >
      <section
        ref="dialogRef"
        class="lookbook-access__card"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="descriptionId"
        tabindex="-1"
        @keydown.esc="$emit('close')"
      >
        <header class="lookbook-access__header">
          <span class="lookbook-access__eyebrow">{{ eyebrow }}</span>
          <h2 :id="titleId">{{ title }}</h2>
          <p :id="descriptionId">{{ description }}</p>
        </header>

        <div class="lookbook-access__body">
          <div v-if="errorMessage" class="lookbook-access__error" role="alert">
            {{ errorMessage }}
          </div>

          <label class="lookbook-access__field">
            <span>Correo electronico</span>
            <input
              :value="email"
              type="email"
              placeholder="correo@empresa.com"
              autocomplete="email"
              required
              @input="$emit('update:email', $event.target.value)"
            />
          </label>

          <label class="lookbook-access__field">
            <span>Usuario de Instagram <small>Opcional</small></span>
            <input
              :value="instagramUsername"
              type="text"
              placeholder="@usuario"
              autocomplete="off"
              @input="$emit('update:instagramUsername', $event.target.value)"
            />
          </label>
        </div>

        <footer class="lookbook-access__footer">
          <button
            type="button"
            class="lookbook-access__button lookbook-access__button--primary"
            :disabled="loading"
            @click="$emit('submit')"
          >
            {{ primaryLabel }}
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
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  visible: {
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
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
});

defineEmits([
  "close",
  "submit",
  "update:email",
  "update:instagramUsername",
]);

const dialogRef = ref(null);
const titleId = "lookbook-access-title";
const descriptionId = "lookbook-access-description";

const eyebrow = computed(() => "Datos de descarga");

const title = computed(() => "Descargar guia");

const description = computed(() =>
  "Ingresa tu correo para registrar la descarga. Instagram es opcional.",
);

const primaryLabel = computed(() => {
  if (props.loading) {
    return "Procesando...";
  }

  return "Descargar guia";
});

const setBodyScrollLock = (locked) => {
  document.body.style.overflow = locked ? "hidden" : "";
};

watch(
  () => props.visible,
  async (visible) => {
    setBodyScrollLock(Boolean(visible));

    if (visible) {
      await nextTick();
      dialogRef.value?.focus();
    }
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
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(4, 12, 20, 0.78);
  backdrop-filter: blur(10px);
}

.lookbook-access__card {
  width: min(560px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), #eef4f9);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.3);
}

.lookbook-access__eyebrow {
  color: #175a8f;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  font-weight: 800;
}

.lookbook-access__header h2 {
  margin: 0.65rem 0 0.85rem;
  color: #081a2a;
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  line-height: 1.05;
  letter-spacing: 0;
}

.lookbook-access__header p {
  margin: 0;
  color: #5d697b;
  line-height: 1.7;
}

.lookbook-access__body,
.lookbook-access__footer {
  display: grid;
  gap: 14px;
}

.lookbook-access__body {
  margin-top: 24px;
}

.lookbook-access__footer {
  margin-top: 24px;
}

.lookbook-access__error {
  padding: 14px 16px;
  border: 1px solid rgba(168, 55, 48, 0.18);
  border-radius: 12px;
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

.lookbook-access__field small {
  color: #6d7684;
  font-size: 0.78rem;
  font-weight: 600;
}

.lookbook-access__field input {
  width: 100%;
  min-height: 52px;
  padding: 0 16px;
  border: 1px solid rgba(8, 26, 42, 0.12);
  border-radius: 12px;
  background: #ffffff;
  color: #081a2a;
  font: inherit;
}

.lookbook-access__field input:focus,
.lookbook-access__card:focus {
  outline: 2px solid rgba(23, 90, 143, 0.22);
  outline-offset: 2px;
}

.lookbook-access__button {
  min-height: 50px;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.06em;
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

.lookbook-access__button--ghost {
  background: transparent;
  color: #5d697b;
}

@media (max-width: 640px) {
  .lookbook-access {
    padding: 16px;
  }

  .lookbook-access__card {
    padding: 24px 20px;
  }
}
</style>
