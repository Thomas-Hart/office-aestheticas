<template>
  <div class="reviews-section">
    <!-- Ratings & Summary Row -->
    <div class="ratings-summary">
      <div class="left-panel">
        <div class="average-rating">
          <div class="rating-value">{{ overallRating }}</div>
          <div class="max-rating">/ 5</div>
        </div>
        <div class="rating-text">
          <strong>{{ totalReviews }}</strong> reviews
        </div>
        <!-- Star distribution (mocked for illustration) -->
        <div class="star-distribution">
          <div v-for="i in 5" :key="i" class="star-row">
            <span>{{ 6 - i }} stars</span>
            <div class="progress-bar">
              <div
                class="progress"
                :style="{ width: starDistribution[i] + '%' }"
              ></div>
            </div>
            <span>{{ starDistribution[i] }}%</span>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="customer-photos">
          <h4>Customer Photos</h4>
          <div class="photos-container">
            <div
              v-for="(photo, index) in uniquePhotos"
              :key="index"
              class="photo-item"
            >
              <img :src="photo" alt="Customer photo" />
            </div>
          </div>
        </div>
        <button class="write-review-btn" @click="openReviewModal">
          Write a review
        </button>
      </div>
    </div>

    <!-- Filter Row -->
    <div class="filters-row">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        :class="{ active: activeFilter === option.value }"
        @click="applyFilter(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Reviews List -->
    <div class="reviews-list">
      <div
        v-for="review in filteredReviews"
        :key="review._id"
        class="review-card"
      >
        <!-- Star Rating & Name/Date -->
        <div class="review-header">
          <div class="star-rating">
            <span
              v-for="i in 5"
              :key="i"
              class="star"
              :class="{ filled: review.rating >= i }"
            >
              ★
            </span>
          </div>
          <div class="review-meta">
            <span class="reviewer-name">{{
              censorName(review.reviewerName)
            }}</span>
            <span class="review-date">{{ formatDate(review.date) }}</span>
          </div>
        </div>

        <!-- Review Title & Comment -->
        <div class="review-body">
          <h4 class="review-title">{{ review.title }}</h4>
          <p class="review-comment">{{ review.comment }}</p>
          <!-- Photos -->
          <div
            v-if="review.photos && review.photos.length"
            class="review-photos"
          >
            <div
              v-for="(photo, idx) in review.photos"
              :key="idx"
              class="photo-item"
            >
              <img :src="photo" alt="Review photo" />
            </div>
          </div>
        </div>

        <!-- Helpful Section -->
        <div class="helpful-section">
          <span>Was this helpful?</span>
          <button class="thumbs-btn" @click="markHelpful(review, 'up')">
            👍 {{ review.helpful?.thumbsUp || 0 }}
          </button>
          <button class="thumbs-btn" @click="markHelpful(review, 'down')">
            👎 {{ review.helpful?.thumbsDown || 0 }}
          </button>
        </div>
      </div>
    </div>

    <!-- Write Review Modal -->
    <transition name="fade">
      <div class="modal-overlay" v-if="showReviewModal">
        <div class="modal">
          <!-- Modal Header with item image and close button -->
          <div class="modal-header">
            <div class="item-info">
              <img
                v-if="props.itemImage"
                :src="props.itemImage"
                alt="Item Image"
                class="modal-item-image"
              />
              <div>
                <h3 class="modal-title">Rate {{ props.itemName }}</h3>
              </div>
            </div>
            <button class="close-button" @click="closeReviewModal">
              &times;
            </button>
          </div>

          <div class="modal-body">
            <!-- Step 1: Rating & Basic Info -->
            <div v-if="reviewStep === 1">
              <p class="step-heading">Quality*</p>
              <!-- Error message if required fields are missing -->
              <div v-if="showRequiredError" class="error-message">
                Please enter required fields
              </div>

              <!-- Star Rating -->
              <div class="star-rating-input">
                <span
                  v-for="i in 5"
                  :key="i"
                  class="star"
                  :class="{ filled: reviewForm.rating >= i }"
                  @click="reviewForm.rating = i"
                >
                  ★
                </span>
              </div>

              <label class="input-label">Review Title *</label>
              <input
                type="text"
                placeholder="Text field title placeholder"
                v-model="reviewForm.title"
              />

              <label class="input-label">Review Content *</label>
              <textarea
                placeholder="Text field content placeholder"
                v-model="reviewForm.comment"
              ></textarea>

              <button class="next-btn" @click="goToNextStep">Next</button>
            </div>

            <!-- Step 2: Photo Upload -->
            <div v-else-if="reviewStep === 2">
              <h4 class="step-heading">Upload Photos</h4>
              <p class="media-note">Accept .jpg, .png and max 2MB each</p>

              <div class="photo-uploads">
                <div
                  v-for="(file, index) in reviewForm.photos"
                  :key="index"
                  class="photo-preview"
                >
                  <img :src="file" alt="Preview" />
                  <button class="remove-photo" @click="removePhoto(index)">
                    Remove
                  </button>
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                @change="handlePhotoUpload"
                :disabled="reviewForm.photos.length >= 3"
              />
              <p class="limit-note">You can upload up to 3 photos</p>

              <button class="next-btn" @click="goToNextStep">Next</button>
            </div>

            <!-- Step 3: Name & Email -->
            <div v-else-if="reviewStep === 3">
              <h4 class="step-heading">Your information</h4>
              <label class="input-label">Your Name *</label>
              <input
                type="text"
                placeholder="Text field name placeholder"
                v-model="reviewForm.reviewerName"
              />

              <label class="input-label">Your Email *</label>
              <input
                type="email"
                placeholder="Text field email placeholder"
                v-model="reviewForm.email"
              />

              <button class="submit-btn" @click="submitReview">
                Submit Your Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
  
  <script setup>
