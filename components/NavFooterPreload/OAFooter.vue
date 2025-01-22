<template>
  <div class="footer-wrapper">
    <div class="upper-content">
      <div class="left">
        <address class="footer-heading">
          <h1>{{ companyName }}</h1>
          <h2>{{ companyDescription }}</h2>
        </address>
        <!-- prettier-ignore -->
        <nav class="footer-nav">
          <div class="link" v-for="(link, index) in navPaths" :key="index">
            <NuxtLink :to="getRoute(link)" class="">{{ link.charAt(0).toUpperCase() + link.slice(1) }}</NuxtLink>
          </div>
        </nav>
      </div>
      <div class="right">
        <h1>Contact</h1>
        <address class="footer-heading contact-info">
          <p>Phone: {{ phone }}</p>
          <p>Email: {{ email }}</p>
        </address>
        <h1 class="slogan">
          {{ slogan }}
        </h1>
      </div>
    </div>
    <!-- prettier-ignore -->
    <div class="bottom-content">
      <p>Copyright © 2024 {{ companyName }} LLC. All rights reserved.</p>
      <p>
        <NuxtLink to="/privacy" class="hover-underline" @click.stop>Privacy Policy</NuxtLink> |
        <NuxtLink to="/terms" class="hover-underline" @click.stop>Terms of Service</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  navPaths: {
    type: Array,
    validator: function (array) {
      return array.every((item) => typeof item === "string");
    },
    default: () => [],
  },
  companyName: String,
  companyDescription: String,
  phone: String,
  email: String,
  slogan: String,
});

const getRoute = (link) => {
  return link === "home" ? "/" : `/${link}`;
};
</script>

<style scoped>
.footer-wrapper {
  z-index: 6;
  min-height: 80%;
  height: auto;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5rem;
  width: 100%;
  position: relative;
}
.upper-content {
  display: flex;
  gap: 5rem;
}

.left {
  flex-grow: 1;
}

.footer-heading {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  font-style: normal !important;
  margin: 0;
}

h2 {
  font-size: 1.3rem;
  margin: 0;
  font-weight: normal;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 2rem;
  margin-top: 2rem;
}

a,
.link {
  text-decoration: none;
  font-size: 20px;
  transition: 0.5s;
  color: #c0c0c0;
}

a,
.link:hover {
  color: white;
}

a:visited,
a:link {
  color: inherit;
}

.right {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.slogan {
  flex-grow: 1;
}

.bottom-content {
  position: relative;
  margin: 3rem 0 1rem 0;
  width: 100%;
  bottom: 0;
}

p {
  margin: 0.1rem 0;
}

a {
  font-size: 1rem;
}

.hover-underline {
  text-decoration: none;
}

.hover-underline:hover {
  text-decoration: underline;
}

a.router-link-exact-active {
  transition: 0.6s;
  color: white;
}

@media (max-width: 768px) {
  /*  ------------  MOBILE  ------------   */
  .footer-wrapper {
    padding: 0 1.5rem;
  }

  .upper-content {
    gap: 3rem;
  }
}
@media (max-width: 480px) {
  .footer-wrapper {
    padding: 0 1rem;
  }
  .upper-content {
    gap: 1.5rem;
  }

  h1 {
    font-size: 1.3rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  a,
  p {
    font-size: 1rem;
  }

  .contact-info p {
    font-size: 0.8rem;
  }
}
</style>