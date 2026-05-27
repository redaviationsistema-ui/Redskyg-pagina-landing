<template>
  <MainLayout>

    <!-- HERO ABOUT -->
    <section class="about-hero">
      <img class="about-hero-bg" src="../../public/images/about/about1.jpeg" alt="Private Jet" />
      <div class="about-hero-overlay"></div>

      <div class="about-hero-content">
        <h1>About Us</h1>
        <p class="breadcrumb">HOME &nbsp;/&nbsp; ABOUT US</p>
      </div>
    </section>

    <!-- DISCOVER -->
    <section class="section container discover-section">
      <div class="discover-grid">

        <!-- LEFT -->
        <div class="discover-left">
          <img class="discover-img" src="../../public/images/Home/home2.jpg" alt="Private Jet Interior" />

          <div class="reserve-box">
            <h5>INTRODUCING SKYLUX RESERVE</h5>
            <h3>The Premier Alternative to Jet Card and Fractional</h3>
            <p class="reserve-phone">Call 021–3456–789</p>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="discover-right">
          <h5 class="subtitle">ABOUT</h5>
          <h2>Discover the Luxury of Private Jet with Us</h2>

          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
            sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>

          <p>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
            adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore.
          </p>

          <button class="btn">CONTACT US →</button>
        </div>

      </div>
    </section>

    <!-- WORLD BROKER -->
    <section class="world section">
      <div class="world-grid container">

        <!-- LEFT -->
        <div class="world-left">
          <h5 class="subtitle">ABOUT</h5>
          <h2>
            World Broker in<br />
            Private Jet Charter
          </h2>

          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
            sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>

          <p>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
            adipisci velit, sed quia non numquam eius modi tempora.
          </p>

          <button class="btn-primary">MAKE A APPOINTMENT →</button>
        </div>

        <!-- RIGHT -->
        <div class="world-right">

          <div class="world-item">
            <img src="../../public/images/Home/home3.jpg" alt="Luxury Private Jet Interior" />
            <div class="world-text">
              <h4>Mercury Jets Difference</h4>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
              </p>
              <a class="link-primary">LEARN MORE →</a>
            </div>
          </div>

          <div class="world-item">
            <img src="../../public/images/Home/home4.jpg" alt="Luxury Private Jet Interior" />
            <div class="world-text">
              <h4>Safety and Reliability</h4>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
              </p>
              <a class="link-primary">LEARN MORE →</a>
            </div>
          </div>

          <div class="world-item">
            <img src="../../public/images/Home/home5.jpg" alt="Luxury Private Jet Interior" />
            <div class="world-text">
              <h4>The Essence of Private Charter</h4>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
              </p>
              <a class="link-primary">LEARN MORE →</a>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- COVERAGE -->
    <section class="coverage section">
      <div class="coverage-grid container">

        <!-- LEFT IMAGE -->
        <div class="coverage-media">
          <iframe class="coverage-video" src="https://www.youtube.com/embed/VIDEO_ID?autoplay=0&mute=1&controls=1&rel=0"
            title="Worldwide Coverage Video" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>


        <!-- RIGHT CONTENT -->
        <div class="coverage-content">
          <h5 class="subtitle">COVERAGE</h5>
          <h2>Worldwide<br />Coverage</h2>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip.
          </p>

          <a class="link-primary">SEE AIRCRAFT →</a>
        </div>
      </div>
    </section>


     <!-- TESTIMONIALS -->
  <div class="testimonials section container">

    <h5 class="subtitle center">TESTIMONIALS</h5>
    <h2 class="center">What People Say About Us</h2>
    <p class="center testimonials-desc">
      Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.
    </p>

    <div class="testimonials-grid">

      <div class="testimonial-card">
        <div class="testimonial-user">
          <img src="../../public/images/Home/home22.png" alt="User" />
          <div>
            <h4>The level of comfort and convenience is unparalleled</h4>
          </div>
        </div>
        <p>
          “I can’t imagine ever going back to commercial air travel after experiencing
          SkyLux’s private jet charters. The level of comfort and convenience is
          unparalleled, and the personalized service is second to none.”
        </p>
        <strong>JOHN WILLIAMS</strong>, CEO
      </div>

      <div class="testimonial-card">
        <div class="testimonial-user">
          <img src="../../public/images/Home/home23.png" alt="User" />
          <div>
            <h4>The level of comfort and convenience is unparalleled</h4>
          </div>
        </div>
        <p>
          “I can’t imagine ever going back to commercial air travel after experiencing
          SkyLux’s private jet charters. The level of comfort and convenience is
          unparalleled, and the personalized service is second to none.”
        </p>
        <strong>SAMANTHA WILLIAMS</strong>, CEO
      </div>

    </div>

    <div class="center">
      <button class="btn-primary">SEE ALL →</button>
    </div>

  </div>

  </MainLayout>
