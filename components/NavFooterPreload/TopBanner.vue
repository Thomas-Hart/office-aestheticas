<template>
  <div class="top-banner">
    <div class="scrolling-container">
      <div class="scrolling-content">
        <span v-for="(item, index) in duplicatedItems" :key="index">
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";

const textContent = "#1 National Auto Hub";
const dotContent = "•";
const items = ref(Array(5).fill([textContent, dotContent]).flat());
const duplicatedItems = ref([...items.value, ...items.value]); // Duplicate items for seamless scrolling
</script>
  
  <style scoped>
/* Banner Styles */
.top-banner {
  background-color: #3f654c;
  /* background: #545454; */
  color: white;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: bold;
  font-family: "Source Sans Pro", "Montserrat", sans-serif,
    "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica,
    Arial, "Lucida Grande", sans-serif;
  overflow: hidden;
  position: relative;
  border-bottom: 2px solid white;
}

.scrolling-container {
  display: flex;
  overflow: hidden;
  width: 100%;
}

.scrolling-content {
  display: flex;
  animation: scroll-left 30s linear infinite;
}

.scrolling-content span {
  flex: 1;
  text-align: center;
  min-width: 15rem;
}

@keyframes scroll-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
  