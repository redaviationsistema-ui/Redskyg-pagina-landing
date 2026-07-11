<template>
  <Teleport to="body">
    <div v-if="visible" class="lookbook-preview" @click.self="$emit('close')">
      <div class="lookbook-preview__shell">
        <div class="lookbook-preview__card">
          <header class="lookbook-preview__header">
            <div>
              <span class="lookbook-preview__eyebrow">Biblioteca RedSky</span>
              <h2>{{ title }}</h2>
            </div>

            <button type="button" class="lookbook-preview__close" @click="$emit('close')">
              Cerrar
            </button>
          </header>

          <div class="lookbook-preview__body">
            <div v-if="loading" class="lookbook-preview__loading">
              <span class="lookbook-preview__spinner"></span>
              <p>Generando vista previa...</p>
            </div>

            <iframe
              v-else-if="pdfUrl"
              :src="pdfUrl"
              :title="title"
              class="lookbook-preview__frame"
            />

            <div v-else class="lookbook-preview__empty">
              No fue posible generar el acceso al documento.
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, watch } from "vue";

const props = defineProps({
  visible: Boolean,
  title: String,
  pdfUrl: String,
  loading: Boolean,
});

defineEmits(["close"]);

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
.lookbook-preview {
  position: fixed;
  inset: 0;
  z-index: 12000;
  background: rgba(4, 12, 20, 0.78);
  backdrop-filter: blur(10px);
}

.lookbook-preview__shell {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 100%;
  padding: 28px;
}

.lookbook-preview__card {
  display: grid;
  width: min(1180px, 100%);
  min-height: min(84vh, 920px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  background: #f6f8fb;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.3);
}

.lookbook-preview__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 24px 28px;
  background: #071624;
  color: #ffffff;
}

.lookbook-preview__eyebrow {
  color: rgba(255, 255, 255, 0.66);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  font-weight: 800;
}

.lookbook-preview__header h2 {
  margin: 0.65rem 0 0;
  font-size: clamp(1.3rem, 2vw, 2rem);
}

.lookbook-preview__close {
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  cursor: pointer;
  font-weight: 700;
}

.lookbook-preview__body {
  position: relative;
  min-height: 70vh;
}

.lookbook-preview__frame {
  display: block;
  width: 100%;
  height: min(78vh, 860px);
  border: 0;
  background: #ffffff;
}

.lookbook-preview__loading,
.lookbook-preview__empty {
  display: grid;
  place-items: center;
  gap: 14px;
  min-height: 70vh;
  padding: 32px;
  text-align: center;
  color: #5d697b;
}

.lookbook-preview__spinner {
  width: 42px;
  height: 42px;
  border: 3px solid rgba(23, 90, 143, 0.16);
  border-top-color: #175a8f;
  border-radius: 50%;
  animation: lookbook-spin 0.9s linear infinite;
}

@keyframes lookbook-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .lookbook-preview__shell {
    padding: 16px;
  }

  .lookbook-preview__header {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }

  .lookbook-preview__frame,
  .lookbook-preview__loading,
  .lookbook-preview__empty {
    min-height: 62vh;
    height: 62vh;
  }
}
</style>
