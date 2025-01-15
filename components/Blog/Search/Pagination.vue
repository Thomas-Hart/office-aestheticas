<template>
  <div class="pagination">
    <button
      v-for="page in totalPages"
      :key="page"
      @click="goToPage(page)"
      :class="{ active: page === currentPage }"
    >
      {{ page }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  totalPages: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:page"]);
const goToPage = (page) => {
  emit("update:page", page);
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button.active {
  background-color: #0056b3;
}

.pagination button:hover:not(.active) {
  background-color: #0056b3;
}
</style>
