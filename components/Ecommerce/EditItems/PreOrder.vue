<template>
  <div class="section">
    <h2>Pre-Order</h2>
    <div class="checkbox-wrapper">
      <input
        type="checkbox"
        v-model="selectedItem.preOrder.available"
        id="availableForPreOrder"
      />
      <label for="availableForPreOrder">Available for Pre-Order</label>
    </div>
    <div class="input-wrapper">
      <input
        type="date"
        v-model="formattedDate"
        placeholder=" "
        @change="onDateChange"
      />
      <label>Estimated Shipping Date</label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  selectedItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["updateItem"]);

// Format the date from ISO to yyyy-MM-dd
const formattedDate = computed({
  get() {
    return props.selectedItem.preOrder.estimatedShippingDate
      ? new Date(props.selectedItem.preOrder.estimatedShippingDate)
          .toISOString()
          .substr(0, 10)
      : "";
  },
  set(value) {
    const updatedDate = value ? new Date(value).toISOString() : "";
    props.selectedItem.preOrder.estimatedShippingDate = updatedDate;
    emitUpdate();
  },
});

function onDateChange() {
  emitUpdate();
}

function emitUpdate() {
  emit("updateItem", { ...props.selectedItem });
}
</script>

<style scoped>
.section {
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
}

.checkbox-wrapper {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.checkbox-wrapper input[type="checkbox"] {
  margin-right: 10px;
}

.checkbox-wrapper label {
  margin: 0;
  padding: 0;
  font-size: 1rem;
  color: #666;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-wrapper input[type="date"] {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-wrapper input[type="date"]:focus {
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
  left: 10px;
  font-size: 0.85rem;
  color: #4caf50;
}
</style>
