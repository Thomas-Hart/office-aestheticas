<template>
  <div v-if="isLoggedIn !== null && hydrated">
    <div v-if="isItemOwner && isLoggedIn">
      <p>You represent this item. Reply to reviews below!</p>
    </div>
    <div v-else-if="isLoggedIn">
      <h4 class="review-title" v-if="existingReview">
        Your Review History with {{ item.name }}
      </h4>
      <div v-if="existingReview">
        <ReviewReviews
          :review="existingReview"
          :tagDescriptions="tagDescriptions"
          :isItemOwner="isItemOwner"
          :isPro="isPro"
          :item="item"
        />
      </div>

      <h4
        :class="['review-title-dropdown', { 'is-button': existingReview }]"
        @click="toggleReviewForm"
      >
        {{
          existingReview ? "Click here to update your review" : "Leave a Review"
        }}
        <span
          v-if="existingReview"
          class="arrow"
          :class="{ open: showReviewForm }"
          >▼</span
        >
      </h4>
      <div v-if="showReviewForm || !existingReview">
        <div class="star-rating">
          <p>Choose your star rating:</p>
          <div class="stars-input">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= newReview.rating || n <= hoverRating }"
              @mouseover="hoverRating = n"
              @mouseleave="hoverRating = 0"
              @click="setRating(n)"
            >
              ★
            </span>
          </div>
        </div>
        <textarea
          v-model="newReview.comment"
          placeholder="Write your review..."
        ></textarea>
        <p v-if="error" class="error-message">{{ error }}</p>
        <div class="submit-review-button">
          <SubcomponentsLoadingButton
            :text="existingReview ? 'Update Review' : 'Submit Review'"
            :isLoading="loading"
            @click="submitReview"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <p>You need to sign in to leave a review.</p>
      <button @click="openLoginModal">Login</button>
    </div>
    <NavFooterPreloadLoginModal
      v-if="showLoginModal"
      @close="closeLoginModal"
    />
  </div>
</template>


<script setup>
const props = defineProps({
  existingReview: {
    type: Object,
    required: false,
  },
  item: {
    type: Object,
    required: true,
  },
  tagDescriptions: {
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

const newReview = ref({ rating: null, comment: "", tags: [] });
const hoverRating = ref(0);
const store = useUserStore();
const isLoggedIn = computed(() => !!store.token);
const loading = ref(false);
const showLoginModal = ref(false);
const error = ref("");
const showReviewForm = ref(!props.existingReview);
const hydrated = ref(false);

onMounted(() => {
  hydrated.value = true; // Mark as hydrated when the component is mounted
});

function setRating(rating) {
  newReview.value.rating = rating;
}

function toggleReviewForm() {
  if (props.existingReview) {
    showReviewForm.value = !showReviewForm.value;
  }
}

async function submitReview() {
  if (newReview.value.comment.trim() && newReview.value.rating) {
    loading.value = true;
    error.value = "";
    try {
      const response = await $fetch("/api/reviews", {
        method: "POST",
        body: {
          itemId: props.item._id,
          itemName: props.item.name,
          reviewer: store.user._id,
          reviewerName: store.user.name,
          rating: newReview.value.rating,
          comment: newReview.value.comment,
          tags: newReview.value.tags,
        },
      });
      newReview.value = { rating: null, comment: "", tags: [] };
      location.reload();
    } catch (error) {
      console.error("Failed to submit review:", error);
      error.value = "Failed to submit review. Please try again.";
    } finally {
      loading.value = false;
    }
  } else {
    error.value = "Please fill in all fields before submitting.";
  }
}

function openLoginModal() {
  showLoginModal.value = true;
}

function closeLoginModal() {
  showLoginModal.value = false;
}

watch(
  () => props.existingReview,
  (newReviewData) => {
    if (newReviewData) {
      newReview.value = {
        rating: newReviewData.rating,
        comment: "",
        tags: newReviewData.tags,
      };
      showReviewForm.value = false; // Hide the form initially if there's an existing review
    } else {
      showReviewForm.value = true; // Show the form if there's no existing review
    }
  },
  { immediate: true }
);

watch(isLoggedIn, (loggedIn) => {
  if (!loggedIn) {
    showLoginModal.value = false;
  }
});
</script>



<style scoped>
.checkboxes {
  margin-bottom: 20px;
}

.checkbox-group {
  margin-bottom: 10px;
}

h4,
h5 {
  color: black;
}

h5 {
  margin-top: 1rem;
}

.checkbox-row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  gap: 10px;
  margin-left: -10px;
}

.checkbox-row label {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  color: black;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.checkbox-row label:hover {
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.checkbox-row input {
  margin-right: 10px;
  accent-color: #007bff; /* Change the checkbox color */
  width: 18px;
  height: 18px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  font-size: 16px;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
}

input[type="number"] {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  font-size: 16px;
}

input[type="number"]:focus {
  outline: none;
  border-color: #007bff;
}

button {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 1rem;
}

button:hover {
  background-color: #0056b3;
}

.review-title {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0 10px;
  color: black;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-title-dropdown {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
  color: black;
  display: flex;
  align-items: center;
}

.review-title-dropdown.is-button {
  cursor: pointer;
  padding: 10px 0px;
  background-color: transparent;
  border-radius: 5px;
  transition: background-color 0.3s, box-shadow 0.3s;
  width: 30rem;
}

.review-title-dropdown.is-button:hover {
}

.arrow {
  font-size: 20px;
  transition: transform 0.3s ease;
  margin-left: 10px;
}

.arrow.open {
  transform: rotate(180deg);
}

.star-rating {
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 20px;
}

p {
  color: black;
  margin-top: 1rem;
}

.stars-input {
  display: flex;
}

.stars-input .star {
  font-size: 30px;
  cursor: pointer;
}

.stars-input .star.filled {
  color: #ff9900;
}

.stars-input .star:not(.filled) {
  color: #ddd;
}

.error-message {
  color: red;
  font-size: 14px;
}

.submit-review-button {
  width: 12rem;
}

@media (max-width: 768px) {
  .review-title-dropdown.is-button {
    width: auto;
  }

  .review-title-dropdown {
    font-size: 20px;
  }

  .arrow {
    font-size: 18px;
  }

  .stars-input .star {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .checkbox-row {
    gap: 5px;
    margin-left: 0;
  }

  .checkbox-row label {
    font-size: 12px;
    padding: 4px 8px;
  }

  .review-title-dropdown.is-button {
    width: auto;
    padding: 8px 16px;
  }

  .review-title-dropdown {
    font-size: 18px;
  }

  .arrow {
    font-size: 16px;
  }

  .stars-input .star {
    font-size: 20px;
  }

  .error-message {
    font-size: 12px;
  }
}
</style>
