<template>
  <div class="layout-wrapper">
    <AppHeader />

    <main class="main-content">
      <slot />
    </main>

    <AppFooter />

    <a :href="whatsAppHref" target="_blank" rel="noreferrer" class="whatsapp-float">
      <div class="whatsapp-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
        >
          <path
            d="M16 0C7.164 0 0 7.163 0 16c0 2.82.74 5.574 2.147 8.005L0 32l8.207-2.123A15.93 15.93 0 0016 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.333c-2.6 0-5.147-.69-7.36-2l-.527-.312-4.867 1.26 1.298-4.74-.343-.547A13.284 13.284 0 012.667 16C2.667 8.64 8.64 2.667 16 2.667S29.333 8.64 29.333 16 23.36 29.333 16 29.333zm7.387-10.08c-.403-.202-2.383-1.176-2.75-1.31-.367-.134-.634-.202-.902.202-.268.403-1.036 1.31-1.27 1.578-.233.268-.467.302-.87.1-.403-.202-1.7-.626-3.24-1.996-1.197-1.067-2.005-2.385-2.24-2.788-.233-.403-.025-.62.177-.822.182-.181.403-.467.605-.7.202-.233.268-.403.403-.67.134-.268.067-.503-.034-.705-.1-.202-.902-2.176-1.236-2.98-.326-.784-.657-.677-.902-.69l-.768-.013c-.268 0-.705.1-1.075.503-.37.403-1.41 1.378-1.41 3.36 0 1.983 1.443 3.9 1.645 4.167.202.268 2.84 4.34 6.884 6.085.962.415 1.71.663 2.295.848.964.306 1.842.263 2.536.16.774-.116 2.383-.974 2.718-1.916.335-.943.335-1.75.233-1.916-.1-.167-.367-.268-.77-.47z"
          />
        </svg>
      </div>

      <span class="whatsapp-text">{{ copy.whatsappCta }}</span>
    </a>
  </div>
</template>

<script setup>
import { computed } from "vue";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const { localeConfig } = useLocalizedNavigation();
const copy = computed(() => localeConfig.value.layout);
const whatsAppHref = computed(
  () => `https://wa.me/525586186576?text=${encodeURIComponent(copy.value.whatsappMessage)}`,
);
</script>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  background: transparent;
}

.header.scrolled {
  background: rgba(10, 20, 30, 0.95);
}

.whatsapp-float {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  z-index: 9999;
  max-width: calc(100vw - 32px);
}

.whatsapp-icon {
  width: 62px;
  height: 62px;
  background: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.34);
  transition: 0.3s ease;
  animation: floatPulse 2.5s infinite;
  flex-shrink: 0;
}

@keyframes floatPulse {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }

  100% {
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .whatsapp-float {
    right: 14px;
    bottom: 16px;
    gap: 8px;
  }
}

.whatsapp-text {
  background: linear-gradient(135deg, #071624, #10283d);
  color: white;
  border: 2px solid rgba(243, 205, 122, 0.9);
  padding: 16px 22px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.28);
  transition: 0.3s ease;
  white-space: nowrap;
}

.whatsapp-float:hover .whatsapp-icon {
  transform: scale(1.1);
}

.whatsapp-float:hover .whatsapp-text {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .whatsapp-text {
    display: inline-flex;
    align-items: center;
    min-height: 54px;
    padding: 0 16px;
    font-size: 12px;
  }
}
</style>
