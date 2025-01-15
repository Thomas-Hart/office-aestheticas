<template>
  <div class="section">
    <h2>Frequently Bought Together</h2>
    <div
      v-for="(itemId, index) in selectedItem.frequentlyBoughtTogether"
      :key="index"
      class="input-wrapper"
    >
      <div class="input-group">
        <select
          v-model="selectedItem.frequentlyBoughtTogether[index]"
          @change="onItemIdChange"
          class="dropdown-button"
        >
          <option disabled value="">Select an item</option>
          <option
            v-for="item in availableItems(index)"
            :key="item._id"
            :value="item._id"
          >
            {{ item.name }}
          </option>
        </select>
        <label>Item</label>
      </div>
      <button @click="removeItem(index)" class="remove-button">
        Remove Item
      </button>
    </div>
    <button @click="addItem" class="action-button">Add Item</button>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedItem: {
    type: Object,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["updateItem"]);

// Filter items that are not already in the frequently bought together list and exclude the current selected item
function availableItems(index) {
  const selectedIds = props.selectedItem.frequentlyBoughtTogether
    .map((product, i) => (i !== index ? product : null))
    .filter((id) => id !== null);

  return props.items.filter(
    (item) =>
      (!selectedIds.includes(item._id) ||
        item._id === props.selectedItem.frequentlyBoughtTogether[index]) &&
      item._id !== props.selectedItem._id
  );
}

// Function to handle item selection
function onItemIdChange() {
  emit("updateItem", {
    ...props.selectedItem,
    frequentlyBoughtTogether: [...props.selectedItem.frequentlyBoughtTogether],
  });
}

// Function to add a new item to the list
function addItem() {
  const updatedItems = [...props.selectedItem.frequentlyBoughtTogether, ""];
  emit("updateItem", {
    ...props.selectedItem,
    frequentlyBoughtTogether: updatedItems,
  });
}

// Function to remove an item from the list
function removeItem(index) {
  const updatedItems = [...props.selectedItem.frequentlyBoughtTogether];
  updatedItems.splice(index, 1);
  emit("updateItem", {
    ...props.selectedItem,
    frequentlyBoughtTogether: updatedItems,
  });
}
</script>

<style scoped>
.section {
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
}

.input-wrapper {
  margin-bottom: 1.5rem;
}

.input-group {
  position: relative;
  margin-bottom: 1rem;
}

.input-group input[type="text"],
.input-group input[type="number"],
.dropdown-button {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  margin-bottom: 0.5rem;
}

.input-group input[type="text"]:focus,
.input-group input[type="number"]:focus,
.dropdown-button:focus {
  border-color: #4caf50;
  outline: none;
}

.input-group label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  background: #fff;
  padding: 0 5px;
  color: #999;
  pointer-events: none;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label,
.dropdown-button:focus + label,
.dropdown-button:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 0.85rem;
  color: #4caf50;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  width: 100%;
}

.remove-button:hover {
  background-color: #c0392b;
}

.action-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  margin-bottom: 1rem;
  width: 100%;
  transition: background-color 0.3s, color 0.3s;
}

.action-button:hover {
  background-color: #ff8210;
  color: white;
}
</style>
