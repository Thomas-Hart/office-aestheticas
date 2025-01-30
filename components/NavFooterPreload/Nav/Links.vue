<template>
  <nav class="nav-links">
    <NuxtLink to="/" class="nav-link">Home</NuxtLink>
    <span class="nav-link" @click="openShopMenu">
      Shop
      <img
        class="dropdown-arrow"
        src="/Graphics/Nav/downArrow.svg"
        alt="Down Arrow"
      />
    </span>
    <NuxtLink to="/blog" class="nav-link">Blog</NuxtLink>
  </nav>
</template>
  
  <script setup>
// Emit to open the shop menu
const emit = defineEmits(["open-shop-menu"]);
const openShopMenu = () => {
  emit("open-shop-menu");
};
</script>
  
  <style scoped>
.nav-links {
  display: flex;
  gap: 20px;
  font-family: "Inter", sans-serif;
  font-size: 1.25rem;
  font-weight: 400; /* Lighter font weight for a clean appearance */
}

.nav-link {
  font-family: "Inter", sans-serif;
  font-size: 1.25rem;
  font-weight: 475; /* Fine-tuned for Figma-like rendering */
  color: black;
  cursor: pointer;
  transition: color 0.2s ease-in-out; /* Smooth color transition */
}

.nav-link:hover {
  color: #3b7d3c; /* Slight green hover effect */
}

.dropdown-arrow {
  width: 12px;
  height: 12px;
  margin-left: 8px;
  vertical-align: middle; /* Aligns the arrow vertically with the text */
}
</style>
  