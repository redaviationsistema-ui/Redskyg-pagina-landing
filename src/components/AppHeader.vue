<template>
  <header class="header" :class="{ scrolled }">
    <div class="header-inner">
      <nav class="nav nav-left">
        <RouterLink :to="localizedPath('home')" class="nav-link">
          {{ copy.home }}
        </RouterLink>
        <RouterLink :to="localizedPath('reserva')" class="nav-link cta">
          {{ copy.requestFlight }}
        </RouterLink>
        <RouterLink :to="localizedPath('fleet')" class="nav-link">
          {{ copy.fleet }}
        </RouterLink>
        <RouterLink :to="localizedPath('pricing')" class="nav-link">
          {{ copy.pricing }}
        </RouterLink>
      </nav>

      <div class="logo">
        <RouterLink :to="localizedPath('home')">
          <img src="/images/logoo.png" alt="Sky Group Logo" />
        </RouterLink>
      </div>

      <nav class="nav nav-right">
        <RouterLink :to="localizedPath('contact')" class="nav-link">
          {{ copy.contact }}
        </RouterLink>
        <div class="locale-switch">
          <RouterLink
            :to="switchLocalePath('es-mx')"
            class="locale-link"
            :class="{ active: locale === 'es-mx' }"
          >
            ES
          </RouterLink>
          <RouterLink
            :to="switchLocalePath('en-us')"
            class="locale-link"
            :class="{ active: locale === 'en-us' }"
          >
            EN
          </RouterLink>
        </div>
      </nav>

      <div class="hamburger" @click="toggleMenu">
        <span :class="{ open: mobileOpen }"></span>
        <span :class="{ open: mobileOpen }"></span>
        <span :class="{ open: mobileOpen }"></span>
      </div>
    </div>
  </header>

  <div class="mobile-menu" :class="{ active: mobileOpen }">
    <RouterLink :to="localizedPath('home')" @click="closeMenu">
      {{ copy.home }}
    </RouterLink>
    <RouterLink :to="localizedPath('reserva')" @click="closeMenu">
      {{ copy.requestFlight }}
    </RouterLink>
    <RouterLink :to="localizedPath('fleet')" @click="closeMenu">
      {{ copy.fleet }}
    </RouterLink>
    <RouterLink :to="localizedPath('pricing')" @click="closeMenu">
      {{ copy.pricing }}
    </RouterLink>
    <RouterLink :to="localizedPath('contact')" @click="closeMenu">
      {{ copy.contact }}
    </RouterLink>
    <div class="mobile-locales">
      <RouterLink :to="switchLocalePath('es-mx')" @click="closeMenu">ES</RouterLink>
      <RouterLink :to="switchLocalePath('en-us')" @click="closeMenu">EN</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const scrolled = ref(false);
const mobileOpen = ref(false);
const { locale, localeConfig, localizedPath, switchLocalePath } =
  useLocalizedNavigation();
const copy = computed(() => localeConfig.value.header);

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

const toggleMenu = () => {
  mobileOpen.value = !mobileOpen.value;
};

const closeMenu = () => {
  mobileOpen.value = false;
};

/* Bloquear scroll cuando menú está abierto */
watch(mobileOpen, (val) => {
  document.body.style.overflow = val ? "hidden" : "auto";
});

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

:root {
  --header-navy: #071624;
  --header-ink: #f4f7fb;
  --header-muted: rgba(244, 247, 251, 0.72);
  --header-accent: #d0ac67;
  --header-accent-soft: rgba(208, 172, 103, 0.14);
  --header-line: rgba(255, 255, 255, 0.12);
}

.logo img {
  filter: brightness(0) invert(1);
}
/* LOGO */
.logo img {
  height: 134px;
  transition: 0.35s ease;
}

.header.scrolled .logo img {
  height: 76px;
}


