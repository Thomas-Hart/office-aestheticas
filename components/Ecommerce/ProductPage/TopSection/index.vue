<template>
  <section class="section">
    <ProductPageTopSectionLeftSection :item="item" />
    <div class="checkout-divider"></div>
    <ProductPageTopSectionRightSection
      :item="item"
      :is-out-of-stock="isOutOfStock"
    />
  </section>
</template>
  
  <script setup>
const props = defineProps({
  item: { type: Object, required: true },
  isOutOfStock: { type: Boolean, default: false },
});
</script>
  
  <style scoped>
.section {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  padding: 0 2rem;
}
.checkout-divider {
  width: 1px;
  background-color: #ddd;
  align-self: stretch;
}
</style>
  