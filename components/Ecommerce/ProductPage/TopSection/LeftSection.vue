<template>
  <div class="gallery-wrapper">
    <div class="gallery">
      <div class="main-image">
        <img :src="getImagePath(activeImage)" alt="Product Image" />
        <div class="thumbnails-overlay">
          <button v-if="canScrollUp" class="scroll-arrow up" @click="scrollUp">
            &uarr;
          </button>
          <div class="thumbnails-container" ref="thumbs">
            <img
              v-for="(img, i) in item.moreImages || []"
              :key="i"
              :src="getImagePath(img)"
              @mouseover="activeImage = img"
              @mouseleave="activeImage = baseImage"
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

    <div v-if="!isMobile" class="payment-methods">
      <h3 class="payment-title">Payment methods</h3>
      <div class="payment-icons">
        <img src="placeholder1.png" alt="Method 1" />
        <img src="placeholder2.png" alt="Method 2" />
        <img src="placeholder3.png" alt="Method 3" />
        <img src="placeholder4.png" alt="Method 4" />
      </div>
      <p class="payment-note">
        Your payment information is processed securely and the price includes
        regional tax.
      </p>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
});

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
const pos = ref(0);
const canScrollUp = computed(() => pos.value > 0);
const canScrollDown = computed(() => {
  const el = thumbs.value;
  return el && pos.value < el.scrollHeight - el.clientHeight;
});
function scrollUp() {
  thumbs.value.scrollBy({ top: -60, behavior: "smooth" });
  pos.value = Math.max(0, pos.value - 60);
}
function scrollDown() {
  thumbs.value.scrollBy({ top: 60, behavior: "smooth" });
  pos.value = Math.min(
    thumbs.value.scrollHeight - thumbs.value.clientHeight,
    pos.value + 60
  );
}

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
.gallery-wrapper {
  flex: 1;
}
.gallery {
  position: relative;
  background: white;
}
.main-image {
  position: relative;
  margin-top: 3rem;
}
.main-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
.thumbnails-overlay {
  position: absolute;
  top: 10px;
  left: 15px;
  display: flex;
  flex-direction: column;
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
  width: 70px;
  height: 70px;
  object-fit: cover;
  border: 2px solid #000;
  cursor: pointer;
  transition: border-color 0.3s;
}
.thumbnail.active,
.thumbnail:hover {
  border-color: #3f654c;
}
.scroll-arrow {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}
.payment-methods {
  background: #f5f5f5;
  padding: 1rem;
  margin: 2rem 0;
}
.payment-title {
  margin-bottom: 1rem;
  font-weight: bold;
}
.payment-icons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.payment-icons img {
  height: 32px;
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
  