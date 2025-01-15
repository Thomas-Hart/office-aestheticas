<template>
  <div class="carousel-section-wrapper">
    <div class="carousel-items">
      <EcommerceListingsCarouselItem
        v-for="(item, itemIndex) in section"
        :key="itemIndex"
        :item="item"
      />
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  section: Array,
});

// console.log("Section in carouselSection: " + JSON.stringify(props.section));
</script>
  
  <style scoped>
.carousel-section-wrapper {
  display: flex;
  /* justify-content: center; */
  width: 100%;
  flex-shrink: 0;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  min-height: 35rem;
}

.carousel-items {
  display: flex;
  gap: 30px;
  /* justify-content: center; */
  width: 100%;
  /* max-width: 1400px; */
  margin-left: 1rem;
  margin-right: 1rem;
}

@media (max-width: 1200px) {
  .carousel-items {
    display: flex;
    gap: 30px;
    justify-content: flex-start;
    width: 100%;
    max-width: 1400px;
    margin: 0;
  }
}
</style>
  