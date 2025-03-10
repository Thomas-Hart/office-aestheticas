<template>
  <div class="wrapper">
    <!-- Header -->
    <header class="header">
      <h1>Review Management</h1>
    </header>
    <div class="main-container">
      <!-- Sidebar with Breadcrumbs -->
      <aside class="sidebar">
        <div class="breadcrumbs">
          <span class="breadcrumb-item">Dashboard</span>
          <span class="breadcrumb-separator">&gt;</span>
          <span class="breadcrumb-item">Reviews</span>
        </div>
        <!-- Sidebar Navigation -->
        <div class="search-filters">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search items..."
          />
          <select v-model="filterStatus">
            <option value="">All Items</option>
          </select>
        </div>
        <div v-if="isLoadingItems" class="spinner-container">
          <div class="spinner"></div>
          <div class="spinner-text">Loading items...</div>
        </div>
        <ul class="item-list" v-else>
          <li
            v-for="item in filteredItems"
            :key="item._id"
            @click="selectItem(item)"
            :class="{ active: selectedItem._id === item._id }"
          >
            {{ item.name || "Untitled Item" }}
          </li>
        </ul>
      </aside>

      <!-- Editor Section for Reviews -->
      <section class="editor">
        <!-- Tab Navigation -->
        <div class="tab-header">
          <button
            :class="{ active: activeTab === 'reviews' }"
            @click="activeTab = 'reviews'"
          >
            Reviews
          </button>
          <button
            :class="{ active: activeTab === 'bulk' }"
            @click="activeTab = 'bulk'"
          >
            Bulk Upload
          </button>
        </div>
        <div class="tab-content">
          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'">
            <div v-if="!selectedItem._id">
              <p>Please select an item to view reviews.</p>
            </div>
            <div v-else>
              <!-- Overall Rating -->
              <div class="overall-rating">
                <h2>
                  Overall Rating:
                  <span v-if="reviews.length"
                    >{{ overallRating }} ⭐ ({{ reviews.length }} reviews)</span
                  >
                  <span v-else>No reviews yet</span>
                </h2>
              </div>
              <!-- Loading Spinner for Reviews -->
              <div v-if="isLoadingReviews" class="spinner-container">
                <div class="spinner"></div>
                <div class="spinner-text">Loading reviews...</div>
              </div>
              <div v-else class="review-list">
                <div
                  class="review-card"
                  v-for="review in reviews"
                  :key="review._id"
                >
                  <!-- Delete Button (Top Right) -->
                  <button
                    class="delete-button"
                    @click="openDeleteModal(review)"
                  >
                    &times;
                  </button>
                  <!-- Review Header -->
                  <div class="review-header">
                    <h3>
                      {{ review.reviewerName }} - Rating: {{ review.rating }}
                    </h3>
                    <small>{{ formatDate(review.date) }}</small>
                  </div>
                  <!-- Review Body -->
                  <div class="review-body">
                    <p>{{ review.comment }}</p>
                    <!-- Display update logs if available -->
                    <div v-if="review.updates && review.updates.length">
                      <h4>Updates</h4>
                      <ul>
                        <li
                          v-for="(update, index) in review.updates"
                          :key="index"
                        >
                          {{ formatDate(update.date) }} - Rating:
                          {{ update.rating }} - {{ update.comment }}
                        </li>
                      </ul>
                    </div>
                    <!-- Display business replies if available -->
                    <div
                      v-if="
                        review.businessReplies && review.businessReplies.length
                      "
                    >
                      <h4>Business Replies</h4>
                      <ul>
                        <li
                          v-for="(reply, idx) in review.businessReplies"
                          :key="idx"
                        >
                          <strong>{{ reply.businessRep }}</strong> ({{
                            formatDate(reply.date)
                          }}):
                          {{ reply.comment }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!-- Toggle Buttons Row -->
                  <div class="toggle-buttons-row">
                    <button
                      class="toggle-button"
                      :class="{ active: toggleStates[review._id]?.edit }"
                      @click="toggleEdit(review._id)"
                    >
                      Edit Review
                    </button>
                    <button
                      class="toggle-button"
                      :class="{ active: toggleStates[review._id]?.reply }"
                      @click="toggleReply(review._id)"
                    >
                      Reply to Review
                    </button>
                  </div>
                  <!-- Inline Edit Section (toggled) -->
                  <div
                    class="review-edit"
                    v-if="toggleStates[review._id]?.edit"
                  >
                    <label>Edit Rating</label>
                    <input
                      type="number"
                      v-model.number="review.rating"
                      min="1"
                      max="5"
                    />
                    <label>Edit Comment</label>
                    <textarea v-model="review.comment"></textarea>
                    <button @click="updateReview(review)">Update Review</button>
                    <div class="update-status" v-if="updateStatus[review._id]">
                      {{ updateStatus[review._id] }}
                    </div>
                  </div>
                  <!-- Business Reply Section (toggled) -->
                  <div
                    class="business-reply"
                    v-if="toggleStates[review._id]?.reply"
                  >
                    <h4>Add Business Reply</h4>
                    <input
                      type="text"
                      v-model="replyInputs[review._id].businessRep"
                      placeholder="Your Name"
                    />
                    <textarea
                      v-model="replyInputs[review._id].comment"
                      placeholder="Your Reply"
                    ></textarea>
                    <button @click="postBusinessReply(review)">
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Bulk Upload Tab -->
          <div v-if="activeTab === 'bulk'">
            <div v-if="!selectedItem._id">
              <p>Please select an item to upload reviews.</p>
            </div>
            <div v-else>
              <h3>Bulk Upload Reviews for {{ selectedItem.name }}</h3>
              <textarea
                v-model="bulkJson"
                placeholder="Paste JSON array of review objects here"
              ></textarea>
              <button @click="uploadBulkReviews">Upload Reviews</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" v-if="showDeleteModal">
      <div class="modal">
        <h2>Confirm Delete</h2>
        <p>
          Are you sure you want to delete the review by
          <strong>{{ reviewToDelete?.reviewerName }}</strong
          >? This action cannot be undone.
        </p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="cancelDelete">Cancel</button>
          <button class="delete-btn" @click="confirmDeleteReview">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, reactive, computed, onMounted } from "vue";

