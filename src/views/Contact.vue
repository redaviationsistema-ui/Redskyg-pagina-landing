<template>
  <ContactLanding :content="content" />
</template>

<script setup>
import ContactLanding from "../components/ContactLanding.vue";

const content = {
  hero: {
    eyebrow: "Private Aviation Support",
    title: "Contact Us",
    description:
      "Tell us what you need and our team will help you coordinate the right aircraft, timing and service details for your trip.",
    image: "images/Home/home18.jpg",
    alt: "Private aviation support",
  },
  highlights: [
    {
      label: "Response",
      title: "Fast follow-up",
      description:
        "Our team reviews every request and reaches out as soon as possible.",
    },
    {
      label: "Coverage",
      title: "Mexico and worldwide",
      description:
        "Private aviation solutions for domestic and international operations.",
    },
    {
      label: "Service",
      title: "Tailored assistance",
      description:
        "Charter planning, executive flights and personalized support.",
    },
  ],
  form: {
    kicker: "Flight request",
    title: "Share your trip details",
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    submit: "Send Message",
  },
  direct: {
    phone: "+52 55 8618 6576",
    phoneHref: "tel:+525586186576",
    email: "sales@redskyg.com",
    emailHref: "mailto:sales@redskyg.com",
  },
  process: [
    {
      label: "Step 01",
      title: "Send your request",
      description: "Route, timing, passengers and service details.",
    },
    {
      label: "Step 02",
      title: "Advisor review",
      description: "Our team reviews aircraft options and operational fit.",
    },
    {
      label: "Step 03",
      title: "Receive follow-up",
      description: "We contact you with next steps as soon as possible.",
    },
  ],
  success: {
    title: "Message Received",
    message:
      "Thank you for contacting RedSky Aviation. Our team will review your request and get in touch with you as soon as possible.",
  },
  errors: {
    server: "Server error:",
    send: "Error sending message. Please try again.",
  },
};
</script>
