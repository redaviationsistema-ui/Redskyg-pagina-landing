<template>
  <PricingLanding :content="content" />
</template>

<script setup>
import PricingLanding from "../components/PricingLanding.vue";

const sharedFeatures = [
  "First-class",
  "Lounges",
  "Bathrooms",
  "Kitchens",
  "Bedrooms",
  "Meetings room",
  "Pet rooms",
  "Technology",
];

const content = {
  hero: {
    eyebrow: "Pricing",
    title: "Pricing",
    subtitle:
      "Transparent charter planning for executive, leisure and mission-critical flights.",
    image: "images/Pricing/pricing.webp",
    alt: "Pricing",
  },
  packages: {
    kicker: "Pricing",
    title: "Choose Your Package",
    description:
      "Flexible private aviation solutions designed around frequency, service level and operational complexity.",
    noteStrong: "Online quote available.",
    note:
      " Start your request in our flight form to choose route, aircraft, passengers and trip details without leaving the website.",
    items: [
      {
        name: "On Demand",
        price: "Custom",
        period: "/ per trip",
        features: sharedFeatures,
        cta: "Request Quote",
      },
      {
        name: "Corporate Access",
        price: "Priority",
        period: "/ service plan",
        badge: "Recommended",
        featured: true,
        features: sharedFeatures,
        cta: "Talk to an Advisor",
      },
      {
        name: "Special Missions",
        price: "Tailored",
        period: "/ operation",
        features: sharedFeatures,
        cta: "Plan My Flight",
      },
    ],
  },
  cta: {
    kicker: "Private Quote",
    title: "Ready to Fly Private?",
    description:
      "Our flight advisors are available 24/7 to prepare your personalized private jet quote within minutes.",
    button: "Request Your Private Quote on WhatsApp",
    href: "https://wa.me/525586186576?text=Hello,%20I%20would%20like%20to%20request%20a%20private%20flight%20quote",
  },
  services: {
    kicker: "Service Areas",
    title: "Private Aviation Solutions",
    description:
      "Every service is managed with discretion, operational discipline and personalized support from departure to arrival.",
    items: [
      {
        title: "Business Jet Charter",
        description:
          "Executive private flights tailored for business leaders seeking efficiency, discretion, and seamless global mobility.",
        image: "images/Pricing/Pricing2.jpg",
        alt: "Business Jet Charter",
      },
      {
        title: "Pet Flights",
        description:
          "Safe and comfortable private air travel solutions designed to transport your pets with the highest level of care.",
        image: "images/Pricing/Pricing3.jpg",
        alt: "Pet Flights",
      },
      {
        title: "Air Freight & Cargo",
        description:
          "Secure and time-sensitive cargo transport ensuring reliable delivery across national and international destinations.",
        image: "images/Pricing/Pricing4.jpg",
        alt: "Air Freight & Cargo",
      },
      {
        title: "Air Ambulance",
        description:
          "Rapid-response medical air transport equipped for critical care and emergency patient transfer worldwide.",
        image: "images/Pricing/Pricing5.jpg",
        alt: "Air Ambulance",
      },
    ],
  },
  faq: {
    kicker: "Services",
    title: "Our Services Jet Charter",
    description:
      "Clear operational guidance to help you understand how private aviation pricing is structured.",
    items: [
      {
        title: "Acquisition Cost/Monthly Lease Payment",
        content:
          "Details about acquisition or monthly lease payment for aircraft services.",
      },
      {
        title: "Monthly Management Fee",
        content: "Information regarding monthly aircraft management fees.",
      },
      {
        title: "Fuel Variable Rate",
        content:
          "Fuel variable rates depending on flight hours and destination.",
      },
      {
        title: "No Positioning Costs",
        content: "We do not charge repositioning costs in selected packages.",
      },
      {
        title: "No Minimum Flight Charges",
        content: "No minimum flight hour charges for our clients.",
      },
    ],
  },
};
</script>
