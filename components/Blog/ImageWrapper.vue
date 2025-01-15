<template>
  <div class="img-wrapper" v-if="imageSrc">
    <NuxtImg
      :src="resolvedImgPath(imageSrc)"
      :alt="altText"
      :placeholder="generatePlaceholderUrl(imageSrc)"
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

const resolvedImgPath = (path) => {
  return path ? "/" + path : "/HARTECHOLogo.webp";
};

const generatePlaceholderUrl = (url) => {
  const lastDotIndex = url.lastIndexOf(".");
  if (lastDotIndex === -1) return url; // If no extension found, return original URL

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
</style>
  