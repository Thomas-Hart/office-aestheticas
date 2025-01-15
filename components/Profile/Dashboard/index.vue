<template>
  <div class="wrapper">
    <!-- Profile Image and Edit Section -->
    <ProfileDashboardBanner />
    <div class="welcome">
      <h1>Welcome Back, {{ userStore.user.name }}!</h1>
      <img src="/Graphics/HandWave.png" alt="Waving Hand" />
    </div>
    <ProfileRecentlyViewed />
    <ProfileWishlist />
  </div>
</template>
  
  <script setup>
const userStore = useUserStore();
const loading = ref(true);
</script>
  
  <style scoped>
.body {
  width: 100%;
  min-height: 70rem;
  height: auto;
}

.wrapper {
  /* overflow: auto; */
}

.welcome {
  display: flex;
  margin-bottom: 3rem;
}

h1 {
  margin-left: 1rem;
  color: white;
}

img {
  height: 2rem;
  width: 2rem;
  margin-left: 1rem;
  margin-right: 1rem;
}

.course-list {
  margin-top: 5rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem;
}
</style>
  