// States for items, reviews, and UI controls
const searchTerm = ref("");
const filterStatus = ref("");
const items = ref([]);
const selectedItem = reactive({ _id: null, name: "" });
const reviews = ref([]);
const activeTab = ref("reviews");
const bulkJson = ref("");
const isSubmitting = ref(false);
const isLoadingItems = ref(false);
const isLoadingReviews = ref(false);

// Object to store business reply inputs for each review (keyed by review _id)
const replyInputs = reactive({});
// Object to store update status messages for each review
const updateStatus = reactive({});
// Object to store toggle state for each review: { edit: Boolean, reply: Boolean }
const toggleStates = reactive({});

// Delete modal state
const showDeleteModal = ref(false);
const reviewToDelete = ref(null);

// Computed list for filtered items
const filteredItems = computed(() =>
  items.value.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
    return matchesSearch;
  })
);

// Computed overall rating from the reviews (average)
const overallRating = computed(() => {
  if (reviews.value.length === 0) return "N/A";
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.value.length).toFixed(1);
});

// Fetch all items (assumes an API endpoint at /api/items)
const fetchItems = async () => {
  isLoadingItems.value = true;
  try {
    const data = await $fetch("/api/items");
    items.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching items: ", error);
  } finally {
    isLoadingItems.value = false;
  }
};

// Fetch reviews for the selected item (assumes an API endpoint with query param)
const fetchReviews = async () => {
  if (!selectedItem._id) return;
  isLoadingReviews.value = true;
  try {
    const data = await $fetch(`/api/reviews?itemId=${selectedItem._id}`);
    reviews.value = Array.isArray(data) ? data : [];
    // Initialize reply inputs, updateStatus, and toggleStates for each review if not already set
    reviews.value.forEach((review) => {
      if (!replyInputs[review._id]) {
        replyInputs[review._id] = { businessRep: "", comment: "" };
      }
      if (!updateStatus[review._id]) {
        updateStatus[review._id] = "";
      }
      if (!toggleStates[review._id]) {
        toggleStates[review._id] = { edit: false, reply: false };
      }
    });
  } catch (error) {
    console.error("Error fetching reviews: ", error);
  } finally {
    isLoadingReviews.value = false;
  }
};

// When an item is selected, update state and fetch its reviews
const selectItem = (item) => {
  Object.assign(selectedItem, item);
  fetchReviews();
};

// Toggle functions for edit and reply sections (only one can be open at a time)
const toggleEdit = (id) => {
  if (!toggleStates[id]) toggleStates[id] = { edit: false, reply: false };
  if (!toggleStates[id].edit) {
    toggleStates[id].edit = true;
    toggleStates[id].reply = false;
  } else {
    toggleStates[id].edit = false;
  }
};

const toggleReply = (id) => {
  if (!toggleStates[id]) toggleStates[id] = { edit: false, reply: false };
  if (!toggleStates[id].reply) {
    toggleStates[id].reply = true;
    toggleStates[id].edit = false;
  } else {
    toggleStates[id].reply = false;
  }
};

// Update a review (assumes an API endpoint at /api/reviews/:id)
const updateReview = async (review) => {
  try {
    updateStatus[review._id] = "Updating...";
    await $fetch(`/api/reviews/${review._id}`, {
      method: "PUT",
      body: review,
    });
    updateStatus[review._id] = "Update successful";
    setTimeout(() => {
      updateStatus[review._id] = "";
    }, 3000);
  } catch (error) {
    console.error("Error updating review: ", error);
    updateStatus[review._id] = "Update failed";
    setTimeout(() => {
      updateStatus[review._id] = "";
    }, 3000);
  }
};

