<template>
  <div class="section action-buttons">
    <h2>Available Actions</h2>
    <button @click="addBundle" class="action-button">Add Bundle</button>
    <button @click="updateBundle" class="action-button">Update Bundle</button>
    <button @click="deleteBundle" class="action-button">Delete Bundle</button>
  </div>
</template>
  
<script setup>
const props = defineProps({
  bundle: Object,
});

const emit = defineEmits(["add-bundle", "update-bundle", "delete-bundle"]);

function addBundle() {
  emit("add-bundle");
}

function updateBundle() {
  emit("update-bundle");
}

function deleteBundle() {
  emit("delete-bundle");
}
</script>
  
<style scoped>
.action-buttons {
  text-align: center;
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
