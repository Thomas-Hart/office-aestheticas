<template>
  <!-- Full-screen overlay -->
  <div class="overlay" @click.self="trackAndCloseNav">
    <!-- Slide-out menu on the left -->
    <div class="mobile-nav-content">
      <!-- Close button in top-left -->
      <div class="mobile-nav-header">
        <button class="close-button" @click="trackAndCloseNav">×</button>
      </div>

      <!-- Logo near the top -->
      <div class="mobile-nav-logo">
        <img
          class="logo"
          src="/Logos/OAName.svg"
          alt="Office Aestheticas"
          @click="trackNavigation('Home')"
        />
      </div>

      <!-- Transition wrapper for switching between Links and Categories -->
      <!-- Added mode="out-in" and keys to each component -->
      <transition name="fade" mode="out-in">
        <!-- Categories View -->
        <NavFooterPreloadShopCategories
          v-if="activeView !== 'links'"
          key="categories"
          @switchToLinks="trackAndSwitchToLinks"
          @close-mobile-nav="trackAndCloseNav"
        />

        <!-- Links View -->
        <NavFooterPreloadMobileNavLinks
          v-else
          key="links"
          @switchToCategories="trackAndSwitchToCategories"
          @open-shop-menu="activeView = 'menu'"
          @closeNav="trackAndCloseNav"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close"]);

const activeView = ref("");

const userStore = useUserStore();

// Check if user is logged in
const isLoggedIn = computed(() => !!userStore.token);

// Inject Meta Pixel and Klaviyo with $ prefix
const { $fbq } = useNuxtApp();
const { $klaviyo } = useNuxtApp();

/** Close nav and track the action. */
function trackAndCloseNav() {
  trackNavigation("MobileNav", "close");
  emit("close");
  activeView.value = "links";
}

/** Switch to Categories view and track the action. */
function trackAndSwitchToCategories() {
  trackNavigation("Categories");
  activeView.value = "categories";
}

/** Switch to Links view and track the action. */
function trackAndSwitchToLinks() {
  trackNavigation("Links");
  activeView.value = "links";
}

/** Track navigation or interaction events with Meta Pixel and Klaviyo, including login status and user data. */
function trackNavigation(actionType, action = null) {
  let eventName, properties;

  if (actionType === "MobileNav" && action === "close") {
    eventName = "ClosedMobileNav";
    properties = {
      action: "close",
      timestamp: new Date().toISOString(),
    };
  } else if (actionType === "Categories") {
    eventName = "SwitchedToCategories";
    properties = {
      view: "categories",
      timestamp: new Date().toISOString(),
    };
  } else if (actionType === "Links") {
    eventName = "SwitchedToLinks";
    properties = {
      view: "links",
      timestamp: new Date().toISOString(),
    };
  } else if (actionType === "Home") {
    eventName = "NavigatedToHome";
    properties = {
      pageName: "Home",
      timestamp: new Date().toISOString(),
    };
  }

  const enhancedProperties = isLoggedIn.value
    ? {
        ...properties,
        isLoggedIn: true,
        userId: userStore.user._id,
        email: userStore.user.email,
        cartSize: userStore.user.cart.length,
        wishlistSize: userStore.user.wishlist.length,
        recentlyViewedCount: userStore.user.recentlyViewedItems.length,
        location: `${userStore.user.contact.city}, ${userStore.user.contact.state}`,
      }
    : {
        ...properties,
        isLoggedIn: false,
      };

  // Track with Meta Pixel
  $fbq("trackCustom", eventName, enhancedProperties);

  // Track with Klaviyo
  $klaviyo("track", eventName, enhancedProperties);
}

/** Handle resize logic. */
function handleResize() {
  activeView.value = window.innerWidth < 768 ? "links" : "";
}

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
/* Dark, full-screen overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
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

  font-family: "Montserrat", sans-serif;
  line-height: 1.4;
}

.mobile-nav-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: -1rem;
}

/* Close Button */
.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

/* Logo container near the top */
.mobile-nav-logo {
  display: flex;
}

.logo {
  width: 100%;
}

/* Fade transition for switching between Links and Categories */
.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .mobile-nav-content {
    padding: 1rem 2rem;
  }
}
</style>