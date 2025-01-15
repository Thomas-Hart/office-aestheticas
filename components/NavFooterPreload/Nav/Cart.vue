<template>
  <div class="nav-link shopping-cart" @click="switchRoute('/cart')">
    <NuxtLink to="/cart" class="nav-link-content">
      <img src="/clipboard.svg" alt="Cart" class="icon-size" />
    </NuxtLink>
    <h2 v-if="hydrated" class="cart-count">
      ({{ itemStore.getCartItemCount() }})
    </h2>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";
const itemStore = useItemStore();
const showClickAnimation = ref(false);
const isDropDownVisible = ref(false);
const hydrated = ref(false); // This is used to ensure the component is fully hydrated

const emit = defineEmits(["clicked"]);

onMounted(() => {
  hydrated.value = true;
});

function switchRoute(route) {
  emit("clicked");
  useRouter().push(route);
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
.shopping-cart h2 {
  color: white;
  font-size: 1.2rem;
  margin-left: 10px;
  z-index: 101;
}

.nav-link {
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
  display: inline-block;
  width: 40px;
  text-align: center;
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
  