// Post a business reply for a review (assumes an API endpoint at /api/reviews/:id/business-replies)
const postBusinessReply = async (review) => {
  const reply = replyInputs[review._id];
  if (!reply.businessRep || !reply.comment) {
    alert("Please fill in both the name and reply comment.");
    return;
  }
  try {
    await $fetch(`/api/reviews/${review._id}/business-replies`, {
      method: "POST",
      body: reply,
    });
    alert("Business reply posted successfully");
    fetchReviews();
    replyInputs[review._id] = { businessRep: "", comment: "" };
  } catch (error) {
    console.error("Error posting business reply: ", error);
    alert("Error posting business reply: " + error.message);
  }
};

// Open delete modal for a review
const openDeleteModal = (review) => {
  reviewToDelete.value = review;
  showDeleteModal.value = true;
};

// Cancel deletion
const cancelDelete = () => {
  showDeleteModal.value = false;
  reviewToDelete.value = null;
};

// Confirm and delete review (assumes an API endpoint at /api/reviews/:id)
const confirmDeleteReview = async () => {
  if (!reviewToDelete.value) return;
  try {
    await $fetch(`/api/reviews/${reviewToDelete.value._id}`, {
      method: "DELETE",
    });
    alert("Review deleted successfully");
    showDeleteModal.value = false;
    reviewToDelete.value = null;
    fetchReviews();
  } catch (error) {
    console.error("Error deleting review: ", error);
    alert("Error deleting review: " + error.message);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

onMounted(() => {
  fetchItems();
});
</script>
  
  <style scoped>
/* Use Inter (or Roboto) with clear typography */
.wrapper,
body {
  font-family: "Inter", "Roboto", sans-serif;
  line-height: 1.6;
  background-color: #f9fafb;
  color: #333;
  font-size: 1rem;
  margin: 0;
  padding: 0;
}

.wrapper {
  padding: 20px;
}

.main-container {
  display: flex;
  gap: 20px;
}

/* Sidebar Styling */
.sidebar {
  flex: 0 0 250px;
  background: #fff;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
.breadcrumbs {
  font-size: 0.9rem;
  margin-bottom: 15px;
  color: #6b7280;
}
.breadcrumb-item {
  margin-right: 5px;
}
.breadcrumb-separator {
  margin-right: 5px;
}
.search-filters input,
.search-filters select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #e5e7eb;
  min-width: 200px;
}
.item-list {
  list-style: none;
  max-height: 400px;
  min-height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
  padding: 0;
}
.item-list li {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background 0.2s ease;
}
.item-list li:hover,
.item-list li.active {
  background-color: #f0f0f0;
}

/* Editor Styling */
.editor {
  flex: 1;
  background: #fff;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* Tab Header */
.tab-header {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}
.tab-header button {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.2s ease;
  min-width: 200px;
}
.tab-header button.active,
.tab-header button:hover {
  background-color: #f0f0f0;
  color: #2563eb;
  font-weight: 500;
}

/* Overall Rating */
.overall-rating {
  margin-bottom: 15px;
  text-align: center;
}

/* Review List & Card Styling */
.review-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 300px;
}
.review-card {
  position: relative;
  border-bottom: 1px solid black;
  padding: 20px;
  background: #fff;
}
.review-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #374151;
}
.review-header small {
  color: #6b7280;
}
.review-body {
  margin-top: 10px;
}
.toggle-buttons-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.toggle-button {
  flex: 1;
  max-width: 150px;
  padding: 8px 10px;
  border: 1px solid #2563eb;
  background-color: #fff;
  color: #2563eb;
  cursor: pointer;
  transition: background 0.2s ease;
}
.toggle-button:hover {
  background-color: #f0f0f0;
}
.toggle-button.active {
  background-color: #2563eb;
  color: #fff;
}
.review-edit,
.business-reply {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.review-edit input,
.review-edit textarea,
.business-reply input,
.business-reply textarea {
  padding: 10px;
  border: 1px solid #e5e7eb;
  min-width: 200px;
}
.review-edit button,
.business-reply button {
  background: #2563eb;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  min-width: 200px;
}
.review-edit button:hover,
.business-reply button:hover {
  background: #1d4ed8;
}
.update-status {
  font-size: 0.9rem;
  color: #16a34a;
}

/* Delete Button */
.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
  border: none;
  background: transparent;
  font-size: 1.4rem;
  color: red;
  cursor: pointer;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 20px;
  width: 300px;
  border-radius: 4px;
  text-align: center;
}
.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
.cancel-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.cancel-btn:hover {
  background: #1d4ed8;
}
.delete-btn {
  background: red;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.delete-btn:hover {
  background: darkred;
}

/* Spinner Styling */
.spinner-container {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 10px;
}
.spinner-text {
  font-size: 1rem;
}

/* Keyframes for spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Bulk Upload Styling */
textarea {
  width: 100%;
  height: 150px;
  padding: 10px;
  border: 1px solid #e5e7eb;
  margin-bottom: 10px;
}
</style>
  