<template>
  <ul class="mobile-category-list">
    <!-- Back button up top, or you can style it differently -->
    <li v-if="mobileView" @click="$emit('switchToLinks')" class="back-button">
      &larr; Back
    </li>

    <!-- Actual categories -->
    <li v-for="cat in categories" :key="cat" @click="onCategoryClick(cat)">
      {{ cat }}
    </li>
  </ul>
</template>
  
  <script setup>
const emit = defineEmits(["switchToLinks", "close-mobile-nav"]);

const mobileView = ref(false);

/** Hard-coded categories. */
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

const router = useRouter();

/** Navigate to the category, then close the overlay. */
function onCategoryClick(category) {
  router.push({
    path: "/",
    query: {
      tab: "All",
      category,
    },
  });

  // After pushing, let's also switch back to the main links next time
  if (window.innerWidth < 768) {
    emit("switchToLinks");
  }
  emit("close-mobile-nav");
}

function handleResize() {
  mobileView.value = window.innerWidth < 768;
}

onMounted(() => {
  // Check size immediately
  handleResize();
  // Listen for window resize
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
  
  <style scoped>
.mobile-category-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
}

.mobile-category-list li {
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.mobile-category-list li:hover {
  font-weight: bold;
}

/* Example styling for the "Back" row at the top */
.back-button {
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  color: #777; /* or your preferred style */
}

@media (max-width: 480px) {
  .mobile-category-list li {
    cursor: pointer;
    margin-bottom: 0.65rem;
    font-size: 1.2rem;
  }
}
</style>
  