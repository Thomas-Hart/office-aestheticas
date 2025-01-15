<template>
  <div class="img-wrapper" v-if="editableImageSrc">
    <input
      type="text"
      v-model="editableImageSrc"
      class="image-url-input"
      placeholder="Enter image URL"
    />
    <NuxtImg
      :src="resolvedImgPath(editableImageSrc)"
      :alt="altText"
      :placeholder="generatePlaceholderUrl(editableImageSrc)"
      loading="eager"
      @load="onImageLoad"
      :class="{ 'image-loaded': imageLoaded }"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  imageSrc: String,
  altText: String,
});

const imageLoaded = ref(false);
const editableImageSrc = ref(props.imageSrc);

watch(
  () => props.imageSrc,
  (newSrc) => {
    editableImageSrc.value = newSrc;
  }
);

const resolvedImgPath = (path) => {
  return path ? "/" + path : "/HARTECHOLogo.webp";
};

const generatePlaceholderUrl = (url) => {
  const lastDotIndex = url.lastIndexOf(".");
  if (lastDotIndex === -1) return url;

  const extension = url.slice(lastDotIndex);
  const baseUrl = url.slice(0, lastDotIndex);
  return resolvedImgPath(`${baseUrl}Blur${extension}`);
};

const onImageLoad = () => {
  imageLoaded.value = true;
};
</script>

<style scoped>
.img-wrapper {
  width: 100%;
  height: 25rem;
  overflow: hidden;
  position: relative;
  margin-bottom: 2rem;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.2);
  transition: transform 0.5s ease-in-out;
}

.img-wrapper img.image-loaded {
  transform: scale(1);
}

.image-url-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
