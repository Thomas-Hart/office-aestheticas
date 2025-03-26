<template>
  <div>
    <!-- Top Navigation Section -->
    <div class="top-nav">
      <div class="top-nav-content">
        <!-- MOBILE: Hamburger Menu Button (hidden on desktop) -->
        <button class="mobile-menu-button" @click="trackAndToggleMobileNav">
          <!-- Explicit width/height to prevent layout shift -->
          <img src="/Graphics/NavBars.svg" alt="Menu" width="24" height="24" />
        </button>

        <!-- LOGO: (Copied from NavLogo) -->
        <div class="nav-logo-container">
          <div class="brand">
            <NuxtLink
              to="/"
              class="nav-logo-box"
              @click="trackNavigationLogo('Home')"
            >
              <img
                src="/Logos/OAName.svg"
                alt="Company Logo"
                class="nav-logo"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- DESKTOP: Navigation Links (Copied from NavLinks) -->
        <div class="desktop-nav-links">
          <nav class="nav-links">
            <NuxtLink to="/" class="nav-link" @click="trackAndNavigate('Home')">
              Home
            </NuxtLink>
            <span class="nav-link" @click="trackAndOpenShopMenu('Shop')">
              Shop
              <img
                class="dropdown-arrow"
                src="/Graphics/Nav/downArrow.svg"
                alt="Down Arrow"
              />
            </span>
            <NuxtLink
              to="/blog"
              class="nav-link"
              @click="trackAndNavigate('Blog')"
            >
              Blog
            </NuxtLink>
          </nav>
        </div>

        <!-- DESKTOP: Icons, Search Bar & Cart -->
        <div class="desktop-nav-right">
          <div class="nav-links">
            <!-- Search Bar (Copied from SearchBar component) -->
            <div class="search-bar-container">
              <div class="search-bar-wrapper">
                <button @click="trackAndToggleSearchBar" class="search-icon">
                  <img src="/Graphics/Nav/search.svg" alt="Search" />
                </button>
                <div class="search-bar" :class="{ expanded: showList }">
                  <input
                    v-if="showList"
                    type="text"
                    v-model="searchQuery"
                    @focus="showList = true"
                    @input="filterList"
                    placeholder="What can we help you find today?"
                    class="search-input"
                  />
                </div>
              </div>
              <transition name="dropdown">
                <ul
                  v-if="
                    !loading &&
                    searchQuery.length > 0 &&
                    filteredItems.length &&
                    showList
                  "
                  class="dropdown-list"
                >
                  <li
                    v-for="item in filteredItems"
                    :key="item._id"
                    class="dropdown-item"
                    @mousedown.prevent="trackAndGoToItemPage(item._id, item)"
                  >
                    <img
                      :src="getItemImagePath(item.image)"
                      alt="Item Image"
                      class="item-image"
                    />
                    <div class="item-info">
                      <h3>
                        <span
                          v-for="(part, index) in splitText(item.name)"
                          :key="index"
                          :class="{ highlight: part.match }"
                        >
                          {{ part.text }}
                        </span>
                      </h3>
                      <p class="item-price">${{ item.price.toFixed(2) }}</p>
                    </div>
                  </li>
                </ul>
                <div v-else-if="loading && showList" class="loading-spinner">
                  <div class="spinner"></div>
                </div>
              </transition>
            </div>

            <!-- Nav Icons (Copied from NavIcons component) -->
            <div class="nav-icons">
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
              <div v-if="hydrated && isLoggedIn" class="nav-link">
                <NuxtLink
                  to="/profile"
                  @click="trackAndCloseMobileNav('Profile')"
                >
                  <img src="/Graphics/Nav/profile.svg" alt="Profile" />
                </NuxtLink>
              </div>
              <div v-if="hydrated && isLoggedIn" class="nav-link">
                <NuxtLink
                  to="/profile?section=wishlist"
                  @click="trackAndCloseMobileNav('Wishlist')"
                >
                  <img src="/Graphics/Nav/heart.svg" alt="Wishlist" />
                </NuxtLink>
              </div>
            </div>

            <!-- Cart Button (Copied from NavCartButton component) -->
            <div class="nav-link shopping-cart" @click="toggleCart">
              <div class="nav-link-content">
                <img src="/Graphics/Nav/bag.svg" alt="Cart" class="icon-size" />
                <h2 v-if="hydrated && !isLoggedIn" class="cart-count">
                  {{ itemStore.getCartItemCount() }}
                </h2>
                <h2 v-else-if="hydrated && isLoggedIn" class="cart-count">
                  {{ userStore.getCartItemCount() }}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <!-- MOBILE: Cart Button (Copied from NavCartButton component) -->
        <div
          class="nav-link shopping-cart mobile-cart-button"
          @click="toggleCart"
        >
          <div class="nav-link-content">
            <img src="/Graphics/Nav/bag.svg" alt="Cart" class="icon-size" />
            <h2 v-if="hydrated && !isLoggedIn" class="cart-count">
              {{ itemStore.getCartItemCount() }}
            </h2>
            <h2 v-else-if="hydrated && isLoggedIn" class="cart-count">
              {{ userStore.getCartItemCount() }}
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* No import statements since everything is global in Nuxt3 */

