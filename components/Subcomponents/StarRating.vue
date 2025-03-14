<template>
  <div class="wrapper">
    <div class="stars">
      <!-- Loop through totalStars and render one star for each -->
      <div v-for="index in totalStars" :key="index" class="star-wrapper">
        <svg
          class="star-svg"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Define a clipPath with the star shape -->
          <defs>
            <clipPath :id="`star-clip-${index}`">
              <path :d="starPath" />
            </clipPath>
          </defs>

          <!-- 1) Draw a rectangle that is clipped to the star shape for the filled portion -->
          <rect
            x="0"
            y="0"
            :width="getFillWidth(index - 1)"
            height="50"
            :fill="fillColor"
            :clip-path="`url(#star-clip-${index})`"
          />

          <!-- 2) Draw the star outline on top -->
          <path
            :d="starPath"
            :fill="outlineFill"
            :stroke="outlineColor"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { computed } from "vue";

/**
 * Nuxt 3 + Composition API single-file component.
 *
 * Props:
 *   - rating (Number, 0–5, can be fractional)
 */
const props = defineProps({
  rating: {
    type: Number,
    default: 0,
  },
});

// Optional: name the component for debugging/devtools
defineOptions({
  name: "StarRatingSvg",
});

// Basic constants
const totalStars = 5;
const fillColor = "#EA5520"; // Gold-like fill color
const outlineColor = "#EA5520"; // Same color for outline
const outlineFill = "transparent";

// A path that draws a 5-point star within a 50×50 viewBox
const starPath = `M25,2
                    L31,18
                    L48,18
                    L34,28
                    L39,44
                    L25,34
                    L11,44
                    L16,28
                    L2,18
                    L19,18
                    Z`;

/**
 * Returns the width (in px) of the filled portion for the star at "starIndex".
 * starIndex is 0-based, so the first star is index=0, second is index=1, etc.
 */
function getFillWidth(starIndex) {
  // Example: if rating = 2.7
  //  starIndex=0 => fillFraction=1.0 (fully filled)
  //  starIndex=1 => fillFraction=1.0
  //  starIndex=2 => fillFraction=0.7
  //  starIndex=3,4 => fillFraction=0
  const fillFraction = Math.min(Math.max(props.rating - starIndex, 0), 1);
  // Multiply that fraction by 50 (the width of the SVG viewBox).
  return 50 * fillFraction;
}
</script>
  
  <style scoped>
/**
   * .wrapper will scale to the parent's width. 
   * For example, if the parent has style="width: 5rem;",
   * the entire row of stars will fit within that width.
   */
.wrapper {
  /* inline-block so it only takes as much space as needed (or as the parent sets) */
  display: inline-block;
}

/* A flex container for the stars in a row */
.stars {
  display: flex;
  gap: 2px;
  width: 100%; /* take full available width of the wrapper */
  /* No gap here, so the stars perfectly fit the container width */
}

/* Each star wrapper is flex: 1, so all five stars share the space equally */
.star-wrapper {
  flex: 1;
}

/* The SVG scales to fill the width of .star-wrapper */
.star-svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
  