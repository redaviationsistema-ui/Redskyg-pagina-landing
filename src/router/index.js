import { createRouter, createWebHistory } from "vue-router";

import HomeEn from "../views/Home.vue";
import HomeEs from "../views/HomeEs.vue";
import AboutUs from "../views/AboutUs.vue";
import Pricing from "../views/Pricing.vue";
import PricingEs from "../views/PricingEs.vue";
import Blog from "../views/Blog.vue";
import Faq from "../views/Faq.vue";
import Contact from "../views/Contact.vue";
import ContactEs from "../views/ContactEs.vue";
import OurFleet from "../views/OurFleet.vue";
import OurFleetEs from "../views/OurFleetEs.vue";
import Reserva from "../views/Reserva.vue";
import Airports from "../views/Airports.vue";
import ThankYou from "../views/ThankYou.vue";
import { DEFAULT_LOCALE, detectPreferredLocale } from "../i18n/site";

const routeDefinitions = [
  { pageKey: "home", path: "", componentByLocale: { "es-mx": HomeEs, "en-us": HomeEn } },
  { pageKey: "about", path: "about", component: AboutUs },
  {
    pageKey: "pricing",
    path: "pricing",
    componentByLocale: { "es-mx": PricingEs, "en-us": Pricing },
  },
  { pageKey: "blog", path: "blog", component: Blog },
  { pageKey: "faq", path: "faq", component: Faq },
  {
    pageKey: "contact",
    path: "contact",
    componentByLocale: { "es-mx": ContactEs, "en-us": Contact },
  },
  {
    pageKey: "fleet",
    path: "fleet",
    componentByLocale: { "es-mx": OurFleetEs, "en-us": OurFleet },
    aliases: ["ourfleet"],
  },
  { pageKey: "reserva", path: "reserva", component: Reserva },
  { pageKey: "airports", path: "airports", component: Airports },
  { pageKey: "thankYou", path: "thank-you", component: ThankYou },
];

function createLocalizedRoutes(locale) {
  return routeDefinitions.flatMap((routeDefinition) => {
    const component =
      routeDefinition.componentByLocale?.[locale] ?? routeDefinition.component;

    const basePath = routeDefinition.path
      ? `/${locale}/${routeDefinition.path}`
      : `/${locale}`;

    const aliases = (routeDefinition.aliases ?? []).map(
      (alias) => `/${locale}/${alias}`,
    );

    return [
      {
        path: basePath,
        alias: aliases,
        name: `${locale}-${routeDefinition.pageKey}`,
        component,
        meta: {
          locale,
          pageKey: routeDefinition.pageKey,
        },
      },
    ];
  });
}

const routes = [
  {
    path: "/",
    redirect: () => ({ path: `/${detectPreferredLocale()}` }),
  },
  ...createLocalizedRoutes("es-mx"),
  ...createLocalizedRoutes("en-us"),
  {
    path: "/about",
    redirect: `/${DEFAULT_LOCALE}/about`,
  },
  {
    path: "/pricing",
    redirect: `/${DEFAULT_LOCALE}/pricing`,
  },
  {
    path: "/blog",
    redirect: `/${DEFAULT_LOCALE}/blog`,
  },
  {
    path: "/faq",
    redirect: `/${DEFAULT_LOCALE}/faq`,
  },
  {
    path: "/contact",
    redirect: `/${DEFAULT_LOCALE}/contact`,
  },
  {
    path: "/ourfleet",
    redirect: `/${DEFAULT_LOCALE}/fleet`,
  },
  {
    path: "/fleet",
    redirect: `/${DEFAULT_LOCALE}/fleet`,
  },
  {
    path: "/reserva",
    redirect: `/${DEFAULT_LOCALE}/reserva`,
  },
  {
    path: "/airports",
    redirect: `/${DEFAULT_LOCALE}/airports`,
  },
  {
    path: "/thank-you",
    redirect: `/${DEFAULT_LOCALE}/thank-you`,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: `/${DEFAULT_LOCALE}`,
  },
];

export default createRouter({
  history: createWebHistory("/landing/"),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});
