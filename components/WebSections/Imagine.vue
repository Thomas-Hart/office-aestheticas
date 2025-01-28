<template>
  <div class="office-aesthetic">
    <div class="title-underline"></div>
    <div class="header">
      <h1>Take a Moment to Think About Your New Office</h1>
      <p>
        Every purchase from Office Aestheticas is one step closer to excellence
      </p>
    </div>
    <div class="image-container">
      <img src="/Backgrounds/OfficePic2.jpg" alt="Office Aesthetic" />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.office-aesthetic {
  text-align: center;
  padding: 20px;
  width: 100%;
}

.title-underline {
  width: 300px;
  height: 6px;
  background-color: #3f654c;
  margin: 0 auto 20px auto;
  border-radius: 50px;
}

.header h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.header p {
  font-size: 1rem;
  /* color: #555; */
  margin-bottom: 30px;
  font-family: "Lora";
}

.image-container {
  margin-top: 20px;
  height: 25rem; /* Container height */
  width: 1200px;
  max-width: 90vw; /* Limit maximum width */
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
</style>
