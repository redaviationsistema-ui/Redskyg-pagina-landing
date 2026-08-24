<template>
  <HomeLanding :content="content" />
</template>

<script setup>
import HomeLanding from "../components/HomeLanding.vue";
import { getLocaleConfig } from "../i18n/site";

const localeCopy = getLocaleConfig("en-us");
const whatsappHref = `https://wa.me/525586186576?text=${encodeURIComponent(
  localeCopy.layout.whatsappMessage,
)}`;

const content = {
  whatsapp: {
    href: whatsappHref,
  },
  hero: {
    eyebrow: "Private Aviation in Mexico and Worldwide",
    title: "Your private flight, coordinated from start to finish.",
    description:
      "Aircraft, crew, itinerary and ground support under one coordination flow. For travelers who value time, privacy and certainty.",
    benefits: [
      "Immediate response",
      "24/7 support",
      "Mexico · United States · International",
      "Discrete, personalized attention",
    ],
    primaryCta: "Quote My Flight",
    secondaryCta: "Talk to an Advisor",
    poster: "images/jet-interior-2.webp",
    video: "images/Home/Video3.mp4",
    mobileVideo: "images/Home/6.mp4",
    metrics: [
      { value: "24/7", label: "flight coordination" },
      { value: "Aviation", label: "coordination support" },
      { value: "MX · US · Global", label: "international coverage" },
    ],
  },
  signals: ["Availability", "Precision", "Privacy", "Continuity"],
  why: {
    eyebrow: "Why Sky Group",
    title: "Private aviation coordination built around your itinerary.",
    image: "images/Home/IMG_0319.jpeg",
    imageAlt: "Sky Group private flight onboard experience",
    items: [
      {
        icon: "sparkles",
        title: "Availability",
        description:
          "Aircraft options aligned with your itinerary, travel profile and mission requirements.",
      },
      {
        icon: "route",
        title: "Precision",
        description:
          "Route, timing and operations coordinated around your mission from the first request.",
      },
      {
        icon: "shield",
        title: "Privacy",
        description:
          "Discreet support for passengers, families and executive teams that need certainty.",
      },
      {
        icon: "handshake",
        title: "Continuity",
        description:
          "One point of contact before, during and after the flight to keep every detail in sync.",
      },
    ],
  },
  experience: {
    eyebrow: "The Sky Group Experience",
    title: "The difference is what happens before takeoff.",
    description:
      "Ground coordination, catering, transportation, passenger support and itinerary follow-up as part of one carefully managed experience.",
    video: "images/Home/CATERIING/giv.mp4",
    image: "images/jet-interior-2.webp",
    alt: "Private cabin experience",
  },
  catering: {
    eyebrow: "Beyond the Flight",
    title: "Every detail can be part of the journey.",
    description:
      "Catering, ground transportation, concierge support and special requests as part of a passenger-focused coordination experience.",
    imageAlt: "Private flight catering service",
    previousLabel: "View previous catering image",
    nextLabel: "View next catering image",
    paginationLabel: "Catering carousel navigation",
    slideLabel: "Go to catering image",
  },
  flow: {
    eyebrow: "How It Works",
    title: "Request, select and fly.",
    description:
      "A clear process to quote your mission, review available options and coordinate the right flight without unnecessary friction.",
    steps: [
      {
        title: "Request",
        description: "Route, date and passengers.",
      },
      {
        title: "Select",
        description: "Receive aircraft and itinerary options.",
      },
      {
        title: "Fly",
        description: "We confirm and coordinate your mission.",
      },
    ],
  },
  fleet: {
    eyebrow: "Available Aircraft",
    title: "Flight options for travelers who cannot lose time.",
    description:
      "Private jets, turboprops and helicopters selected according to route, capacity, range and mission profile.",
    cta: "View Available Aircraft",
    allLabel: "All",
    modelCta: "View models",
    backgroundImage: "images/Home/FONDO/GulfstreamG550.jpg",
    decorImage: "images/Home/FONDO/supermijet.png",
    benefitsLabel: "Operational advantages",
    benefits: [
      {
        icon: "coverage",
        label: "Closer to your destination",
        title: "Access to more airports",
        description: "Expand your departure and arrival options, bringing you closer to where you truly need to be.",
      },
      {
        icon: "operations",
        label: "Your schedule sets the flight",
        title: "Flexibility at your pace",
        description: "Flight times and alternatives that adapt to your plans, not the other way around.",
      },
      {
        icon: "secure",
        label: "Travel in complete privacy",
        title: "Discretion at every moment",
        description: "A private, personalized experience, carefully managed from your arrival to your destination.",
      },
      {
        icon: "tailored",
        label: "The right aircraft for every journey",
        title: "A solution for every mission",
        description: "We select the most suitable aircraft based on your destination, passengers, range and preferences.",
      },
    ],
    assurance: {
      title: "Operational coordination and executive support in every request.",
      description:
        "We present flight options and support planning with clear follow-up before takeoff.",
    },
    items: [
      {
        name: "HELICOPTERS",
        meta: "Direct access for short regional routes.",
        image: "images/Home/AVIONES/Helicoptero.png",
        alt: "Private helicopter",
        icon: "helicopter",
        stats: [
          { icon: "passengers", value: "1-6", label: "Passengers" },
          { icon: "range", value: "700 km", label: "Range" },
          { icon: "speed", value: "250 km/h", label: "Speed" },
        ],
      },
      {
        name: "TURBOPROPS",
        meta: "Efficient aircraft for regional travel.",
        image: "images/Home/AVIONES/TURBOH.png",
        alt: "Turboprop aircraft",
        icon: "turboprop",
        stats: [
          { icon: "passengers", value: "6-9", label: "Passengers" },
          { icon: "range", value: "2,000 km", label: "Range" },
          { icon: "speed", value: "550 km/h", label: "Speed" },
        ],
      },
      {
        name: "LIGHT JETS",
        meta: "Fast aircraft for smaller groups.",
        image: "images/Home/AVIONES/LIGHT_JETS.png",
        alt: "Light jet",
        icon: "light",
        stats: [
          { icon: "passengers", value: "4-8", label: "Passengers" },
          { icon: "range", value: "3,200 km", label: "Range" },
          { icon: "speed", value: "780 km/h", label: "Speed" },
        ],
      },
      {
        name: "MID JETS",
        meta: "Balanced range and cabin comfort.",
        image: "images/Home/AVIONES/MID_JETS.png",
        alt: "Mid jet",
        icon: "mid",
        stats: [
          { icon: "passengers", value: "6-9", label: "Passengers" },
          { icon: "range", value: "4,200 km", label: "Range" },
          { icon: "speed", value: "850 km/h", label: "Speed" },
        ],
      },
      {
        name: "SUPER MID",
        meta: "More range for executive missions.",
        image: "images/Home/AVIONES/SUPER_MID.png",
        alt: "Super midsize jet",
        icon: "super",
        stats: [
          { icon: "passengers", value: "8-12", label: "Passengers" },
          { icon: "range", value: "5,800 km", label: "Range" },
          { icon: "speed", value: "880 km/h", label: "Speed" },
        ],
      },
      {
        name: "HEAVY",
        meta: "Long-range aircraft with spacious cabins.",
        image: "images/Home/AVIONES/HEAVY.png",
        alt: "Heavy jet",
        icon: "heavy",
        stats: [
          { icon: "passengers", value: "10-19", label: "Passengers" },
          { icon: "range", value: "10,000+ km", label: "Range" },
          { icon: "speed", value: "920 km/h", label: "Speed" },
        ],
      },
    ],
  },
  trust: {
    eyebrow: "Experience and Credibility",
    title: "Real content, direct support and operational follow-up.",
    description:
      "The Sky Group experience is reflected in itinerary coordination, passenger care and visible attention to detail throughout the journey.",
    image: "images/Home/IMG_0334.jpeg",
    imageAlt: "Executive cabin with premium Sky Group attention",
    badge: "images/Home/CATERIING/experiencia.png",
    badgeAlt: "IS-BAO certification",
    items: [
      "Ground coordination",
      "Passenger support",
      "Itinerary follow-up",
    ],
  },
  lookbooks: {
    enabled: true,
  },
  cta: {
    eyebrow: "Flight Request",
    title: "Your next flight starts with a conversation.",
    description:
      "Tell us your origin, destination, date and passenger count. Our team will prepare the most suitable options for your mission.",
    primary: "Request a Quote",
    phoneHref: "tel:+525586186576",
    phoneLabel: "+52 55 8618 6576",
    supportingText: "Private support · 24/7 · Mexico and international",
  },
};
</script>
