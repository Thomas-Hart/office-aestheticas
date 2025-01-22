<template>
  <div class="mobile-nav-buttons">
    <!-- prettier-ignore -->
    <div class="link" v-for="(link, index) in navPaths" :key="index">
      <NuxtLink :to="getRoute(link)" class="" @click.native="$emit('toggleMobileNav')">{{ link.charAt(0).toUpperCase() + link.slice(1) }}</NuxtLink>
    </div>
    <!-- prettier-ignore -->
    <div class="shopping-cart" @click="goToRoute('/cart')">
          <h2>Cart</h2>
          <p>({{ store.getCartItemCount() }})</p>
        </div>
    <div class="ex">
      <img
        :src="resolvedExImgPath()"
        alt="x"
        @click="$emit('toggleMobileNav')"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  navPaths: Array,
  exImgPath: String,
});

const store = useItemStore();

function resolvedExImgPath() {
  return "/" + props.exImgPath;
}

function getRoute(link) {
  return link === "home" ? "/" : `/${link}`;
}

function goToRoute(link) {
  useRouter().push(`/${link}`);
}
</script>

<style scoped>
.mobile-nav-buttons {
  display: none;
}

@media (max-width: 768px) {
  .mobile-nav-buttons {
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    background: black;
    padding: 25px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
    height: 100vh;
    width: 100%;
    box-shadow: 0 0 5px black;
    transition: transform 0.5s, opacity 0.5s;
    align-items: right;
  }

  .mobile-nav-buttons.hide {
    transform: translateY(10%);
    opacity: 0;
    z-index: -1;
  }

  a,
  .link {
    text-decoration: none;
    font-size: 40px;
    transition: color 0.5s;
    margin-bottom: 2rem;
  }

  a:hover,
  .link:hover {
    color: white;
  }

  /* Router link animations */
  a.router-link-exact-active {
    transition: color 0.6s;
    color: white;
  }

  .shopping-cart {
    height: 3rem;
    display: flex;
    justify-content: center;
  }

  .shopping-cart h2 {
    font-weight: normal;
    font-size: 40px;
  }

  .shopping-cart p {
    font-size: 30px;
    margin-left: 1rem;
  }

  .ex {
    height: 2rem;
    width: 2rem;
    position: absolute;
    object-fit: cover;
    right: 30px;
    top: 30px;
  }

  .ex img {
    height: auto;
    width: 100%;
  }
}

@media (max-width: 480px) {
  a,
  .link {
    font-size: 2rem;
  }

  .shopping-cart h2 {
    font-weight: normal;
    font-size: 2rem;
  }

  .shopping-cart p {
    font-size: 25px;
  }

  .ex {
    height: 1.5rem;
    width: 1.5rem;
  }
}
</style>
