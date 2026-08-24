<template>
  <HomeLanding :content="content" />
</template>

<script setup>
import HomeLanding from "../components/HomeLanding.vue";
import { getLocaleConfig } from "../i18n/site";

const localeCopy = getLocaleConfig("es-mx");
const whatsappHref = `https://wa.me/525586186576?text=${encodeURIComponent(
  localeCopy.layout.whatsappMessage,
)}`;

const content = {
  whatsapp: {
    href: whatsappHref,
  },
  hero: {
    eyebrow: "Aviación privada en México y el mundo",
    title: "Tu vuelo privado, coordinado de principio a fin.",
    description:
      "Tu destino, tus horarios, tus prioridades. Una experiencia de vuelo diseñada alrededor de ti.",
    benefits: [
      "Respuesta inmediata",
      "Atención 24/7",
      "México · Estados Unidos · Internacional",
      "Atención discreta y personalizada",
    ],
    primaryCta: "Cotizar mi vuelo",
    secondaryCta: "Hablar con un asesor",
    poster: "images/jet-interior-2.webp",
    video: "images/Home/Video3.mp4",
    mobileVideo: "images/Home/6.mp4",
    metrics: [
      { value: "24/7", label: "Coordinación de vuelo" },
      { value: "Experiencia", label: "25 años de servicio continuo" },
      { value: "MX · US · Global", label: "Cobertura internacional" },
    ],
  },
  signals: [
    "Disponibilidad",
    "Solidez operativa",
    "Privacidad",
    "Continuidad",
  ],
  why: {
    eyebrow: "Por qué Sky Group",
    title: "Una coordinación de vuelo pensada para tu itinerario.",
    image: "images/Home/IMG_0319.jpeg",
    imageAlt: "Experiencia a bordo en vuelo privado Sky Group",
    items: [
      {
        icon: "sparkles",
        title: "Disponibilidad",
        description:
          "Opciones de aeronave alineadas con tu itinerario, perfil de viaje y necesidades de misión.",
      },
      {
        icon: "route",
        title: "Precisión",
        description:
          "Ruta, horarios y operación coordinados alrededor de tu misión desde la primera solicitud.",
      },
      {
        icon: "shield",
        title: "Privacidad",
        description:
          "Atención discreta para pasajeros, familias y equipos ejecutivos que necesitan certeza.",
      },
      {
        icon: "handshake",
        title: "Continuidad",
        description:
          "Un solo punto de contacto antes, durante y después del vuelo para dar seguimiento a cada detalle.",
      },
    ],
  },
  experience: {
    eyebrow: "Experiencia Sky Group",
    title: "La diferencia está en lo que sucede antes de despegar.",
    description:
      "Coordinación en tierra, catering, transporte, atención al pasajero y seguimiento del itinerario en una experiencia cuidada de principio a fin.",
    video: "images/Home/CATERIING/giv.mp4",
    image: "images/jet-interior-2.webp",
    alt: "Cabina privada",
  },
  catering: {
    eyebrow: "Más allá del vuelo",
    title: "Cada detalle también puede ser parte del viaje.",
    description:
      "Catering, transporte terrestre, concierge y solicitudes especiales como parte de una coordinación pensada para el pasajero.",
    imageAlt: "Servicio de catering para vuelo privado",
    previousLabel: "Ver imagen anterior de catering",
    nextLabel: "Ver siguiente imagen de catering",
    paginationLabel: "Navegación del carrusel de catering",
    slideLabel: "Ir a la imagen de catering",
  },
  flow: {
    eyebrow: "Cómo funciona",
    title: "Solicita, selecciona y vuela.",
    description:
      "Un proceso claro para cotizar, elegir la mejor opción disponible y coordinar tu misión sin fricción innecesaria.",
    steps: [
      {
        title: "Solicita",
        description: "Ruta, fecha y pasajeros.",
      },
      {
        title: "Selecciona",
        description: "Recibe opciones de aeronave e itinerario.",
      },
      {
        title: "Vuela",
        description: "Confirmamos y coordinamos tu misión.",
      },
    ],
  },
  fleet: {
    eyebrow: "Aeronaves disponibles",
    title: "Opciones de vuelo para quienes entienden el valor de su tiempo.",
    description:
      "Seleccionamos la aeronave adecuada, coordinamos cada etapa del itinerario y mantenemos un solo punto de contacto durante toda la misión.",
    cta: "Ver aeronaves disponibles",
    allLabel: "Todas",
    modelCta: "Ver modelos",
    backgroundImage: "images/Home/FONDO/GulfstreamG550.jpg",
    decorImage: "images/Home/FONDO/supermijet.png",
    benefitsLabel: "Ventajas operativas",
    benefits: [
      {
        icon: "coverage",
        label: "Más cerca de tu destino",
        title: "Acceso a más aeropuertos",
        description: "Amplía tus posibilidades de salida y llegada, acercándote más a donde realmente necesitas estar.",
      },
      {
        icon: "operations",
        label: "Tu agenda marca el vuelo",
        title: "Flexibilidad a tu ritmo",
        description: "Horarios y alternativas de vuelo que se adaptan a tus planes, no al contrario.",
      },
      {
        icon: "secure",
        label: "Viaja con total privacidad",
        title: "Discreción en cada momento",
        description: "Una experiencia reservada, personalizada y cuidada desde tu llegada hasta tu destino.",
      },
      {
        icon: "tailored",
        label: "El avión correcto para cada viaje",
        title: "Una solución para cada misión",
        description: "Seleccionamos la aeronave más adecuada según tu destino, pasajeros, alcance y preferencias.",
      },
    ],
    assurance: {
      title: "Coordinación operativa y atención ejecutiva en cada solicitud.",
      description:
        "Mostramos opciones de vuelo y acompañamos la planeación con seguimiento claro antes de despegar.",
    },
    items: [
      {
        name: "HELICÓPTEROS",
        meta: "Helicóptero",
        image: "images/Home/AVIONES/Helicoptero.png",
        alt: "Helicóptero",
        icon: "helicopter",
        stats: [
          { icon: "passengers", value: "1-6", label: "Pasajeros" },
          { icon: "range", value: "700 km", label: "Alcance" },
          { icon: "speed", value: "250 km/h", label: "Velocidad" },
        ],
      },
      {
        name: "TURBOHÉLICES",
        meta: "Regional eficiente",
        image: "images/Home/AVIONES/TURBOH.png",
        alt: "Turbohélice",
        icon: "turboprop",
        stats: [
          { icon: "passengers", value: "6-9", label: "Pasajeros" },
          { icon: "range", value: "2,000 km", label: "Alcance" },
          { icon: "speed", value: "550 km/h", label: "Velocidad" },
        ],
      },
      {
        name: "LIGHT JETS",
        meta: "Jet ligero",
        image: "images/Home/AVIONES/LIGHT_JETS.png",
        alt: "Jet ligero",
        icon: "light",
        stats: [
          { icon: "passengers", value: "4-8", label: "Pasajeros" },
          { icon: "range", value: "3,200 km", label: "Alcance" },
          { icon: "speed", value: "780 km/h", label: "Velocidad" },
        ],
      },
      {
        name: "MID JETS",
        meta: "Jet mediano",
        image: "images/Home/AVIONES/MID_JETS.png",
        alt: "Jet mediano",
        icon: "mid",
        stats: [
          { icon: "passengers", value: "6-9", label: "Pasajeros" },
          { icon: "range", value: "4,200 km", label: "Alcance" },
          { icon: "speed", value: "850 km/h", label: "Velocidad" },
        ],
      },
      {
        name: "SUPER MID",
        meta: "Jet super mediano",
        image: "images/Home/AVIONES/SUPER_MID.png",
        alt: "Jet super mediano",
        icon: "super",
        stats: [
          { icon: "passengers", value: "8-12", label: "Pasajeros" },
          { icon: "range", value: "5,800 km", label: "Alcance" },
          { icon: "speed", value: "880 km/h", label: "Velocidad" },
        ],
      },
      {
        name: "HEAVY",
        meta: "Jet de largo alcance",
        image: "images/Home/AVIONES/HEAVY.png",
        alt: "Jet de largo alcance",
        icon: "heavy",
        stats: [
          { icon: "passengers", value: "10-19", label: "Pasajeros" },
          { icon: "range", value: "10,000+ km", label: "Alcance" },
          { icon: "speed", value: "920 km/h", label: "Velocidad" },
        ],
      },
    ],
  },
  trust: {
    eyebrow: "Experiencia y credibilidad",
    title: "Operación sólida, atención al cliente y seguimiento operativo.",
    description:
      "La experiencia Sky Group se refleja en la coordinación del itinerario, la atención al pasajero y el cuidado visible en cada etapa del viaje.",
    image: "images/Home/IMG_0334.jpeg",
    imageAlt: "Cabina ejecutiva con atención premium Sky Group",
    badge: "images/Home/CATERIING/experiencia.png",
    badgeAlt: "Certificacion IS-BAO",
    items: [
      "Coordinación en tierra",
      "Atención al pasajero",
      "Seguimiento del itinerario",
    ],
  },
  lookbooks: {
    enabled: true,
  },
  cta: {
    eyebrow: "Solicitud de vuelo",
    title: "Tu próximo vuelo comienza con una conversación.",
    description:
      "Dinos origen, destino, fecha y número de pasajeros. Nuestro equipo preparará las opciones más adecuadas para tu misión.",
    primary: "Solicitar cotización",
    phoneHref: "tel:+525586186576",
    phoneLabel: "+52 55 8618 6576",
    supportingText: "Atención privada · 24/7 · México e internacional",
  },
};
</script>
