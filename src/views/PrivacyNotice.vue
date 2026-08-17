<template>
  <MainLayout>
    <section class="privacy-page">
      <section class="privacy-hero">
        <img
          class="privacy-hero__image"
          :src="assetUrl('images/Home/home18.jpg')"
          alt=""
        />
        <div class="privacy-hero__overlay"></div>

        <div class="privacy-shell privacy-hero__content">
          <span class="privacy-eyebrow">{{ copy.eyebrow }}</span>
          <h1>{{ copy.title }}</h1>
        </div>
      </section>

      <section class="privacy-content">
        <div class="privacy-shell">
          <article class="privacy-card">
            <section
              v-for="section in copy.sections"
              :key="section.title"
              class="privacy-section"
            >
              <h2>{{ section.title }}</h2>

              <p v-for="paragraph in section.paragraphs || []" :key="paragraph">
                {{ paragraph }}
              </p>

              <ul v-if="section.bullets?.length" class="privacy-list">
                <li v-for="item in section.bullets" :key="item">{{ item }}</li>
              </ul>
            </section>

            <section class="privacy-section privacy-section--credit">
              <span class="privacy-section__eyebrow">{{ copy.credit.eyebrow }}</span>
              <p>
                {{ copy.credit.prefix }}
                <a
                  href="https://github.com/redaviationsistema-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kevin Lael de Jesus Flores
                </a>
                {{ copy.credit.suffix }}
              </p>
            </section>

            <div class="privacy-meta">
              <p>{{ copy.updatedAt }}</p>
              <small>{{ copy.rights }}</small>
            </div>
          </article>
        </div>
      </section>
    </section>
  </MainLayout>
</template>

<script setup>
import { computed } from "vue";
import MainLayout from "../layouts/MainLayout.vue";
import { useLocalizedNavigation } from "../composables/useLocalizedNavigation";

const { locale } = useLocalizedNavigation();

const assetUrl = (path = "") =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

