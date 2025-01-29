<template>
  <div class="checkout-wrapper">
    <!--prettier-ignore-->
    <section class="checkout-section point-bot">
      <!-- <EcommerceCheckoutForm /> -->
      <EcommercePaypalCheckout/>
    </section>
    <!--prettier-ignore-->
    <section class="FAQ">
      <WebSectionsFAQ />
    </section>
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

<style>
.checkout-section {
  min-height: 75rem;
  padding: 4rem 0 8rem 0;
  background-size: cover;
}
</style>