const searchQuery = ref("");
const showList = ref(false);
const loading = ref(true);
const hydrated = ref(false);
const mobileNavOpen = ref(false);

const itemStore = useItemStore();
const userStore = useUserStore();
const router = useRouter();
const isLoggedIn = computed(() => !!userStore.token);

// Mimic original event propagation
const emit = defineEmits([
  "toggle-cart",
  "toggle-mobile-nav",
  "close-mobile-nav",
  "open-login-modal",
  "close-login-modal",
]);

// Global tracking helpers (using $fbq and $klaviyo)
const { $fbq, $klaviyo } = useNuxtApp();

/* ------------------------------
   Computed: Filtered Items
------------------------------ */
const filteredItems = computed(() => {
  // Ensure we have an array; if not, default to []
  const items = itemStore.allItems || [];
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return items.filter(
    (item) => item.name && item.name.toLowerCase().includes(query)
  );
});

/* ===============================
   TRACKING FUNCTIONS (Unified)
============================== */
function trackNavigation(actionType, extra = null) {
  let eventName, properties;
  if (actionType === "MobileMenu" && extra === "toggle") {
    eventName = "ToggledMobileMenu";
    properties = { action: "toggle", timestamp: new Date().toISOString() };
  } else if (actionType === "MobileNav" && extra === "close") {
    eventName = "ClosedMobileNav";
    properties = { action: "close", timestamp: new Date().toISOString() };
  } else if (actionType === "LoginModal" && extra === "open") {
    eventName = "OpenedLoginModal";
    properties = { action: "open", timestamp: new Date().toISOString() };
  } else if (actionType === "Cart" && extra === "interacted") {
    eventName = "InteractedWithCart";
    properties = { action: "interacted", timestamp: new Date().toISOString() };
  } else if (actionType === "Home") {
    eventName = "NavigatedToHome";
    properties = { pageName: "Home", timestamp: new Date().toISOString() };
  } else if (actionType === "SearchBar") {
    eventName = "ToggledSearchBar";
    properties = { action: "toggle", timestamp: new Date().toISOString() };
  } else if (actionType === "Item" && extra) {
    eventName = "NavigatedToItem";
    properties = {
      itemId: extra._id,
      itemName: extra.name,
      itemPrice: extra.price,
      timestamp: new Date().toISOString(),
    };
  } else if (["Profile", "Wishlist", "Blog", "Shop"].includes(actionType)) {
    eventName = `NavigatedTo${actionType}`;
    properties = { pageName: actionType, timestamp: new Date().toISOString() };
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

/* -------------------------------
   NAVIGATION & UI ACTIONS
------------------------------- */
// NavLogo click handler (from NavLogo)
function trackNavigationLogo(pageName) {
  trackNavigation(pageName);
}

// NavLinks handlers
function trackAndNavigate(pageName) {
  trackNavigation(pageName);
}
function trackAndOpenShopMenu(pageName) {
  trackNavigation(pageName);
  emit("open-shop-menu");
}

// Mobile nav handlers
function toggleMobileNav() {
  emit("toggle-mobile-nav");
}
function trackAndToggleMobileNav() {
  trackNavigation("MobileMenu", "toggle");
  toggleMobileNav();
}
function closeMobileNav() {
  emit("close-mobile-nav");
}
function trackAndCloseMobileNav(pageName) {
  trackNavigation("MobileNav", "close");
  closeMobileNav();
}

// Login modal handler
function openLoginModal() {
  emit("open-login-modal");
}
function trackAndOpenLoginModal(pageName) {
  trackNavigation("LoginModal", "open");
  openLoginModal();
}

// Cart handlers
function openCart() {
  console.log("Opening cart...");
  emit("toggle-cart");
}
function toggleCart() {
  trackNavigation("Cart", "interacted");
  openCart();
}

/* -------------------------------
   SEARCH BAR FUNCTIONS
------------------------------- */
function filterList() {
  showList.value = true;
}
function hideList() {
  setTimeout(() => {
    showList.value = false;
  }, 200);
}
function toggleSearchBar() {
  if (!showList.value) {
    showList.value = true;
  } else {
    setTimeout(() => {
      showList.value = false;
      searchQuery.value = "";
    }, 300);
  }
}
function trackAndToggleSearchBar() {
  trackNavigation("SearchBar");
  toggleSearchBar();
}
function trackAndGoToItemPage(itemId, item) {
  trackNavigation("Item", item);
  goToItemPage(itemId);
}
function goToItemPage(itemId) {
  hideList();
  router.push(`/item/${itemId}`);
}
function splitText(text) {
  const query = searchQuery.value.toLowerCase();
  if (!text || typeof text !== "string") return [{ text: "", match: false }];
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === query,
  }));
}
function getItemImagePath(fileName) {
  return "/ItemPics/" + fileName;
}

