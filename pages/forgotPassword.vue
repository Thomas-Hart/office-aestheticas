<template>
  <div class="forgot-password-container full-width">
    <!-- Wrapper for the back arrow in the top-left corner -->
    <div class="back-arrow-wrapper">
      <img
        @click="handleBackClick"
        src="/Graphics/leftArrowWhite.webp"
        alt="Back"
        class="back-arrow"
      />
    </div>

    <!-- Main Content (Form, Images, etc.) -->
    <div class="forgot-password-content">
      <img src="/Graphics/HandWave.png" alt="Waving Hand" />
      <h2>Reset Your Password</h2>
      <form @submit.prevent="handleForgotPassword" class="forgot-password-form">
        <div class="input-wrapper">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Example@email.com"
            required
            class="input"
          />
        </div>
        <SubcomponentsLoadingButton
          :isLoading="isLoading"
          :disabled="!isFormValid"
          @click="handleForgotPassword"
          text="Send Recovery Email"
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
import { ref, computed } from "vue";

const email = ref("");
const message = ref("");
const isLoading = ref(false);
const messageType = ref(""); // 'success' or 'error'

const emit = defineEmits(["back"]);

const isFormValid = computed(() => {
  return email.value !== "";
});

const handleBackClick = () => {
  emit("back");
};

const handleForgotPassword = async () => {
  isLoading.value = true;
  message.value = ""; // Clear previous message

  try {
    const response = await $fetch(`/api/users`);
    const user = response.find((user) => user.email === email.value);
    if (user) {
      await sendResetEmail(user._id);
      message.value = "Recovery email sent successfully!";
      messageType.value = "success";
    } else {
      message.value = "No user found with that email.";
      messageType.value = "error";
    }
  } catch (e) {
    console.error("Failed to fetch user data:", e);
    message.value = "Failed to send recovery email. Please try again.";
    messageType.value = "error";
  } finally {
    isLoading.value = false;
  }
};

const sendResetEmail = async (userId) => {
  try {
    const response = await fetch(
      "https://us-west3-national-auto-hub.cloudfunctions.net/forgotPasswordEmail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email.value,
          from: "beau@nationalautohub.com",
          link: "https://www.nationalautohub.com/reset?target=" + userId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.log("Error in sendResetEmail:", error.message);
    throw error;
  }
};
</script>
  

<style scoped>
.forgot-password-container {
  width: 100%;
  position: relative;
}

/* Wrapper for the back arrow to position it separately */
.back-arrow-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.back-arrow {
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.back-arrow:hover {
  transform: scale(1.1);
}

/* Keep the main content and form styles as before */
.forgot-password-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* margin-top: 3rem; */
}

.forgot-password-content img {
  margin-top: 3rem;
}

img {
  height: 3rem;
  width: 3rem;
  margin-top: 1rem;
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

.forgot-password-form {
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



  