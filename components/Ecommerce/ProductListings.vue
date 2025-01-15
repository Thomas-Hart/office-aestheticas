<template>
  <div class="listings">
    <!--prettier-ignore-->
    <div class="listings-header">
      <h1>Featured Products</h1>
    </div>
    <!--prettier-ignore-->
    <div :class="['listings-wrapper', layout]">
      <div :class="['listings-container', layout]" ref="listingsContainer" @scroll="checkScroll">
        <div v-for="item in items" :key="item._id" class="product-listing">
          <EcommerceItem :item="item" />
        </div>
      </div>
      <!-- <NuxtLink to="/item/editItems" class="edit-button-link">
        <button class="edit-button">Edit Items</button>
      </NuxtLink> -->
      <div v-if="layout == 'scroll'" class="arrow" v-show="showArrow" @click="scrollRight">
        <img :src="resolvedArrowImg()" alt="Side Arrow"/>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  layout: {
    type: String,
    default: "scroll",
  },
});

const store = useItemStore();
const loading = ref(true);
const showArrow = ref(true);
const listingsContainer = ref(null);

// Fetch items via useFetch at the top-level (SSR-friendly)
const { data: itemsData, error: itemsError } = await useFetch("/api/items");

// After the component is mounted, set the items in the store
onMounted(() => {
  if (itemsError.value) {
    console.error("Failed to fetch items:", itemsError.value);
  } else {
    store.setItems(itemsData.value);
  }
  loading.value = false;
});

const scrollRight = () => {
  listingsContainer.value.scrollTo({
    left: listingsContainer.value.scrollLeft + 200,
    behavior: "smooth",
  });
};

const checkScroll = () => {
  const container = listingsContainer.value;
  if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
    showArrow.value = false;
  } else {
    showArrow.value = true;
  }
};

const resolvedArrowImg = () => "/HoneySideArrow.png";
</script>

<style scoped>
.listings {
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  position: relative;
  padding-bottom: 4rem;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(10px);
  }
}

.listings-wrapper.scroll {
  margin-left: 15rem;
  overflow: visible;
}

.listings-wrapper.grid {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.listings-header {
  text-align: center;
  padding-top: 4rem;
  margin-bottom: 5rem;
  font-size: 2rem;
  text-shadow: 2px 2px 2px white;
}

.listings-container {
  position: relative;

  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  scrollbar-width: none;
}

.listings-container.scroll {
  /* styles for scroll layout */
  display: flex;
  overflow-x: scroll;
  gap: 3rem;
}

.listings-container.grid {
  /* styles for grid layout */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5rem;
}

.listings-container.scroll::before {
  content: "";
  flex: 0 0 15rem; /* Same width as the margin-left of .listings-container */
}

.listings-container.scroll::-webkit-scrollbar {
  display: none;
}

.product-listing {
  flex: 0 0 auto;
  scroll-snap-align: start;
  white-space: normal;
}

.edit-button-link {
  display: flex;
  justify-content: center;
  width: 100%;
}

.edit-button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.arrow {
  height: 90px;
  width: 90px;
  object-fit: cover;
  position: absolute;
  right: 50px;
  top: 60%;
  transform: translateY(-50%);
  animation: bounce 1s infinite;
  cursor: pointer; /* Add this line to change the cursor when hovering over the arrow */
  -webkit-user-select: none; /* Safari 3.1+ So the arrows don't highlight when I click them */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
}

.arrow img {
  height: 100%;
  width: 100%;
}

@media (max-width: 950px) {
  .listings-container.grid {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 3rem;
  }
}

@media (max-width: 768px) {
  /*  ------------  MOBILE  ------------   */
  .listings-wrapper.scroll,
  .listings-wrapper.grid {
    margin: 0;
  }

  .listings-container.scroll,
  .listings-container.grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .listings-container.scroll::before {
    content: none;
  }

  .arrow {
    display: none;
  }
}

@media (max-width: 480px) {
}
</style>