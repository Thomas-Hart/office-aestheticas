<template>
  <!-- Inline Image Gallery -->
  <div class="gallery">
    <div class="main-image">
      <img :src="getImagePath(computedGalleryImage)" alt="Product Image" />
      <div class="thumbnails-overlay">
        <button v-if="canScrollUp" class="scroll-arrow up" @click="scrollUp">
          &uarr;
        </button>
        <div class="thumbnails-container" ref="thumbnailContainer">
          <img
            v-for="(img, index) in item && item.moreImages
              ? item.moreImages
              : []"
            :key="index"
            :src="getImagePath(img)"
            @mouseover="hoverImage(img)"
            @mouseleave="resetImage"
            :class="{ active: computedGalleryImage === img }"
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

    <div class="payment-methods" v-if="isAbove768">
      <h3 class="payment-title">Payment methods</h3>
      <div class="payment-icons">
        <!-- <img src="placeholder1.png" alt="Method 1" />
        <img src="placeholder2.png" alt="Method 2" />
        <img src="placeholder3.png" alt="Method 3" />
        <img src="placeholder4.png" alt="Method 4" /> -->
      </div>
      <p class="payment-note">
        Your payment information is processed securely and the price includes
        regional tax.
      </p>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  item: { type: Object, required: true },
  selectedVariant: { type: Object, required: true },
});

const galleryActiveImage = ref(computedGalleryImage.value);
const computedGalleryImage = computed(() => {
  if (
    props.selectedVariant &&
    props.selectedVariant.image &&
    props.selectedVariant.image.trim() !== ""
  ) {
    return props.selectedVariant.image;
  } else if (
    props.localItem &&
    props.localItem.image &&
    props.localItem.image.trim() !== ""
  ) {
    return props.localItem.image;
  }
  return "default.webp";
});

watch(computedGalleryImage, (newVal) => {
  galleryActiveImage.value = newVal;
});

const thumbnailContainer = ref(null);

const baseImage = computed(
  () =>
    props.item.variants?.[0]?.image?.trim() ||
    props.item.image?.trim() ||
    "default.webp"
);
const activeImage = ref(baseImage.value);
const getImagePath = (img) => `/ItemPics/${img}`;

// thumbnails scroll
const thumbs = ref(null);
const scrollPosition = ref(0);
function hoverImage(img) {
  galleryActiveImage.value = img;
}
function resetImage() {
  galleryActiveImage.value = computedGalleryImage.value;
}
function scrollUp() {
  if (thumbnailContainer.value) {
    thumbnailContainer.value.scrollBy({ top: -60, behavior: "smooth" });
    scrollPosition.value -= 60;
  }
}
function scrollDown() {
  if (thumbnailContainer.value) {
    thumbnailContainer.value.scrollBy({ top: 60, behavior: "smooth" });
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

// responsive
const isMobile = ref(false);
function onResize() {
  isMobile.value = window.innerWidth <= 768;
}
onMounted(() => {
  onResize();
  window.addEventListener("resize", onResize);
});
onUnmounted(() => window.removeEventListener("resize", onResize));
</script>
  
  <style scoped>
.gallery {
  position: relative;
  background: white;
  flex: 1;
}
.main-image {
  position: relative;
  width: 100%;
  height: auto;
  margin-top: 3rem;
}
.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.2s ease-out;
}
.thumbnails-overlay {
  position: absolute;
  top: 10px;
  left: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: calc(100% - 20px);
  width: 80px;
}
.thumbnails-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 15px;
  width: 90px;
}
.thumbnail {
  min-width: 70px;
  min-height: 70px;
  max-width: 70px;
  max-height: 70px;
  cursor: pointer;
  object-fit: cover;
  transition: border-color 0.3s ease;
  border: 2px solid #000;
  background: white;
}
.thumbnail.active,
.thumbnail:hover {
  border-color: #3f654c;
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

/* Payment Methods */
.payment-methods {
  background: #f5f5f5;
  padding: 1rem;
  margin: 2rem 0;
}
.payment-title {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.payment-icons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.payment-icons img {
  height: 32px;
  width: auto;
}
.payment-note {
  font-size: 0.9rem;
  color: #555;
}

@media (max-width: 768px) {
  .payment-methods {
    display: none;
  }
}
</style>
  