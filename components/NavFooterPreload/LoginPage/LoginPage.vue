<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal" key="modal">
      <div v-if="!emailSignIn" key="signInOptions" class="content-wrapper">
        <div class="form-wrapper">
          <transition name="fade" mode="out-in">
            <NavFooterPreloadLoginSignInSection
              v-if="loginForm"
              @emailSignIn="handleEmailSignIn"
              @googleLogin="handleGoogleLogin"
              @loginError="handleLoginError"
              @signUp="switchToSignUp"
              @closeModal="closeModal"
            />
            <NavFooterPreloadLoginSignUpForm
              v-else
              :isLoading="isLoading"
              :signUpError="signUpError"
              @signUp="handleSignUp"
              @signIn="switchToSignIn"
            />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useUserStore();
const emailSignIn = ref(false);
const email = ref("");
const password = ref("");
const showModal = ref(false);
const isLoading = ref(false);
const loginForm = ref(true);

const loginError = ref({});
const signUpError = ref({});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};

const switchToSignUp = () => {
  loginForm.value = false;
};

const switchToSignIn = () => {
  loginForm.value = true;
};

const handleEmailSignIn = () => {
  emailSignIn.value = true;
};

const handleEmailLogin = async (loginData) => {
  isLoading.value = true;
  loginError.value = {};
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: loginData.email.toLowerCase(),
        password: loginData.password,
      },
    });
    store.setToken(response.token);
    store.setUser(response.user);
    closeModal();
  } catch (error) {
    loginError.value = {
      general: error.data.message || "Invalid email or password",
    };
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = async (response) => {
  const { credential } = response;
  if (credential) {
    try {
      const response = await $fetch("/api/auth/google-login", {
        method: "POST",
        body: { token: credential },
      });
      store.setToken(response.token);
      store.setUser(response.user);
      closeModal();
    } catch (error) {
      loginError.value = {
        general: error.data.message || "Google login failed",
      };
    }
  }
};

const handleLoginError = (error) => {
  loginError.value = { general: "Google login failed" };
};

const handleSignUp = async (signUpData) => {
  isLoading.value = true;
  signUpError.value = {};
  if (signUpData.password !== signUpData.passwordConfirm) {
    signUpError.value.passwordConfirm = "Passwords do not match";
    isLoading.value = false;
    return;
  }
  try {
    const response = await $fetch("/api/users", {
      method: "POST",
      body: {
        email: signUpData.email,
        password: signUpData.password,
        name: signUpData.name,
      },
    });
    email.value = signUpData.email;
    password.value = signUpData.password;
    await handleEmailLogin({
      email: signUpData.email,
      password: signUpData.password,
    });
  } catch (error) {
    signUpError.value.general =
      error.data.message || "Sign-up failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

// Mount Google One Tap on modal open
onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});
</script>

<style scoped>
.modal-overlay {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: rgba(0, 0, 0, 0.8); */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  /* background: url("/Car2.png") no-repeat center top; */
  background-size: cover;
  padding: 1rem 2rem;
  max-width: 90%;
  min-height: 70vh;
  width: 25rem;
  text-align: center;
  position: relative;
  /* overflow-y: auto;  */
}

h1 {
  font-size: 2rem;
  margin-bottom: 3.5rem;
  color: white;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  width: 100%;
}

.back-button {
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 24px;
  height: 24px;
  z-index: 10;
  transition: transform 0.3s;
}

.back-button:hover {
  transform: translateX(-2px);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #007bff;
  cursor: pointer;
  z-index: 10;
  transition: color 0.3s;
}

.close-button:hover {
  color: #0056b3;
}

.form-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  h1 {
    margin: 1rem 0 3rem 0;
    font-size: 1.5rem;
  }

  .form-wrapper {
    flex-direction: column;
  }

  .modal {
    height: auto;
    padding: 0;
    max-height: 80vh; /* Adjust height for smaller screens */
    min-height: 80vh;
  }
}

*,
body {
  text-shadow: 1px 1px 1px black;
}

@media (max-width: 480px) {
  .modal {
    /* overflow: hidden; */
    /* overflow-y: scroll; */
  }
}
</style>

