<template>
  <!-- Full-screen overlay -->
  <div class="overlay" @click.self="closeNav">
    <!-- Slide-out menu on the left -->
    <div class="mobile-nav-content">
      <!-- Close button in top-left -->
      <div class="mobile-nav-header">
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <!-- (Optional) Logo or brand name near the top -->
      <div class="mobile-nav-logo">
        <img class="logo" src="/Logos/OAName.svg" alt="" />
      </div>

      <!-- Category list -->
      <ul class="mobile-category-list">
        <li
          v-for="(cat, i) in categories"
          :key="i"
          @click="onCategoryClick(cat)"
        >
          {{ cat }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

// Events
const emit = defineEmits(["close"]);

// We’ll push this array of categories into the side menu
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

// Router instance
const router = useRouter();

/**
 * Handle category click:
 *   1. Update URL query (e.g. ?tab=All&category=Lighting)
 *   2. Close the mobile nav
 */
function onCategoryClick(category) {
  router.push({
    path: "/",
    query: {
      tab: "All",
      category,
    },
  });
  closeNav();
}

// Emit close event to parent
function closeNav() {
  emit("close");
}
</script>

<style scoped>
/* Dark, full-screen overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* dims rest of the screen */
  display: flex;
  justify-content: flex-start;
  z-index: 1000;
  padding: 1rem;
}

/* The slide-out container */
.mobile-nav-content {
  width: 20rem;
  max-width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 2rem;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  /* Font and Spacing Consistency */
  font-family: "Montserrat", sans-serif;
  line-height: 1.4;
}

.mobile-nav-header {
  display: flex;
  justify-content: flex-end;
}

/* Close Button */
.mobile-nav-header .close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

/* Logo container near the top */
.mobile-nav-logo {
  display: flex;
  /* justify-content: center; */
}

.logo {
  height: 8rem;
}

/* Category list */
.mobile-category-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-category-list li {
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  /* Adjust spacing/styling as desired */
}

.mobile-category-list li:hover {
  font-weight: bold;
}

@media (max-width: 480px) {
  .mobile-category-list li {
    margin-bottom: 0.7rem;
  }

  .logo {
    /* height: 7.5rem; */
  }
}
</style>
