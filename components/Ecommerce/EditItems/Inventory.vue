<template>
  <div class="section">
    <h2>Inventory Information</h2>
    <div class="input-wrapper">
      <input
        type="number"
        :value="selectedItem.stock"
        @input="onStockChange($event.target.value)"
        placeholder=" "
      />
      <label>Stock</label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

function onStockChange(newStock) {
  const updatedItem = { ...props.selectedItem, stock: parseInt(newStock, 10) };
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

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-wrapper input[type="number"] {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-wrapper input[type="number"]:focus {
  border-color: #4caf50;
  outline: none;
}

.input-wrapper label {
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

.input-wrapper input:focus + label,
.input-wrapper input:not(:placeholder-shown) + label {
  top: -10px;
  left: 5px;
  font-size: 0.85rem;
  color: #4caf50;
}
</style>
