<template>
  <FleetLanding :content="content" />
</template>

<script setup>
import FleetLanding from "../components/FleetLanding.vue";

const content = {
  fallbackImage: "images/Ourfleet/Ourfleet.jpg",
  hero: {
    eyebrow: "Coleccion de aviacion privada",
    title: "Flota ejecutiva",
    subtitle: "Aeronaves de lujo para viajes de negocios y privados",
    image: "images/Ourfleet/Ourfleet.jpg",
    alt: "Flota ejecutiva",
  },
  intro: {
    kicker: "Coleccion de aviacion privada",
    title:
      "Aeronaves seleccionadas para viajes ejecutivos, flexibilidad y confort",
    description:
      "Explora nuestra flota activa y revisa disponibilidad de un vistazo antes de solicitar una cotizacion personalizada.",
    totalLabel: "aeronaves activas",
  },
  loading: "Cargando aeronaves...",
  actions: {
    view: "Ver aeronave",
    quote: "Cotizar vuelo ahora",
  },
  specs: {
    passengers: "pax",
    range: "hrs",
    rate: "Tarifa",
    hour: "hora",
  },
  status: {
    available: "Disponible para charter",
    unavailable: "No disponible por ahora",
  },
  pagination: {
    previous: "Anterior",
    next: "Siguiente",
    page: "Pagina",
    of: "de",
  },
  modal: {
    close: "X",
    passengers: "Pasajeros",
    range: "Alcance",
    rate: "Tarifa",
  },
};
</script>
