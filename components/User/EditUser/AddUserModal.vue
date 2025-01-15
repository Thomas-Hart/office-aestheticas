<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>Add New User</h3>
      <label for="name">Name</label>
      <input v-model="newUser.name" id="name" type="text" placeholder="Name" />

      <label for="email">Email</label>
      <input
        v-model="newUser.email"
        id="email"
        type="email"
        placeholder="Email"
      />

      <label for="password">Password</label>
      <input
        v-model="newUser.password"
        id="password"
        type="password"
        placeholder="Password"
      />

      <label for="confirmPassword">Confirm Password</label>
      <input
        v-model="newUser.confirmPassword"
        id="confirmPassword"
        type="password"
        placeholder="Confirm Password"
      />

      <div class="modal-buttons">
        <button class="modal-cancel-button" @click="closeModal">Cancel</button>
        <button class="modal-add-button" @click="confirmAddUser">
          Add User
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(["close", "add-user"]);

const newUser = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Close the modal
function closeModal() {
  emit("close");
  resetNewUserFields();
}

// Reset new user fields
function resetNewUserFields() {
  newUser.value = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
}

// Confirm and add the new user
function confirmAddUser() {
  if (newUser.value.password !== newUser.value.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  emit("add-user", {
    name: newUser.value.name,
    email: newUser.value.email,
    password: newUser.value.password,
  });
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

.modal-content label {
  display: block;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
  text-align: left;
}

.modal-content input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.modal-add-button {
  background-color: #007bff;
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

.modal-add-button:hover {
  background-color: #0056b3;
}

.modal-cancel-button:hover {
  background-color: #5a6268;
}
</style>
