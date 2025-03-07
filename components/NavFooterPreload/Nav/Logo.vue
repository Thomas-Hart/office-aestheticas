<template>
  <div class="brand">
    <NuxtLink to="/" class="nav-logo-box" @click="trackNavigation('Home')">
      <img src="/Logos/OAName.svg" alt="Company Logo" class="nav-logo" />
    </NuxtLink>
  </div>
</template>

<script setup>
const userStore = useUserStore();

// Check if user is logged in
const isLoggedIn = computed(() => !!userStore.token);

// Inject Meta Pixel and Klaviyo with $ prefix
const { $fbq } = useNuxtApp();
const { $klaviyo } = useNuxtApp();

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
.brand {
  display: flex;
  align-items: center;
  gap: 20px;
}
.nav-logo-box {
  width: 160px;
  height: auto;
}
.nav-logo {
  max-width: 100%;
  height: auto;
}

@media (max-width: 480px) {
  .nav-logo-box {
    /* width: 60px; */
  }
}
</style>