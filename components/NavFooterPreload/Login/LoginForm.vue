<template>
  <div class="login-modal-container">
    <h2>Login</h2>
    <form @submit.prevent="handleEmailLogin" class="login-form-content">
      <div class="input-wrapper">
        <input
          v-model="email"
          type="email"
          placeholder=" "
          required
          class="input"
        />
        <label>Email</label>
      </div>
      <NavFooterPreloadLoginPasswordInput
        v-model="password"
        placeholder="Password"
      />
      <SubcomponentsLoadingButton
        :isLoading="isLoading"
        :disabled="!isFormValid"
        @click="handleEmailLogin"
        text="Login"
      />
      <transition name="fade">
        <div v-if="loginError.general" class="error-message">
          {{ loginError.general }}
        </div>
      </transition>
    </form>
    <!-- Google Sign-In Button -->
    <div class="alternative-methods">
      <GoogleSignInButton
        @success="handleGoogleLogin"
        @error="handleLoginError"
        :client-id="config.public.GOOGLE_CLIENT_ID"
      ></GoogleSignInButton>
    </div>
    <button @click="goToSignUp" class="switch-button">
      Don't have an account? Sign Up
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { GoogleSignInButton } from "vue3-google-signin";

const config = useRuntimeConfig();

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  loginError: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["emailLogin", "googleLogin", "loginError", "signUp"]);

const email = ref("");
const password = ref("");

const handleEmailLogin = () => {
  emit("emailLogin", { email: email.value, password: password.value });
  password.value = "";
};

const handleGoogleLogin = (response) => {
  emit("googleLogin", response);
};

const handleLoginError = (error) => {
  emit("loginError", error);
};

const goToSignUp = () => {
  emit("signUp");
};

const isFormValid = computed(() => {
  return email.value && password.value;
});
</script>

<style scoped>
.login-modal-container {
  padding: 0.5rem 2rem;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  color: black;
  margin-bottom: 1.5rem;
}

.login-form-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
  color: black;
  width: 100%;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  font-size: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input:focus {
  border-color: #4caf50;
  outline: none;
}

label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: black;
  text-shadow: none;
  font-size: 1rem;
  transition: all 0.2s ease;
  pointer-events: none;
}

.input:not(:placeholder-shown) + label,
.input:focus + label {
  top: -10px;
  left: 5px;
  font-size: 1rem;
  color: white;
  text-shadow: 2px 2px 0px black;
}

.error-message {
  color: white;
  background-color: red;
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 0.5rem;
  text-align: center;
  width: 100%;
  opacity: 1;
  transition: opacity 0.3s ease;
  font-weight: bold;
}

.alternative-methods {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.switch-button {
  margin-top: 1.5rem;
  background: none;
  border: none;
  color: #ff8000;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bolder;
}

.switch-button:hover {
  color: white;
}
</style>
