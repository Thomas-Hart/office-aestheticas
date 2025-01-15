<template>
  <div class="wrapper">
    <!-- prettier-ignore -->
    <section class="bundle-wrapper point-bot">
      <div class="bundle-container">
        <div class="left-column">
          <div class="img-wrapper">
            <img :src="resolvedImgPath()" alt="Bundle Image" />
          </div>
        </div>
        <div class="right-column" v-if="bundle">
          <h1>{{ bundle.name }}</h1>
          <p class="header">
            <span class="bundle-price">${{ bundle.price.toFixed(2) }}</span>
            <span v-if="bundle.discountPercentage" class="discount">
              Save {{ bundle.discountPercentage.toFixed(2) }}%
            </span>
          </p>
          <p class="description">{{ bundle.description }}</p>

          <p class="stock-status" :class="stockStatusClass">
            {{ stockMessage }}
          </p>

          <div class="items-list">
            <h3>Items in this Bundle:</h3>
            <ul>
              <li v-for="item in bundle.items" :key="item.itemId">
                {{ itemDetails(item.itemId).name }} - Quantity: {{ item.quantity }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <!-- prettier-ignore -->
    <section class="FAQ">
      <WebSectionsFAQ />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Bundle from "~/server/models/Bundle";
import Item from "~/server/models/Item";

const { data: bundle } = await useFetch(
  `/api/bundles?_id=${useRoute().params.id}`
);
const { data: items } = await useFetch("/api/items");

// SEO ADJUST
useSeoMeta({
  title: bundle.value ? bundle.value.name : "Bundle",
  description: bundle.value ? bundle.value.description : "",
});

// Method to resolve image path
function resolvedImgPath() {
  return bundle.value.image ? `/${bundle.value.image}` : "";
}

// Computed property for stock message and class
const stockMessage = computed(() => {
  if (bundle.value.stock > 5) {
    return "In Stock";
  } else if (bundle.value.stock > 0) {
    return `Only ${bundle.value.stock} Left In Stock`;
  } else {
    return "Out of Stock";
  }
});

const stockStatusClass = computed(() => {
  if (bundle.value.stock > 5) {
    return "in-stock";
  } else if (bundle.value.stock > 0) {
    return "low-stock";
  } else {
    return "out-of-stock";
  }
});

// Method to get item details by item ID
function itemDetails(itemId) {
  return items.value.find((item) => item._id === itemId) || {};
}

// Emit to hide loading if necessary
const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
.wrapper {
  width: 100%;
}

.bundle-wrapper {
  background: url("/HoneyCombBG.svg") no-repeat;
  background-size: cover;
  color: #f1b55c;
  font-family: Montserrat, cursive;
}

.bundle-container {
  display: flex;
  justify-content: space-between;
  min-height: 55rem;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12rem 2rem;
}

.left-column,
.right-column {
  width: 45%;
  justify-content: baseline;
  height: 100%;
}

.img-wrapper {
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right-column h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bolder;
}

.header {
  margin-bottom: 2rem;
}

.bundle-price {
  font-size: 1.5rem;
  font-weight: bolder;
}

.discount {
  font-size: 1.2rem;
  color: #c1ff72;
  font-weight: bold;
  margin-left: 10px;
}

.right-column .description {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  white-space: pre-line;
}

.items-list {
  margin-top: 2rem;
}

.items-list h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.items-list ul {
  list-style-type: none;
  padding-left: 0;
}

.items-list li {
  font-size: 1rem;
  background-color: #ff8000;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
}

.stock-status {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.in-stock {
  color: #28a745;
}

.low-stock {
  color: #ff5722;
}

.out-of-stock {
  color: #dc3545;
}

@media (max-width: 768px) {
  .bundle-container {
    flex-direction: column;
    padding: 5rem;
  }

  .left-column,
  .right-column {
    width: 100%;
    height: auto;
  }

  .right-column h1 {
    margin-top: 2rem;
  }
}

@media (max-width: 480px) {
  .bundle-container {
    padding: 5rem 2rem;
  }
}
</style>