import { ref, reactive, computed, onMounted, defineProps } from "vue";

const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemImage: {
    type: String,
    required: false,
    default: "",
  },
});

// Local State
const reviews = ref([]);
const totalReviews = ref(0);
const overallRating = ref(0);

// Mocked star distribution data
const starDistribution = reactive({
  1: 5,
  2: 10,
  3: 15,
  4: 30,
  5: 40,
});

// Summarize unique photos from all reviews
const uniquePhotos = computed(() => {
  const allPhotos = reviews.value.flatMap((r) => r.photos || []);
  return [...new Set(allPhotos)];
});

// Filter
const filterOptions = [
  { label: "All", value: "all" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];
const activeFilter = ref("all");

// Modal for writing a review
const showReviewModal = ref(false);
const reviewStep = ref(1);
const reviewForm = reactive({
  rating: 0,
  title: "",
  comment: "",
  photos: [],
  reviewerName: "",
  email: "",
});
const showRequiredError = ref(false);

// Lifecycle: fetch reviews when mounted
onMounted(async () => {
  await fetchReviews();
});

// Fetch reviews from your API
async function fetchReviews() {
  try {
    // e.g. /api/reviews?itemId=...
    const data = await $fetch(`/api/reviews?itemId=${props.itemId}`);
    reviews.value = Array.isArray(data) ? data : [];
    calculateStats();
  } catch (err) {
    console.error("Failed to fetch reviews", err);
  }
}

// Recalculate total reviews and overall rating
function calculateStats() {
  totalReviews.value = reviews.value.length;
  if (!totalReviews.value) {
    overallRating.value = 0;
    return;
  }
  const sum = reviews.value.reduce((acc, r) => acc + (r.rating || 0), 0);
  overallRating.value = (sum / totalReviews.value).toFixed(1);
}

// Filter logic
function applyFilter(value) {
  activeFilter.value = value;
}

// Computed filtered reviews
const filteredReviews = computed(() => {
  if (activeFilter.value === "newest") {
    return [...reviews.value].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  } else if (activeFilter.value === "oldest") {
    return [...reviews.value].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }
  // 'all' or any other fallback
  return reviews.value;
});

// "Is this helpful?" logic
async function markHelpful(review, type) {
  try {
    if (!review.helpful) {
      review.helpful = { thumbsUp: 0, thumbsDown: 0 };
    }
    if (type === "up") {
      review.helpful.thumbsUp++;
    } else {
      review.helpful.thumbsDown++;
    }
    // In a real app, call an endpoint to persist the change:
    // await $fetch(`/api/reviews/${review._id}/helpful`, {
    //   method: 'POST',
    //   query: { type },
    // })
  } catch (err) {
    console.error("Error marking helpful", err);
    // Revert or handle error gracefully
  }
}

// Modal Controls
function openReviewModal() {
  resetReviewForm();
  showReviewModal.value = true;
  reviewStep.value = 1;
}

function closeReviewModal() {
  showReviewModal.value = false;
}

function resetReviewForm() {
  reviewForm.rating = 0;
  reviewForm.title = "";
  reviewForm.comment = "";
  reviewForm.photos = [];
  reviewForm.reviewerName = "";
  reviewForm.email = "";
  showRequiredError.value = false;
}

function goToNextStep() {
  if (reviewStep.value === 1) {
    // Validate rating, title, comment
    if (!reviewForm.rating || !reviewForm.title || !reviewForm.comment) {
      showRequiredError.value = true;
      return;
    }
    showRequiredError.value = false;
    reviewStep.value = 2;
  } else if (reviewStep.value === 2) {
    // Move on to final step
    reviewStep.value = 3;
  }
}

// Handle photo upload
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Basic file size check (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    alert("File is too large. Max 2MB allowed.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    reviewForm.photos.push(reader.result);
  };
  reader.readAsDataURL(file);
  event.target.value = ""; // Reset file input
}

function removePhoto(index) {
  reviewForm.photos.splice(index, 1);
}

// Submit final step
async function submitReview() {
  // Validate name & email
  if (!reviewForm.reviewerName || !reviewForm.email) {
    alert("Please fill in your name and email.");
    return;
  }

  try {
    // Construct new review object
    const newReview = {
      itemId: props.itemId,
      reviewerName: reviewForm.reviewerName,
      email: reviewForm.email,
      title: reviewForm.title,
      comment: reviewForm.comment,
      rating: reviewForm.rating,
      photos: reviewForm.photos,
      helpful: { thumbsUp: 0, thumbsDown: 0 },
      date: new Date(),
    };

    // POST to /api/reviews
    await $fetch("/api/reviews", {
      method: "POST",
      body: newReview,
    });

    alert("Review submitted!");
    showReviewModal.value = false;
    await fetchReviews();
  } catch (err) {
    console.error("Error submitting review", err);
    alert("Error submitting review");
  }
}

// Utility functions
function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function censorName(name) {
  if (!name) return "";
  const parts = name.split(" ");
  return parts
    .map((part) => {
      if (part.length <= 1) return part; // single-letter name
      // Show the first character, replace the rest with asterisks
      return part[0] + part.slice(1).replace(/./g, "*");
    })
    .join(" ");
}
</script>
  
  <style scoped>
.reviews-section {
  margin: 20px auto;
  max-width: 1000px;
  font-family: sans-serif;
}

/* Ratings Summary Row */
.ratings-summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.average-rating {
  display: flex;
  align-items: flex-end;
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}
.average-rating .rating-value {
  color: #ea5520;
}
.average-rating .max-rating {
  font-size: 1.5rem;
  color: #9ca3af;
  margin-left: 5px;
}

.rating-text {
  font-size: 1rem;
  color: #6b7280;
}

.star-distribution {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.star-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #6b7280;
}
.progress-bar {
  width: 100px;
  height: 6px;
  background: #e5e7eb;
  position: relative;
  border-radius: 3px;
}
.progress {
  background: #ea5520;
  height: 6px;
  border-radius: 3px;
  transition: width 0.3s;
}

.right-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 15px;
}

