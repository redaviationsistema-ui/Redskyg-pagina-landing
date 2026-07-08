<template>
  <HomeLanding :content="content" />
</template>

<script setup>
import HomeLanding from "../components/HomeLanding.vue";

const content = {
  whatsapp: {
    href: "https://wa.me/525586186576?text=Hola,%20quiero%20solicitar%20una%20cotizacion%20de%20vuelo%20privado.",
  },
  hero: {
    eyebrow: "Aviacion privada en Mexico y el mundo",
    title: "Vuelos privados con control ejecutivo de salida a llegada.",
    description:
      "Sky Group coordina aeronave, tripulacion y ruta para ejecutivos, familias y viajes donde el tiempo no puede esperar.",
    primaryCta: "Cotizar vuelo ahora",
    secondaryCta: "Recibir cotizacion en minutos",
    poster: "images/Home/home2.jpg",
    video: "images/Home/home2.mp4",
    metrics: [
      { value: "24/7", label: "coordinacion de vuelo" },
      { value: "20+", label: "años en aviacion" },
      { value: "MX / US", label: "soporte regional" },
    ],
  },
  signals: [
    "Sin filas",
    "Sin escalas",
    "Aeropuertos privados",
    "Atencion personalizada",
  ],
  why: {
    eyebrow: "Por Que Sky Group",
    title: "Aviacion privada diseñada para velocidad, privacidad y certeza.",
    items: [
      {
        icon: "globe",
        title: "Cobertura global",
        description:
          "Acceso regional e internacional con un solo punto de contacto.",
      },
      {
        icon: "route",
        title: "Propuestas claras",
        description:
          "Opciones alineadas con ruta, horario y perfil de mision.",
      },
      {
        icon: "clock",
        title: "Flexibilidad aeroportuaria",
        description:
          "Soporte en rutas, aeropuertos y salidas mas eficientes.",
      },
      {
        icon: "handshake",
        title: "Relacion ejecutiva",
        description:
          "Servicio pensado para viajes corporativos y privados recurrentes.",
      },
      {
        icon: "sparkles",
        title: "Activacion inmediata",
        description:
          "Coordinacion agil para salidas urgentes e itinerarios sensibles.",
      },
      {
        icon: "shield",
        title: "Enfoque en seguridad",
        description:
          "Tripulaciones calificadas, cumplimiento y ejecucion disciplinada.",
      },
    ],
  },
  experience: {
    eyebrow: "Prueba Social",
    title: "Momentos reales de vuelo con precision ejecutiva.",
    description: "Salidas ejecutivas, atencion en tierra y cabinas privadas.",
    image: "images/Home/home3.jpg",
    alt: "Cabina privada",
  },
  flow: {
    eyebrow: "Como Funciona",
    title: "Solicita tu vuelo privado en tres pasos.",
    description:
      "Opciones claras, comunicacion directa y disciplina operativa desde la primera solicitud hasta el despegue.",
    steps: [
      {
        title: "Solicitas cotizacion",
        description:
          "Comparte ruta, fecha y pasajeros para activar tu solicitud.",
      },
      {
        title: "Recibes opciones",
        description:
          "Recibe opciones de aeronave y horario segun tu mision.",
      },
      {
        title: "Confirmas y vuelas",
        description:
          "Confirma la mejor opcion y despega con coordinacion directa.",
      },
    ],
  },
  fleet: {
    eyebrow: "Acceso A Flota",
    title: "Aeronaves alineadas con cada mision.",
    description:
      "Contamos con una flota versatil y moderna para ofrecer soluciones a la medida de cada necesidad.",
    cta: "Ver Toda La Flota",
    allLabel: "Todas",
    modelCta: "Ver modelos",
    assurance: {
      title: "Seguridad, experiencia y tecnologia en cada vuelo.",
      description:
        "Certificaciones internacionales y estandares de la mas alta industria.",
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
        image: "images/Home/AVIONES/TURBOHÉLICES.png",
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
    eyebrow: "Confianza Operativa",
    title: "Estandares de seguridad y experiencia detras de cada operacion.",
    description:
      "Cada vuelo se gestiona con enfoque en cumplimiento, coordinacion calificada y experiencia real en aviacion ejecutiva.",
    badge: "images/Home/ISBAO.png",
    badgeAlt: "Certificacion IS-BAO",
    items: [
      "Seguridad operacional",
      "Estandares y cumplimiento",
      "Experiencia comprobada",
    ],
  },
  cta: {
    eyebrow: "Cotizacion Ejecutiva",
    title: "Cotizacion en minutos, seguimiento humano y ejecucion ejecutiva.",
    description:
      "Comparte tu ruta y recibe opciones de aeronave, tiempos y soporte operativo directo.",
    primary: "Recibir cotizacion en minutos",
    phoneHref: "tel:+525586186576",
    phoneLabel: "+52 55 8618 6576",
  },
};
</script>
