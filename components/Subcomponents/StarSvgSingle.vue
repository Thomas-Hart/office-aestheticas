<template>
  <svg class="star-svg" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath :id="clipId">
        <path :d="starPath" />
      </clipPath>
    </defs>
    <rect
      x="0"
      y="0"
      width="50"
      height="50"
      :fill="unfilledColor"
      :clip-path="`url(#${clipId})`"
    />
    <rect
      x="0"
      y="0"
      :width="fillWidth"
      height="50"
      :fill="fillColor"
      :clip-path="`url(#${clipId})`"
    />
  </svg>
</template>

<script setup>
import { useId } from "vue";

const clipId = `star-clip-${useId()}`;

const props = defineProps({
  fillWidth: {
    type: Number,
    default: 0,
  },
  fillColor: {
    type: String,
    default: "#EA5520",
  },
  unfilledColor: {
    type: String,
    default: "#ccc",
  },
  starPath: {
    type: String,
    default: `M25,2
L31,18
L48,18
L34,28
L39,44
L25,34
L11,44
L16,28
L2,18
L19,18
Z`,
  },
});
</script>

<style scoped>
.star-svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
