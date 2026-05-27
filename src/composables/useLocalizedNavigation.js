import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  DEFAULT_LOCALE,
  getLocaleConfig,
  getLocalizedPath,
  normalizeLocale,
} from "../i18n/site";

export function useLocalizedNavigation() {
  const route = useRoute();

  const locale = computed(() => normalizeLocale(route.meta?.locale ?? DEFAULT_LOCALE));
  const localeConfig = computed(() => getLocaleConfig(locale.value));
  const pageKey = computed(() => route.meta?.pageKey ?? "home");

  const localizedPath = (targetPageKey) => getLocalizedPath(locale.value, targetPageKey);
  const switchLocalePath = (targetLocale) =>
    getLocalizedPath(targetLocale, pageKey.value);

  return {
    locale,
    localeConfig,
    localizedPath,
    switchLocalePath,
  };
}
