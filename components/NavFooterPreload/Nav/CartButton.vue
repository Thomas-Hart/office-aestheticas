<template>
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
</template>
  
  <script setup>
const itemStore = useItemStore();
const userStore = useUserStore();
const hydrated = ref(false); // This is used to ensure the component is fully hydrated

const isLoggedIn = computed(() => !!userStore.user);

const emit = defineEmits(["clicked", "toggle-cart"]);

onMounted(() => {
  hydrated.value = true;
});

function toggleCart() {
  emit("clicked");
  emit("toggle-cart");
}
</script>
  
  <style scoped>
.shopping-cart {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  z-index: 101;
}
h2 {
  color: white;
  font-size: 0.9rem;
  margin-left: 10px;
  z-index: 101;
}

.nav-link {
  display: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  color: white;
  font-size: 0.9rem;
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
  top: -0.5rem;
  right: -0.5rem;
}

.icon-size {
  height: 20px;
  width: 20px;
}
.click-animation {
  position: absolute;
  top: 5rem;
  right: -2rem;
  min-width: 5rem;
  min-height: 5rem;
  animation: clickAnimation 1s ease infinite;
  z-index: 101;
}
.click-text {
  position: absolute;
  top: 12rem;
  right: -2rem;
  color: white;
  font-size: 1rem;
  z-index: 101;
  width: 5rem;
}
</style>
  