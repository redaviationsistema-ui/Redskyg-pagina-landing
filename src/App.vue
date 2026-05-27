<template>
  <!-- 🔥 ROOT ÚNICO -->
  <div id="app">
    <Suspense>
      <template #default>
        <RouterView v-slot="{ Component }">
          <transition name="page-slide" mode="out-in">
            <!-- 🔥 Wrapper obligatorio -->
            <div v-if="Component" :key="$route.fullPath">
              <component :is="Component" />
            </div>
          </transition>
        </RouterView>
      </template>

      <template #fallback>
        <div class="loading">Loading…</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";
import { watch } from "vue";
import { getSeoForRoute } from "./i18n/site";

const $route = useRoute();

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertLink(rel, href, hreflang) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;

  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    if (hreflang) {
      element.setAttribute("hreflang", hreflang);
    }
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

watch(
  () => $route.fullPath,
  () => {
    const seo = getSeoForRoute($route);

    document.documentElement.lang = seo.htmlLang;
    document.title = seo.title;

    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "robots", seo.robots);
    upsertMeta("property", "og:locale", seo.ogLocale);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", seo.siteName);
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:url", seo.canonical);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);

    upsertLink("canonical", seo.canonical);
    seo.alternates.forEach((alternate) => {
      upsertLink("alternate", alternate.href, alternate.hreflang);
    });
  },
  { immediate: true },
);
</script>

<style>
/* ===============================
   PAGE TRANSITION
================================ */

.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}


.page-slide-enter-from {
  opacity: 0;
  transform: translateY(80px);
}

.page-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

/* ===============================
   LOADING
================================ */

.loading {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: white;
  background: #000;
}
</style>
