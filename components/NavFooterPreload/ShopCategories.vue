<template>
  <ul class="mobile-category-list">
    <li
      v-for="(cat, i) in categories"
      :key="i"
      @click="emitCategoryClicked(cat)"
    >
      {{ cat }}
    </li>
  </ul>
</template>
  
  <script setup>
// We keep the categories data and click handling here
const categories = [
  "Desks and Tables",
  "Chairs and Seating",
  "Computers and Electronics",
  "Office Supplies",
  "Ergonomic Accessories",
  "Lighting",
  "Decor and Comfort",
  "Communication",
  "Health and Wellness",
  "Networking and Security",
  "Cleaning and Maintenance",
  "Storage Solutions",
];

const emit = defineEmits(["categoryClicked"]);

function emitCategoryClicked(cat) {
  emit("categoryClicked", cat);
}
</script>
  
  <style scoped>
.mobile-category-list {
  list-style: none;
  margin: 1rem 0;
  padding: 0;
  border-left: 3px solid #ddd;
  margin-left: 1rem;
  padding-left: 1rem;
}

.mobile-category-list li {
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.mobile-category-list li:hover {
  font-weight: bold;
}
</style>
  