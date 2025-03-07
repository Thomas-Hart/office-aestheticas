<template>
  <div class="nav-links">
    <NavFooterPreloadNavSearchBar />
    <div
      v-if="hydrated && !isLoggedIn"
      class="nav-link"
      @click="trackAndOpenLoginModal('Profile')"
    >
      <img src="/Graphics/Nav/profile.svg" alt="Login" />
    </div>
    <div
      v-if="hydrated && !isLoggedIn"
      class="nav-link"
      @click="trackAndOpenLoginModal('Wishlist')"
    >
      <img src="/Graphics/Nav/heart.svg" alt="Login" />
    </div>
    <div class="nav-link" v-if="hydrated && isLoggedIn">
      <NuxtLink to="/profile" @click="trackAndCloseMobileNav('Profile')">
        <img src="/Graphics/Nav/profile.svg" alt="Blog Graphic" />
      </NuxtLink>
    </div>
    <div class="nav-link" v-if="hydrated && isLoggedIn">
      <NuxtLink
        to="/profile?section=wishlist"
        @click="trackAndCloseMobileNav('Wishlist')"
      >
        <img src="/Graphics/Nav/heart.svg" alt="Blog Graphic" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const hydrated = ref(false); // Assume hydrated flag is passed as prop
const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.token);

const emit = defineEmits(["closeMobileNav", "openLoginModal"]);

// Inject Meta Pixel and Klaviyo with $ prefix
const { $fbq } = useNuxtApp();
const { $klaviyo } = useNuxtApp();

/** Close mobile nav and track the link click. */
function trackAndCloseMobileNav(pageName) {
  trackNavigation(pageName);
  emit("closeMobileNav");
}

/** Open login modal and track the click. */
function trackAndOpenLoginModal(pageName) {
  trackNavigation(pageName);
  emit("openLoginModal");
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

onMounted(() => {
  hydrated.value = true;
});
</script>

<style scoped>
.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}
.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;
  text-align: center;
  color: white;
  font-size: 0.9rem;
  height: 20px;
  width: 20px;
}

a {
  height: 100%;
  width: 100%;
}

.nav-link img {
  height: 100%;
  width: 100%;
}
</style>