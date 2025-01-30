<template>
  <div class="section">
    <h2>Return Policy</h2>
    <div class="checkbox-wrapper">
      <input
        type="checkbox"
        v-model="localSelectedItem.returnPolicy.isReturnable"
        id="isReturnable"
        @change="emitUpdate"
      />
      <label for="isReturnable">Is Returnable</label>
    </div>
    <div class="input-wrapper">
      <input
        type="number"
        v-model="localSelectedItem.returnPolicy.returnPeriod"
        placeholder=" "
        @input="emitUpdate"
      />
      <label>Return Period (days)</label>
    </div>
    <div class="input-wrapper">
      <input
        type="number"
        v-model="localSelectedItem.returnPolicy.restockingFeePercentage"
        placeholder=" "
        @input="emitUpdate"
      />
      <label>Restocking Fee (%)</label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

const localSelectedItem = ref({ ...props.selectedItem });

// Emit the updated selected item back to the parent
function emitUpdate() {
  emit("updateItem", { ...localSelectedItem.value });
}

// Keep localSelectedItem in sync with props.selectedItem
watch(
  () => props.selectedItem,
  (newVal) => {
    localSelectedItem.value = { ...newVal };
  },
  { deep: true }
);
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
  left: 10px;
  font-size: 0.85rem;
  color: #4caf50;
}
</style>
