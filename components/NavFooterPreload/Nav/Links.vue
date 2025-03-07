<template>
  <nav class="nav-links">
    <NuxtLink to="/" class="nav-link" @click="trackAndNavigate('Home')"
      >Home</NuxtLink
    >
    <span class="nav-link" @click="trackAndOpenShopMenu('Shop')">
      Shop
      <img
        class="dropdown-arrow"
        src="/Graphics/Nav/downArrow.svg"
        alt="Down Arrow"
      />
    </span>
    <NuxtLink to="/blog" class="nav-link" @click="trackAndNavigate('Blog')"
      >Blog</NuxtLink
    >
  </nav>
</template>

<script setup>
const emit = defineEmits(["open-shop-menu"]);
const userStore = useUserStore();

// Check if user is logged in
const isLoggedIn = computed(() => !!userStore.token);

// Inject Meta Pixel and Klaviyo with $ prefix
const { $fbq } = useNuxtApp();
const { $klaviyo } = useNuxtApp();

/** Open shop menu and track the click. */
function trackAndOpenShopMenu(pageName) {
  trackNavigation(pageName);
  emit("open-shop-menu");
}

/** Track and navigate for NuxtLink clicks. */
function trackAndNavigate(pageName) {
  trackNavigation(pageName);
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