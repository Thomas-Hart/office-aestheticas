<template>
  <div class="video-content">
    <iframe
      :src="video.url"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <p class="video-caption">{{ video.caption }}</p>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  video: Object,
});
</script>
  
  <style scoped>
.video-content iframe {
  width: 100%;
  height: 315px;
  border-radius: 8px;
}

.video-caption {
  text-align: center;
  font-size: 1rem;
  color: #777;
  margin-top: 0.5rem;
}
</style>
  