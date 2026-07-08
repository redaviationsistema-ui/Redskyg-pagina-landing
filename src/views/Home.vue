<template>
  <HomeLanding :content="content" />
</template>

<script setup>
import HomeLanding from "../components/HomeLanding.vue";

const content = {
  whatsapp: {
    href: "https://wa.me/525586186576",
  },
  hero: {
    eyebrow: "Private Aviation in Mexico and Worldwide",
    title: "Private flights with executive control from takeoff to arrival.",
    description:
      "Sky Group coordinates aircraft, crew and route execution for executives, family offices and time-sensitive travel.",
    primaryCta: "Request a Flight",
    secondaryCta: "Talk to an Advisor",
    poster: "images/Home/home2.jpg",
    video: "images/Home/home2.mp4",
    metrics: [
      { value: "24/7", label: "flight coordination" },
      { value: "20+", label: "years in aviation" },
      { value: "MX / US", label: "regional support" },
    ],
  },
  signals: ["No lines", "No layovers", "Private terminals", "Direct support"],
  why: {
    eyebrow: "Benefits",
    title: "Private aviation designed around speed, privacy and certainty.",
    items: [
      {
        icon: "globe",
        title: "Worldwide coverage",
        description:
          "Regional and international aircraft access through one point of contact.",
      },
      {
        icon: "route",
        title: "Clear proposals",
        description:
          "Aircraft options aligned with route, schedule and mission profile.",
      },
      {
        icon: "clock",
        title: "Airport flexibility",
        description:
          "Practical routing and airport access support for smoother departures.",
      },
      {
        icon: "handshake",
        title: "Client relationships",
        description:
          "Executive service for recurring corporate and private travel.",
      },
      {
        icon: "sparkles",
        title: "Rapid activation",
        description:
          "Responsive coordination for urgent and time-sensitive itineraries.",
      },
      {
        icon: "shield",
        title: "Safety focus",
        description:
          "Qualified crews, compliance awareness and disciplined execution.",
      },
    ],
  },
  experience: {
    eyebrow: "Social Proof",
    title: "Real flight moments, handled with executive precision.",
    description:
      "Executive departures, ground support and private cabin environments.",
    image: "images/Home/home3.jpg",
    alt: "Private cabin experience",
  },
  flow: {
    eyebrow: "How It Works",
    title: "Request your private flight in three controlled steps.",
    description:
      "Clear options, direct communication and operational discipline from the first request to departure.",
    steps: [
      {
        title: "Request a quote",
        description: "Share route, date and passengers to activate your request.",
      },
      {
        title: "Receive options",
        description:
          "Receive aircraft and schedule options tailored to the mission.",
      },
      {
        title: "Confirm and fly",
        description:
          "Confirm the best option and depart with direct coordination.",
      },
    ],
  },
  fleet: {
    eyebrow: "Operational Brief",
    title: "Built for clients who cannot lose time.",
    description:
      "Aircraft selection, itinerary review and operational follow-up in one precise, discreet flow.",
    cta: "Our Fleet",
    allLabel: "All",
    modelCta: "View models",
    assurance: {
      title: "Safety, experience and technology on every flight.",
      description:
        "International certifications and high-standard aviation practices.",
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
    eyebrow: "Operational Trust",
    title: "Safety standards and experience behind every operation.",
    description:
      "Every flight is managed with compliance awareness, qualified coordination and proven executive aviation experience.",
    badge: "images/Home/ISBAO.png",
    badgeAlt: "IS-BAO certification",
    items: [
      "Operational safety",
      "Standards and compliance",
      "Proven experience",
    ],
  },
  cta: {
    eyebrow: "Final CTA",
    title: "Ready to move with private aviation precision?",
    description:
      "Share your route and receive aircraft options, timing and direct operational support.",
    primary: "Request Your Flight",
    phoneHref: "tel:+525586186576",
    phoneLabel: "+52 55 8618 6576",
  },
};
</script>
