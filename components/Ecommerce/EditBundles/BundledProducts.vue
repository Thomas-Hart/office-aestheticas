<template>
  <div class="section">
    <h2>Bundled Products</h2>
    <div
      v-for="(product, index) in selectedBundle.items"
      :key="index"
      class="input-wrapper"
    >
      <div class="input-group">
        <select
          v-model="selectedBundle.items[index].itemId"
          @change="onProductIdChange(index)"
          class="dropdown-button"
        >
          <option disabled value="">Select Item</option>
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
      <div class="input-group">
        <input
          type="number"
          v-model="product.quantity"
          placeholder=" "
          @input="onQuantityChange(index, $event.target.value)"
        />
        <label>Quantity</label>
      </div>
      <button @click="removeProduct(index)" class="remove-button">
        Remove Product
      </button>
    </div>
    <button @click="addProduct" class="action-button">
      Add Bundled Product
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  selectedBundle: Object,
  items: Array,
});

const emit = defineEmits(["updateBundle"]);

// Compute available items for a specific dropdown, allowing the selected item in that dropdown to remain visible
function availableItems(index) {
  const selectedIds = props.selectedBundle.items
    .map((product, i) => (i !== index ? product.itemId : null))
    .filter((id) => id !== null);

  return props.items.filter(
    (item) =>
      !selectedIds.includes(item._id) ||
      item._id === props.selectedBundle.items[index].itemId
  );
}

function onProductIdChange(index) {
  emit("updateBundle", {
    ...props.selectedBundle,
    items: [...props.selectedBundle.items],
  });
}

function onQuantityChange(index, newQuantity) {
  props.selectedBundle.items[index].quantity = newQuantity;
  emit("updateBundle", {
    ...props.selectedBundle,
    items: [...props.selectedBundle.items],
  });
}

function addProduct() {
  // console.log("props.selectedBundle.items: " + props.selectedBundle.items);
  // console.log("props.selectedBundle: " + JSON.stringify(props.selectedBundle));
  const newProduct = { itemId: "", quantity: 1 };
  const updatedItems = [...props.selectedBundle.items, newProduct];
  emit("updateBundle", {
    ...props.selectedBundle,
    items: updatedItems,
  });
}

function removeProduct(index) {
  const updatedItems = [...props.selectedBundle.items];
  updatedItems.splice(index, 1);
  emit("updateBundle", {
    ...props.selectedBundle,
    items: updatedItems,
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
