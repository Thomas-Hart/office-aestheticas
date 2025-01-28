<template>
  <section class="best-sellers-section" ref="bestSellersSection">
    <!-- Title -->
    <h2 class="section-title">Our Best Sellers</h2>
    <div class="title-underline"></div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === tab }"
        @click="handleTabClick(tab)"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Optional Filters (only when "All" tab is selected) -->
    <div v-if="activeTab === 'All'" class="filters">
      <!-- Category Filter -->
      <div class="filter-group">
        <label for="categorySelect">Category</label>
        <select id="categorySelect" v-model="selectedCategory">
          <option value="">All</option>
          <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <!-- Price Range -->
      <div class="filter-group">
        <label for="minPrice">Price Range</label>
        <div class="price-inputs">
          <input
            type="number"
            id="minPrice"
            v-model.number="priceFilter.min"
            placeholder="Min"
            min="0"
          />
          <span>—</span>
          <input
            type="number"
            id="maxPrice"
            v-model.number="priceFilter.max"
            placeholder="Max"
            min="0"
          />
        </div>
      </div>

      <!-- Star Rating Filter -->
      <div class="filter-group star-rating-filter">
        <label>Minimum Rating</label>
        <div class="stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ active: star <= starRating }"
            @click="selectStar(star)"
          >
            ★
          </span>
          <span class="clear-rating" @click="selectStar(0)"> Clear </span>
        </div>
      </div>
    </div>

    <!-- Products container -->
    <div class="products-container">
      <div class="product-grid" v-if="displayedItems.length > 0">
        <EcommerceListingsItem
          v-for="(item, idx) in displayedItems"
          :key="idx"
          :item="item"
        />
      </div>

      <div v-else>
        <img class="logo" src="/Logos/OAName.webp" alt="" />
        <h2 class="no-items-message">No items match the current selection</h2>
        <p>Choose another option</p>
      </div>

      <!-- Show More -->
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
/* ========== CONFIG ========== */
const tabs = ["Featured", "On Sale!", "All"];

// We'll refer to our section for scrolling
const bestSellersSection = ref(null);

// Our state
const activeTab = ref("Featured");
const starRating = ref(0);
const selectedCategory = ref("");
const priceFilter = ref({ min: 0, max: 0 });
const itemsToShow = ref(16);

/* ========== FETCH ITEMS ========== */
const { data: items } = await useFetch("/api/items");

/* ========== COMPUTED ========== */
function sortByHighestPrice(arr) {
  return [...arr].sort((a, b) => b.price - a.price);
}

// Unique categories from tags
const uniqueCategories = computed(() => {
  if (!items.value) return [];
  const allTags = items.value
    .flatMap((item) => item.tags || [])
    .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase());
  return [...new Set(allTags)].sort();
});

// Figure out why items arenn't show up **************************************************************************************************************************
const filteredItems = computed(() => {
  if (!items.value) return [];

  let result = [];
  switch (activeTab.value) {
    case "Featured":
      result = sortByHighestPrice(items.value);
      break;
    case "On Sale!":
      result = items.value.filter((item) => item.oldPrice);
      break;
    case "All":
      result = [...items.value];
      // Category
      if (selectedCategory.value) {
        const lowerCat = selectedCategory.value.toLowerCase();
        result = result.filter((item) =>
          item.tags.some((tag) => tag.toLowerCase() === lowerCat)
        );
      }
      // Price
      const minP = priceFilter.value.min;
      const maxP = priceFilter.value.max;
      result = result.filter((item) => {
        const p = item.price;
        const passMin = minP ? p >= minP : true;
        const passMax = maxP ? p <= maxP : true;
        return passMin && passMax;
      });
      // Star rating
      if (starRating.value > 0) {
        result = result.filter((item) => item.ratings >= starRating.value);
      }
      break;
    default:
      result = [...items.value];
  }
  return result;
});

// Items to display
const displayedItems = computed(() => {
  return filteredItems.value.slice(0, itemsToShow.value);
});

/* ========== METHODS ========== */
function showMore() {
  itemsToShow.value = filteredItems.value.length;
}

function selectStar(star) {
  starRating.value = star;
}

function handleTabClick(tab) {
  // Immediately update local state so user sees a change
  activeTab.value = tab;
  // Also sync to the query
  updateQuery();
}

/* ========== QUERY PARAMS ========== */
const route = useRoute();
const router = useRouter();