const translations = {
  "es-mx": {
    eyebrow: "DOCUMENTACION LEGAL",
    title: "Aviso de Privacidad para Pasajeros",
    updatedAt: "Ultima actualizacion: marzo 2026",
    rights: "© 2026 RED SKY GROUP. Todos los derechos reservados.",
    credit: {
      eyebrow: "Desarrollo tecnologico",
      prefix: "Diseno y desarrollo tecnologico por",
      suffix: "para Sky Group.",
    },
    sections: [
      {
        title: "Identidad del Responsable",
        paragraphs: [
          'RED SKY GROUP LLC (en lo sucesivo, "RED SKY GROUP"), sociedad de responsabilidad limitada debidamente constituida conforme a las leyes de los Estados Unidos de America, actua como responsable del tratamiento respecto de los datos personales recabados a traves de este sitio web y en relacion con la coordinacion y gestion de servicios aeronauticos.',
          "RED SKY GROUP opera internacionalmente y coordina servicios que pueden llevarse a cabo en distintas jurisdicciones, incluyendo Mexico. Este Aviso de Privacidad se emite de conformidad con la normativa aplicable en materia de proteccion de datos, particularmente cuando los servicios, vuelos o pasajeros se relacionan con territorio mexicano.",
        ],
      },
      {
        title: "Categorias de Datos Personales Tratados",
        paragraphs: [
          "Para cumplir con las finalidades descritas en este Aviso de Privacidad, RED SKY GROUP puede recabar y tratar las siguientes categorias de datos personales:",
        ],
        bullets: [
          "Datos de identificacion;",
          "Datos de contacto;",
          "Datos de facturacion y financieros;",
          "Informacion contenida en pasaportes, visas y otros documentos de viaje o migratorios requeridos para vuelos nacionales o internacionales.",
          "RED SKY GROUP no recaba ni trata intencionalmente datos personales sensibles.",
        ],
      },
      {
        title: "Finalidades Primarias del Tratamiento",
        paragraphs: [
          "Los datos personales seran tratados para las siguientes finalidades primarias:",
        ],
        bullets: [
          "Coordinar, organizar, administrar y/o facilitar servicios aeronauticos, transporte aereo y servicios relacionados;",
          "Determinar la entidad responsable de prestar y, en su caso, facturar los servicios contratados, segun el lugar de compra y de ejecucion del vuelo;",
          "Gestionar procesos de facturacion, pago y cobranza en cumplimiento de obligaciones fiscales y legales aplicables;",
          "Realizar la gestion operativa, administrativa y logistica de los vuelos;",
          "Verificar que los pasajeros cuenten con la documentacion requerida para viajes nacionales e internacionales;",
          "Permitir el acceso a aeronaves e instalaciones aeroportuarias;",
          "Atender solicitudes o requerimientos de autoridades nacionales o internacionales competentes;",
          "Administrar bitacoras de vuelo, reportes aduanales y migratorios;",
          "Mantener comunicaciones y notificaciones relacionadas con los vuelos;",
          "Prevenir, detectar y mitigar posibles fraudes;",
          "Cumplir con obligaciones legales, regulatorias y aeronauticas aplicables.",
        ],
      },
      {
        title: "Base Legal del Tratamiento",
        paragraphs: [
          "RED SKY GROUP trata los datos personales con base en el consentimiento expreso del titular, el cual se entendera otorgado cuando proporcione informacion personal con el fin de contratar servicios, realizar pagos o viajar en aeronaves coordinadas o administradas por RED SKY GROUP.",
        ],
      },
      {
        title: "Transferencias de Datos Personales",
        paragraphs: [
          "RED SKY GROUP LLC podra compartir datos personales, sin requerir consentimiento adicional del titular, con terceros independientes con quienes mantenga relaciones comerciales o de colaboracion, incluyendo RED AVIATION COMPANY S.A. DE C.V., exclusivamente cuando ello sea necesario para la coordinacion, prestacion o facturacion de los servicios contratados.",
          "En esos casos, cada entidad sera responsable del tratamiento de los datos personales bajo su control, conforme a la legislacion aplicable y a las finalidades de la relacion juridica que mantenga con el titular.",
          "Los datos personales tambien podran transferirse a:",
        ],
        bullets: [
          "Proveedores de servicios que apoyen operaciones aeronauticas, administrativas, tecnologicas o financieras, sujetos a obligaciones de confidencialidad;",
          "Autoridades gubernamentales nacionales o internacionales, incluidas autoridades aeronauticas, aeroportuarias, aduanales, migratorias y fiscales, cuando exista requerimiento legal.",
        ],
      },
      {
        title: "Derechos del Titular",
        paragraphs: [
          "Dependiendo de la jurisdiccion aplicable, los titulares podran ejercer sus derechos de acceso, rectificacion, cancelacion, oposicion o sus equivalentes reconocidos por la normativa de proteccion de datos aplicable. Las solicitudes podran presentarse a traves de los canales de contacto designados por RED SKY GROUP.",
        ],
      },
      {
        title: "Autoridad de Proteccion de Datos",
        paragraphs: [
          "Cuando resulte aplicable, los titulares podran acudir ante la autoridad mexicana de proteccion de datos, el Instituto Nacional de Transparencia, Acceso a la Informacion y Proteccion de Datos Personales (INAI), si consideran que sus derechos han sido vulnerados.",
        ],
      },
      {
        title: "Ley Aplicable",
        paragraphs: [
          "Este Aviso de Privacidad se rige por la Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares en Mexico, sin perjuicio de la aplicacion de otras disposiciones legales que pudieran resultar aplicables, considerando la naturaleza internacional de las operaciones de RED SKY GROUP.",
        ],
      },
      {
        title: "Cambios a este Aviso de Privacidad",
        paragraphs: [
          "RED SKY GROUP se reserva el derecho de modificar o actualizar este Aviso de Privacidad en cualquier momento derivado de cambios legislativos, politicas internas, nuevos requerimientos de servicio o practicas del mercado.",
          "Este Aviso de Privacidad y sus actualizaciones estaran disponibles a traves de los canales oficiales de RED SKY GROUP.",
        ],
      },
    ],
  },
  "en-us": {
    eyebrow: "LEGAL DOCUMENTATION",
    title: "Privacy Notice for Passengers",
    updatedAt: "Last updated: March 2026",
    rights: "© 2026 RED SKY GROUP. All rights reserved.",
    credit: {
      eyebrow: "Technology development",
      prefix: "Technology design and development by",
      suffix: "for Sky Group.",
    },
    sections: [
      {
        title: "Controller Identity",
        paragraphs: [
          'RED SKY GROUP LLC ("RED SKY GROUP"), a limited liability company duly organized under the laws of the United States of America, acts as the controller of personal data collected through this website and in connection with the coordination and management of aeronautical services.',
          "RED SKY GROUP operates internationally and coordinates services that may take place in different jurisdictions, including Mexico. This Privacy Notice is issued in accordance with applicable data protection laws, particularly when services, flights or passengers are connected to Mexican territory.",
        ],
      },
      {
        title: "Categories of Personal Data Processed",
        paragraphs: [
          "To fulfill the purposes described in this Privacy Notice, RED SKY GROUP may collect and process the following categories of personal data:",
        ],
        bullets: [
          "Identification data;",
          "Contact data;",
          "Billing and financial data;",
          "Information contained in passports, visas and other travel or immigration documents required for domestic or international flights.",
          "RED SKY GROUP does not intentionally collect or process sensitive personal data.",
        ],
      },
      {
        title: "Primary Processing Purposes",
        paragraphs: [
          "Personal data will be processed for the following primary purposes:",
        ],
        bullets: [
          "Coordinate, organize, manage and/or facilitate aeronautical services, air transport and related services;",
          "Determine the entity responsible for providing and, where applicable, invoicing the contracted services, according to the place of purchase and performance of the flight;",
          "Manage billing, payment and collection processes in compliance with applicable tax and legal obligations;",
          "Carry out the operational, administrative and logistical management of flights;",
          "Verify that passengers have the documentation required for domestic and international travel;",
          "Allow access to aircraft and airport facilities;",
          "Address requests or requirements from competent national or international authorities;",
          "Manage flight logs and customs or immigration reports;",
          "Maintain communications and notices related to flights;",
          "Prevent, detect and mitigate potential fraud;",
          "Comply with applicable legal, regulatory and aeronautical obligations.",
        ],
      },
      {
        title: "Legal Basis for Processing",
        paragraphs: [
          "RED SKY GROUP processes personal data based on the express consent of the data subject, which will be understood as granted when personal information is provided for the purpose of contracting services, making payments or traveling on aircraft coordinated or managed by RED SKY GROUP.",
        ],
      },
      {
        title: "Transfers of Personal Data",
        paragraphs: [
          "RED SKY GROUP LLC may share personal data, without requiring additional consent from the data subject, with independent third parties with whom it maintains commercial or collaboration relationships, including RED AVIATION COMPANY S.A. DE C.V., solely when necessary for the coordination, provision or billing of contracted services.",
          "In such cases, each entity will be responsible for processing the personal data under its control, in accordance with applicable law and the purposes of the legal relationship it maintains with the data subject.",
          "Personal data may also be transferred to:",
        ],
        bullets: [
          "Service providers supporting aeronautical, administrative, technological or financial operations, subject to confidentiality obligations;",
          "National or international government authorities, including aeronautical, airport, customs, immigration and tax authorities, when there is a legal requirement.",
        ],
      },
      {
        title: "Data Subject Rights",
        paragraphs: [
          "Depending on the applicable jurisdiction, data subjects may exercise their rights of access, rectification, cancellation, objection or equivalent rights recognized by applicable data protection regulations. Requests may be submitted through the contact channels designated by RED SKY GROUP.",
        ],
      },
      {
        title: "Data Protection Authority",
        paragraphs: [
          "When applicable, data subjects may contact the Mexican data protection authority, the National Institute for Transparency, Access to Information and Personal Data Protection (INAI), if they believe their rights have been violated.",
        ],
      },
      {
        title: "Applicable Law",
        paragraphs: [
          "This Privacy Notice is governed by the Federal Law on Protection of Personal Data Held by Private Parties in Mexico, without prejudice to the application of other legal provisions that may apply, considering the international nature of RED SKY GROUP operations.",
        ],
      },
      {
        title: "Changes to this Privacy Notice",
        paragraphs: [
          "RED SKY GROUP reserves the right to modify or update this Privacy Notice at any time due to legislative changes, internal policies, new service requirements or market practices.",
          "This Privacy Notice and its updates will be available through RED SKY GROUP official channels.",
        ],
      },
    ],
  },
};

