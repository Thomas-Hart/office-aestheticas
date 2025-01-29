<template>
  <div>
    <!-- Top Navigation Section -->
    <div class="top-nav">
      <div class="top-nav-content">
        <!-- MOBILE: Hamburger Menu Button (hidden on desktop) -->
        <button class="mobile-menu-button" @click="toggleMobileNav">
          <img src="/Graphics/NavBars.svg" alt="Menu" />
        </button>

        <!-- LOGO: Always visible, but centered on mobile; left on desktop -->
        <div class="nav-logo-container">
          <NavFooterPreloadNavLogo />
        </div>

        <!-- DESKTOP: Navigation Links in the center (hidden on mobile) -->
        <div class="desktop-nav-links">
          <NavFooterPreloadNavLinks @open-shop-menu="toggleMobileNav" />
        </div>

        <!-- DESKTOP: Icons + Cart on the right (hidden on mobile) -->
        <div class="desktop-nav-right">
          <NavFooterPreloadNavIcons
            @closeMobileNav="closeMobileNav"
            @openLoginModal="openLoginModal"
          />
          <NavFooterPreloadNavCartButton
            @clicked="closeMobileNav"
            @toggle-cart="toggleCart"
          />
        </div>

        <!-- MOBILE: Cart Button (hidden on desktop) -->
        <NavFooterPreloadNavCartButton
          class="mobile-cart-button"
          @clicked="closeMobileNav"
          @toggle-cart="toggleCart"
        />
      </div>
    </div>

    <!-- Pointer Animation & Text for Cart (Optional) -->
    <img
      v-if="showClickAnimation && !isDropDownVisible"
      src="/CartPoint.svg"
      alt="Click Animation"
      class="click-animation"
    />
    <p v-if="showClickAnimation && !isDropDownVisible" class="click-text">
      Click here to see your cart
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const itemStore = useItemStore();

// State variables
const showClickAnimation = ref(false);
const isDropDownVisible = ref(false);

// Watch cart item count to trigger a pointer animation from 0 -> 1
watch(
  () => itemStore.getCartItemCount(),
  (newVal, oldVal) => {
    if (oldVal === 0 && newVal === 1 && !isDropDownVisible.value) {
      triggerClickAnimation();
    }
  }
);

function triggerClickAnimation() {
  showClickAnimation.value = true;
  setTimeout(() => {
    showClickAnimation.value = false;
  }, 3000);
}

const emit = defineEmits([
  "toggle-cart",
  "toggle-mobile-nav",
  "close-mobile-nav",
  "open-login-modal",
  "close-login-modal",
]);

// Emit toggle-cart event
function toggleCart() {
  emit("toggle-cart");
}

// Toggle mobile nav
function toggleMobileNav() {
  console.log("here");
  emit("toggle-mobile-nav");
}

function closeMobileNav() {
  emit("close-mobile-nav");
}

// Login modal
function openLoginModal() {
  emit("open-login-modal");
}

function closeLoginModal() {
  emit("close-login-modal");
}
</script>

<style scoped>
/* ----------------------------------------
   NAV WRAPPER
---------------------------------------- */
.top-nav {
  position: relative;
  width: 100%;
  height: 60px;
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

/* ----------------------------------------
   DESKTOP NAV SECTIONS
---------------------------------------- */
/* Middle (nav links on desktop) */
.desktop-nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Right side (icons + cart on desktop) */
.desktop-nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* ----------------------------------------
   MOBILE BUTTONS (hidden on desktop)
---------------------------------------- */
.mobile-menu-button {
  display: none; /* Shown below 768px */
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-cart-button {
  display: none; /* Shown below 768px */
}

/* ----------------------------------------
   LOGO CONTAINER
---------------------------------------- */
.nav-logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Desktop default. Overridden in media query below for mobile. */
}

/* ----------------------------------------
   CART POINTER ANIMATION (optional)
---------------------------------------- */
.click-animation {
  position: absolute;
  top: 6rem; /* Adjust to position under cart icon */
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

.mobile-menu-button img {
  height: 1.5rem;
  width: 1.5rem;
}

/* Prevent body scroll when nav or modal is open */
.no-scroll {
  overflow: hidden;
}

/* ----------------------------------------
   RESPONSIVE QUERIES
---------------------------------------- */
@media (max-width: 768px) {
  /* Hide the desktop nav links & icons on mobile */
  .desktop-nav-links,
  .desktop-nav-right {
    display: none;
  }

  /* Show the mobile hamburger & mobile cart */
  .mobile-menu-button,
  .mobile-cart-button {
    display: block;
  }

  /* Center the logo on mobile */
  .nav-logo-container {
    flex: 1;
    justify-content: center;
  }
}

@media (min-width: 769px) {
  /* Hide the mobile controls on desktop */
  .mobile-menu-button,
  .mobile-cart-button {
    display: none;
  }

  /* Keep everything else visible on desktop */
  .desktop-nav-links,
  .desktop-nav-right {
    display: flex;
  }

  .nav-logo-container {
    flex: 0;
    justify-content: flex-start;
  }
}
</style>
