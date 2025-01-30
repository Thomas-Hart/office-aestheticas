<template>
  <div class="change-password-container full-width">
    <!-- Main Content (Form, Images, etc.) -->
    <div class="change-password-content">
      <img src="/Graphics/EditPencil.svg" alt="Lock Icon" />
      <h2>Reset Your Password</h2>
      <form @submit.prevent="handleChangePassword" class="change-password-form">
        <div class="input-wrapper">
          <label>New Password</label>
          <input
            v-model="newPassword"
            type="password"
            placeholder="Enter your new password"
            required
            class="input"
          />
        </div>

        <div class="input-wrapper">
          <label>Confirm New Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            required
            class="input"
          />
        </div>

        <SubcomponentsLoadingButton
          :isLoading="isLoading"
          :disabled="!isFormValid"
          @click="handleChangePassword"
          text="Change Password"
        />

        <transition name="fade">
          <div
            v-if="message.length > 0"
            :class="
              messageType === 'success' ? 'success-message' : 'error-message'
            "
          >
            {{ message }}
          </div>
        </transition>
      </form>
    </div>
  </div>
</template>
  
<script setup>
const newPassword = ref("");
const confirmPassword = ref("");
const message = ref("");
const isLoading = ref(false);
const messageType = ref("");

const route = useRoute(); // Use to access the route
const userStore = useUserStore(); // Assuming you have a user store to manage user data

const userId = route.query.target; // Extract the 'target' parameter (userId) from the URL

// Use useFetch to retrieve the user data based on the userId parameter
const { data: userResponse, error: fetchError } = await useFetch(() =>
  userId ? `/api/users/${userId}` : null
);

if (fetchError.value) {
  console.error("Failed to fetch user:", fetchError.value);
  message.value = "Failed to retrieve user data.";
  messageType.value = "error";
} else if (userResponse.value) {
  userStore.setUser(userResponse.value); // Set the user in the store
} else {
  message.value = "Invalid or missing user ID.";
  messageType.value = "error";
}

// Validate if the form is valid
const isFormValid = computed(() => {
  return newPassword.value !== "" && confirmPassword.value !== "";
});

// Handle password change logic
const handleChangePassword = async () => {
  isLoading.value = true;
  message.value = ""; // Clear previous message

  if (newPassword.value !== confirmPassword.value) {
    message.value = "New passwords do not match.";
    messageType.value = "error";
    isLoading.value = false;
    return;
  }

  try {
    // Send the new password along with the userId to update the user's password
    const response = await $fetch(`/api/users/${userId}`, {
      method: "PUT",
      body: { password: newPassword.value },
    });

    if (response) {
      message.value = "Password changed successfully!";
      messageType.value = "success";
    } else {
      message.value = "Failed to change the password.";
      messageType.value = "error";
    }
  } catch (e) {
    console.error("Failed to change password:", e);
    message.value = "An error occurred while changing your password.";
    messageType.value = "error";
  } finally {
    isLoading.value = false;
  }
};
</script>

  
  <style scoped>
/* Styling similar to previous component */
.change-password-container {
  width: 100%;
  position: relative;
  background: black;
  width: 100%;
  height: 100vh;
  padding: 0 1rem;
}

.change-password-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.change-password-content img {
  margin-top: 3rem;
}

img {
  height: 3rem;
  width: 3rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

h2 {
  color: white;
  text-shadow: none;
  font-size: 1.6rem;
  margin-bottom: 2rem;
}

.full-width {
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.change-password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%; /* Ensure form inputs take full width */
  max-width: 400px; /* Set a max width to maintain the form's original size */
}

.input-wrapper {
  position: relative;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #0197b2;
  background: white;
  border-radius: 10px;
  font-size: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 3.2rem;
  color: black;
}

.input:focus {
  outline: none;
}

label {
  font-size: 1rem;
  pointer-events: none;
  width: 100%;
  text-align: left;
  color: white;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

/* Placeholder Styles */
input::placeholder {
  color: #aaa;
  font-size: 16px;
}

input:focus::placeholder {
  color: #777;
}

.success-message {
  color: white;
  background-color: green;
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 0.5rem;
  text-align: center;
  width: 100%;
  border-radius: 5px;
  opacity: 1;
  transition: opacity 0.3s ease;
  font-weight: bold;
}

.error-message {
  color: white;
  background-color: red;
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 0.5rem;
  text-align: center;
  width: 100%;
  border-radius: 5px;
  opacity: 1;
  transition: opacity 0.3s ease;
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
  