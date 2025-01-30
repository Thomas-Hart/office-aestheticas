<template>
  <div class="nav-links">
    <NavFooterPreloadNavSearchBar />
    <div
      v-if="hydrated && !isLoggedIn"
      class="nav-link"
      @click="openLoginModal"
    >
      <img src="/Graphics/Nav/profile.svg" alt="Login" />
    </div>
    <div
      v-if="hydrated && !isLoggedIn"
      class="nav-link"
      @click="openLoginModal"
    >
      <img src="/Graphics/Nav/heart.svg" alt="Login" />
    </div>
    <div class="nav-link" v-if="hydrated && isLoggedIn">
      <NuxtLink to="/profile" @click="closeMobileNav">
        <img src="/Graphics/Nav/profile.svg" alt="Blog Graphic" />
      </NuxtLink>
    </div>
    <div class="nav-link" v-if="hydrated && isLoggedIn">
      <NuxtLink to="/profile?section=wishlist" @click="closeMobileNav">
        <img src="/Graphics/Nav/heart.svg" alt="Blog Graphic" />
      </NuxtLink>
    </div>
  </div>
</template>
  
  <script setup>
const hydrated = ref(false); // Assume hydrated flag is passed as prop
const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.token);

const emit = defineEmits(["closeMobileNav", "openLoginModal"]);

function closeMobileNav() {
  emit("closeMobileNav");
}

function openLoginModal() {
  emit("openLoginModal");
}

onMounted(() => {
  hydrated.value = true;
});
</script>
  
  <style scoped>
.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}
.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;
  text-align: center;
  color: white;
  font-size: 0.9rem;
  height: 20px;
  width: 20px;
}

a {
  height: 100%;
  width: 100%;
}

.nav-link img {
  height: 100%;
  width: 100%;
}
</style>
  