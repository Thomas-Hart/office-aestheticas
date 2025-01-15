<template>
  <div class="post-header" v-if="author && date">
    <div class="author-info">
      <img
        v-if="author.image"
        :src="`/${author.image}`"
        alt="Author Image"
        class="author-image"
      />
      <div class="author-details">
        <p class="header">
          Authored by
          <span>{{ author.name }}</span
          >,
          <span>{{ formattedDate(date) }}</span>
        </p>
        <p class="bio">{{ author.bio }}</p>
      </div>
    </div>
    <div class="views">
      <img src="/ViewCountEye.svg" alt="Views Icon" class="views-icon" />
      <span>{{ formattedViews }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  author: {
    type: Object,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
});

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formattedViews = computed(() => {
  return props.views ? formatNumberWithCommas(props.views) : "0";
});

const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<style scoped>
.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-image {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-right: 1rem;
}

.author-details {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.header {
  color: #555;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5em;
  font-style: italic;
}

.bio {
  color: #777;
  font-size: 1rem;
  font-style: italic;
}

.views {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.views-icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