const copy = computed(() => translations[locale.value] ?? translations["es-mx"]);
</script>

<style scoped>
.privacy-page {
  background: linear-gradient(180deg, #0a1825 0%, #08131d 100%);
  color: #f5f7fb;
}

.privacy-shell {
  width: min(1100px, calc(100% - 40px));
  margin: 0 auto;
}

.privacy-hero {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #071624;
}

.privacy-hero__image,
.privacy-hero__overlay {
  position: absolute;
  inset: 0;
}

.privacy-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.75);
}

.privacy-hero__overlay {
  background:
    linear-gradient(180deg, rgba(7, 22, 36, 0.72), rgba(7, 22, 36, 0.92)),
    radial-gradient(circle at center, rgba(208, 172, 103, 0.08), transparent 28%);
}

.privacy-hero__content {
  position: relative;
  z-index: 1;
  padding-top: 132px;
  text-align: center;
}

.privacy-eyebrow {
  display: inline-flex;
  color: #d0ac67;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.privacy-hero h1 {
  margin: 1.1rem auto 0;
  max-width: 900px;
  font-size: clamp(2.6rem, 5vw, 4.4rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.privacy-content {
  padding: 92px 0 110px;
}

.privacy-card {
  padding: 56px 56px 42px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
}

.privacy-section + .privacy-section {
  margin-top: 3rem;
}

.privacy-section h2 {
  margin: 0 0 1rem;
  color: #ffffff;
  font-size: clamp(1.7rem, 3vw, 2.35rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.privacy-section p,
.privacy-list li,
.privacy-meta {
  color: #d0d8e2;
  font-size: 1rem;
  line-height: 1.85;
}

.privacy-section p {
  margin: 0 0 1.1rem;
}

.privacy-list {
  margin: 0;
  padding-left: 1.35rem;
  display: grid;
  gap: 0.7rem;
}

.privacy-section--credit {
  margin-top: 3.4rem;
  padding-top: 2.1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.privacy-section__eyebrow {
  display: inline-flex;
  margin-bottom: 1rem;
  color: #ffffff;
  font-size: clamp(1.7rem, 3vw, 2.35rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  text-transform: none;
}

.privacy-section--credit p {
  margin-bottom: 0;
}

.privacy-section--credit a {
  color: #f3d08a;
  text-decoration: none;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.22em;
  text-decoration-color: rgba(243, 208, 138, 0.42);
  font-weight: 700;
  transition: color 0.22s ease;
}

.privacy-section--credit a:hover,
.privacy-section--credit a:focus-visible {
  color: #ffe3ac;
  text-decoration-color: currentColor;
}

.privacy-section--credit a:focus-visible {
  outline: 1px solid rgba(243, 208, 138, 0.45);
  outline-offset: 4px;
}

.privacy-meta {
  margin-top: 3.6rem;
  text-align: center;
}

.privacy-meta p {
  margin: 0 0 0.55rem;
}

.privacy-meta small {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.95rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .privacy-hero {
    min-height: 420px;
  }

  .privacy-hero__content {
    padding-top: 116px;
  }

  .privacy-content {
    padding: 62px 0 82px;
  }

  .privacy-card {
    padding: 30px 22px 28px;
  }
}
</style>
