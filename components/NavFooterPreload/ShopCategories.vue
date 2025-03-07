<template>
  <ul class="mobile-category-list">
    <!-- Back button up top, or you can style it differently -->
    <li v-if="mobileView" @click="trackAndSwitchToLinks" class="back-button">
      ← Back
    </li>

    <!-- Actual categories -->
    <li
      v-for="cat in categories"
      :key="cat"
      @click="trackAndNavigateToCategory(cat)"
    >
      {{ cat }}
    </li>
  </ul>
</template>

<script setup>
const emit = defineEmits(["switchToLinks", "close-mobile-nav"]);

const mobileView = ref(false);

const userStore = useUserStore();

// Check if user is logged in
const isLoggedIn = computed(() => !!userStore.token);

// Inject Meta Pixel and Klaviyo with $ prefix
const { $fbq } = useNuxtApp();
const { $klaviyo } = useNuxtApp();

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

/** Navigate to the category, track the action, and close the overlay. */
function trackAndNavigateToCategory(category) {
  trackNavigation("Category", category);

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
  trackAndCloseMobileNav();
}

/** Switch to links view and track the action. */
function trackAndSwitchToLinks() {
  trackNavigation("Links");
  emit("switchToLinks");
}

/** Close mobile nav and track the action. */
function trackAndCloseMobileNav() {
  trackNavigation("MobileNav", "close");
  emit("close-mobile-nav");
}

/** Track navigation or interaction events with Meta Pixel and Klaviyo, including login status and user data. */
function trackNavigation(actionType, action = null) {
  let eventName, properties;

  if (actionType === "Category") {
    eventName = "NavigatedToCategory";
    properties = {
      category: action,
      timestamp: new Date().toISOString(),
    };
  } else if (actionType === "Links") {
    eventName = "SwitchedToLinks";
    properties = {
      view: "links",
      timestamp: new Date().toISOString(),
    };
  } else if (actionType === "MobileNav" && action === "close") {
    eventName = "ClosedMobileNav";
    properties = {
      action: "close",
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