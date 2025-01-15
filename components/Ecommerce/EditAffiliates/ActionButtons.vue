<template>
  <div class="section action-buttons">
    <h2>Available Actions</h2>
    <button @click="addAffiliate" class="action-button">Add Affiliate</button>
    <button @click="updateAffiliate" class="action-button">
      Update Affiliate
    </button>
    <button @click="deleteAffiliate" class="action-button">
      Delete Affiliate
    </button>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  affiliate: Object,
});

const emit = defineEmits([
  "add-affiliate",
  "update-affiliate",
  "delete-affiliate",
]);

function addAffiliate() {
  emit("add-affiliate");
}

function updateAffiliate() {
  emit("update-affiliate");
}

function deleteAffiliate() {
  emit("delete-affiliate");
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
  