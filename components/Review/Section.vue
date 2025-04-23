<template>
  <div class="reviews-section">
    <!-- Ratings & Summary Row -->
    <div class="ratings-summary">
      <div class="left-panel">
        <!-- Inline rating summary: rating, stars, reviews count -->
        <div class="rating-summary-inline">
          <span class="rating-value">{{ overallRating }}</span>
          <div class="stars-container">
            <SubcomponentsStarRating :rating="overallRating" />
          </div>
          <span class="review-count">{{ totalReviews }} reviews</span>
        </div>

        <!-- Star distribution with actual counts -->
        <div class="star-distribution">
          <div
            v-for="star in [5, 4, 3, 2, 1]"
            :key="star"
            class="star-row"
            @click="applyStarFilter(star)"
            :class="{ active: activeFilter === star }"
          >
            <span>{{ star }}</span>
            <div class="star-wrapper">
              <SubcomponentsStarSvgSingle :fillWidth="50" />
            </div>
            <div class="progress-bar">
              <div
                class="progress"
                :style="{ width: calculateProgressWidth(star) }"
              ></div>
            </div>
            <span>{{ ratingCounts[star] }}</span>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <button class="write-review-btn" @click="openReviewModal">
          Write a review
        </button>
      </div>
    </div>

    <!-- Reviews Header: "Showing X of X reviews" + filter buttons -->
    <div class="reviews-list-header">
      <div class="reviews-count">
        Showing 1 - 6 of {{ totalReviews }} reviews
      </div>
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
    </div>

    <!-- Reviews List -->
    <div class="reviews-list">
      <div
        v-for="review in filteredReviews"
        :key="review._id"
        class="review-card"
      >
        <!-- Top Row: Name (censored) + Verified Check + Date -->
        <div class="review-top-row">
          <span class="reviewer-name">{{
            censorName(review.reviewerName)
          }}</span>
          <span class="verified-check-icon" title="Verified Reviewer">✔</span>
          <span class="review-date">{{ formatDate(review.date) }}</span>
        </div>

        <!-- Star Rating Row -->
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

        <!-- Comment -->
        <div class="review-body">
          <p class="review-comment">{{ review.comment }}</p>
        </div>

        <!-- Helpful Section -->
        <div class="helpful-section">
          <span>Is this helpful?</span>
          <button
            class="thumbs-btn"
            @click="markHelpful(review, 'up')"
            :disabled="hasVoted(review)"
          >
            👍 {{ review.helpful?.thumbsUp || 0 }}
          </button>
          <button
            class="thumbs-btn"
            @click="markHelpful(review, 'down')"
            :disabled="hasVoted(review)"
          >
            👎 {{ review.helpful?.thumbsDown || 0 }}
          </button>
        </div>
      </div>
    </div>

    <!-- Write Review Modal -->
    <transition name="fade">
      <div class="modal-overlay" v-if="showReviewModal">
        <div class="modal">
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
            <div class="modal-body-wrapper" v-if="reviewStep === 1">
              <p class="step-heading">Quality*</p>
              <div v-if="showRequiredError" class="error-message">
                Please enter required fields
              </div>

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

            <div class="modal-body-wrapper" v-else-if="reviewStep === 2">
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

            <div class="modal-body-wrapper" v-else-if="reviewStep === 3">
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
const props = defineProps({
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  itemImage: { type: String, required: false, default: "" },
});

const reviews = ref([]);
const totalReviews = ref(0);
const overallRating = ref(0);
const votedReviews = ref([]);

const ratingCounts = computed(() => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.value.forEach((r) => {
    if (r.rating) {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    }
  });
  return counts;
});

function calculateProgressWidth(star) {
  const count = ratingCounts.value[star];
  const maxCount = Math.max(...Object.values(ratingCounts.value));
  if (maxCount === 0) return "0%";
  return (count / maxCount) * 100 + "%";
}

const uniquePhotos = computed(() => {
  const allPhotos = reviews.value.flatMap((r) => r.photos || []);
  return [...new Set(allPhotos)];
});

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Latest", value: "newest" },
];

const activeFilter = ref("all");
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

function initVotedReviews() {
  const stored = localStorage.getItem("helpfulVotes");
  votedReviews.value = stored ? JSON.parse(stored) : [];
}

onMounted(async () => {
  initVotedReviews();
  await fetchReviews();
});

async function fetchReviews() {
  try {
    const data = await $fetch(`/api/reviews/${props.itemId}`);
    reviews.value = Array.isArray(data) ? data : [];
    calculateStats();
  } catch (err) {
    console.error("Failed to fetch reviews", err);
  }
}