</template>


<script setup>
import MainLayout from '../layouts/MainLayout.vue'
</script>
<style>
/* =====================
   HERO ABOUT
===================== */
.about-hero {
  position: relative;
  height: 60vh;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.about-hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 20, 30, 0.55);
}

.about-hero-content {
  position: relative;
  z-index: 2;
  color: #fff;
}

.about-hero-content h1 {
  font-size: 4rem;
  font-weight: 300;
  margin-bottom: 1rem;
}

.breadcrumb {
  font-size: 0.75rem;
  letter-spacing: 2px;
  opacity: 0.9;
}

/* =====================
   DISCOVER SECTION
===================== */
.discover-section {
  padding: 6rem 0;
}

.discover-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: flex-start;
}

/* LEFT */
.discover-left {
  position: relative;
}

.discover-img {
  width: 100%;
  display: block;
  border-radius: 6px;
}

/* BLUE BOX */
.reserve-box {
  position: absolute;
  left: 0;
  bottom: -80px;
  width: 85%;
  background: #0b3b75;
  color: #fff;
  padding: 2.5rem 2.2rem;
  border-radius: 4px;
}

.reserve-box h5 {
  font-size: 0.65rem;
  letter-spacing: 2px;
  margin-bottom: 0.8rem;
  opacity: 0.85;
}

.reserve-box h3 {
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.4;
  margin-bottom: 1.2rem;
}

.reserve-phone {
  font-size: 1.4rem;
  font-weight: 600;
}

/* RIGHT */
.discover-right h2 {
  font-size: 2.6rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
}

.discover-right p {
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.2rem;
}

/* =====================
   WORLD SECTION
===================== */
.world {
  background: #fff;
  padding: 6rem 0;
}

.world-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 5rem;
  align-items: start;
}

/* LEFT */
.world-left h2 {
  font-size: 2.8rem;
  font-weight: 300;
  line-height: 1.25;
  margin-bottom: 1.5rem;
}

.world-left p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 1.2rem;
}

/* RIGHT */
.world-right {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* ITEM */
.world-item {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 2rem;
  align-items: center;
}

.world-item img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 6px;
}

.world-text h4 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.6rem;
}

.world-text p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.6rem;
}

/* =====================
   RESPONSIVE
===================== */
@media (max-width: 992px) {

  .discover-grid,
  .world-grid {
    grid-template-columns: 1fr;
  }

  .reserve-box {
    position: relative;
    bottom: 0;
    margin-top: 1.5rem;
    width: 100%;
  }

  .world-item {
    grid-template-columns: 1fr;
  }

  .world-item img {
    height: 220px;
  }
}

@media (max-width: 576px) {
  .about-hero-content h1 {
    font-size: 2.6rem;
  }

  .discover-right h2,
  .world-left h2 {
    font-size: 2.1rem;
  }
}

/* ----------- */

/* =====================
   COVERAGE
===================== */
.coverage {
  background: #fff;
  padding: 6rem 0;
}

.coverage-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 5rem;
  align-items: center;
}

/* IMAGE */
.coverage-media {
  position: relative;
}

.coverage-media img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 6px;
}


.coverage-video {
  width: 100%;
  height: 420px;
  border-radius: 6px;
  object-fit: cover;
}


/* PLAY BUTTON */
.play-btn {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.play-btn:hover {
  transform: scale(1.1);
}

/* CONTENT */
.coverage-content h2 {
  font-size: 3rem;
  font-weight: 300;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.coverage-content p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

/* =====================
   RESPONSIVE
===================== */
@media (max-width: 992px) {
  .coverage-grid {
    grid-template-columns: 1fr;
  }

  .coverage-media img {
    height: 320px;
  }
}

/* ----------------------------------------- */


/* ===== TESTIMONIALS ===== */
.center {
  text-align: center;
}

.testimonials-desc {
  max-width: 640px;
  margin: 0 auto 3rem;
  font-size: 0.95rem;
  color: #666;
}

/* GRID */
.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

/* CARD */
.testimonial-card {
  background: #fff;
  padding: 2.5rem;
  box-shadow: 0 20px 50px rgba(0,0,0,0.08);
  border-radius: 6px;
}

.testimonial-card h4 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
}

.testimonial-card p {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.testimonial-card strong {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

/* USER */
.testimonial-user {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.testimonial-user img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
}

/* RESPONSIVE */
@media (max-width: 992px) {
  .assurance-hero {
    height: 300px;
  }

  .assurance-card {
    position: relative;
    transform: none;
    left: auto;
    top: auto;
    margin: -4rem auto 0;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}

</style>