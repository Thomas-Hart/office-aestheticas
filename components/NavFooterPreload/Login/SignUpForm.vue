<template>
  <div class="form-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignUp">
      <div class="input-wrapper">
        <input
          v-model="signUpName"
          type="text"
          placeholder=" "
          required
          class="input"
        />
        <label>Name</label>
      </div>
      <div class="input-wrapper">
        <input
          v-model="signUpEmail"
          type="email"
          placeholder=" "
          required
          class="input"
        />
        <label>Email</label>
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
        <button
          type="button"
          @click="toggleRequirements"
          class="requirements-button"
        >
          Password Requirements
        </button>
        <transition name="fade">
          <div v-if="showRequirements" class="password-requirements">
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
              One uppercase letter
            </div>
            <div
              :class="{ valid: passwordHasNumber, invalid: !passwordHasNumber }"
            >
              <span v-if="passwordHasNumber">✔ </span>
              <span v-else>✘ </span>
              One number
            </div>
          </div>
        </transition>
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
      <button @click="switchToLogin" class="switch-button">
        Already have an account? Login
      </button>
    </form>
  </div>
</template>

<script setup>
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

const emit = defineEmits(["signUp"]);

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

const switchToLogin = () => {
  emit("switchToLogin");
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
  padding: 0.5rem 2rem;
  width: 100%;
  position: relative;
  margin: 0 auto; /* Center the form container */
  height: auto;
}

h2 {
  margin-bottom: 1.5rem;
  color: black;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem; /* Adjust this if needed for vertical spacing */
  text-shadow: none;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  text-shadow: none;
  font-size: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-wrapper input:focus {
  border-color: #4caf50;
  outline: none;
}

.input-wrapper label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: black;
  font-size: 1rem;
  transition: all 0.2s ease;
  pointer-events: none;
}

.input-wrapper input:not(:placeholder-shown) + label,
.input-wrapper input:focus + label {
  top: -10px;
  left: 5px;
  font-size: 1rem;
  color: white;
  background: transparent;
  text-shadow: 2px 2px 0px black;
}

.password-requirements-toggle {
  margin-bottom: 1rem;
  text-align: center;
}

.requirements-button {
  width: 100%;
  background: #3f654c;
  color: white;
  font-weight: bold;
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
  padding: 1rem;
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

.switch-button {
  margin-top: 1.5rem;
  background: none;
  border: none;
  color: #3f654c;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bolder;
}

.switch-button:hover {
  color: #2e5e2f;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .form-container {
    width: 100%;
    overflow-y: scroll;
  }
}
</style>
