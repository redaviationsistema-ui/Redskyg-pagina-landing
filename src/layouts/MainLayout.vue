<template>
  <div class="layout-wrapper">
    <AppHeader />

    <main class="main-content">
      <slot />
    </main>

    <a
      class="floating-whatsapp"
      href="https://wa.me/525586186576?text=Hola,%20quiero%20solicitar%20una%20cotizacion%20de%20vuelo%20privado."
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <transition name="whatsapp-bubble">
        <span v-if="showWhatsappBubble" class="floating-whatsapp-bubble">
          Contactanos directamente
        </span>
      </transition>
      <img src="/images/social/whatsapp.svg" alt="" />
    </a>

    <AppFooter />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";

const showWhatsappBubble = ref(true);
let whatsappBubbleTimeout = null;

onMounted(() => {
  whatsappBubbleTimeout = window.setTimeout(() => {
    showWhatsappBubble.value = false;
  }, 10000);
});

onBeforeUnmount(() => {
  if (whatsappBubbleTimeout) {
    window.clearTimeout(whatsappBubbleTimeout);
    whatsappBubbleTimeout = null;
  }
});
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

.floating-whatsapp {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 10040;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 999px;
  background: #25d366;
  box-shadow: 0 18px 36px rgba(10, 20, 30, 0.22);
  animation: whatsappFloat 2.2s ease-in-out infinite;
  transition:
    transform 250ms ease,
    box-shadow 250ms ease,
    filter 250ms ease;
}

.floating-whatsapp-bubble {
  position: absolute;
  right: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%);
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(13, 17, 26, 0.94);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 12px 28px rgba(10, 20, 30, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.floating-whatsapp-bubble::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -6px;
  width: 12px;
  height: 12px;
  background: rgba(13, 17, 26, 0.94);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transform: translateY(-50%) rotate(-45deg);
}

.whatsapp-bubble-enter-active,
.whatsapp-bubble-leave-active {
  transition:
    opacity 250ms ease,
    transform 250ms ease;
}

.whatsapp-bubble-enter-from,
.whatsapp-bubble-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(10px);
}

.whatsapp-bubble-enter-to,
.whatsapp-bubble-leave-from {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

.floating-whatsapp img {
  width: 38px;
  height: 38px;
  display: block;
}

.floating-whatsapp:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 24px 44px rgba(10, 20, 30, 0.28);
  filter: brightness(1.04);
}

@keyframes whatsappFloat {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -16px;
  }
}

@media (max-width: 640px) {
  .floating-whatsapp {
    right: 16px;
    bottom: 16px;
    width: 64px;
    height: 64px;
  }

  .floating-whatsapp-bubble {
    font-size: 12px;
    padding: 10px 14px;
    right: calc(100% + 10px);
  }

  .floating-whatsapp img {
    width: 34px;
    height: 34px;
  }
}
</style>
