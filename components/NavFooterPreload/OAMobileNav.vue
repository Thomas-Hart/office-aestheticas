<template>
  <div class="overlay" @click.self="trackAndCloseNav">
    <div class="mobile-nav-content">
      <div class="mobile-nav-header">
        <button class="close-button" @click="trackAndCloseNav">×</button>
      </div>
      <div class="mobile-nav-logo">
        <img
          class="logo"
          src="/Logos/OAName.svg"
          alt="Office Aestheticas"
          @click="trackNavigation('Home')"
        />
      </div>
      <transition name="fade" mode="out-in">
        <template v-if="activeView !== 'links'" key="categories">
          <ul class="mobile-category-list">
            <li
              v-if="mobileView"
              @click="trackAndSwitchToLinks"
              class="back-button"
            >
              ← Back
            </li>
            <li
              v-for="(label, key) in tagDescriptions"
              :key="key"
              @click="trackAndNavigateToCategory(key)"
            >
              {{ label }}
            </li>
          </ul>
        </template>
        <template v-else key="links">
          <ul class="mobile-nav-list">
            <li>
              <NuxtLink to="/" @click="closeAndReset('Home')">Home</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/blog" @click="closeAndReset('Blog')"
                >Blog</NuxtLink
              >
            </li>
            <li>
              <template v-if="!isLoggedIn">
                <button @click="handleProfileClick">Profile</button>
              </template>
              <template v-else>
                <NuxtLink to="/profile" @click="closeAndReset('Profile')">
                  Profile
                </NuxtLink>
              </template>
            </li>
            <li>
              <template v-if="!isLoggedIn">
                <button @click="handleWishlistClick">Wishlist</button>
              </template>
              <template v-else>
                <NuxtLink
                  to="/profile?section=wishlist"
                  @click="closeAndReset('Wishlist')"
                >
                  Wishlist
                </NuxtLink>
              </template>
            </li>
            <li><button @click="trackShopClick">Shop</button></li>
            <li><button disabled>Search (coming soon)</button></li>
          </ul>
        </template>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { tagDescriptions } from "~/utils/tagDescriptions.js"; // ← pull categories from tagDescriptions

const emit = defineEmits(["close", "open-login-modal"]);
const activeView = ref("");
const mobileView = ref(false);
const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.token);
const { $fbq, $klaviyo } = useNuxtApp();
const router = useRouter();

function trackNavigation(actionType, action = null) {
  let eventName = "";
  let properties = {};
  if (actionType === "MobileNav" && action === "close") {
    eventName = "ClosedMobileNav";
    properties = { action: "close", timestamp: new Date().toISOString() };
  } else if (actionType === "Categories") {
    eventName = "SwitchedToCategories";
    properties = { view: "categories", timestamp: new Date().toISOString() };
  } else if (actionType === "Links") {
    eventName = "SwitchedToLinks";
    properties = { view: "links", timestamp: new Date().toISOString() };
  } else if (actionType === "Category") {
    eventName = "NavigatedToCategory";
    properties = { category: action, timestamp: new Date().toISOString() };
  } else {
    eventName = `NavigatedTo${actionType}`;
    properties = {
      pageName: actionType,
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
    : { ...properties, isLoggedIn: false };
  $fbq("trackCustom", eventName, enhancedProperties);
  $klaviyo("track", eventName, enhancedProperties);
}

function trackAndCloseNav() {
  trackNavigation("MobileNav", "close");
  emit("close");
  activeView.value = "links";
}

function trackAndSwitchToCategories() {
  trackNavigation("Categories");
  activeView.value = "categories";
}

function trackAndSwitchToLinks() {
  trackNavigation("Links");
  activeView.value = "links";
}

function closeAndReset(pageName) {
  trackNavigation(pageName);
  trackAndCloseNav();
}

function handleProfileClick() {
  trackNavigation("LoginModal", "open");
  emit("open-login-modal");
  trackAndCloseNav();
}

function handleWishlistClick() {
  trackNavigation("LoginModal", "open");
  emit("open-login-modal");
  trackAndCloseNav();
}

function trackShopClick() {
  trackNavigation("Shop");
  trackAndSwitchToCategories();
}

function trackAndNavigateToCategory(categoryKey) {
  trackNavigation("Category", categoryKey);
  router.push({ path: "/", query: { tab: "All", category: categoryKey } });
  if (window.innerWidth < 768) {
    trackAndSwitchToLinks();
  }
  trackAndCloseNav();
}

function handleResize() {
  mobileView.value = window.innerWidth < 768;
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
.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}
.mobile-nav-logo {
  display: flex;
}
.logo {
  width: 100%;
}
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
.back-button {
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  color: #777;
}
@media (max-width: 480px) {
  .mobile-category-list li {
    margin-bottom: 0.65rem;
    font-size: 1.2rem;
  }
}
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
  margin-bottom: 0rem;
  font-size: 1.2rem;
  background: none;
  border: none;
}
button:hover {
  font-weight: bold;
}
</style>
