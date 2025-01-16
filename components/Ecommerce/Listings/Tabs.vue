<template>
  <section class="best-sellers-section">
    <!-- Title -->
    <h2 class="section-title">Our Best Sellers</h2>
    <!-- Thick underline (rounded ends) -->
    <div class="title-underline"></div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Products Container (max width 1400px) -->
    <div class="products-container">
      <div class="product-grid">
        <!-- Render items based on filtered array & slice by itemsToShow -->
        <EcommerceListingsItem
          v-for="(item, index) in displayedItems"
          :key="index"
          :item="item"
        />
      </div>

      <!-- Show More Button (appear if we have more items to show) -->
      <div
        class="show-more-container"
        v-if="filteredItems.length > itemsToShow"
      >
        <button class="show-more-button" @click="showMore">Show More</button>
      </div>
    </div>
  </section>
</template>
  
  <script setup>
const tabs = ["Featured", "All", "On Sale!"];
const activeTab = ref("Featured");

// Mock data for demonstration: 20 items
const items = ref([
  {
    _id: "1",
    name: "Office Chair",
    price: 172.99,
    oldPrice: 222.99,
    image: "chair1.png",
    ratings: 4.5,
    reviewCount: 34,
    description:
      "This chair is the absolute pinnacle of office assets. You will work better and in more comfort with its intentional design.",
  },
  {
    _id: "2",
    name: "Ergonomic Chair",
    price: 199.99,
    image: "chair1.png",
    ratings: 4.0,
    reviewCount: 18,
  },
  {
    _id: "3",
    name: "Desk Lamp",
    price: 49.99,
    oldPrice: 69.99,
    image: "chair1.png",
    ratings: 5.0,
    reviewCount: 12,
  },
  {
    _id: "4",
    name: "Modern Desk Lamp",
    price: 29.99,
    image: "chair1.png",
    ratings: 3.8,
    reviewCount: 8,
  },
  {
    _id: "5",
    name: "Gaming Chair",
    price: 299.99,
    oldPrice: 399.99,
    image: "chair1.png",
    ratings: 4.7,
    reviewCount: 56,
  },
  {
    _id: "6",
    name: "Study Table",
    price: 199.99,
    oldPrice: 249.99,
    image: "chair1.png",
    ratings: 4.4,
    reviewCount: 22,
  },
  {
    _id: "7",
    name: "Wooden Desk",
    price: 249.99,
    oldPrice: 289.99,
    image: "chair1.png",
    ratings: 4.1,
    reviewCount: 14,
  },
  {
    _id: "8",
    name: "Minimalist Desk",
    price: 129.99,
    image: "chair1.png",
    ratings: 4.2,
    reviewCount: 40,
  },
  {
    _id: "9",
    name: "Floor Lamp",
    price: 89.99,
    oldPrice: 99.99,
    image: "chair1.png",
    ratings: 4.0,
    reviewCount: 6,
  },
  {
    _id: "10",
    name: "Comfortable Sofa",
    price: 499.99,
    image: "chair1.png",
    ratings: 4.9,
    reviewCount: 12,
  },
  {
    _id: "11",
    name: "Leather Recliner",
    price: 799.99,
    oldPrice: 899.99,
    image: "chair1.png",
    ratings: 4.8,
    reviewCount: 20,
  },
  {
    _id: "12",
    name: "Glass Coffee Table",
    price: 149.99,
    oldPrice: 199.99,
    image: "chair1.png",
    ratings: 4.3,
    reviewCount: 32,
  },
  {
    _id: "13",
    name: "Standing Desk",
    price: 349.99,
    image: "chair1.png",
    ratings: 4.5,
    reviewCount: 15,
  },
  {
    _id: "14",
    name: "Accent Chair",
    price: 129.99,
    image: "chair1.png",
    ratings: 4.0,
    reviewCount: 18,
  },
  {
    _id: "15",
    name: "Table Lamp",
    price: 19.99,
    image: "chair1.png",
    ratings: 3.8,
    reviewCount: 5,
  },
  {
    _id: "16",
    name: "Floor Rug",
    price: 99.99,
    oldPrice: 129.99,
    image: "chair1.png",
    ratings: 4.7,
    reviewCount: 12,
  },
  {
    _id: "17",
    name: "Bookshelf",
    price: 149.99,
    image: "chair1.png",
    ratings: 4.4,
    reviewCount: 10,
  },
  {
    _id: "18",
    name: "Nightstand",
    price: 59.99,
    oldPrice: 79.99,
    image: "chair1.png",
    ratings: 4.5,
    reviewCount: 8,
  },
  {
    _id: "19",
    name: "Wall Clock",
    price: 39.99,
    image: "chair1.png",
    ratings: 4.2,
    reviewCount: 4,
  },
  {
    _id: "20",
    name: "Luxury Couch",
    price: 999.99,
    image: "chair1.png",
    ratings: 5.0,
    reviewCount: 32,
  },
]);

// Show 16 items by default
const itemsToShow = ref(16);

/**
 * Return a new array, sorted from highest price to lowest price
 * We’ll use this for "Featured" logic
 */
function getHighestPricedItems(arr) {
  return [...arr].sort((a, b) => b.price - a.price);
}

/**
 * Computed property to filter items based on the selected tab
 */
const filteredItems = computed(() => {
  if (activeTab.value === "All") {
    // Return all items in the original order
    return items.value;
  } else if (activeTab.value === "On Sale!") {
    // All items that have an oldPrice
    return items.value.filter((item) => item.oldPrice);
  } else if (activeTab.value === "Featured") {
    // The 16 highest price items (or fewer if not enough)
    return getHighestPricedItems(items.value);
  }
  // Fallback
  return items.value;
});

/**
 * Slice the filtered items by itemsToShow
 */
const displayedItems = computed(() => {
  return filteredItems.value.slice(0, itemsToShow.value);
});

/**
 * Show More button: show all filtered items (or increment as needed)
 */
function showMore() {
  itemsToShow.value = filteredItems.value.length;
}
</script>
  
  <style scoped>
.best-sellers-section {
  padding: 40px 20px;
  background-color: #fff;
  text-align: center;
  width: 100%;
  max-width: 1200px; /* Constrain the max width */
  margin: 0 auto; /* Center the section horizontally */
}

.section-title {
  font-family: "Lora", serif;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* Thick underline (green), centered, with rounded ends */
.title-underline {
  width: 300px; /* Adjust as desired */
  height: 6px; /* Thickness of the line */
  background-color: #3f654c;
  margin: 0 auto 30px auto; /* center and add spacing below */
  border-radius: 50px; /* round ends */
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 5rem;
  gap: 10px;
}

.tabs button {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 1rem;
  padding: 10px 20px;
  /* Uniform button size */
  min-width: 175px;
  border: 2px solid #3f654c;
  background-color: white;
  color: #3f654c;
  cursor: pointer;
  /* Remove border-radius */
  border-radius: 0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.tabs button:hover {
  background-color: #e0e0e0;
}

.tabs button.active {
  background-color: #3f654c;
  color: white;
}

/* Products Container */
.products-container {
  margin: 0 auto;
}

/* 4-column grid with equal spacing */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* Show More Button Container */
.show-more-container {
  margin-top: 20px;
  text-align: center;
}

.show-more-button {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 1rem;
  padding: 10px 20px;
  min-width: 120px;
  border: 2px solid #3f654c;
  background-color: white;
  color: #3f654c;
  cursor: pointer;
  border-radius: 0; /* remove border-radius */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.show-more-button:hover {
  background-color: #3f654c;
  color: white;
}

/* Responsive adjustments (optional) */
@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
  