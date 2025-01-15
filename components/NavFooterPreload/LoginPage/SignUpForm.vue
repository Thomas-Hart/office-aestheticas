<template>
  <div class="form-container">
    <img src="/Graphics/Lightning.svg" alt="Sign Up Graphic" />
    <h2>Sign Up and Watch Your Sales Skills Grow</h2>
    <form @submit.prevent="handleSignUp" class="sign-up-form-content">
      <div class="input-wrapper">
        <label>Name</label>
        <input
          v-model="signUpName"
          type="text"
          placeholder="John Doe"
          required
          class="input"
        />
      </div>
      <div class="input-wrapper">
        <label>Email</label>
        <input
          v-model="signUpEmail"
          type="email"
          placeholder="Example@email.com"
          required
          class="input"
        />
      </div>
      <NavFooterPreloadLoginPasswordInput
        v-model="signUpPassword"
        placeholder="Password"
        @input="validatePassword"
      />
      <NavFooterPreloadLoginPasswordInput
        v-model="signUpPasswordConfirm"
        placeholder="Confirm Password"
      />
      <div class="password-requirements-toggle">
        <div class="password-requirements">
          <div
            :class="{
              valid: passwordValidLength,
              invalid: !passwordValidLength,
            }"
          >
            <span v-if="passwordValidLength">✔ </span>
            <span v-else>✘ </span>
            8 characters minimum
          </div>
          <div
            :class="{
              valid: passwordHasUppercase,
              invalid: !passwordHasUppercase,
            }"
          >
            <span v-if="passwordHasUppercase">✔ </span>
            <span v-else>✘ </span>
            At least one uppercase letter
          </div>
          <div
            :class="{ valid: passwordHasNumber, invalid: !passwordHasNumber }"
          >
            <span v-if="passwordHasNumber">✔ </span>
            <span v-else>✘ </span>
            At least one number
          </div>
        </div>
      </div>
      <SubcomponentsLoadingButton
        :isLoading="isLoading"
        :disabled="!isFormValid"
        @click="handleSignUp"
        text="Sign Up"
        class="sign-up-button"
      />

      <transition name="fade">
        <div v-if="signUpError.general" class="error-message">
          {{ signUpError.general }}
        </div>
      </transition>
    </form>
    <p>
      Already have an account?
      <button @click="changeToSignIn">Sign In!</button>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  signUpError: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["signUp", "signIn"]);

const signUpName = ref("");
const signUpEmail = ref("");
const signUpPassword = ref("");
const signUpPasswordConfirm = ref("");

const showRequirements = ref(false);

const passwordValidLength = ref(false);
const passwordHasUppercase = ref(false);
const passwordHasNumber = ref(false);

const validatePassword = () => {
  const password = signUpPassword.value;
  passwordValidLength.value = password.length >= 8;
  passwordHasUppercase.value = /[A-Z]/.test(password);
  passwordHasNumber.value = /[0-9]/.test(password);
};

const toggleRequirements = () => {
  showRequirements.value = !showRequirements.value;
};

const changeToSignIn = () => {
  emit("signIn");
};

const handleSignUp = async () => {
  if (!isFormValid.value) {
    signUpError.value = { general: "Please fill in all fields correctly." };
    return;
  }
  emit("signUp", {
    email: signUpEmail.value,
    password: signUpPassword.value,
    passwordConfirm: signUpPasswordConfirm.value,
    name: signUpName.value,
  });
};

const isPasswordMatch = computed(() => {
  return signUpPassword.value === signUpPasswordConfirm.value;
});

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(signUpEmail.value);
});

const isFormValid = computed(() => {
  return (
    signUpEmail.value &&
    isEmailValid.value &&
    signUpPassword.value &&
    signUpPasswordConfirm.value &&
    isPasswordMatch.value &&
    signUpName.value &&
    passwordValidLength.value &&
    passwordHasUppercase.value &&
    passwordHasNumber.value
  );
});
</script>

<style scoped>
.form-container {
  width: 100%;
  position: relative;
  margin: 0 auto; /* Center the form container */
  height: auto;
}

img {
  height: 3rem;
  width: 3rem;
  margin-top: 3rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: white;
}

.sign-up-form-content {
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

.password-requirements-toggle {
  /* margin-bottom: 1rem; */
  text-align: center;
}

.requirements-button {
  width: 100%;
  background: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 1rem;
  transition: background 0.3s, transform 0.3s;
}

.requirements-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.password-requirements {
  background: rgba(0, 0, 0, 0.9);
  text-shadow: none;
  border-radius: 10px;
  /* padding: 1rem; */
  /* margin-top: 1rem; */
}

.password-requirements div {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: white;
  margin-bottom: 0.5rem;
}

.password-requirements .valid {
  color: #28a745;
  font-weight: bold;
}

.password-requirements .invalid {
  color: #dc3545;
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

.error-message-enter-active,
.error-message-leave-active {
  opacity: 1;
}

.sign-up-button {
  width: 100%;
}

.sign-up-button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

p {
  margin-top: 1rem;
  color: white;
  width: 100%;
  text-align: center;
}

button {
  background: none;
  color: #0197b2;
  border: none;
  font-size: 1rem;
  font-weight: bold;
}

button:hover {
  text-decoration: underline;
  cursor: pointer;
}

@media (max-width: 480px) {
  .form-container {
    width: 100%;
    overflow-y: scroll;
  }
}
</style>
