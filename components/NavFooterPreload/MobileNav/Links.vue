<template>
  <ul class="mobile-nav-list">
    <!-- Home -->
    <li>
      <NuxtLink to="/" @click="closeAndReset"> Home </NuxtLink>
    </li>

    <!-- Blog -->
    <li>
      <NuxtLink to="/blog" @click="closeAndReset"> Blog </NuxtLink>
    </li>

    <!-- Profile -->
    <li>
      <NuxtLink to="/profile" @click="closeAndReset"> Profile </NuxtLink>
    </li>

    <!-- Wishlist -->
    <li>
      <NuxtLink to="/profile?section=wishlist" @click="closeAndReset">
        Wishlist
      </NuxtLink>
    </li>

    <li>
      <button @click="$emit('switchToCategories')">Shop</button>
    </li>

    <!-- Search placeholder -->
    <li>
      <button disabled>Search (coming soon)</button>
    </li>

    <!-- Shop: Switch to categories view -->
  </ul>
</template>
  
  <script setup>
const emit = defineEmits(["switchToCategories", "closeNav"]);

/** Close the entire nav if user taps a link. */
function closeAndReset() {
  emit("closeNav");
}
</script>
  
  <style scoped>
.mobile-nav-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
}

.mobile-nav-list li {
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
}

.mobile-nav-list li:after {
  content: ">";
}

.mobile-nav-list li:hover {
  font-weight: bold;
}

button {
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  background: none;
  border: none;
}

button:hover {
  font-weight: bold;
}
</style>
  