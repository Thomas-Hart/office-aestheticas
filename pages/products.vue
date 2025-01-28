<template>
  <div class="shop-products">
    <div class="header">
      <h1>Shop All Products</h1>
    </div>

    <!-- Filters Dropdown -->
    <div class="filters">
      <label for="filter-select" class="filter-label">Sort By:</label>
      <select
        id="filter-select"
        class="filter-dropdown"
        @change="handleSortChange"
      >
        <option value="">Select Filter</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
        <option value="name-az">Alphabetical: A-Z</option>
        <option value="name-za">Alphabetical: Z-A</option>
        <option value="rating-high-low">Customer Ratings</option>
      </select>
    </div>

    <div class="products-container">
      <!-- Left Side Ads Section -->
      <div class="ads-section">
        <SubcomponentsStickyCTA v-if="isLargeScreen" />
      </div>

      <!-- Products Section -->
      <div class="products-section">
        <EcommerceListingsDynamicItem
          v-for="(item, itemIndex) in filteredItems"
          :key="itemIndex"
          :item="item"
          @openLoginModal=""
        />
        <SubcomponentsStickyCTA v-if="!isLargeScreen" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Sorting and filtering state
const sortBy = ref(null);
const isLargeScreen = ref(true); // Default value, will be updated on client-side

const emit = defineEmits(["hide-loading", "openLoginModal"]);

// Fetch products using useFetch
const { data: items, error: fetchError } = await useFetch("/api/items");

if (fetchError.value) {
  console.error("Error fetching items:", fetchError.value);
}

// Handle sorting change
const handleSortChange = (event) => {
  setSortBy(event.target.value);
};

// Handle window resize and update screen size
function handleResize() {
  if (typeof window !== "undefined") {
    isLargeScreen.value = window.innerWidth >= 1024;
  }
}

// Add event listener for window resizing
onMounted(() => {
  handleResize(); // Set initial value
  window.addEventListener("resize", handleResize);
});

// Remove event listener when component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

// Method to set sorting criteria
const setSortBy = (criteria) => {
  sortBy.value = criteria;
};

// Sorting and filtering logic
const filteredItems = computed(() => {
  let sortedItems = Array.isArray(items.value) ? [...items.value] : [];

  // Sorting Logic
  if (sortBy.value === "price-low-high") {
    sortedItems.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === "price-high-low") {
    sortedItems.sort((a, b) => b.price - a.price);
  } else if (sortBy.value === "name-az") {
    sortedItems.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === "name-za") {
    sortedItems.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy.value === "rating-high-low") {
    sortedItems.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
  }

  return sortedItems;
});

// Emit event to hide loading (if applicable)
emit("hide-loading");
</script>


<style scoped>
.shop-products {
  /* background-color: #4a4a4a; */
  background: white;
  color: white;
  padding: 2rem;
  border-top: 2px solid white;
  border-bottom: 2px solid white;
}

.header h1 {
  text-align: left;
  color: black;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.filters {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.filter-label {
  margin-right: 1rem;
  font-size: 1rem;
  color: black;
}

.filter-dropdown {
  padding: 0.5rem;
  font-size: 1rem;
  background-color: #fff;
  color: black;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.filter-dropdown:focus {
  border-color: #4a4a4a;
  outline: none;
}

.products-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.ads-section {
  position: sticky;
  top: 5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: auto; /* Set height based on content */
  align-self: flex-start; /* Aligns the section to the start */
  overflow: hidden; /* Keep the overflow hidden */
  flex-basis: 17%; /* Initial width based on content */
}

.ads-section img {
  width: 100px;
  height: auto;
}

.products-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: auto;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 5;
  /* max-width: 1400px; */
}

.product-image {
  position: relative;
}

.product-image img {
  width: 100%;
  height: auto;
}

.badge {
  position: absolute;
  top: 0;
  left: 0;
  background-color: orange;
  color: white;
  padding: 5px;
  font-size: 0.75rem;
}

.wishlist {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 2rem;
  width: 2rem;
}

.product-info {
  padding: 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
}

.old-price {
  text-decoration: line-through;
  color: gray;
}

.savings {
  color: green;
}

.ratings {
  display: flex;
  align-items: center;
}

.stars {
  color: #ff8000;
}

.reviews {
  font-size: 0.9rem;
  color: gray;
}

.color-options {
  display: flex;
  gap: 5px;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

@media (max-width: 1300px) {
  .products-section {
    grid-template-columns: repeat(3, 1fr);
  }

  .ads-section {
    flex-basis: 20%; /* Initial width based on content */
  }
}

@media (max-width: 1024px) {
  .products-section {
    order: 1;
    grid-template-columns: repeat(3, 1fr);
  }

  .products-container {
    flex-direction: column;
  }

  .ads-section {
    order: 2;
    flex-basis: 20%; /* Initial width based on content */
  }
}

@media (max-width: 768px) {
  .products-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .shop-products {
    padding: 1rem;
  }

  .products-section {
    grid-template-columns: repeat(1, 1fr);
    justify-content: center;
    align-items: center;
  }
}
</style>
