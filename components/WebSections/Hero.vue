<template>
  <section class="collection-section">
    <div class="collection-wrapper">
      <!-- Left Image -->
      <div class="image-container left-image">
        <img src="/Backgrounds/OfficePic2.jpg" alt="Left Collection Image" />
      </div>

      <!-- Text Layer in the Center -->
      <div class="text-container">
        <h2 class="title">Quality Equipment</h2>
        <p class="subtitle">Just for you</p>
      </div>

      <!-- Right Image -->
      <div class="image-container right-image">
        <img src="/Backgrounds/OfficePic4.jpg" alt="Right Collection Image" />
      </div>
    </div>
  </section>
</template>
  
  <script setup>
// This script setup can remain empty unless you need props or events
</script>
  
  <style scoped>
.collection-section {
  padding: 5rem 0 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.collection-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1400px;
  width: 100%;
  gap: 20px;
  position: relative;
}

.image-container {
  flex: 1;
  border: 5px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  /* border-radius: 12px; */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 30rem;
  width: 50rem;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-container {
  position: absolute;
  z-index: 2;
  background-color: white;
  padding: 30px 40px;
  border: 2px solid rgba(60, 90, 70, 0.8);
  /* border-radius: 16px; */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.title {
  font-family: "Lora", serif;
  font-size: 2rem;
  font-weight: bold;
  color: #3f654c;
  margin-bottom: 10px;
}

.subtitle {
  font-family: "Source Sans Pro", serif;
  font-size: 1.2rem;
  font-style: italic;
  color: #555;
}

.left-image {
  margin-right: 20px;
}

.right-image {
  margin-left: 20px;
}
</style>
  