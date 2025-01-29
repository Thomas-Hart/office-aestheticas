<template>
  <div class="home">
    <section class="intro-section">
      <!-- prettier-ignore -->
      <WebSectionsIntro/>
    </section>

    <section class="hero-section">
      <!-- prettier-ignore -->
      <WebSectionsHero/>
    </section>

    <section class="set-apart-section">
      <EcommerceListingsTabs />
    </section>

    <section class="imagine-section">
      <WebSectionsImagine />
    </section>

    <!--prettier-ignore-->
    <!-- <section class="testimonials-wrapper"> -->
    <!-- <WebSectionsTestimonials logoPath="OAName.svg"/> -->
    <!-- </section> -->
  </div>
</template>

<script setup>
// SEO ADJUST
useSeoMeta({
  title: "post.value.mainTitle",
  ogTitle: "post.value.mainTitle",
  description: "post.value.preview",
  ogDescription: "post.value.preview",
  ogImage: "post.value.thumbnail",
  twitterCard: "post.value.thumbnail",
});

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped media="screen">
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background: #4a4a4a; */
}

.intro-section,
.hero-section,
.set-apart-section {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.hero-section,
.set-apart-section,
.imagane-section {
  padding: 2rem;
}

.set-apart-section {
  /* background: url("/SetApartBG.svg") no-repeat; */
  min-height: 40rem;
}

.testimonials-wrapper {
  height: 15rem;
}

@media (max-width: 768px) {
  /*  ------------  MOBILE  ------------   */
  .hero-section,
  .set-apart-section,
  .imagane-section {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-section,
  .set-apart-section,
  .imagane-section {
    padding: 1rem;
  }
}
</style>
