<template>
  <div class="comments-section">
    <h2>Comments</h2>
    <div v-if="comments.length" class="comments-list">
      <div
        v-for="(comment, index) in comments"
        :key="'comment-' + index"
        class="comment-item"
      >
        <div class="comment-header">
          <strong class="comment-name">{{ comment.name }}</strong>
          <span class="comment-date">({{ formattedDate(comment.date) }})</span>
        </div>
        <p class="comment-text">{{ comment.comment }}</p>
        <a
          v-if="comment.url"
          :href="formatUrl(comment.url)"
          target="_blank"
          rel="noopener noreferrer"
          class="comment-url"
        >
          Visit Website
        </a>
      </div>
    </div>
    <div v-else>
      <p class="no-comments">No comments yet. Be the first to comment!</p>
    </div>

    <!-- Add Comment Form -->
    <div class="add-comment-form">
      <h3>Leave a Comment</h3>
      <input
        type="text"
        v-model="newComment.name"
        placeholder="Your Name"
        class="input-field"
      />
      <textarea
        v-model="newComment.comment"
        placeholder="Your Comment"
        class="textarea-field"
      ></textarea>
      <input
        type="text"
        v-model="newComment.url"
        placeholder="Optional: Your Website URL"
        class="input-field"
      />
      <button class="cta-button" @click="submitComment">Submit Comment</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["addComment"]);

const newComment = ref({
  name: "",
  comment: "",
  url: "",
});

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formatUrl = (url) => {
  // Prepend http:// or https:// if not already included
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }
  return url;
};

const submitComment = () => {
  if (newComment.value.name && newComment.value.comment) {
    emit("addComment", { ...newComment.value });
    newComment.value = { name: "", comment: "", url: "" };
  } else {
    alert("Please enter your name and comment.");
  }
};
</script>

<style scoped>
.comments-section {
  margin-top: 3rem;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  /* max-width: 800px; */
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.comments-section h2 {
  font-family: "Poppins";
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.comments-list {
  margin-bottom: 2rem;
}

.comment-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-name {
  font-size: 1rem;
  color: #333;
  font-weight: bold;
}

.comment-date {
  font-size: 0.85rem;
  color: #777;
}

.comment-text {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1rem;
}

.comment-url {
  font-size: 0.9rem;
  color: #005ba0;
  text-decoration: underline;
}

.comment-url:hover {
  color: #01c5ee;
  text-decoration: none;
}

.no-comments {
  font-size: 1rem;
  color: #777;
}

.add-comment-form {
  margin-top: 2rem;
}

.add-comment-form h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.input-field,
.textarea-field {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.textarea-field {
  height: 150px;
  resize: none;
}

.cta-button {
  display: inline-block;
  background-color: #005ba0;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease-in-out;
  width: 10rem;
  text-align: center;
  cursor: pointer;
  border: none;
}

.cta-button:hover {
  background-color: #01c5ee;
}

@media (max-width: 480px) {
  .comments-section {
    padding: 1rem;
  }
}
</style>
