<template>
  <div class="savings-carousel">
    <div class="top">
      <h2 class="carousel-title">Today's Top Savings</h2>
      <!-- <EcommerceListingsTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @update:activeTab="setActiveTab"
      /> -->
    </div>
    <div class="separator-line"></div>
    <EcommerceListingsCarousel :items="items" />
    <div class="separator-line bottom-line"></div>
  </div>
</template>
  
  <script setup>
const tabs = [
  "All",
  "Interior",
  "Exterior",
  "Audio & Electronics",
  "Tools & Equipment",
];
const activeTab = ref(0);

const { data: items } = await useFetch("/api/items");

function setActiveTab(tabIndex) {
  activeTab.value = tabIndex;
}
</script>
  
  <style scoped>
.savings-carousel {
  width: 100%;
  /* background-color: #4a4a4a; */
  background-color: white;
  padding: 2rem 0;
  color: black;
  font-family: "Montserrat", sans-serif, "HelveticaNeue-Light",
    "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande",
    sans-serif;
}

.top {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.carousel-title {
  font-size: 2rem;
  /* margin-bottom: 20px; */
}

.separator-line {
  width: 100%;
  height: 2px;
  background-color: white;
  /* margin-bottom: 20px; */
}

.bottom-line {
  /* margin-top: 20px; */
}
</style>
  