<template>
  <FleetLanding :content="content" />
</template>

<script setup>
import FleetLanding from "../components/FleetLanding.vue";

const content = {
  fallbackImage: "images/Ourfleet/Ourfleet.jpg",
  hero: {
    eyebrow: "Private Aviation Collection",
    title: "Executive Fleet",
    subtitle: "Luxury aircraft for business and private travel",
    image: "images/Ourfleet/Ourfleet.jpg",
    alt: "Executive Fleet",
  },
  intro: {
    kicker: "Private Aviation Collection",
    title: "Aircraft selected for executive travel, flexibility and comfort",
    description:
      "Explore our active fleet and review availability at a glance before requesting a tailored quote.",
    totalLabel: "active aircraft",
  },
  loading: "Loading fleet aircraft...",
  actions: {
    view: "View Aircraft",
    quote: "Get a Quote",
  },
  specs: {
    passengers: "pax",
    range: "hrs",
    rate: "Rate",
    hour: "hour",
  },
  status: {
    available: "Available for Charter",
    unavailable: "Currently Unavailable",
  },
  pagination: {
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
  modal: {
    close: "X",
    passengers: "Passengers",
    range: "Range",
    rate: "Rate",
  },
};
</script>
