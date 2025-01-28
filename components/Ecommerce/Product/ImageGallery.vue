<template>
  <div class="gallery">
    <div class="main-image">
      <img
        v-if="activeImage"
        :src="getImagePath(activeImage)"
        alt="Product Image"
      />
      <div class="thumbnails-overlay">
        <button v-if="canScrollUp" class="scroll-arrow up" @click="scrollUp">
          &uarr;
        </button>
        <div class="thumbnails-container" ref="thumbnailContainer">
          <img
            v-for="(img, index) in images"
            :key="index"
            :src="getImagePath(img)"
            @mouseover="hoverImage(img)"
            @mouseleave="resetImage"
            :class="{ active: activeImage === img }"
            class="thumbnail"
          />
        </div>
        <button
          v-if="canScrollDown"
          class="scroll-arrow down"
          @click="scrollDown"
        >
          &darr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";

const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    default: () => [],
  },
});

const activeImage = ref(props.image);
const thumbnailContainer = ref(null);
const scrollPosition = ref(0);

function getImagePath(img) {
  // console.log("Image: " + img);
  return "/ItemPics/" + img;
}

function hoverImage(img) {
  activeImage.value = img;
}

function resetImage() {
  activeImage.value = props.image;
}

function scrollUp() {
  if (thumbnailContainer.value) {
    thumbnailContainer.value.scrollBy({
      top: -60, // Scroll up by the height of one thumbnail
      behavior: "smooth",
    });
    scrollPosition.value -= 60;
  }
}

function scrollDown() {
  if (thumbnailContainer.value) {
    thumbnailContainer.value.scrollBy({
      top: 60, // Scroll down by the height of one thumbnail
      behavior: "smooth",
    });
    scrollPosition.value += 60;
  }
}

const canScrollUp = computed(() => scrollPosition.value > 0);
const canScrollDown = computed(() => {
  if (thumbnailContainer.value) {
    return (
      scrollPosition.value <
      thumbnailContainer.value.scrollHeight -
        thumbnailContainer.value.clientHeight
    );
  }
  return false;
});

onMounted(() => {
  scrollPosition.value = thumbnailContainer.value.scrollTop;
});

watch(
  () => props.image,
  (newImage) => {
    activeImage.value = newImage;
  }
);
</script>

<style scoped>
.gallery {
  position: relative;
  background: white;
  /* border-right: 2px solid black; */
  margin-right: 2rem;
}

.main-image {
  position: relative;
  width: 600px; /* Larger size for the active image */
  height: 550px; /* Adjust as needed */
  border: 1px solid black;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(0.85);
  transition: all 0.2s ease-out;
}

.main-image img:hover {
  transform: scale(0.9);
}

.thumbnails-overlay {
  position: absolute;
  top: 10px;
  left: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: calc(100% - 20px); /* Make sure it fits within the main image */
  width: 80px; /* Narrow column for the thumbnails */
}

.thumbnails-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 15px;
  height: auto;
  width: 90px; /* Ensure it matches the width of the overlay */
}

.thumbnail {
  min-width: 70px; /* Smaller size for the thumbnails */
  min-height: 70px; /* Adjust accordingly */
  max-width: 70px; /* Smaller size for the thumbnails */
  max-height: 70px; /* Adjust accordingly */
  cursor: pointer;
  object-fit: cover;
  transition: border-color 0.3s ease;
  border: 2px solid #000;
  background: white;
}

.thumbnail.active,
.thumbnail:hover {
  border-color: #ff8000;
}

.scroll-arrow {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}

.scroll-arrow.up {
  margin-bottom: 0.5rem;
}

.scroll-arrow.down {
  margin-top: 0.5rem;
}

/* Responsiveness */
@media (max-width: 1300px) {
  .main-image {
    width: 500px;
    height: 450px;
  }

  .thumbnails-overlay {
    width: 70px;
  }

  .thumbnail {
    min-width: 60px;
    min-height: 60px;
    max-width: 60px;
    max-height: 60px;
  }
}

@media (max-width: 1024px) {
  .main-image {
    position: relative;
    width: 100%;
    height: auto;
    min-height: 25rem;
  }

  .thumbnails-overlay {
    width: 100px;
  }
}

@media (max-width: 768px) {
  .thumbnail {
    min-width: 50px;
    min-height: 50px;
    max-width: 50px;
    max-height: 50px;
  }
}

@media (max-width: 480px) {
  .thumbnail {
    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;
  }
}
</style>
