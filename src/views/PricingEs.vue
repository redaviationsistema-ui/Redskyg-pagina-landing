<template>
  <PricingLanding :content="content" />
</template>

<script setup>
import PricingLanding from "../components/PricingLanding.vue";

const sharedFeatures = [
  "Cabina premium",
  "Salas lounge",
  "Banos",
  "Cocina",
  "Descanso a bordo",
  "Espacio para reuniones",
  "Opciones pet friendly",
  "Tecnologia",
];

const content = {
  hero: {
    eyebrow: "Precios",
    title: "Precios",
    subtitle:
      "Planeacion transparente de charter para vuelos ejecutivos, de placer y operaciones criticas.",
    image: "images/Pricing/pricing.webp",
    alt: "Precios",
  },
  packages: {
    kicker: "Precios",
    title: "Elige tu paquete",
    description:
      "Soluciones flexibles de aviacion privada disenadas segun frecuencia, nivel de servicio y complejidad operativa.",
    noteStrong: "Cotizacion en linea disponible.",
    note:
      " Inicia tu solicitud en nuestro formulario de vuelo para elegir ruta, aeronave, pasajeros y detalles del viaje sin salir del sitio.",
    items: [
      {
        name: "Bajo demanda",
        price: "Personalizado",
        period: "/ por viaje",
        features: sharedFeatures,
        cta: "Cotizar vuelo ahora",
      },
      {
        name: "Acceso corporativo",
        price: "Prioridad",
        period: "/ plan de servicio",
        badge: "Recomendado",
        featured: true,
        features: sharedFeatures,
        cta: "Recibir cotizacion en minutos",
      },
      {
        name: "Misiones especiales",
        price: "A medida",
        period: "/ operacion",
        features: sharedFeatures,
        cta: "Cotizar vuelo ahora",
      },
    ],
  },
  cta: {
    kicker: "Cotizacion privada",
    title: "Listo para volar privado?",
    description:
      "Nuestros asesores estan disponibles 24/7 para preparar tu cotizacion personalizada en minutos.",
    button: "Recibir cotizacion en minutos",
    href: "https://wa.me/525586186576?text=Hola,%20quiero%20solicitar%20una%20cotizacion%20de%20vuelo%20privado",
  },
  services: {
    kicker: "Areas de servicio",
    title: "Soluciones de aviacion privada",
    description:
      "Cada servicio se gestiona con discrecion, disciplina operativa y acompanamiento personalizado de inicio a fin.",
    items: [
      {
        title: "Jet charter ejecutivo",
        description:
          "Vuelos privados ejecutivos para lideres que buscan eficiencia, discrecion y movilidad global sin fricciones.",
        image: "images/Pricing/Pricing2.jpg",
        alt: "Jet charter ejecutivo",
      },
      {
        title: "Vuelos con mascotas",
        description:
          "Soluciones seguras y comodas para transportar a tus mascotas con el mayor nivel de cuidado.",
        image: "images/Pricing/Pricing3.jpg",
        alt: "Vuelos con mascotas",
      },
      {
        title: "Carga aerea",
        description:
          "Transporte de carga seguro y sensible al tiempo con entregas confiables en destinos nacionales e internacionales.",
        image: "images/Pricing/Pricing4.jpg",
        alt: "Carga aerea",
      },
      {
        title: "Ambulancia aerea",
        description:
          "Transporte medico de respuesta rapida equipado para atencion critica y traslados de emergencia.",
        image: "images/Pricing/Pricing5.jpg",
        alt: "Ambulancia aerea",
      },
    ],
  },
  faq: {
    kicker: "Servicios",
    title: "Nuestros servicios de jet charter",
    description:
      "Guia operativa clara para ayudarte a entender como se estructura el precio en aviacion privada.",
    items: [
      {
        title: "Costo de adquisicion o renta mensual",
        content:
          "Detalles sobre adquisicion o pago mensual aplicable a determinados esquemas de servicio aeronautico.",
      },
      {
        title: "Cuota mensual de administracion",
        content:
          "Informacion sobre cargos de administracion y coordinacion operativa.",
      },
      {
        title: "Tarifa variable de combustible",
        content:
          "La tarifa de combustible puede variar segun horas de vuelo, ruta y destino.",
      },
      {
        title: "Sin costos de posicionamiento",
        content:
          "En paquetes seleccionados no se aplican cargos de reposicionamiento.",
      },
      {
        title: "Sin cargos minimos de vuelo",
        content: "No manejamos minimos de horas de vuelo en planes seleccionados.",
      },
    ],
  },
};
</script>
