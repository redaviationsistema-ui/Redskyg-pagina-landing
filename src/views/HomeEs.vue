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
    title: "Vuelo Privado con control ejecutivo de salida a llegada.",
    description:
      "Sky Group LLC coordina aeronave, tripulacion y ruta para ejecutivos, familias y viajes donde el tiempo no puede esperar.",
    benefits: [
      "Disponibilidad inmediata",
      "Seguridad y confidencialidad",
      "Atencion personalizada 24/7",
      "Servicio Concierge",
    ],
    primaryCta: "Cotizar vuelo ahora",
    secondaryCta: "Recibir cotizacion en minutos",
    poster: "images/jet-interior-2.webp",
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
    title: "Experiencia real con precision y calidad ejecutiva.",
    description: "Salidas ejecutivas, atencion en tierra y cabinas privadas.",
    video: "images/Home/CATERIING/giv.mp4",
    image: "images/jet-interior-2.webp",
    alt: "Cabina privada",
  },
  catering: {
    eyebrow: "Catering a bordo",
    title: "Una experiencia cuidada hasta el último detalle.",
    description:
      "Selección gastronómica preparada para acompañar tu vuelo con presentación, frescura y servicio ejecutivo.",
    imageAlt: "Servicio de catering para vuelo privado",
    previousLabel: "Ver imagen anterior de catering",
    nextLabel: "Ver siguiente imagen de catering",
    paginationLabel: "Navegación del carrusel de catering",
    slideLabel: "Ir a la imagen de catering",
  },
  flow: {
    eyebrow: "Cómo funciona",
    title: "Solicita tu vuelo privado en tres pasos.",
    description:
      "Opciones claras, comunicación directa y disciplina operativa desde la primera solicitud hasta el despegue.",
    steps: [
      {
        title: "Solicitas cotización",
        description:
          "Comparte ruta, fecha y pasajeros para activar tu solicitud.",
      },
      {
        title: "Recibes opciones",
        description:
          "Te enviamos las mejores opciones de aeronaves y horarios.",
      },
      {
        title: "Confirmas y vuelas",
        description:
          "Confirma la mejor opción y despega con coordinación directa.",
      },
    ],
  },
  fleet: {
    eyebrow: "Operational Brief",
    title: "Diseñado para clientes que no pueden perder tiempo.",
    description:
      "Selección de aeronaves, revisión del itinerario y seguimiento operativo en un flujo preciso y discreto.",
    cta: "Nuestra Flota",
    allLabel: "Todas",
    modelCta: "Ver modelos",
    backgroundImage: "images/Home/FONDO/home1.png",
    decorImage: "images/Home/FONDO/supermijet.png",
    benefitsLabel: "Ventajas de flota",
    benefits: [
      {
        icon: "coverage",
        title: "Cobertura Global",
        description: "Acceso a miles de aeropuertos en todo el mundo.",
      },
      {
        icon: "operations",
        title: "Operación 24/7",
        description: "Disponibles en cualquier momento y lugar.",
      },
      {
        icon: "secure",
        title: "Discreción y Seguridad",
        description: "Tu privacidad y seguridad son nuestra prioridad.",
      },
      {
        icon: "tailored",
        title: "Soluciones a la Medida",
        description: "Nos adaptamos a tus necesidades con precisión.",
      },
    ],
    assurance: {
      title: "Seguridad, experiencia y tecnología en cada vuelo.",
      description:
        "Certificaciones internacionales y prácticas aeronáuticas de alto nivel.",
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
  lookbooks: {
    enabled: true,
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