/* ===== HEADER BASE ===== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 136px;
  z-index: 10000;
  display: flex;
  align-items: center;
  transition: all 0.35s ease;
  background: transparent;
}

.header.scrolled {
  height: 84px;
  background: rgba(7, 22, 36, 0.88);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--header-line);
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.22);
}

/* ===== INNER ===== */
.header-inner {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

/* ===== NAV DESKTOP ===== */
.nav {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1.4rem;
  font-family: "Inter", sans-serif;
  font-size: 12px;
  letter-spacing: 0.16em;
  font-weight: 600;
  text-transform: uppercase;
}

.nav-left { justify-content: flex-start; }
.nav-right { justify-content: flex-end; }

.locale-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-left: 0.4rem;
}

.locale-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  min-height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--header-ink);
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 0.14em;
  transition: 0.25s ease;
}

.locale-link.active,
.locale-link:hover {
  background: rgba(208, 172, 103, 0.16);
  border-color: rgba(208, 172, 103, 0.4);
  color: var(--header-accent);
}

.nav-link {
  color: var(--header-ink);
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  opacity: 0.92;
}

.nav-link:hover {
  color: var(--header-accent);
  opacity: 1;
}

.nav-link.router-link-active {
  color: var(--header-accent);
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0%;
  height: 1px;
  background: linear-gradient(90deg, var(--header-accent), transparent);
  transition: 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* CTA */
.cta {
  padding: 0.8rem 1.15rem;
  border: 1px solid rgba(208, 172, 103, 0.45);
  border-radius: 999px;
  background: var(--header-accent-soft);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.cta:hover {
  background: rgba(208, 172, 103, 0.9);
  color: #071624;
  border-color: rgba(208, 172, 103, 0.9);
}


/* ===== HAMBURGER ===== */
/* ===== HAMBURGER PREMIUM ===== */
.hamburger {
  display: none;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s ease;
  position: relative;
}

.hamburger:hover {
  background: rgba(208, 172, 103, 0.16);
  border-color: rgba(208, 172, 103, 0.26);
}

.hamburger span {
  position: absolute;
  width: 18px;
  height: 2px;
  background: white;
  border-radius: 999px;
  transition: 0.3s ease;
}

.hamburger span:nth-child(1) {
  transform: translateY(-6px);
}

.hamburger span:nth-child(2) {
  transform: translateY(0);
}

.hamburger span:nth-child(3) {
  transform: translateY(6px);
}

/* Animación X */
.hamburger span.open:nth-child(1) {
  transform: rotate(45deg);
}

.hamburger span.open:nth-child(2) {
  opacity: 0;
}

.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg);
}
/* ===== MOBILE MENU ===== */
.mobile-menu {
  position: fixed;
  top: 84px;
  left: 0;
  width: 100%;
  background:
    linear-gradient(180deg, rgba(7, 22, 36, 0.98), rgba(7, 22, 36, 0.96));
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 2rem 1.5rem 2.5rem;
  transform: translateY(-20px);
  opacity: 0;
  pointer-events: none;
  transition: 0.3s ease;
  z-index: 9999;
  border-bottom: 1px solid var(--header-line);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.24);
}

.mobile-menu.active {
  transform: translateY(0);
  opacity: 1;
  pointer-events: all;
}

.mobile-menu a {
  width: min(92vw, 420px);
  color: white;
  text-decoration: none;
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.16em;
  padding: 1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.25s ease;
}

.mobile-menu a:hover,
.mobile-menu a.router-link-active {
  color: var(--header-accent);
  border-color: rgba(208, 172, 103, 0.3);
  background: rgba(208, 172, 103, 0.08);
}

.mobile-locales {
  display: flex;
  gap: 0.8rem;
}

.mobile-locales a {
  width: auto;
  min-width: 84px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {

  .nav-left,
  .nav-right {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .header {
    height: 84px;
    background: rgba(7, 22, 36, 0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .logo img {
    height: 70px;
  }

}
@media (max-width: 768px) {

  .nav-left,
  .nav-right {
    display: none;
  }

  .header-inner {
    position: relative;
    justify-content: center;
  }

  .logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .hamburger {
    display: flex;
    position: absolute;
    right: 20px;
  }

  .header {
    height: 84px;
    background: rgba(7, 22, 36, 0.92);
  }

  .logo img {
    height: 50px;
  }

}
</style>