function calculateStats() {
  totalReviews.value = reviews.value.length;
  if (!totalReviews.value) {
    overallRating.value = 0;
    return;
  }
  const sum = reviews.value.reduce((acc, r) => acc + (r.rating || 0), 0);
  overallRating.value = (sum / totalReviews.value).toFixed(1);
}

function applyFilter(value) {
  activeFilter.value = value;
}

const filteredReviews = computed(() => {
  if (typeof activeFilter.value === "number") {
    return reviews.value.filter((r) => r.rating === activeFilter.value);
  } else if (activeFilter.value === "newest") {
    return [...reviews.value].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }
  return reviews.value;
});

function applyStarFilter(star) {
  activeFilter.value = star;
}

function hasVoted(review) {
  return votedReviews.value.includes(review._id);
}

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

    // persist to DB
    await $fetch(`/api/reviews/${review._id}`, {
      method: "PUT",
      body: { helpful: review.helpful },
    });

    // track locally so button disables
    votedReviews.value.push(review._id);
    localStorage.setItem("helpfulVotes", JSON.stringify(votedReviews.value));
  } catch (err) {
    console.error("Error marking helpful", err);
  }
}

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
    if (!reviewForm.rating || !reviewForm.title || !reviewForm.comment) {
      showRequiredError.value = true;
      return;
    }
    showRequiredError.value = false;
    reviewStep.value = 2;
  } else if (reviewStep.value === 2) {
    reviewStep.value = 3;
  }
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert("File is too large. Max 2MB allowed.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    reviewForm.photos.push(reader.result);
  };
  reader.readAsDataURL(file);
  event.target.value = "";
}

function removePhoto(index) {
  reviewForm.photos.splice(index, 1);
}

async function submitReview() {
  if (!reviewForm.reviewerName || !reviewForm.email) {
    alert("Please fill in your name and email.");
    return;
  }
  try {
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

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function censorName(name) {
  if (!name) return "";
  const parts = name.split(" ");
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      return part[0] + part.slice(1).replace(/./g, "*");
    })
    .join(" ");
}
</script>

<style scoped>
.reviews-section {
  margin: 20px auto;
  max-width: 1300px;
  font-family: sans-serif;
  padding: 0 2rem;
}
.ratings-summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  margin-bottom: 30px;
}
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 18rem;
}
.rating-summary-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
}
.rating-value {
  font-weight: bold;
  font-size: 3rem;
}
.stars-container {
  width: 6rem;
  display: flex;
  justify-content: flex-end;
}
.review-count {
  font-size: 1.2rem;
}
.star-distribution {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.star-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1rem;
  width: 1rem;
}
.star-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: black;
  cursor: pointer;
  width: 100%;
}
.star-row.active {
  color: black;
}
.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  position: relative;
  border-radius: 20px;
}
.progress {
  background: #ea5520;
  height: 8px;
  border-radius: 20px;
  transition: width 0.3s;
}
.right-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  min-height: 100%;
  height: 100%;
  gap: 15px;
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
.reviews-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.reviews-count {
  font-size: 1rem;
  color: #374151;
}
.filters-row {
  display: flex;
  gap: 10px;
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
}
.review-top-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 6px;
}
.reviewer-name {
  font-weight: 600;
  color: #111;
}
.verified-check-icon {
  color: #16a34a;
  font-size: 1rem;
}
.review-date {
  font-size: 0.9rem;
  color: #6b7280;
}
.star-rating {
  margin: 0.2rem 0 0.6rem;
  font-size: 1.2rem;
}
.star {
  color: #d1d5db;
}
.star.filled {
  color: #ea5520;
}
.review-body {
  margin-top: 0.2rem;
}
.review-comment {
  font-size: 1rem;
  color: #374151;
  line-height: 1.4;
}
.helpful-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #6b7280;
}
.helpful-section span {
  white-space: nowrap;
}
.thumbs-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;
}
.thumbs-btn:hover:not(:disabled) {
  background: #f3f4f6;
}
.thumbs-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
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
  width: 600px;
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
.modal-body-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  margin-top: -10px;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@media (max-width: 480px) {
  .reviews-section {
    padding: 0 1rem;
  }
  .left-panel {
    min-width: 15rem;
    width: 100%;
  }
  .right-panel {
    width: 100%;
  }
  .write-review-btn {
    width: 100%;
  }
  .ratings-summary {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
