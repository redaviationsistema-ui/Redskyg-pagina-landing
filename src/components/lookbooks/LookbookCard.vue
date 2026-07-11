<template>
  <article class="lookbook-card">
    <div class="lookbook-card__media">
      <img
        v-if="lookbook.cover_url && !imageFailed"
        :src="lookbook.cover_url"
        :alt="lookbook.title"
        class="lookbook-card__image"
        loading="lazy"
        decoding="async"
        @error="imageFailed = true"
      />

      <div v-else class="lookbook-card__placeholder" aria-hidden="true">
        <FileText />
        <strong>{{ lookbook.aircraft_name || lookbook.title }}</strong>
        <span>Aircraft Guide</span>
      </div>
    </div>

    <div class="lookbook-card__body">
      <div class="lookbook-card__meta">
        <span class="lookbook-card__badge">{{ lookbook.category || "General" }}</span>
        <span v-if="lookbook.pages || lookbook.size_mb" class="lookbook-card__specs">
          <span v-if="lookbook.pages">{{ lookbook.pages }} p</span>
          <span v-if="lookbook.size_mb">{{ lookbook.size_mb }} MB</span>
        </span>
      </div>

      <div class="lookbook-card__copy">
        <h3>{{ lookbook.title }}</h3>
        <p class="lookbook-card__aircraft">{{ lookbook.aircraft_name || "Private Aircraft" }}</p>
        <p class="lookbook-card__description">
          {{ lookbook.description || "Documentacion exclusiva de aeronaves." }}
        </p>
      </div>

      <div class="lookbook-card__actions">
        <button type="button" class="lookbook-card__button lookbook-card__button--ghost" @click="$emit('preview')">
          Vista previa
        </button>
        <button
          type="button"
          class="lookbook-card__button lookbook-card__button--primary"
          :disabled="downloading"
          @click="$emit('download')"
        >
          {{ downloading ? "Descargando..." : "Descargar eBook" }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, watch } from "vue";
import { FileText } from "lucide-vue-next";

const props = defineProps({
  lookbook: {
    type: Object,
    required: true,
  },
  downloading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["preview", "download"]);

const imageFailed = ref(false);

watch(
  () => props.lookbook?.cover_url,
  () => {
    imageFailed.value = false;
  },
);
</script>

<style scoped>
.lookbook-card {
  display: grid;
  min-height: 100%;
  overflow: hidden;
  border: 1px solid rgba(7, 22, 36, 0.1);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(240, 246, 251, 0.96));
  box-shadow: 0 20px 50px rgba(7, 22, 36, 0.08);
}

.lookbook-card__media {
  position: relative;
  min-height: 260px;
  background: linear-gradient(135deg, #081a2a 0%, #153a59 100%);
}

.lookbook-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lookbook-card__placeholder {
  display: grid;
  place-items: center;
  gap: 12px;
  height: 100%;
  padding: 28px;
  text-align: center;
  color: rgba(255, 255, 255, 0.92);
}

.lookbook-card__placeholder svg {
  width: 42px;
  height: 42px;
  color: #d0ac67;
}

.lookbook-card__placeholder strong {
  font-size: 1.15rem;
  letter-spacing: 0.04em;
}

.lookbook-card__placeholder span {
  color: rgba(255, 255, 255, 0.68);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
}

.lookbook-card__body {
  display: grid;
  gap: 20px;
  padding: 24px;
}

.lookbook-card__meta,
.lookbook-card__specs,
.lookbook-card__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lookbook-card__meta {
  justify-content: space-between;
  flex-wrap: wrap;
}

.lookbook-card__badge {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(23, 90, 143, 0.08);
  color: #175a8f;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lookbook-card__specs {
  color: #536274;
  font-size: 0.82rem;
  font-weight: 700;
}

.lookbook-card__specs span + span::before {
  content: "•";
  margin-right: 12px;
}

.lookbook-card__copy h3 {
  margin: 0;
  color: #081a2a;
  font-size: 1.35rem;
  line-height: 1.12;
}

.lookbook-card__aircraft {
  margin: 0.5rem 0 0;
  color: #175a8f;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lookbook-card__description {
  margin: 1rem 0 0;
  color: #5d697b;
  line-height: 1.7;
}

.lookbook-card__actions {
  flex-wrap: wrap;
}

.lookbook-card__button {
  flex: 1 1 180px;
  min-height: 48px;
  border-radius: 14px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.lookbook-card__button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.lookbook-card__button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.lookbook-card__button--ghost {
  border-color: rgba(8, 26, 42, 0.12);
  background: #ffffff;
  color: #081a2a;
}

.lookbook-card__button--primary {
  background: linear-gradient(135deg, #081a2a 0%, #175a8f 100%);
  color: #ffffff;
  box-shadow: 0 16px 32px rgba(23, 90, 143, 0.18);
}
</style>
