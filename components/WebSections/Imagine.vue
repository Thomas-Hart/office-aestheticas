<template>
  <div class="office-aesthetic">
    <div class="title-underline"></div>
    <div class="header">
      <h2>Take a Moment to Think About Your New Office</h2>
      <p>
        Every purchase from Office Aestheticas is one step closer to excellence
      </p>
    </div>
    <div class="image-container">
      <NuxtImg src="/Backgrounds/OfficePic2.webp" alt="Office Aesthetic" />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.office-aesthetic {
  text-align: center;
  width: 100%;
  overflow: hidden;
}

.title-underline {
  width: 300px;
  height: 6px;
  background-color: #3f654c;
  margin: 0 auto 20px auto;
  border-radius: 50px;
}

.header {
  padding: 0 2rem;
}

.header h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.header p {
  font-size: 1rem;
  margin-bottom: 30px;
  font-family: "Lora";
}

.image-container {
  margin-top: 20px;
  height: 35rem; /* Container height */
  width: calc(min(calc(100vw - 4.5rem), 1300px));
  overflow: hidden;
  margin: 0 auto;
  position: relative; /* Needed for overlay */
}

.image-container img {
  width: 100%; /* Allow image to scale with container width */
  height: 100%; /* Fill container height */
  object-fit: cover; /* Ensure image covers the container */
  object-position: center 60%; /* Center horizontally, adjust vertical position to be lower */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional aesthetic */
}

.image-container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* Dark transparent overlay */
  pointer-events: none; /* Allow interaction with image below */
}

@media (max-width: 768px) {
  .image-container {
    width: calc(min(calc(100vw - 4rem), 1300px));
  }

  .header {
    padding: 0 1.5rem;
  }
}

@media (max-width: 480px) {
  .image-container {
    width: calc(min(calc(100vw - 3.5rem), 1300px));
  }

  .header {
    padding: 0 1rem;
  }

  h2 {
    margin-bottom: 1rem;
  }

  .title-underline {
    width: 200px;
    height: 4px;
  }
}
</style>
