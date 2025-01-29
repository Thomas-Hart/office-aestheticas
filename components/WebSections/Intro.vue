<template>
  <section class="intro-section">
    <div class="background-overlay"></div>
    <canvas ref="glowCanvas" class="glow-canvas"></canvas>
    <div class="content-wrapper">
      <h1 class="title">Elevate Your Workspace, Refine Your Life</h1>
      <p class="subtitle">
        Premium home office essentials designed for comfort and sophistication
      </p>
      <div class="lamp-container">
        <img class="lamp-icon" src="/Graphics/Home/lamp.svg" alt="Lamp Icon" />
      </div>
      <div class="button-group">
        <button class="btn shop-now" @click="setTab('Featured')">
          Shop Now
        </button>
        <button class="btn view-all" @click="setTab('All')">View All</button>
      </div>
    </div>
  </section>
</template>


<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const glowCanvas = ref(null);
let mousePos = { x: 0, y: 0 };

const router = useRouter();
const route = useRoute();

function setTab(tab) {
  router.push({ query: { ...route.query, tab } });
}

onMounted(() => {
  const canvas = glowCanvas.value;
  const ctx = canvas.getContext("2d");
  let lampCenter = { x: 0, y: 0 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lampIcon = document.querySelector(".lamp-icon");
    const bounds = lampIcon.getBoundingClientRect();
    lampCenter = {
      x: bounds.left + bounds.width / 2 + window.scrollX + 8, // Account for horizontal scroll
      y: bounds.top + bounds.height * 0.25 + window.scrollY, // Account for vertical scroll
    };
  }

  function drawGlow(bloom) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const glowWidth = 18 + bloom; // Width of the glow
    const glowHeight = (15 + bloom) * 1.8; // Height of the glow (taller)

    // Calculate distance and proximity factor based on cursor position
    const dx = mousePos.x - lampCenter.x;
    const dy = mousePos.y - lampCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 750; // Max distance for effect
    const proximityFactor = Math.max(0.25, 1 - distance / maxDistance); // Closer = brighter

    // Create the gradient for the glow
    ctx.save();
    ctx.translate(lampCenter.x, lampCenter.y);
    ctx.scale(1, glowHeight / glowWidth); // Stretch to an oval shape

    const gradient = ctx.createRadialGradient(0, 0, 2, 0, 0, glowWidth);
    gradient.addColorStop(
      0,
      `rgba(255, 180, 100, ${0.8 + 0.4 * proximityFactor})`
    );
    gradient.addColorStop(
      0.5,
      `rgba(255, 150, 80, ${0.2 + 0.2 * proximityFactor})`
    );
    gradient.addColorStop(1, "rgba(255, 120, 50, 0.001)");

    ctx.beginPath();
    ctx.arc(0, 0, glowWidth, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }

  function handleMouseMove(e) {
    mousePos = { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY }; // Track cursor position including scroll
  }

  function animateGlow() {
    let frame = 0;

    function step() {
      frame += 0.3;

      // Bloom fluctuation
      const bloom = Math.sin(frame / 40) * 3; // Soft, slow pulsing effect
      drawGlow(bloom);

      requestAnimationFrame(step);
    }

    step();
  }

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("scroll", resizeCanvas); // Update glow position on scroll

  resizeCanvas(); // Initialize canvas size
  animateGlow(); // Start drawing loop

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("scroll", resizeCanvas);
  };
});
</script>



<style scoped>
.intro-section {
  min-height: calc(100vh - 110px); /* Full viewport height minus nav bar */
  background-image: url("/Backgrounds/OAIntroBG.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
  padding: 1rem; /* Added padding for small screens */
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.glow-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none; /* Prevents canvas from blocking interactions */
}

.content-wrapper {
  max-width: 1000px;
  padding: 0 20px;
  z-index: 3; /* Content above the overlay and glow canvas */
  position: relative;
  margin-bottom: 5rem;
}

.title {
  font-family: "Lora", serif;
  font-size: 3rem;
  font-weight: bolder;
  color: white;
  margin-bottom: 10px;
}

.subtitle {
  font-family: "Lora", serif;
  font-weight: 200; /* Light weight */
  font-size: 1.25rem;
  color: #ddd;
  margin-bottom: 35px;
}

.lamp-container {
  position: relative;
  display: inline-block;
}

.lamp-icon {
  width: 130px;
  height: auto;
}

.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 35px;
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
}

.btn {
  font-family: "Lora", "Source Sans Pro", serif;
  font-size: 1.3rem;
  padding: 10px 48px;
  min-width: 180px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shop-now {
  background-color: #3f654c;
  color: white;
}

.shop-now:hover {
  background-color: #2e5e2f;
}

.view-all {
  background-color: white;
  color: black;
}

.view-all:hover {
  background-color: #e0e0e0;
}

/* Responsive adjustments */

@media (max-width: 1300px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .lamp-icon {
    width: 110px;
  }

  .btn {
    font-size: 1.1rem;
    padding: 8px 36px;
    min-width: 160px;
  }
}

@media (max-width: 992px) {
  .intro-section {
    padding: 1rem;
  }

  .title {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .lamp-icon {
    width: 90px;
  }

  .btn {
    font-size: 1rem;
    padding: 8px 28px;
    min-width: 140px;
  }

  .button-group {
    gap: 15px;
    margin-top: 25px;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .lamp-icon {
    width: 70px;
  }

  .btn {
    font-size: 0.9rem;
    padding: 6px 24px;
    min-width: 120px;
  }

  .button-group {
    gap: 10px;
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .lamp-icon {
    width: 75px;
  }

  .btn {
    font-size: 0.8rem;
    padding: 5px 20px;
    min-width: 100px;
    height: 2rem;
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }
}
</style>