/* -------------------------------
   FETCH ITEMS & HYDRATION
------------------------------- */
const { data: itemsData, error: itemsError } = await useFetch("/api/items");
onMounted(() => {
  if (itemsError.value) {
    console.error("Failed to fetch items:", itemsError.value);
  } else {
    itemStore.setItems(itemsData.value);
  }
  loading.value = false;
  hydrated.value = true;
});

/* -------------------------------
   WATCH CART COUNT CHANGES
------------------------------- */
if (isLoggedIn.value) {
  watch(
    () => userStore.getCartItemCount(),
    (newVal, oldVal) => {
      if (newVal > oldVal) {
        openCart();
      }
    }
  );
} else {
  watch(
    () => itemStore.getCartItemCount(),
    (newVal, oldVal) => {
      if (newVal > oldVal) {
        openCart();
      }
    }
  );
}
</script>

<style scoped>
/* ================================
   Top Navigation & Layout
================================ */
.top-nav {
  position: relative;
  width: 100%;
  height: 60px; /* Fixed height to prevent shift */
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.top-nav-content {
  display: flex;
  align-items: center;
  width: 90%;
  height: 100%;
  justify-content: space-between;
}

/* ================================
   Desktop Navigation Sections
================================ */
.desktop-nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}
.desktop-nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* ================================
   Mobile Buttons
================================ */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
}
.mobile-cart-button {
  display: none;
}

/* ================================
   Logo & Brand (NavLogo)
================================ */
.nav-logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
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

/* ================================
   Navigation Links (NavLinks)
================================ */
.nav-links {
  display: flex;
  gap: 20px;
  font-family: "Inter", sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
}
.nav-link {
  font-family: "Inter", sans-serif;
  font-size: 1.25rem;
  font-weight: 475;
  color: black;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}
