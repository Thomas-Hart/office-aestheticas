<template>
  <div class="wrapper">
    <div class="stars">
      <!-- Loop through totalStars and render one star-wrapper for each -->
      <div v-for="index in totalStars" :key="index" class="star-wrapper">
        <!-- Instead of an <svg> directly, we now use <StarSvgSingle> -->
        <SubcomponentsStarSvgSingle :fillWidth="getFillWidth(index - 1)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import StarSvgSingle from "./StarSvgSingle.vue";

/**
 * Props:
 *   rating (Number) => e.g. 2.7 means 2.7 out of 5 stars
 */
const props = defineProps({
  rating: {
    type: Number,
    default: 0,
  },
});

/**
 * Keep everything exactly as in your original code:
 *   - totalStars
 *   - fillColor, outlineColor, outlineFill
 *   - starPath
 *   - getFillWidth(starIndex)
 */

const totalStars = 5;
const fillColor = "#EA5520"; // same as original
const outlineColor = "#EA5520"; // same as original
const outlineFill = "transparent";
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
 * Exactly the same function from your original code:
 *  - We compute the fraction of the star that should be filled
 *  - Then multiply by 50 (the star's width in px)
 */
function getFillWidth(starIndex) {
  // starIndex is 0-based; so for the 1st star, starIndex=0
  // rating=2.7 => star0=1.0 => 50px, star1=1.0 => 50px, star2=0.7 => 35px, etc.
  const fillFraction = Math.min(Math.max(props.rating - starIndex, 0), 1);
  return 50 * fillFraction; // => a number in [0..50]
}
</script>

<style scoped>
/**
 * These styles are identical to your original:
 * .wrapper, .stars, .star-wrapper, .star-svg
 * so that the layout & appearance remain unchanged.
 */

.wrapper {
  display: inline-block;
}

.stars {
  display: flex;
  gap: 2px;
  width: 100%;
}

.star-wrapper {
  flex: 1;
}

/* 
  The .star-svg class is now inside the child (StarSvgSingle.vue).
  If you want it here too for the parent's scope, you can keep it.
  But typically it's enough that the child has .star-svg. 
  We'll include it to be safe. 
*/
.star-svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
