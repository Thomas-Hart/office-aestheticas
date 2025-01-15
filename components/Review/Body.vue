<template>
  <div>
    <p class="review-date">{{ formatDate(review.date) }}</p>
    <p class="review-comment">{{ review.comment }}</p>
    <p class="review-tags">
      <strong>Tags:</strong>
      {{ review.tags.map((tag) => tagDescriptions[tag]).join(", ") }}
    </p>

    <div v-if="review.updates[0]" class="latest-update-wrapper">
      <div class="update latest-update">
        <ReviewHeader
          :reviewerName="review.reviewer.name"
          :rating="review.updates[review.updates.length - 1].rating"
        />
        <p class="review-date">
          {{ formatDate(review.updates[review.updates.length - 1].date) }}
        </p>
        <p class="review-comment">
          {{ review.updates[review.updates.length - 1].comment }}
        </p>
        <div class="update-tag">Updated Review</div>
      </div>
    </div>

    <div v-if="review.updates.length > 1 || review.businessReplies.length">
      <button @click="toggleReplies" class="show-updates-button">
        {{ showReplies ? "Hide Replies" : "Show All Replies" }} ({{
          review.updates.length + review.businessReplies.length
        }})
      </button>
      <div
        ref="repliesContainer"
        :class="{ open: showReplies }"
        class="replies-container"
      >
        <div
          v-for="item in sortedUpdatesAndReplies(review)"
          :key="item._id"
          class="update"
          :class="{
            'business-reply': item.isBusinessReply,
            pro: item.isBusinessReply && isPro,
            'latest-update':
              review.updates.length &&
              item._id === review.updates[review.updates.length - 1]._id &&
              !item.isBusinessReply,
          }"
        >
          <ReviewHeader
            :reviewerName="
              item.isBusinessReply
                ? getBusinessName(item.businessRep)
                : review.reviewer.name
            "
            :rating="item.rating"
          />
          <p class="review-date">{{ formatDate(item.date) }}</p>
          <p class="review-comment">{{ item.comment }}</p>
          <div v-if="item.isBusinessReply && isPro" class="update-tag">
            <img
              src="/GoldenCheck.webp"
              alt="Verified Pro"
              class="verified-tag"
            />
          </div>
          <div
            v-if="
              review.updates.length &&
              item._id === review.updates[review.updates.length - 1]._id &&
              !item.isBusinessReply
            "
            class="update-tag"
          >
            Updated Review
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
  tagDescriptions: {
    type: Object,
    required: true,
  },
  isPro: {
    type: Boolean,
    required: true,
  },
  item: {
    type:
  }
});

const showReplies = ref(false);
const repliesContainer = ref(null);

function toggleReplies() {
  if (showReplies.value) {
    repliesContainer.value.style.maxHeight = "0";
  } else {
    repliesContainer.value.style.maxHeight = "100rem";
  }
  showReplies.value = !showReplies.value;
}

function sortedUpdatesAndReplies(review) {
  const updates = review.updates.map((update) => ({
    ...update,
    isBusinessReply: false,
  }));
  const replies = review.businessReplies.map((reply) => ({
    ...reply,
    isBusinessReply: true,
  }));
  return [...updates, ...replies].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

function getBusinessName(businessRep) {
  return props.isPro ? props.review.itemName : `${businessRep} (Owner)`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}
</script>

<style scoped>
.review-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.review-comment,
.review-tags {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.latest-update-wrapper {
  transition: max-height 1s ease;
  max-height: 100rem;
  overflow: hidden;
}

.latest-update {
  background-color: #f0f8ff;
  border-left: 4px solid #007bff;
  padding: 10px;
  margin-left: 0;
  border-radius: 8px;
}

.update.business-reply {
  border-left: 4px solid #a3a3a3;
  padding-left: 20px;
  margin-bottom: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.update.business-reply.pro {
  border-left: 4px solid #ffd700;
  background: #fff8dc;
}

.show-updates-button {
  background: none;
  color: #007bff;
  padding: 0;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  display: inline-block;
}

.show-updates-button:hover {
  text-decoration: underline;
}

.replies-container {
  margin-top: 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 1s ease;
}

.replies-container.open {
  max-height: 1000px; /* Arbitrary large value to ensure full expansion */
}

.verified-tag {
  margin-left: 10px;
  margin-bottom: 3px;
  width: 20px;
  height: 20px;
}

.update-tag {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
  white-space: nowrap;
}
</style>
