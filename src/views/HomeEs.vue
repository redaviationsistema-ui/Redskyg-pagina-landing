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
      { value: "20+", label: "anos en aviacion" },
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
    title: "Aviacion privada disenada para velocidad, privacidad y certeza.",
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
      "Soporte aeronautico profesional con servicio privado de alto nivel.",
    cta: "Ver Toda La Flota",
    items: [
      {
        name: "Learjet 31",
        meta: "Jet Ligero",
        image: "images/Home/165-artguru.png",
        alt: "Learjet 31",
      },
      {
        name: "Bell 407",
        meta: "Helicoptero",
        image: "images/Home/2004bell407.png",
        alt: "Bell 407",
      },
      {
        name: "Gulfstream G-IV",
        meta: "Jet De Largo Alcance",
        image: "images/Home/389-artguru.png",
        alt: "Gulfstream G-IV",
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
