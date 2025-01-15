<template>
  <nav class="drop-down-nav" ref="navbar" :class="{ hidden: !isVisible }">
    <div class="nav-content">
      <div class="brand">
        <NuxtLink to="/" class="nav-logo-box">
          <img src="/OAName.webp" alt="Company Logo" class="nav-logo" />
        </NuxtLink>
      </div>
      <div class="nav-links">
        <NuxtLink to="/products" class="nav-link">
          <img src="/shopAll.webp" alt="Shop All" />
        </NuxtLink>
        <NuxtLink to="/products" class="nav-link">
          <img src="/DIY.webp" alt="Blog Image" />
        </NuxtLink>

        <!-- Conditionally change the route for Login/Profile -->
        <div class="nav-link" @click="navigateBasedOnLogin">
          <img v-if="!hydrated || !isLoggedIn" src="/login.webp" alt="Login" />
          <img v-else src="/login.webp" alt="Profile" />
        </div>

        <!-- Shopping Cart Section with Pointer Animation -->
        <div class="shopping-cart" @click="switchRoute('/cart')">
          <img src="/cart.webp" alt="Cart" />
          <h2 v-if="hydrated">{{ cartItemCount }}</h2>

          <!-- Click animation SVG for drop-down nav, only shows if isVisible is true -->
          <img
            v-if="showClickAnimation && isVisible"
            src="/CartPoint.svg"
            alt="Click Animation"
            class="click-animation"
          />
          <p v-if="showClickAnimation && isVisible" class="click-text">
            Click here to see your cart
          </p>
        </div>
      </div>
    </div>

    <!-- Dark Overlay -->
    <div v-if="showClickAnimation && isVisible" class="dark-overlay"></div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
const store = useItemStore();
const userStore = useUserStore(); // Assuming you have a user store to check if the user is logged in
const isVisible = ref(false);
const showClickAnimation = ref(false);
const hydrated = ref(false); // This is used to ensure the component is fully hydrated

// Computed property to check if the user is logged in
const isLoggedIn = computed(() => !!userStore.token);

// Detect whether the user has scrolled and show the drop-down nav
function handleScroll() {
  const currentScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;

  // Show the drop-down nav when the top nav is out of view
  isVisible.value = currentScrollPosition > 80;
}

// Watch the cart item count and trigger the click animation and overlay when it changes from 0 to 1
watch(
  () => store.getCartItemCount(),
  (newVal, oldVal) => {
    if (oldVal === 0 && newVal === 1) {
      triggerClickAnimation();
    }
  }
);

// Trigger pointer animation and overlay
function triggerClickAnimation() {
  showClickAnimation.value = true;

  // Hide the animation and overlay after 4 seconds
  setTimeout(() => {
    showClickAnimation.value = false;
  }, 3000);
}

// Switch route to the cart page
function switchRoute(route) {
  useRouter().push(route);
}

const cartItemCount = computed(() => store.getCartItemCount());

// Conditionally navigate based on login status
function navigateBasedOnLogin() {
  if (isLoggedIn.value) {
    switchRoute("/profile"); // Go to profile page if logged in
  } else {
    switchRoute("/login"); // Go to login page if not logged in
  }
}

// Set hydrated to true after the component is mounted
onMounted(() => {
  hydrated.value = true;
  window.addEventListener("scroll", handleScroll);
});

// Remove scroll listener on component unmount
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.drop-down-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #ff8000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 102;
  transition: all 0.3s ease-in-out;
}

.drop-down-nav.hidden {
  transform: translateY(-100%);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
}

.brand {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-logo-box {
  width: 50px;
  height: auto;
}

.nav-logo {
  max-width: 100%;
  height: auto;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  cursor: pointer;
}

.nav-link img {
  max-height: 100%;
  width: auto;
}

.shopping-cart {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  z-index: 102; /* Ensure it's above the overlay */
}

.shopping-cart img {
  height: 30px;
  width: auto;
  margin-right: 10px;
}

.shopping-cart h2 {
  color: white;
  font-size: 1.2rem;
}

/* Dark Overlay */
.dark-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 101; /* Ensure it's under the cart and pointer */
}

/* Click Animation */
.click-animation {
  position: absolute;
  top: 50px;
  right: -2rem;
  min-width: 5rem;
  min-height: 5rem;
  animation: clickAnimation 1s ease infinite;
  z-index: 102;
}

.click-text {
  position: absolute;
  top: 10rem;
  right: -2rem;
  color: white;
  font-size: 1rem;
  z-index: 102;
  width: 5rem;
  text-align: center;
}

@keyframes clickAnimation {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px); /* Move up and down */
  }
}

@media (max-width: 480px) {
  .search-bar input {
    font-size: 12px;
  }

  .nav-logo-box {
    width: 40px;
    height: auto;
  }

  .nav-links {
    gap: 20px;
  }

  .nav-link img {
    max-height: 90%;
    width: auto;
  }
}
</style>
