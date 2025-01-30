<template>
  <div>
    <!-- Conditionally render layout based on route -->
    <NuxtLayout>
      <!-- Page content with transition -->
      <transition name="fade" mode="out-in">
        <div class="page-wrapper">
          <NuxtPage @hide-loading="hideLoadingScreen" />
        </div>
      </transition>

      <!-- Loading popup controlled by isLoading -->
      <div v-if="isLoading && !isProfileRoute" class="loading-popup">
        <div class="loading-spinner"></div>
        <p>Loading, please wait...</p>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
// Reactive states
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Show/hide loading screen functions remain the same
function showLoadingScreen() {
  isLoading.value = true;
}

function hideLoadingScreen() {
  isLoading.value = false;
}

// Provide the showLoadingScreen function so that child components can use it
provide("showLoadingScreen", showLoadingScreen);

// Check if current route is '/profile'
const isProfileRoute = computed(() => route.path === "/profile");

// Before each route navigation, show loading screen
// BUT skip if it's only a query change (same path)
router.beforeEach((to, from, next) => {
  // If the path isn't changing (only query or hash changed),
  // then do NOT show the loading screen.
  if (to.path === from.path) {
    next();
    return;
  }
  showLoadingScreen();
  next();
});

const fetchedUser = ref(null);
const error = ref(null);

const fetchUser = async () => {
  if (userStore.user && userStore.user._id) {
    try {
      const response = await $fetch(`/api/users/${userStore.user._id}`);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }
};

// Fetch user data on app load
onMounted(fetchUser);

// Watch for fetched user data or errors and set user accordingly
watchEffect(() => {
  if (fetchedUser.value) {
    userStore.setUser(fetchedUser.value);
  } else if (error.value) {
    console.error(
      "Failed to fetch user data on page load (app.vue): ",
      error.value
    );
  }
});

// Set the lang attribute and favicon via useHead
useHead({
  link: [{ rel: "icon", type: "image/x-icon", href: "/Logos/OALogo.svg" }],
  htmlAttrs: {
    lang: "en",
  },
});
</script>


<style scoped media="screen">
#app {
  scroll-behavior: smooth;
  background-color: #f0f2f5;
  font-family: "Source Sans Pro", Montserrat, sans-serif, "HelveticaNeue-Light",
    "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande",
    sans-serif;
  position: static;
}

/* Wrapper to ensure transition works correctly */
.page-wrapper {
  width: 100%;
  height: 100%;
}

/* Loading popup styling */
.loading-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  z-index: 2000;
  flex-direction: column;
  transition: opacity 0.5s ease;
  opacity: 1;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid white;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Fade transition styling */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Additional global styles */
.login-container {
  font-weight: bold;
  max-width: 300px;
  margin: 200px auto;
  padding: 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.7);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

form button {
  width: 100%;
  height: 2rem;
  font-weight: bold;
}
</style>

<style>
@import "./css/Dividers/PointBot.css";
@import "./css/Transitions/Fade.css";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Source Sans Pro", Montserrat, sans-serif;
}

/* body {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
} */

a:visited,
a:link,
a:focus,
a:active {
  outline: none;
  text-decoration: none;
  background: none;
  color: inherit;
  box-shadow: none;
  -webkit-tap-highlight-color: transparent; /* Removes tap highlight color in mobile browsers */
}

p {
  line-height: 1.5;
}
</style>