.customer-photos {
  width: 200px;
}
.customer-photos h4 {
  margin: 0 0 5px;
  font-size: 1rem;
}
.photos-container {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.photo-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.write-review-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 10px 18px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
}
.write-review-btn:hover {
  background: #dc2626;
}

/* Filters Row */
.filters-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.filters-row button {
  background: none;
  border: none;
  padding: 6px 10px;
  font-size: 1rem;
  cursor: pointer;
  color: #6b7280;
  border-bottom: 2px solid transparent;
}
.filters-row button:hover {
  color: #111;
}
.filters-row button.active {
  color: #111;
  border-color: #ea5520;
}

/* Reviews List */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fff;
  position: relative;
}

/* Review Header */
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.star-rating {
  display: flex;
  gap: 2px;
  font-size: 1.2rem;
}
.star {
  color: #d1d5db;
  cursor: pointer;
}
.star.filled {
  color: #ea5520;
}
.review-meta {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #6b7280;
}
.reviewer-name {
  font-weight: 600;
}

/* Review Body */
.review-body {
  margin-top: 10px;
}
.review-title {
  margin: 0 0 5px;
  font-size: 1.1rem;
  color: #111;
}
.review-comment {
  margin: 0;
  line-height: 1.4;
  color: #374151;
}
.review-photos {
  margin-top: 10px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.review-photos .photo-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 1px solid #ddd;
}

/* Helpful Section */
.helpful-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #6b7280;
}
.thumbs-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;
}
.thumbs-btn:hover {
  background: #f3f4f6;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #fff;
  width: 600px; /* Make the modal bigger */
  max-width: 90%;
  padding: 20px;
  border-radius: 6px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
.item-info {
  display: flex;
  align-items: center;
  gap: 15px;
}
.modal-item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
.modal-title {
  margin: 0;
  font-size: 1.2rem;
  color: #374151;
  font-weight: 600;
}
.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #9ca3af;
}
.close-button:hover {
  color: #6b7280;
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.step-heading {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #374151;
}
.media-note {
  font-size: 0.9rem;
  color: #6b7280;
}
.error-message {
  background: #fee2e2;
  color: #b91c1c;
  padding: 8px;
  border-radius: 4px;
}
.star-rating-input {
  display: flex;
  gap: 4px;
  font-size: 1.5rem;
}
.star-rating-input .star {
  cursor: pointer;
  color: #d1d5db;
}
.star-rating-input .star.filled {
  color: #ea5520;
}
.input-label {
  font-weight: 600;
  margin-top: 10px;
}
.modal input[type="text"],
.modal input[type="email"],
.modal textarea {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  font-size: 0.95rem;
}
.photo-uploads {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.photo-preview {
  position: relative;
}
.photo-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.remove-photo {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ef4444;
  border: none;
  color: #fff;
  font-size: 0.8rem;
  padding: 2px 4px;
  cursor: pointer;
  border-radius: 2px;
}
.limit-note {
  font-size: 0.85rem;
  color: #6b7280;
}
.next-btn,
.submit-btn {
  align-self: flex-end;
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 10px 18px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
}
.next-btn:hover,
.submit-btn:hover {
  background: #dc2626;
}

/* Simple fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
  