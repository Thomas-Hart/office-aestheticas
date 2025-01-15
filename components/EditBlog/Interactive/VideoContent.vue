<template>
  <div class="video-content">
    <input type="text" v-model="video.url" class="video-url-input" />
    <iframe
      :src="video.url"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <p class="video-caption" contenteditable @input="updateCaption">
      {{ video.caption }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  video: Object,
});

const updateCaption = (event) => {
  props.video.caption = event.target.innerText;
};
</script>

<style scoped>
.video-url-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

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
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
