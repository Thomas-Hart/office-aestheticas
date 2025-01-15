<template>
  <div class="section">
    <div class="section-header" @click="toggleCollapse" @mousedown.prevent>
      <h2>Recently Viewed Items</h2>
      <span :class="['collapse-icon', isCollapsed ? 'collapsed' : 'expanded']">
        ▼
      </span>
    </div>

    <div
      ref="content"
      :style="{ maxHeight: isCollapsed ? '0px' : contentHeight }"
      class="content"
    >
      <div
        v-if="selectedUser.recentlyViewedItems.length > 0"
        class="recently-viewed-items"
      >
        <div
          v-for="(item, index) in selectedUser.recentlyViewedItems"
          :key="index"
          class="recently-viewed-item"
        >
          <div class="input-group">
            <label>Item ID</label>
            <input
              type="text"
              :value="item"
              @input="onRecentlyViewedItemChange(index, $event.target.value)"
              placeholder="Item ID"
            />
          </div>
          <button
            @click="removeRecentlyViewedItem(index)"
            class="delete-button"
          >
            <img src="/Graphics/TrashBlue.svg" alt="Remove" />
          </button>
        </div>
      </div>
      <button @click="addNewRecentlyViewedItem" class="add-button">
        Add New Item
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";

const props = defineProps({
  selectedUser: Object,
});

const emit = defineEmits(["updateUser"]);

const isCollapsed = ref(true);
const contentHeight = ref("0px");
const content = ref(null);

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  adjustContentHeight();
}

function adjustContentHeight() {
  nextTick(() => {
    contentHeight.value = isCollapsed.value
      ? "0px"
      : `${content.value.scrollHeight}px`;
  });
}

onMounted(() => {
  adjustContentHeight();
});

function onRecentlyViewedItemChange(index, value) {
  const updatedRecentlyViewed = [...props.selectedUser.recentlyViewedItems];
  updatedRecentlyViewed[index] = value;
  const updatedUser = {
    ...props.selectedUser,
    recentlyViewedItems: updatedRecentlyViewed,
  };
  emit("updateUser", updatedUser);
  adjustContentHeight(); // Adjust height after updating an item
}

function addNewRecentlyViewedItem() {
  const updatedRecentlyViewed = [...props.selectedUser.recentlyViewedItems, ""];
  const updatedUser = {
    ...props.selectedUser,
    recentlyViewedItems: updatedRecentlyViewed,
  };
  emit("updateUser", updatedUser);
  adjustContentHeight(); // Adjust height after adding a new item
}

function removeRecentlyViewedItem(index) {
  const updatedRecentlyViewed = [...props.selectedUser.recentlyViewedItems];
  updatedRecentlyViewed.splice(index, 1);
  const updatedUser = {
    ...props.selectedUser,
    recentlyViewedItems: updatedRecentlyViewed,
  };
  emit("updateUser", updatedUser);
  adjustContentHeight(); // Adjust height after removing an item
}
</script>

<style scoped>
.section {
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  user-select: none;
  outline: none;
}

.section-header h2,
.section-header .collapse-icon {
  user-select: none;
  outline: none;
}

.collapse-icon {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.collapsed {
  transform: rotate(-90deg);
}

h2 {
  font-size: 1.4rem;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.content {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s ease;
}

.recently-viewed-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.recently-viewed-item {
  display: grid;
  grid-template-columns: 1fr auto;
  max-width: 400px;
  gap: 0.5rem;
  padding: 0.8rem;
  background: rgba(240, 240, 240, 1); /* Light gray background */
  border: 1px solid #ddd;
  border-radius: 6px;
  align-items: center;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-size: 0.8rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.input-group input[type="text"] {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: all 0.3s ease;
  width: 100%;
}

.input-group input:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
}

.add-button {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  border: none;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
  margin: 1rem;
  border-radius: 6px;
}

.add-button:hover {
  background-color: #357abd;
}

.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  transition: transform 0.2s ease;
}

.delete-button img {
  width: 1.2rem;
  height: 1.2rem;
}

.delete-button:hover {
  transform: scale(1.1);
}

/* Responsive adjustments for screens 830px or smaller */
@media (max-width: 830px) {
  .section-header h2 {
    font-size: 1.2rem;
  }

  .recently-viewed-item {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .delete-button {
    align-self: flex-end;
    margin-top: 0.5rem;
  }

  .input-group input[type="text"] {
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
  }

  .add-button {
    width: 100%;
    max-width: 200px;
  }
}
</style>
