<template>
  <div class="related-links-wrapper" v-if="links.length">
    <div class="related-links">
      <h2>Related External Blogs</h2>
      <ul>
        <li v-for="(link, index) in links" :key="index">
          <a :href="link.url" target="_blank">{{ link.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  links: Array,
});
</script>
  
  <style scoped>
.related-links-wrapper {
  max-width: 1300px;
  margin: 2rem auto;
  padding: 2rem;
}

.related-links {
  padding: 2rem;
  font-family: "Merriweather", serif;
  color: #444;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.related-links h2 {
  font-family: "Poppins";
  font-size: 2rem;
  line-height: 2.2rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
  color: #333;
}

.related-links ul {
  list-style-type: none;
  padding-left: 0;
}

.related-links ul li {
  margin-bottom: 0.75rem;
}

.related-links ul li a {
  color: #005ba0;
  text-decoration: none;
}

.related-links ul li a:hover {
  text-decoration: underline;
}
</style>
  