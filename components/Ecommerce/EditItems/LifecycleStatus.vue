<template>
  <div class="section">
    <h2>Lifecycle Status</h2>
    <div class="input-wrapper">
      <select
        v-model="selectedItem.lifecycleStatus"
        @change="emitUpdate"
        class="dropdown-button"
      >
        <option value="Active">Active</option>
        <option value="Discontinued">Discontinued</option>
        <option value="Coming Soon">Coming Soon</option>
      </select>
      <label>Lifecycle Status</label>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  selectedItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["updateItem"]);

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

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.dropdown-button {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.dropdown-button:focus {
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

.dropdown-button:focus + label,
.dropdown-button:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 0.85rem;
  color: #4caf50;
}
</style>
  