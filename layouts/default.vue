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
  console.log("here2");
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

/* Global Styles */
#app {
  scroll-behavior: smooth;
  background-color: #545454;
  font-family: "Source Sans Pro", "Montserrat", sans-serif,
    "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica,
    Arial, "Lucida Grande", sans-serif;
  position: static;
}

/* For Webkit browsers */
::-webkit-scrollbar {
  width: 8px; /* Adjust the width of the scrollbar */
}

::-webkit-scrollbar-track {
  background: #f0f0f0; /* Track background color */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #888; /* Thumb color */
  border-radius: 10px; /* Round edges */
  border: 2px solid #f0f0f0; /* Space between thumb and track */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* Thumb color on hover */
}

/* For Firefox */
* {
  scrollbar-width: thin; /* Make it thinner */
  scrollbar-color: #888 #f0f0f0; /* Thumb color and track background */
}

.content {
  width: 100%;
  height: auto;
  animation: item-load 0.8s;
}

.image-overflow-hidden {
  overflow: hidden;
  width: 100%;
  height: 25vh;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.image-overflow-hidden img {
  width: 100%;
}

@keyframes item-load {
  0% {
    transform: translateY(8%);
    opacity: 0%;
  }

  50% {
    transform: translateY(8%);
    opacity: 0%;
  }

  100% {
    transform: translateY(0%);
    opacity: 100%;
  }
}

@keyframes page-load {
  0% {
    transform: translateY(-20%);
    opacity: 0%;
  }

  100% {
    transform: translateY(0%);
    opacity: 100%;
  }
}
</style>