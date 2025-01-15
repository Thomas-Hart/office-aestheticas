<template>
  <div class="action-buttons">
    <h2>Available Actions</h2>
    <div class="button-container">
      <button @click="addOrder" class="action-button">
        <img src="/Graphics/EditPages/AddUser.svg" alt="Add Order" />
        Add Order
      </button>
      <button @click="deleteOrder" class="action-button">
        <img src="/Graphics/TrashBlue.svg" alt="Delete Order" />
        Delete Current Order
      </button>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  order: Object,
});

const emit = defineEmits(["add-order", "delete-order"]);

function addOrder() {
  emit("add-order");
}

function deleteOrder() {
  emit("delete-order");
}
</script>
  
  <style scoped>
.action-buttons {
  width: 300px;
  border-right: 1px solid #ddd;
  text-align: left;
  padding: 1rem 10px;
  margin-top: 5rem;
}

h2 {
  margin-bottom: 1rem;
  margin-left: 1rem;
  font-size: 1.2rem;
  color: #333;
  text-decoration: underline;
}

/* Container for left-aligning all buttons */
.button-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: bold;
  color: #0197b2;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.action-button:hover {
  background-color: white;
  color: color;
  box-shadow: 1px 1px 2px black;
}

.action-button img {
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
}

@media (max-width: 1160px) {
  .action-buttons {
    width: 100%;
    border-right: none;
    margin: 2rem 0;
  }
}
</style>
  