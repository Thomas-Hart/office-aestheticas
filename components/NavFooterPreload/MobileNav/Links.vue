<template>
  <ul class="mobile-nav-list">
    <!-- Home -->
    <li>
      <NuxtLink to="/" @click="closeAndReset('Home')"> Home </NuxtLink>
    </li>

    <!-- Blog -->
    <li>
      <NuxtLink to="/blog" @click="closeAndReset('Blog')"> Blog </NuxtLink>
    </li>

    <!-- Profile -->
    <li>
      <NuxtLink to="/profile" @click="closeAndReset('Profile')">
        Profile
      </NuxtLink>
    </li>

    <!-- Wishlist -->
    <li>
      <NuxtLink
        to="/profile?section=wishlist"
        @click="closeAndReset('Wishlist')"
      >
        Wishlist
      </NuxtLink>
    </li>

    <li>
      <button @click="trackShopClick">Shop</button>
    </li>

    <!-- Search placeholder -->
    <li>
      <button disabled>Search (coming soon)</button>
    </li>
  </ul>
</template>

<script setup>
const emit = defineEmits(["switchToCategories", "closeNav"]);
const userStore = useUserStore();

// Check if user is logged in
const isLoggedIn = computed(() => !!userStore.user);

// Inject Meta Pixel and Klaviyo with $ prefix
const { $fbq } = useNuxtApp();
const { $klaviyo } = useNuxtApp();

/** Close the nav and track the link click. */
function closeAndReset(pageName) {
  trackNavigation(pageName);
  emit("closeNav");
}

/** Track Shop button click. */
function trackShopClick() {
  trackNavigation("Shop");
  emit("switchToCategories");
}

/** Track navigation events with Meta Pixel and Klaviyo, including login status and user data. */
function trackNavigation(pageName) {
  const eventName = `NavigatedTo${pageName}`;
  const baseProperties = {
    pageName,
    timestamp: new Date().toISOString(),
  };

  const properties = isLoggedIn.value
    ? {
        ...baseProperties,
        isLoggedIn: true,
        userId: userStore.user._id,
        email: userStore.user.email,
        cartSize: userStore.user.cart.length,
        wishlistSize: userStore.user.wishlist.length,
        recentlyViewedCount: userStore.user.recentlyViewedItems.length,
        location: `${userStore.user.contact.city}, ${userStore.user.contact.state}`,
        // Avoid sending full cart/wishlist for performance; summarize instead
      }
    : {
        ...baseProperties,
        isLoggedIn: false,
      };

  // Track with Meta Pixel
  $fbq("trackCustom", eventName, properties);

  // Track with Klaviyo
  $klaviyo("track", eventName, properties);
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