function parseQueryToLocal() {
  const q = route.query;
  // Tab
  if (q.tab && tabs.includes(q.tab)) {
    activeTab.value = q.tab;
  } else {
    activeTab.value = "Featured";
  }
  // Category
  if (typeof q.category === "string") {
    selectedCategory.value =
      q.category.charAt(0).toUpperCase() + q.category.slice(1).toLowerCase();
  } else {
    selectedCategory.value = "";
  }
  // Price
  priceFilter.value.min = q.minPrice ? Number(q.minPrice) : 0;
  priceFilter.value.max = q.maxPrice ? Number(q.maxPrice) : 0;
  // Star rating
  starRating.value = q.rating ? Number(q.rating) : 0;
}

// Called whenever local filter state changes (or tab changes)
function updateQuery() {
  if (!process.client) return;
  router.push({
    query: {
      ...route.query,
      tab: activeTab.value,
      category: selectedCategory.value.toLowerCase() || "",
      minPrice: priceFilter.value.min || "",
      maxPrice: priceFilter.value.max || "",
      rating: starRating.value || "",
    },
  });
}

// Scroll to our section
function scrollToTop() {
  if (!process.client) return;
  nextTick(() => {
    if (bestSellersSection.value) {
      bestSellersSection.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

/* ========== LIFECYCLE ========== */

// On mount, parse existing query
onMounted(() => {
  parseQueryToLocal();
});

// Whenever the route query changes, re-parse local state and scroll
watch(
  () => route.query,
  () => {
    parseQueryToLocal();
    scrollToTop();
  },
  { deep: true }
);

// Watch local state changes → update route query
watch([activeTab, selectedCategory, priceFilter, starRating], updateQuery, {
  deep: true,
});
</script>

<style scoped>
.best-sellers-section {
  padding: 0;
  background-color: #fff;
  text-align: center;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
}

.section-title {
  font-family: "Lora", serif;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* Underline */
.title-underline {
  width: 300px;
  height: 6px;
  background-color: #3f654c;
  margin: 0 auto 30px auto;
  border-radius: 50px;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 10px;
  flex-wrap: wrap; /* Allow tabs to wrap on smaller screens */
}

.tabs button {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 1rem;
  padding: 10px 20px;
  min-width: 180px; /* Reduced min-width for smaller screens */
  border: 2px solid #3f654c;
  background-color: white;
  color: #3f654c;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.tabs button:hover {
  background-color: #e0e0e0;
}

.tabs button.active {
  background-color: #3f654c;
  color: white;
}

/* Filters */
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem; /* Reduced gap for smaller screens */
  margin-bottom: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 0.9rem;
  color: #333;
  width: 200px; /* Fixed width for consistency */
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

#categorySelect {
  min-width: 10rem;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px; /* Added border-radius */
  text-align: center;
}

/* Price range styling */
.price-inputs {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
}

.price-inputs input {
  width: 70px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px; /* Added border-radius */
  text-align: center;
}

/* Star rating filter styling */
.star-rating-filter {
  min-width: 150px;
}

.star-rating-filter .stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-rating-filter .star {
  font-size: 1.5rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.3s;
}

.star-rating-filter .star.active {
  color: #ffd700; /* gold color */
}

.star-rating-filter .clear-rating {
  font-size: 0.8rem;
  color: #333;
  cursor: pointer;
  margin-left: 0.5rem;
  text-decoration: underline;
}

/* Products Container */
.products-container {
  margin: 0 auto;
}

/* 4-column grid with equal spacing */
.product-grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
  gap: 4rem;
}

.logo {
  height: 18rem;
  margin-bottom: -6rem;
  width: auto;
}

.no-items-message {
  margin-bottom: 1rem;
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
  border-radius: 5px; /* Added border-radius */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.show-more-button:hover {
  background-color: #3f654c;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 1300px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters {
    gap: 5rem;
  }

  .filter-group {
    width: 150px; /* Reduced width for smaller screens */
  }
}

@media (max-width: 768px) {
  .product-grid {
    /* grid-template-columns: 1fr; */
    gap: 1.5rem;
  }

  .filters {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .filter-group {
    width: 100%;
    max-width: 300px;
  }

  .price-inputs {
    /* justify-content: center; */
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.5rem;
  }

  .title-underline {
    width: 200px;
    height: 4px;
  }

  /* .tabs {
    gap: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .tabs button {
    font-size: 0.8rem;
    padding: 6px 12px;
    width: 100%;
    min-width: 130px;
    height: 2.5rem;
  } */

  .star-rating-filter .star {
    font-size: 1.2rem;
  }

  .star-rating-filter .clear-rating {
    font-size: 0.7rem;
  }

  .show-more-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>

