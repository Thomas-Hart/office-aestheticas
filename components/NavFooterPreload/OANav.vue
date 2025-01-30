<template>
  <div>
    <!-- Top Navigation Section -->
    <div class="top-nav">
      <div class="top-nav-content">
        <!-- MOBILE: Hamburger Menu Button (hidden on desktop) -->
        <button class="mobile-menu-button" @click="toggleMobileNav">
          <!-- Explicit width/height to prevent layout shift -->
          <img src="/Graphics/NavBars.svg" alt="Menu" width="24" height="24" />
        </button>

        <!-- LOGO: If possible, define width/height in your logo component or here -->
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
    <!-- Also add fixed width/height here if needed -->
    <img
      v-if="showClickAnimation && !isDropDownVisible"
      src="/CartPoint.svg"
      alt="Click Animation"
      class="click-animation"
      width="80"
      height="80"
    />
    <p v-if="showClickAnimation && !isDropDownVisible" class="click-text">
      Click here to see your cart
    </p>
  </div>
</template>

<script setup>
const itemStore = useItemStore();

// State
const showClickAnimation = ref(false);
const isDropDownVisible = ref(false);

// Watch cart item count to trigger pointer animation from 0 -> 1
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

function toggleCart() {
  emit("toggle-cart");
}
function toggleMobileNav() {
  emit("toggle-mobile-nav");
}
function closeMobileNav() {
  emit("close-mobile-nav");
}
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
  /* Fix a known height to prevent vertical shift */
  position: relative;
  width: 100%;
  height: 60px; /* matches .top-nav-content height below */
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

/* ----------------------------------------
   MOBILE BUTTONS
---------------------------------------- */
.mobile-menu-button {
  display: none; /* Shown < 768px */
  background: none;
  border: none;
  cursor: pointer;
  /* This ensures the button has stable dimensions for the icon */
  width: 24px;
  height: 24px;
}

.mobile-cart-button {
  display: none; /* Shown < 768px */
}

/* Logo container */
.nav-logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* desktop default, mobile overrides below */
  /* Optionally fix a width/height if your logo is a direct <img>:
     min-width: 120px; 
     min-height: 40px;
  */
}

/* ----------------------------------------
   CART POINTER ANIMATION (optional)
---------------------------------------- */
.click-animation {
  position: absolute;
  top: 6rem;
  right: 5rem;
  /* we've given the <img> width/height in HTML too, 
     but you can also set them here to preserve space */
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

/* Prevent body scroll when nav or modal is open */
.no-scroll {
  overflow: hidden;
}

/* ----------------------------------------
   RESPONSIVE QUERIES
---------------------------------------- */
@media (max-width: 768px) {
  .desktop-nav-links,
  .desktop-nav-right {
    display: none; /* hide on mobile */
  }

  .mobile-menu-button,
  .mobile-cart-button {
    display: block; /* show on mobile */
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
</style>
