<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>Confirm Deletion</h3>
      <p>Are you sure you want to delete this user?</p>
      <div class="modal-buttons">
        <button class="modal-cancel-button" @click="closeModal">Cancel</button>
        <button class="modal-delete-button" @click="confirmDeleteUser">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(["close", "delete-user"]);

// Close the modal
function closeModal() {
  emit("close");
}

// Confirm and delete the user
function confirmDeleteUser() {
  emit("delete-user");
  closeModal();
}
</script>
  
  <style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 0 1rem;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: #333;
}

.modal-content p {
  margin-bottom: 1.5rem;
  color: #555;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-delete-button {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-cancel-button {
  background-color: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-delete-button:hover {
  background-color: #c82333;
}

.modal-cancel-button:hover {
  background-color: #5a6268;
}
</style>
  