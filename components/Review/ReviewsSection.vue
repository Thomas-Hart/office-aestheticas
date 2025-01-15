<template>
  <div class="reviews-page">
    <!-- Left Column for Overall Rating and Filters -->
    <div class="left-column">
      <div class="filters">
        <div class="star-rating-breakdown">
          <h2>Search Reviews</h2>
          <div class="average-rating" v-if="item.ratings && item.ratings >= 1">
            <span class="average-rating-score">{{ item.ratings }}</span>
            <span class="average-rating-text">out of 5</span>
            <div class="stars">
              <span v-for="n in 5" :key="n" class="star">
                {{ n <= roundedItemRating ? "★" : "☆" }}
              </span>
            </div>
          </div>
          <div v-else>
            <span class="average-rating-score">No Reviews</span>
          </div>
          <div class="rating-bars">
            <div
              class="rating-bar"
              v-for="n in [5, 4, 3, 2, 1]"
              :key="n"
              @click="filterByRating(n)"
            >
              <span>{{ n }} star</span>
              <div class="bar-container">
                <div
                  class="bar"
                  :style="{ width: ratingPercentages[n - 1] + '%' }"
                ></div>
              </div>
              <span>{{ ratingCounts[n - 1] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Section for Reviews -->
    <div class="reviews-container">
      <p v-if="filteredReviews.length === 0" class="no-reviews-message">
        No reviews yet. Reviews will show up here once submitted.
      </p>
      <ReviewReviews
        v-for="review in filteredReviews"
        :key="review._id"
        :review="review"
        :tagDescriptions="tagDescriptions"
        :isItemOwner="isItemOwner"
        :isPro="isPro"
        :item="item"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  reviews: {
    type: Array,
  },
  item: {
    type: Object,
    required: true,
  },
  isItemOwner: {
    type: Boolean,
    required: true,
  },
  isPro: {
    type: Boolean,
    required: true,
  },
});

const filteredReviews = ref([]);
const selectedRating = ref(null);
const selectedTags = ref([]);
const ratingCounts = ref([0, 0, 0, 0, 0]);
const availableTags = ref([]);
const showUpdates = ref({});
const newReply = ref({});
const loading = ref(false);
const error = ref("");

function updateRatingCounts() {
  if (props.reviews) {
    ratingCounts.value = [0, 0, 0, 0, 0];
    props.reviews.forEach((review) => {
      const latestRating =
        review.updates && review.updates.length
          ? review.updates[review.updates.length - 1].rating
          : review.rating;
      ratingCounts.value[latestRating - 1]++;
    });
  }
}

const roundedItemRating = computed(() => {
  return props.item ? Math.round(props.item.ratings) : 0;
});

const ratingPercentages = computed(() => {
  const total = props.reviews ? props.reviews.length : 0;
  return total
    ? ratingCounts.value.map((count) => ((count / total) * 100).toFixed(2))
    : [0, 0, 0, 0, 0];
});

function filterReviews() {
  updateRatingCounts();
  if (props.reviews) {
    filteredReviews.value = props.reviews.filter((review) => {
      const latestRating =
        review.updates && review.updates.length
          ? review.updates[review.updates.length - 1].rating
          : review.rating;
      const ratingMatch = selectedRating.value
        ? latestRating === selectedRating.value
        : true;
      const tagsMatch = selectedTags.value.length
        ? selectedTags.value.every((tag) => review.tags.includes(tag))
        : true;
      return ratingMatch && tagsMatch;
    });
  }
}

function filterByRating(rating) {
  selectedRating.value = rating;
  filterReviews();
}

function filterByTags() {
  filterReviews();
}

function toggleTag(tag) {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
  filterByTags();
}

const lastScrollTop = ref(0);

const handleScroll = () => {
  const leftColumn = document.querySelector(".left-column");
  if (!leftColumn) return; // Check if leftColumn exists

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop.value) {
    leftColumn.classList.remove("large");
    leftColumn.classList.add("small");
  } else {
    leftColumn.classList.remove("small");
    leftColumn.classList.add("large");
  }

  lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  filterReviews();
  if (props.item) {
    availableTags.value = props.item.tags || [];
  }
});
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.reviews-page {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 2rem;
  gap: 5rem;
}

.left-column {
  width: 30%;
  background: #f9f9f9;
  position: -webkit-sticky;
  position: sticky;
  height: fit-content;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
  transition: top 0.4s;
}

.left-column.small {
  top: 4rem;
}

.left-column.large {
  top: 9rem;
}

.filters {
  color: black;
  padding: 20px;
}

.star-rating-breakdown h2,
.tag-filters h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.average-rating {
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-size: 24px;
  font-weight: bold;
}

.average-rating-score {
  color: #ff9900;
}

.rating-bars {
  margin-top: 10px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.rating-bar:hover .bar {
  background: #ffb347;
}

.bar-container {
  flex: 1;
  background: #ddd;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.bar {
  height: 100%;
  background: #ff9900;
}

.tag-filters .tag {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 5px 10px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s;
  border-radius: 10px;
  background: white;
  position: relative;
}

.tag-filters .tag:hover {
  background: #e0e0e0;
}

.tag-filters .tag.selected {
  background: #ff8210;
  color: white;
}

.tag-filters .hidden-checkbox {
  display: none;
}

.tag-label {
  pointer-events: none; /* Prevent the label from intercepting click events */
  flex: 1;
  user-select: none; /* Prevent text selection */
}

.stars {
  display: flex;
  align-items: center;
}

.star {
  color: #ff9900;
  font-size: 30px;
}

.reviews-container {
  width: 70%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-reviews-message {
  font-size: 1.5rem;
  text-align: center;
  margin: 2rem 0;
  color: white;
}

@media (max-width: 1024px) {
  .reviews-page {
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
  }

  .left-column {
    width: 100%;
    position: relative;
    top: 0;
  }

  .left-column.small {
    top: 0rem;
  }

  .left-column.large {
    top: 0rem;
  }

  .reviews-container {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .reviews-page {
    padding: 1.5rem;
  }

  .left-column {
    padding: 1rem;
  }

  .filters {
    padding: 10px;
  }

  .average-rating {
    font-size: 20px;
  }

  .average-rating-score {
    font-size: 20px;
  }

  .rating-bar {
    font-size: 14px;
  }

  .tag-filters .tag {
    padding: 7px;
  }

  .star {
    font-size: 25px;
  }
}

@media (max-width: 480px) {
  .reviews-page {
    padding: 1rem;
    gap: 1rem;
  }

  .left-column {
    padding: 0.5rem;
  }

  .filters {
    padding: 5px;
  }

  .average-rating {
    font-size: 16px;
  }

  .average-rating-score {
    font-size: 16px;
  }

  .rating-bar {
    font-size: 12px;
  }

  .star {
    font-size: 20px;
  }
}
</style>
