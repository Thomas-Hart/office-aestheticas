<template>
  <div
    class="carousel-wrapper"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <!-- Show the left arrow only if we're not at the first section -->
    <img
      v-if="currentIndex > 0"
      src="/leftArrowGray.webp"
      class="nav-arrow left-arrow"
      @click="prevSlide"
      alt="Previous"
    />
    <div class="carousel-sections-container">
      <div
        class="carousel-sections"
        :style="{ transform: `translateX(-${currentIndex * 100}vw)` }"
      >
        <EcommerceListingsCarouselSection
          v-for="(section, index) in sections"
          :key="index"
          :section="section"
        />
      </div>
    </div>
    <!-- Show the right arrow only if we're not at the last section -->
    <img
      v-if="currentIndex < sections.length - 1"
      src="/rightArrowGray.webp"
      class="nav-arrow right-arrow"
      @click="nextSlide"
      alt="Next"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  items: Array,
});

const currentIndex = ref(0);
const itemsPerSection = ref(3); // Default to 3 items per section (desktop)

let startX = 0;
let isDragging = false;
let dragOffset = 0;

// Update itemsPerSection based on the screen size
const updateItemsPerSection = () => {
  const screenWidth = window.innerWidth;
  // console.log("screenWidth: " + screenWidth);
  if (screenWidth < 480) {
    itemsPerSection.value = 1; // Mobile view: 1 item per section for screens below 480px
  } else if (screenWidth < 768) {
    itemsPerSection.value = 2; // Small tablet and large mobile view: 2 items per section for screens between 480px and 768px
  } else if (screenWidth < 1600) {
    itemsPerSection.value = 3; // Small tablet and large mobile view: 2 items per section for screens between 480px and 768px
  } else {
    itemsPerSection.value = 4; // Desktop view: 3 items per section for screens above 768px
  }
};

// Dynamically calculate sections based on itemsPerSection
const sections = computed(() => {
  const result = [];
  for (let i = 0; i < props.items.length; i += itemsPerSection.value) {
    result.push(props.items.slice(i, i + itemsPerSection.value));
  }
  return result;
});

// Handle swipe and drag for mobile and desktop
const onTouchStart = (e) => {
  startX = e.touches[0].clientX;
};

const onTouchMove = (e) => {
  dragOffset = e.touches[0].clientX - startX;
};

const onTouchEnd = () => {
  if (dragOffset > 50) {
    prevSlide();
  } else if (dragOffset < -50) {
    nextSlide();
  }
  dragOffset = 0; // Reset offset after swipe
};

const onMouseDown = (e) => {
  startX = e.clientX;
  isDragging = true;
};

const onMouseMove = (e) => {
  if (!isDragging) return;
  dragOffset = e.clientX - startX;
};

const onMouseUp = () => {
  if (dragOffset > 50) {
    prevSlide();
  } else if (dragOffset < -50) {
    nextSlide();
  }
  dragOffset = 0;
  isDragging = false;
};

const onMouseLeave = () => {
  isDragging = false;
};

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Call updateItemsPerSection when the component is mounted
onMounted(() => {
  updateItemsPerSection();
  // Update itemsPerSection when the window is resized
  window.addEventListener("resize", debounce(updateItemsPerSection, 200));
});

function prevSlide() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function nextSlide() {
  if (currentIndex.value < sections.value.length - 1) {
    currentIndex.value++;
  }
}
</script>

<style scoped>
.carousel-wrapper {
  display: flex;
  position: relative;
  width: 100%;
  overflow: hidden;
  cursor: grab;
  background: white;
}

.carousel-wrapper:active {
  cursor: grabbing;
}

img {
  z-index: 10;
}

.carousel-sections-container {
  display: flex;
  width: 100%;
  margin: 2rem 0;
}

.carousel-sections {
  display: flex;
  transition: transform 0.3s ease-in-out;
  width: 100%;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 30px;
  height: auto;
}

.left-arrow {
  left: 0;
}

.right-arrow {
  right: 0;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .nav-arrow {
    width: 25px; /* Slightly smaller arrows for tablet */
  }
}

@media (max-width: 480px) {
  .nav-arrow {
    width: 20px; /* Smaller arrows for mobile */
  }

  .carousel-wrapper {
    padding: 0 0rem; /* Add padding for mobile */
  }
}
</style>
