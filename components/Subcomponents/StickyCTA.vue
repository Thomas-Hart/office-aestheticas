<template>
  <div class="cta-sidebar" :class="{ large: isLarge, small: !isLarge }">
    <h2>
      Want a website like this? Subscribe to our marketing services with a
      <u>60-day satisfaction guarantee</u>.
    </h2>
    <div class="cta-content">
      <p class="cta-text">
        Get a fully optimized, custom-built website — completely free with any
        subscription. Enjoy unlimited edits and keep your site free for as long
        as you’re subscribed.
      </p>
      <a
        href="https://hartecho.com/websites"
        class="cta-button"
        target="_blank"
        rel="noopener"
      >
        Get A Quote
      </a>
    </div>
  </div>
</template>
  
  <script setup>
const lastScrollTop = ref(0);
const isLarge = ref(true);

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop.value) {
    isLarge.value = false;
  } else {
    isLarge.value = true;
  }
  lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
</script>
  
  <style scoped>
.cta-sidebar {
  flex: 1;
  position: -webkit-sticky;
  position: sticky;
  height: fit-content;
  transition: top 0.4s;
  background: white;
  padding: 1rem;
}

.cta-sidebar.large {
  top: 5rem;
}

.cta-sidebar.small {
  top: 2rem;
}

h3 {
  font-size: 1.1rem;
  height: 100%;
}

.cta-sidebar h2 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  text-align: left;
}

.cta-content {
  display: flex;
  flex-direction: column;
  align-items: left;
}

.cta-text {
  font-size: 1rem;
  font-family: "Merriweather", serif;
  color: #444;
  text-align: left;
  margin-bottom: 1rem;
}

.benefits {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  font-family: "Merriweather", serif;
  text-align: left;
}

.benefits ul {
  list-style-type: disc;
  margin-left: 20px;
}

.cta-button {
  display: inline-block;
  background-color: #005ba0;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease-in-out;
  width: 10rem;
  text-align: center;
}

.cta-button:hover {
  background-color: #01c5ee;
}

@media (max-width: 768px) {
  .cta-sidebar {
    margin-top: 2rem;
  }
}
</style>
  