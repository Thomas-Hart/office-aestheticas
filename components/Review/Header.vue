<template>
  <div class="review-header">
    <h4 class="reviewer-name">{{ reviewerName }}</h4>
    <div class="rating">
      <span v-for="n in 5" :key="n" class="star">
        {{ n <= rating ? "★" : "☆" }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  reviewerName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.review-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
  position: relative;
}

.reviewer-name {
  display: inline-flex;
  align-items: center;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.rating {
  display: flex;
  align-items: center;
}

.star {
  color: #ff9900;
  font-size: 20px;
}
</style>
