<template>
  <div class="filters sticky-filters">
    <h3>Filter by</h3>

    <label for="tag-filter">Topic</label>
    <select id="tag-filter" :value="selectedTag" @change="onTagChange($event)">
      <option value="">All Tags</option>
      <option v-for="tag in allTags" :key="tag" :value="tag">
        {{ tag }}
      </option>
    </select>

    <label for="sort-filter">Sorting</label>
    <select id="sort-filter" :value="sortOption" @change="onSortChange($event)">
      <option value="alphabetical">Alphabetical</option>
      <option value="reverse-alphabetical">Reverse Alphabetical</option>
      <option value="most-recent">Most Recent</option>
      <option value="oldest-first">Oldest First</option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  allTags: {
    type: Array,
    required: true,
  },
  selectedTag: {
    type: String,
    required: true,
  },
  sortOption: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:tag", "update:sort"]);

const onTagChange = (event) => {
  emit("update:tag", event.target.value);
};

const onSortChange = (event) => {
  emit("update:sort", event.target.value);
};
</script>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
}

.filters label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.filters select {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 1.5rem;
  width: 100%;
}

.sticky-filters {
  position: sticky;
  top: 1rem;
}

h3 {
  margin-bottom: 2rem;
}
</style>
