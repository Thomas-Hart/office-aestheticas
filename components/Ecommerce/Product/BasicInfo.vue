<template>
  <div class="basic-info">
    <h1 class="product-name">{{ item.name }}</h1>
    <!-- Rating Row -->
    <div class="ratings-row">
      <div class="stars-container">
        <img
          v-for="(star, index) in starImages"
          :key="index"
          :src="star"
          alt="Star"
          class="star-icon"
        />
      </div>
      <span v-if="item.reviewCount > 0" class="rating-number"
        >({{ item.reviewCount.toFixed(0) }})</span
      >
      <span v-else>No Reviews</span>
    </div>

    <p class="product-description">{{ item.description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// Helper function to get the star images
const getStarImages = (rating) => {
  const fullStar = "/FullStar.svg";
  const halfStar = "/HalfStar.svg";
  const emptyStar = "/EmptyStar.svg";
  const starImages = [];

  const roundedRating = Math.round(rating * 2) / 2;

  for (let i = 0; i < 5; i++) {
    if (roundedRating - i >= 1) {
      starImages.push(fullStar);
    } else if (roundedRating - i === 0.5) {
      starImages.push(halfStar);
    } else {
      starImages.push(emptyStar);
    }
  }
  return starImages;
};

const starImages = computed(() => getStarImages(props.item.ratings || 0));
</script>

<style scoped>
.basic-info {
  /* padding: 20px; */
  margin-bottom: 1rem;
  color: black;
}

/* Desktop-first: Default font sizes */
.product-name {
  font-size: 3.5rem; /* Large font for desktops */
  font-weight: bold;
  margin-bottom: 10px;
  color: black;
}

.product-description {
  font-size: 1.3rem; /* Larger font for desktops */
  line-height: 1.5rem;
  color: black;
  /* margin-bottom: 15px; */
}

.ratings-row {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid black;
  padding-bottom: 0.2rem;
}

.stars-container {
  display: flex;
  height: 20px;
  max-height: 20px;
  max-width: 100px;
  width: 100px;
}

.star-icon {
  width: 100%;
  margin: 0 !important;
}

span {
  font-size: 1rem;
  margin-left: 8px;
  color: black;
}

/* For smaller screens (tablets) */
@media (max-width: 1024px) {
  .product-name {
    font-size: 3rem; /* Slightly smaller for tablets */
  }

  .product-description {
    font-size: 1.5rem;
  }
}

/* For medium screens (small tablets or large phones) */
@media (max-width: 768px) {
  .product-name {
    font-size: 2.5rem; /* Further reduced for smaller screens */
  }

  .product-description {
    font-size: 1.25rem;
  }
}

/* For mobile screens */
@media (max-width: 480px) {
  .product-name {
    font-size: 2rem; /* Smallest for mobile devices */
  }

  .product-description {
    font-size: 1rem;
  }
}
</style>
