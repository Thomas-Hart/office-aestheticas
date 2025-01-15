<template>
  <div v-if="isItemOwner" class="business-reply-section">
    <textarea v-model="newReply" placeholder="Write a reply..."></textarea>
    <p v-if="error" class="error-message">{{ error }}</p>
    <SubcomponentsLoadingButton
      :isLoading="loading"
      text="Submit Reply"
      @click="submitReply"
      class="submit-button"
    />
  </div>
</template>
  
  <script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  review: {
    type: Object,
    required: true,
  },
  fetchReviews: {
    type: Function,
    required: true,
  },
  isItemOwner: {
    type: Boolean,
    required: true,
  },
});

const store = useUserStore();
const newReply = ref("");
const loading = ref(false);
const error = ref("");

async function submitReply() {
  if (newReply.value.trim()) {
    loading.value = true;
    error.value = "";
    try {
      await $fetch("/api/reviews", {
        method: "POST",
        body: {
          contractor: props.contractor._id,
          reviewId: props.review._id,
          businessRep: store.user.name,
          reply: newReply.value,
        },
      });
      newReply.value = "";
      // Fetch updated reviews to refresh the component state
      await props.fetchReviews();
    } catch (error) {
      console.error("Failed to submit reply:", error);
      error.value = "Failed to submit reply. Please try again.";
    } finally {
      loading.value = false;
    }
  } else {
    error.value = "Please enter a reply before submitting.";
  }
}
</script>
  
  <style scoped>
.business-reply-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.business-reply-section textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
  resize: vertical;
}

.business-reply-section .submit-button {
  align-self: flex-start;
  width: auto;
}

.error-message {
  color: red;
  font-size: 14px;
}
</style>
  