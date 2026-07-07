<template>
  <ContactLanding :content="content" />
</template>

<script setup>
import ContactLanding from "../components/ContactLanding.vue";

const content = {
  hero: {
    eyebrow: "Soporte de aviacion privada",
    title: "Contactanos",
    description:
      "Cuentanos lo que necesitas y nuestro equipo te ayudara a coordinar la aeronave correcta, los tiempos y el nivel de servicio ideal para tu viaje.",
    image: "images/Home/home18.jpg",
    alt: "Soporte de aviacion privada",
  },
  highlights: [
    {
      label: "Respuesta",
      title: "Seguimiento rapido",
      description: "Revisamos cada solicitud y te contactamos lo antes posible.",
    },
    {
      label: "Cobertura",
      title: "Mexico y el mundo",
      description:
        "Soluciones de aviacion privada para operaciones nacionales e internacionales.",
    },
    {
      label: "Servicio",
      title: "Asistencia a la medida",
      description:
        "Planeacion charter, vuelos ejecutivos y acompanamiento personalizado.",
    },
  ],
  form: {
    kicker: "Solicitud de vuelo",
    title: "Comparte los detalles de tu viaje",
    name: "Nombre completo",
    email: "Correo electronico",
    phone: "Telefono",
    message: "Mensaje",
    submit: "Enviar mensaje",
  },
  direct: {
    phone: "+52 55 8618 6576",
    phoneHref: "tel:+525586186576",
    email: "ventas@redskyg.com",
    emailHref: "mailto:ventas@redskyg.com",
  },
  process: [
    {
      label: "Paso 01",
      title: "Envia tu solicitud",
      description: "Ruta, tiempos, pasajeros y detalles del servicio.",
    },
    {
      label: "Paso 02",
      title: "Revision de asesor",
      description:
        "Nuestro equipo revisa opciones de aeronave y ajuste operativo.",
    },
    {
      label: "Paso 03",
      title: "Recibe seguimiento",
      description:
        "Te contactamos con los siguientes pasos lo antes posible.",
    },
  ],
  success: {
    title: "Mensaje recibido",
    message:
      "Gracias por contactar a RedSky Aviation. Nuestro equipo revisara tu solicitud y se pondra en contacto contigo lo antes posible.",
  },
  errors: {
    server: "Error del servidor:",
    send: "Error al enviar el mensaje. Intentalo de nuevo.",
  },
};
</script>
