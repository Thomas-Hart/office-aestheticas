<template>
  <div class="section action-buttons">
    <h2>Available Actions</h2>
    <button @click="addItem" class="action-button">Add Item</button>
    <button @click="updateItem" class="action-button">Update Item</button>
    <button @click="deleteItem" class="action-button">Delete Item</button>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  item: Object,
});

const emit = defineEmits(["add-item", "update-item", "delete-item"]);

function addItem() {
  emit("add-item");
}

function updateItem() {
  emit("update-item");
}

function deleteItem() {
  emit("delete-item");
}
</script>
  
<style scoped>
.action-buttons {
  text-align: center;
  display: flex;
  flex-direction: column;
  width: 100%;
}

h2 {
  margin-bottom: 1rem;
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

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

  