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
  filters: {
    search: "Search aircraft",
    searchPlaceholder: "Aircraft name or brand",
    category: "Trip type",
    allCategories: "All options",
    base: "Home base",
    allBases: "All bases",
    passengers: "People on board",
    passengersPlaceholder: "Minimum passengers",
    results: "aircraft found",
    empty: "No aircraft matched those filters.",
    categoryOptions: {
      helicopter: "Helicopter · flexible for short trips",
      singleEngine: "Small plane · practical for a few passengers",
      turboprop: "Turboprop · efficient for regional flights",
      lightJet: "Light jet · fast for small groups",
      midJet: "Midsize jet · more space and range",
      superMidJet: "Large jet · more comfort for longer trips",
      heavyJet: "Long-range jet · spacious cabin",
      regionalJet: "Regional jet · higher capacity for groups",
    },
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
