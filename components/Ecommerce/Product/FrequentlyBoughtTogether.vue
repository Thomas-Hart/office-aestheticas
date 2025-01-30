<template>
  <div class="frequently-bought-wrapper">
    <h2>Frequently Bought Together</h2>
    <div v-if="items.length > 0" class="frequently-bought-list">
      <div
        v-for="item in items"
        :key="item._id"
        class="frequently-bought-item"
        @click="goToItem(item._id)"
      >
        <div class="image-wrapper">
          <img
            :src="getImagePath(item.image)"
            alt="Product Image"
            class="item-image"
          />
        </div>
        <div class="item-info">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-price">${{ item.price.toFixed(2) }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading items...</p>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  itemIds: {
    type: Array,
    required: true,
  },
});

const items = ref([]);
const router = useRouter();

// Fetch each item by ID using the API
async function fetchItemById(itemId) {
  try {
    const response = await $fetch(`/api/items?_id=${itemId}`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch item with id ${itemId}:`, error);
    return null;
  }
}

// Fetch all frequently bought together items
async function fetchFrequentlyBoughtTogetherItems() {
  for (const itemId of props.itemIds) {
    const item = await fetchItemById(itemId);
    if (item) {
      items.value.push(item);
    }
  }
}

function getImagePath(imagePath) {
  return "/" + imagePath;
}

onMounted(() => {
  fetchFrequentlyBoughtTogetherItems();
});

function goToItem(itemId) {
  router.push(`/item/${itemId}`);
}
</script>
  
  <style scoped>
.frequently-bought-wrapper {
  padding: 1rem 5rem;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.3),
    /* Darker gradient for more contrast */ rgba(255, 255, 255, 0.3),
    rgba(0, 0, 0, 0.3)
  );
  animation: gradientMove 10s ease infinite;
  background-size: 400% 400%;
  width: 100%;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.frequently-bought-list {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  width: 100%;
  margin: 0 auto;
}

.frequently-bought-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  min-width: 15%; /* Keep the width of the clickable area consistent */
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.frequently-bought-item:hover {
  transform: translateY(-5px);
  background-color: rgba(255, 255, 255, 0.2);
}

.image-wrapper {
  width: 100%;
  height: 120px; /* Reduced height for a more compact look */
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the entire space while maintaining aspect ratio */
}

.item-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
}

.item-name {
  font-size: 1rem;
  color: #fff;
  font-weight: bold;
  text-align: center;
}

.item-price {
  font-size: 1.2rem;
  color: #ff6200;
  font-weight: bold;
}
</style>
  