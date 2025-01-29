<template>
  <div class="brand">
    <NuxtLink to="/" class="nav-logo-box">
      <img src="/Logos/OAName.svg" alt="Company Logo" class="nav-logo" />
    </NuxtLink>
  </div>
</template>
  
  <style scoped>
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
</style>
  