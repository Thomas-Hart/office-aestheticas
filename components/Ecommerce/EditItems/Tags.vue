<template>
  <div class="section">
    <h2>Tags</h2>
    <SubcomponentsDropdown
      label="Select Tags"
      :items="tagDescriptions"
      :selectedItems="selectedItem.tags"
      @update:selectedItems="onUpdateTags"
    />
  </div>
</template>

<script setup>
import { tagDescriptions } from "/utils/tagDescriptions.js";

const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

function onUpdateTags(tags) {
  const updatedItem = { ...props.selectedItem, tags };
  emit("updateItem", updatedItem);
}
</script>

<style scoped>
.section {
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
}

.dropdown-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  transition: background-color 0.3s, color 0.3s;
}

.dropdown-button:hover {
  background-color: #ff8210;
  color: white;
}
</style>
