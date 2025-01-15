<template>
  <div class="form-container">
    <div class="form-content">
      <transition name="fade" mode="out-in">
        <NavFooterPreloadLoginForm
          v-if="!forgot"
          :isLoading="isLoading"
          :loginError="loginError"
          @emailLogin="handleEmailLogin"
          @forgot-password="forgot = true"
        />

        <NavFooterPreloadLoginForgotPassword v-else @back="forgot = false" />
      </transition>

      <!-- <div class="divider">
        <div class="divider-text">
          <h4>Or continue with</h4>
        </div>
      </div>

      <GoogleSignInButton
        @success="handleGoogleLogin"
        @error="handleLoginError"
        :client-id="config.public.GOOGLE_CLIENT_ID"
        class="google-button"
      ></GoogleSignInButton> -->
    </div>
    <!-- <p>
      Dont have an account?
      <button @click="changeToSignUp">Create Account!</button>
    </p> -->
  </div>
</template>
  
  <script setup>
import { GoogleSignInButton } from "vue3-google-signin";
const config = useRuntimeConfig();
const isLoading = ref(false);
const loginError = ref({});
const userStore = useUserStore();
const forgot = ref(false);

const emit = defineEmits([
  "emailSignIn",
  "googleLogin",
  "signUp",
  "loginError",
]);

const handleGoogleLogin = (response) => {
  emit("googleLogin", response);
};

const handleLoginError = (error) => {
  emit("loginError", error);
};

const changeToSignUp = () => {
  emit("signUp");
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
  } catch (error) {
    loginError.value = {
      general: error.data.message || "Invalid email or password",
    };
  } finally {
    isLoading.value = false;
  }
};
</script>
  
<style scoped>
.form-container {
  width: 100%;
  position: relative;
}

h2 {
  color: white;
  text-decoration: underline;
}

.form-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.divider {
  position: relative;
  width: 100%;
  border-bottom: 2px solid white;
  margin-bottom: 2rem;
  margin-top: 2rem;
}

.divider-text {
  position: absolute;
  color: white;
  background: black;
  width: 12rem;
  top: -0.35rem;
  left: 50%;
  transform: translateX(-50%);
}

.button {
  color: black;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
  width: 11.25rem;
  display: block;
}

.sign-in-button {
  background: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: background 0.3s;
  color: white;
  font-weight: bold;
}

.sign-in-button:hover {
  background: #0056b3;
}

.google-button {
  color: #4285f4;
  text-shadow: none;
  transition: background 0.3s, color 0.3s;
}

.google-button:hover {
  color: #fff;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
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
  }
  .form-content {
    min-height: 0;
    height: auto;
    padding: 1rem 0;
  }
}
</style>