.nav-link:hover {
  color: #3b7d3c;
}
.dropdown-arrow {
  width: 12px;
  height: 12px;
  margin-left: 8px;
  vertical-align: middle;
}

/* ================================
   Nav Icons (NavIcons)
================================ */
.nav-icons {
  display: flex;
  align-items: center;
  gap: 20px;
}
.nav-icons .nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  color: white;
  font-size: 0.9rem;
  height: 20px;
  width: 20px;
}
.nav-icons a {
  height: 100%;
  width: 100%;
}
.nav-icons .nav-link img {
  height: 100%;
  width: 100%;
}

/* ================================
   Cart Button (NavCartButton)
================================ */
.shopping-cart {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  z-index: 101;
}
.nav-link-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  color: white;
  font-size: 0.9rem;
}
.cart-count {
  background: black;
  border-radius: 50%;
  width: 1.1rem;
  height: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: -0.5rem;
  font-size: 0.9rem;
}
.icon-size {
  height: 20px;
  width: 20px;
}

/* ================================
   Search Bar (SearchBar)
================================ */
.search-bar-container {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.search-bar-wrapper {
  display: flex;
  align-items: center;
}
.search-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  overflow: hidden;
  height: 35px;
  width: 0;
  border-radius: 20px;
  transition: width 0.3s ease;
  justify-content: flex-start;
}
.search-bar.expanded {
  width: 350px;
  padding-left: 10px;
}
.search-input {
  border: none;
  padding: 0 10px;
  height: 100%;
  font-size: 16px;
  outline: none;
  width: 100%;
  transition: opacity 0.3s ease;
  opacity: 1;
}
.search-bar:not(.expanded) .search-input {
  opacity: 0;
}
.search-icon {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.search-icon img {
  height: 20px;
  width: 20px;
}
.dropdown-list {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid #ccc;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  display: flex;
  flex-direction: column;
}
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 14px;
  color: white;
}
.dropdown-item:last-child {
  border-bottom: none;
}
.item-image {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 5px;
}
.item-info {
  flex: 1;
  text-align: left;
}
.item-info h3 {
  margin: 0;
  font-size: 16px;
  color: #fff;
}
.item-price {
  font-size: 14px;
  color: #ddd;
}
.highlight {
  background-color: darkcyan;
  color: white;
}
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
.spinner {
  border: 4px solid rgba(0, 0, 0, 1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: white;
  animation: spin 1s ease infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 480px) {
  .search-bar.expanded {
    width: 150px;
  }
  .search-bar input {
    font-size: 12px;
  }
  .dropdown-item {
    align-items: flex-start;
  }
  .item-image {
    margin-top: 5px;
  }
}

/* ================================
   Responsive Queries
================================ */
@media (max-width: 768px) {
  .desktop-nav-links,
  .desktop-nav-right {
    display: none;
  }
  .mobile-menu-button,
  .mobile-cart-button {
    display: block;
  }
  .nav-logo-container {
    flex: 1;
    justify-content: center;
  }
}
@media (min-width: 769px) {
  .mobile-menu-button,
  .mobile-cart-button {
    display: none;
  }
  .desktop-nav-links,
  .desktop-nav-right {
    display: flex;
  }
  .nav-logo-container {
    flex: 0;
    justify-content: flex-start;
  }
}

/* ================================
   Optional Click Animation
================================ */
.click-animation {
  position: absolute;
  top: 6rem;
  right: 5rem;
  width: 5rem;
  height: 5rem;
  animation: clickAnimation 1s ease infinite;
  z-index: 101;
}
.click-text {
  position: absolute;
  top: 12rem;
  right: 5rem;
  color: white;
  font-size: 1rem;
  z-index: 101;
  width: 5rem;
  text-align: center;
}
@keyframes clickAnimation {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.no-scroll {
  overflow: hidden;
}
</style>
