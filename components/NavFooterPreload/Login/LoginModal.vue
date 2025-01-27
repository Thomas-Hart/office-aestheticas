<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal" key="modal">
      <button @click="closeModal" class="close-button">×</button>
      <transition name="fade" mode="out-in">
        <div v-if="!showSignUp" key="loginForm" class="content-wrapper">
          <NavFooterPreloadLoginForm
            :isLoading="isLoading"
            :loginError="loginError"
            @emailLogin="handleEmailLogin"
            @googleLogin="handleGoogleLogin"
            @signUp="switchToSignUp"
          />
        </div>
        <div v-else key="signUpForm">
          <NavFooterPreloadLoginSignUpForm
            :isLoading="isLoading"
            :signUpError="signUpError"
            @signUp="handleSignUp"
            @switchToLogin="switchToLogin"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore();
const itemStore = useItemStore();

const showSignUp = ref(false); // Controls whether the sign-up form is shown
const isLoading = ref(false);

const loginError = ref({});
const signUpError = ref({});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};

const switchToSignUp = () => {
  showSignUp.value = true;
};

const switchToLogin = () => {
  showSignUp.value = false;
};

const handleEmailLogin = async (loginData) => {
  isLoading.value = true;
  loginError.value = {};
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: loginData.email, password: loginData.password },
    });
    userStore.setToken(response.token);
    userStore.setUser(response.user);
    closeModal();
    updateUserCart();
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
      userStore.setToken(response.token);
      userStore.setUser(response.user);
      closeModal();
      // updateUserCart();
    } catch (error) {
      loginError.value = {
        general: error.data.message || "Google login failed",
      };
    }
  }
};

// If you want to add item store cart to user cart on login
const updateUserCart = async () => {
  const cart = itemStore.cart;
  try {
    const userResponse = await $fetch(
      `/api/users/cart/add/${userStore.user._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: { items: cart },
      }
    );
  } catch (error) {}
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
}

.modal {
  background: white;
  padding: 2rem;
  /* border-radius: 15px; */
  max-width: 90%;
  max-height: 85vh;
  min-height: 85vh;
  width: 30rem;
  text-align: center;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: bold;
  color: black;
  cursor: pointer;
  z-index: 1001;
}

.close-button:hover {
  color: #ff0000;
}

h2 {
  color: white;
  margin-bottom: 1rem;
}

.alternative-methods {
  margin-top: 2rem;
}

.google-button {
  width: 100%;
}

@media (max-width: 480px) {
  .modal {
    padding: 2rem 0rem;
  }
}
</style>
