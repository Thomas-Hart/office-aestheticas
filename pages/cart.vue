<template>
  <div class="wrapper">
    <!--prettier-ignore-->
    <section class="cart point-bot">
      <EcommerceBasicCart />
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

<style scoped>
.cart {
  min-height: 65rem;
  background: url("/Car1.png") no-repeat;
  background-size: cover;
  padding-bottom: 4rem;
}
</style>