<template>
  <div class="login-form-container full-width">
    <img src="/Graphics/HandWave.png" alt="Waving Hand" />
    <h2>Welcome Back to Nexgen Training Portal</h2>
    <form @submit.prevent="handleEmailLogin" class="login-form-content">
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
      <div class="forgot">
        <h3 @click="handleForgotPassword">Forgot Your Password?</h3>
      </div>
      <transition name="fade">
        <div v-if="loginError.general" class="error-message">
          {{ loginError.general }}
        </div>
      </transition>
    </form>
  </div>
</template>

<script setup>
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

const emit = defineEmits(["emailLogin", "back", "forgot-password"]);

const email = ref("");
const password = ref("");

const handleEmailLogin = () => {
  emit("emailLogin", { email: email.value, password: password.value });
  password.value = "";
};

const handleBackClick = () => {
  emit("back");
};

const handleForgotPassword = () => {
  emit("forgot-password");
};

const backArrowSrc = "/BackArrow.svg";

const isFormValid = computed(() => {
  return email.value && password.value;
});
</script>

<style scoped>
.login-form-container {
  /* padding: 1rem; */
  width: 100%;
}

img {
  height: 3rem;
  width: 3rem;
  margin-top: 3rem;
}

h2 {
  color: white;
  text-shadow: none;
  font-size: 1.6rem;
  margin-bottom: 2rem;
}

.full-width {
  width: 100%;
  /* position: absolute; */
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.login-form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-wrapper {
  position: relative;
  /* margin-bottom: 1rem; */
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
  /* border-color: #4caf50; */
  outline: none;
}

label {
  position: static;
  font-size: 1rem;
  pointer-events: none;
  width: 100%;
  text-align: left;
  color: white;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

/* Target the placeholder */
input::placeholder {
  color: #aaa; /* Change the color */
  font-size: 16px; /* Change the font size */
  opacity: 1; /* Ensure the opacity is 100% (default can be less) */
}

/* Target the placeholder in different input states (optional) */
input:focus::placeholder {
  color: #777; /* Change color when input is focused */
}

input:disabled::placeholder {
  color: #888; /* Placeholder style for disabled inputs */
}

.forgot h3 {
  color: #28a745;
  font-weight: bold;
  width: 100%;
  text-align: right;
  background: none;
  border: none;
  font-size: 1rem;
}

.forgot h3:hover {
  text-decoration: underline;
  cursor: pointer;
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

.error-message-enter-active,
.error-message-leave-active {
  opacity: 1;
}

.back-button {
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 2rem;
  left: 2rem;
  width: 24px;
  height: 24px;
  z-index: 10;
  transition: transform 0.3s;
}

.back-button:hover {
  transform: translateX(-2px);
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
