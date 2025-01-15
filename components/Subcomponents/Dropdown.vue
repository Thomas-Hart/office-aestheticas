<template>
  <div class="dropdown" ref="dropdown">
    <button @click="toggleDropdown" class="dropdown-button">
      {{ selectedItemsText }}
    </button>
    <div v-if="showDropdown" class="dropdown-menu">
      <button class="close-button" @click="closeDropdown">×</button>
      <div
        v-for="(description, key) in items"
        :key="key"
        class="dropdown-item"
        :class="{ selected: selectedItems.includes(key) }"
        @click="toggleItem(key)"
      >
        <input
          type="checkbox"
          :id="key"
          :value="key"
          :checked="selectedItems.includes(key)"
          @change="updateSelectedItems(key)"
          class="hidden-checkbox"
        />
        <label :for="key">{{ description }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  items: Object,
  selectedItems: Array,
  label: String,
});

const emit = defineEmits(["update:selectedItems"]);

const dropdown = ref(null);
const showDropdown = ref(false);

const selectedItemsText = computed(() => {
  if (props.selectedItems.length === 0) return props.label;
  return props.selectedItems.map((key) => props.items[key]).join(", ");
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const updateSelectedItems = (item) => {
  const newItems = props.selectedItems.includes(item)
    ? props.selectedItems.filter((i) => i !== item)
    : [...props.selectedItems, item];
  emit("update:selectedItems", newItems);
};

const toggleItem = (item) => {
  updateSelectedItems(item);
};

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.dropdown {
  position: relative;
  width: 100%;
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
}

.dropdown-button::after {
  content: "▼";
  font-size: 12px;
  margin-left: 10px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid #ccc;
  border-radius: 10px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px 25px 10px 10px;
}

.hidden-checkbox {
  display: none;
}

.dropdown-menu input {
  margin-right: 0.5rem;
}

.dropdown-item {
  flex: 1 0 30%; /* Adjusted to have 3 columns */
  margin: 5px;
  color: white;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background 0.3s;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background: #555;
}

.dropdown-item.selected {
  background: #ff8210;
  border-color: #ff8210;
  box-shadow: inset 0 0 5px black;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
}

label {
  cursor: pointer;
}
</style>
