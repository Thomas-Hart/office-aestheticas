<template>
  <svg class="star-svg" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- We'll use our auto-generated clipId for the star shape -->
      <clipPath :id="clipId">
        <path :d="starPath" />
      </clipPath>
    </defs>

    <!-- 1) Gray background, clipped to the star shape -->
    <rect
      x="0"
      y="0"
      width="50"
      height="50"
      :fill="unfilledColor"
      :clip-path="`url(#${clipId})`"
    />

    <!-- 2) Colored fill portion, clipped to the star shape -->
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
/**
 * A single-star component with no outline.
 * The star shape is determined by a clipPath.
 * - The entire star is first painted gray (unfilledColor).
 * - Then the left portion is painted fillColor, up to fillWidth.
 */

const props = defineProps({
  /**
   * fillWidth: number in [0..50]
   *   e.g. 25 => half-filled star
   */
  fillWidth: {
    type: Number,
    default: 0,
  },
  /**
   * fillColor: the color of the "filled" portion
   */
  fillColor: {
    type: String,
    default: "#EA5520",
  },
  /**
   * unfilledColor: the gray color for the "unfilled" portion
   */
  unfilledColor: {
    type: String,
    default: "#ccc", // or "#999", adjust as you wish
  },
  /**
   * The star path inside a 50x50 viewBox
   */
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

// Generate a unique ID for the clipPath so each star is isolated
const clipId = `star-clip-${Math.random().toString(36).substring(2, 9)}`;
</script>
  
  <style scoped>
.star-svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
  