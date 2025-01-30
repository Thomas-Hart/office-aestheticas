<template>
  <div>
    <NavFooterPreloadOANav
      @toggle-cart="toggleCartVisibility"
      @toggle-mobile-nav="toggleMobileNav"
      @close-mobile-nav="closeMobileNav"
      @open-login-modal="openLoginModal"
      @close-login-modal="closeLoginModal"
      :class="{ 'nav-hidden': isNavHidden, 'nav-visible': !isNavHidden }"
    />

    <!-- MOBILE NAV OVERLAY COMPONENT -->
    <transition name="cart-transition">
      <NavFooterPreloadOAMobileNav
        v-if="showMobileNav"
        @close="toggleMobileNav"
        @openLoginModal="openLoginModal"
      />
    </transition>

    <!-- LOGIN MODAL -->
    <transition name="cart-transition">
      <NavFooterPreloadLoginModal
        v-if="showLoginModal"
        @close="closeLoginModal"
      />
    </transition>

    <transition name="cart-transition">
      <EcommerceNavCart
        v-if="isCartVisible"
        @close-cart="toggleCartVisibility"
      />
    </transition>

    <div>
      <slot />
    </div>

    <NavFooterPreloadOAFooter />
  </div>
</template>

<script setup>
const isCartVisible = ref(false);
const isNavHidden = ref(false);
const showMobileNav = ref(false);
const showLoginModal = ref(false);

let lastScrollY = 0;

const store = useUserStore();
const isLoggedIn = computed(() => !!store.token);

// Function to toggle cart visibility
const toggleCartVisibility = () => {
  isCartVisible.value = !isCartVisible.value;
};

// Toggle mobile nav
function toggleMobileNav() {
  showMobileNav.value = !showMobileNav.value;
  // Prevent scrolling in background when nav is open
  document.body.classList.toggle("no-scroll", showMobileNav.value);
}

function closeMobileNav() {
  showMobileNav.value = false;
  document.body.classList.remove("no-scroll");
}

// Login modal
function openLoginModal() {
  showLoginModal.value = true;
  document.body.classList.add("no-scroll");
}

function closeLoginModal() {
  showLoginModal.value = false;
  document.body.classList.remove("no-scroll");
}

// Scroll behavior for hiding and showing nav
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY) {
    isNavHidden.value = true; // Hide nav on scroll down
  } else {
    isNavHidden.value = false; // Show nav on scroll up
  }
  lastScrollY = currentScrollY;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* Nav Bar Styles */
.nav-visible {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: translateY(0);
}

.nav-hidden {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: translateY(-100%);
}

.modal-wrapper {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.5s ease;
}

.modal-wrapper.is-visible {
  visibility: visible;
  opacity: 1;
}

/* Cart Transition */
.cart-transition-enter-active,
.cart-transition-leave-active {
  transition: opacity 0.2s ease;
}

.cart-transition-enter-from {
  opacity: 0;
}

.cart-transition-enter-to {
  opacity: 1;
}

.cart-transition-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.cart-transition-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>