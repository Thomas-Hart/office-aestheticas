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
          <option
            v-for="(label, key) in tagDescriptions"
            :key="key"
            :value="key"
          >
            {{ label }}
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
        <img class="logo" src="/Logos/OALogo.svg" alt="" />
        <h2 class="no-items-message">No items match the current selection</h2>
        <p class="choose-another">Choose another option</p>
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
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { tagDescriptions } from "~/utils/tagDescriptions.js"; // ← import categories

const tabs = ["Featured", "On Sale!", "All"];
const bestSellersSection = ref(null);
const activeTab = ref("Featured");
const starRating = ref(0);
const selectedCategory = ref("");
const priceFilter = ref({ min: 0, max: 0 });
const itemsToShow = ref(16);

const { data: items } = await useFetch("/api/items");

function sortByHighestPrice(arr) {
  return [...arr].sort((a, b) => b.price - a.price);
}

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

      // Filter by selectedCategory (only keys from tagDescriptions)
      if (selectedCategory.value) {
        result = result.filter((item) =>
          (item.tags || []).includes(selectedCategory.value)
        );
      }

      // Filter by price range
      const minP = priceFilter.value.min;
      const maxP = priceFilter.value.max;
      result = result.filter((item) => {
        const p = item.price;
        const passMin = minP ? p >= minP : true;
        const passMax = maxP ? p <= maxP : true;
        return passMin && passMax;
      });

      // Filter by star rating
      if (starRating.value > 0) {
        result = result.filter((item) => item.ratings >= starRating.value);
      }
      break;

    default:
      result = [...items.value];
  }

  return result;
});

const displayedItems = computed(() =>
  filteredItems.value.slice(0, itemsToShow.value)
);

function showMore() {
  itemsToShow.value = filteredItems.value.length;
}

function selectStar(star) {
  starRating.value = star;
}

function handleTabClick(tab) {
  activeTab.value = tab;
  updateQuery();
}

const route = useRoute();
const router = useRouter();

function parseQueryToLocal() {
  const q = route.query;
  activeTab.value = q.tab && tabs.includes(q.tab) ? q.tab : "Featured";
  selectedCategory.value =
    typeof q.category === "string" && tagDescriptions[q.category]
      ? q.category
      : "";
  priceFilter.value.min = q.minPrice ? Number(q.minPrice) : 0;
  priceFilter.value.max = q.maxPrice ? Number(q.maxPrice) : 0;
  starRating.value = q.rating ? Number(q.rating) : 0;
}

function updateQuery() {
  if (!process.client) return;
  router.push({
    query: {
      ...route.query,
      tab: activeTab.value,
      category: selectedCategory.value || "",
      minPrice: priceFilter.value.min || "",
      maxPrice: priceFilter.value.max || "",
      rating: starRating.value || "",
    },
  });
}

function scrollToTop() {
  if (!process.client) return;
  nextTick(() => {
    bestSellersSection.value?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

onMounted(() => {
  parseQueryToLocal();
});

watch(
  () => route.query,
  () => {
    parseQueryToLocal();
    scrollToTop();
  },
  { deep: true }
);

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

.title-underline {
  width: 300px;
  height: 6px;
  background-color: #3f654c;
  margin: 0 auto 30px auto;
  border-radius: 50px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 10px;
  flex-wrap: wrap;
}

.tabs button {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 1rem;
  padding: 10px 20px;
  min-width: 180px;
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

/* ─── Filters ────────────────────────────────────────────────────────────────── */
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 4rem;
  margin: 0 auto 2rem;
  max-width: 1000px;
  padding: 0 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: "Source Sans Pro", sans-serif;
}

.filter-group label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #4a4a4a;
}

.filter-group select,
.filter-group input[type="number"] {
  width: 100%;
  height: 2.5rem;
  padding: 0 0.75rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: #fafafa;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filter-group select:focus,
.filter-group input[type="number"]:focus {
  outline: none;
  border-color: #3f654c;
  box-shadow: 0 0 0 3px rgba(63, 101, 76, 0.15);
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-inputs span {
  font-size: 1.1rem;
  color: #666;
}

.star-rating-filter .stars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.star-rating-filter .star {
  font-size: 1.75rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.star-rating-filter .star.active {
  color: #f5c518;
}

.star-rating-filter .clear-rating {
  font-size: 0.75rem;
  color: #3f654c;
  cursor: pointer;
  text-decoration: underline;
}

/* Products Container */
.products-container {
  margin: 0 auto;
}

.product-grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
  gap: 4rem;
}

.logo {
  height: 10rem;
  margin-bottom: 0;
  width: auto;
}

.no-items-message {
  margin-bottom: 1rem;
}

.choose-another {
  margin-bottom: 2rem;
}

/* Show More Button */
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
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.show-more-button:hover {
  background-color: #3f654c;
  color: white;
}

/* Responsive Grids */
@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .tabs {
    margin-bottom: 2rem;
  }
  .filters {
    gap: 2rem;
    padding: 0;
  }
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
  }
  .section-title {
    font-size: 1.5rem;
  }
  .logo {
    height: 8rem;
  }
  .title-underline {
    width: 200px;
    height: 4px;
  }
  .tabs button {
    width: 100%;
  }
  .star-rating-filter .clear-rating {
    font-size: 0.7rem;
  }
  .show-more-button {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}

/* Stack filters on small screens */
@media (max-width: 600px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
