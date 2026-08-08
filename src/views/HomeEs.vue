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
      "Aeronave, tripulación, itinerario y atención en tierra bajo una sola coordinación. Para quienes valoran su tiempo, privacidad y certeza.",
    benefits: [
      "Respuesta inmediata",
      "Atención 24/7",
      "México · Estados Unidos · Internacional",
      "Atención discreta y personalizada",
    ],
    primaryCta: "Cotizar mi vuelo",
    secondaryCta: "Hablar con un asesor",
    poster: "images/jet-interior-2.webp",
    video: "images/Home/home2.mp4",
    metrics: [
      { value: "24/7", label: "Coordinación de vuelo" },
      { value: "Experiencia", label: "Atención aeronáutica" },
      { value: "MX · US · Global", label: "Cobertura internacional" },
    ],
  },
  signals: [
    "Disponibilidad",
    "Precisión operativa",
    "Privacidad",
    "Continuidad",
  ],
  why: {
    eyebrow: "Por qué Sky Group",
    title: "Una coordinación de vuelo pensada para tu itinerario.",
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
    title: "Opciones de vuelo para quienes no pueden perder tiempo.",
    description:
      "Jets privados, turbohélices y helicópteros seleccionados según ruta, capacidad, alcance y perfil de misión.",
    cta: "Ver aeronaves disponibles",
    allLabel: "Todas",
    modelCta: "Ver modelos",
    backgroundImage: "images/Home/FONDO/home1.png",
    decorImage: "images/Home/FONDO/supermijet.png",
    benefitsLabel: "Ventajas operativas",
    benefits: [
      {
        icon: "coverage",
        title: "Acceso a más aeropuertos",
        description: "Más alternativas de salida y llegada según la operación y el itinerario.",
      },
      {
        icon: "operations",
        title: "Respuesta inmediata",
        description: "Atención continua para revisar opciones y coordinar cada solicitud con agilidad.",
      },
      {
        icon: "secure",
        title: "Privacidad y discreción",
        description: "Atención enfocada en pasajeros que requieren reserva, orden y seguimiento puntual.",
      },
      {
        icon: "tailored",
        title: "Opciones a la medida",
        description: "Aeronaves y operación alineadas con el tipo de viaje, pasajeros y tiempos disponibles.",
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
    title: "Contenido real, atención directa y seguimiento operativo.",
    description:
      "La experiencia Sky Group se refleja en la coordinación del itinerario, la atención al pasajero y el cuidado visible en cada etapa del viaje.",
    badge: "images/Home/ISBAO.png",
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
