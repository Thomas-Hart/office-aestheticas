<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal" key="modal">
      <button @click="closeModal" class="close-button">×</button>

      <transition name="fade">
        <div v-if="showSuccessMessage" class="success-message">
          Logged in successfully!
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="!showSignUp" key="loginForm" class="content-wrapper">
          <div class="login-modal-container">
            <h2>Login</h2>
            <form class="login-form-content">
              <div
                class="form-group"
                :class="{ 'has-text': loginEmail.length > 0 }"
              >
                <label for="loginEmail">Email</label>
                <input
                  id="loginEmail"
                  v-model="loginEmail"
                  type="email"
                  required
                />
              </div>
              <div
                class="form-group"
                :class="{ 'has-text': loginPassword.length > 0 }"
              >
                <label for="loginPassword">Password</label>
                <NavFooterPreloadLoginPasswordInput
                  id="loginPassword"
                  v-model="loginPassword"
                />
              </div>
              <SubcomponentsLoadingButton
                class="full-width-btn"
                :isLoading="isLoading"
                :disabled="!loginFormValid"
                @click="onLoginSubmit"
                text="Login"
              />
              <transition name="fade">
                <div v-if="loginError.general" class="error-message">
                  {{ loginError.general }}
                </div>
              </transition>
            </form>
            <div class="alternative-methods">
              <button
                v-if="config.public.GOOGLE_CLIENT_ID"
                type="button"
                class="google-btn"
                @click="onGoogleSignIn"
              >
                <img
                  src="/Logos/google-logo.svg"
                  alt="Google logo"
                  class="google-logo"
                />
                Sign in with Google
              </button>
            </div>
            <button @click="switchToSignUp" class="switch-button">
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
        <div v-else key="signUpForm" class="form-container">
          <h2>Sign Up</h2>
          <form>
            <div
              class="form-group"
              :class="{ 'has-text': signUpName.length > 0 }"
            >
              <label for="signUpName">Name</label>
              <input
                id="signUpName"
                v-model="signUpName"
                type="text"
                required
              />
            </div>
            <div
              class="form-group"
              :class="{ 'has-text': signUpEmail.length > 0 }"
            >
              <label for="signUpEmail">Email</label>
              <input
                id="signUpEmail"
                v-model="signUpEmail"
                type="email"
                required
              />
            </div>
            <div
              class="form-group password-field"
              :class="{ 'has-text': signUpPassword.length > 0 }"
            >
              <label for="signUpPassword">Password</label>
              <NavFooterPreloadLoginPasswordInput
                id="signUpPassword"
                v-model="signUpPassword"
                @input="validatePassword"
              />
            </div>
            <div
              class="form-group"
              :class="{ 'has-text': signUpPasswordConfirm.length > 0 }"
            >
              <label for="signUpPasswordConfirm">Confirm Password</label>
              <NavFooterPreloadLoginPasswordInput
                id="signUpPasswordConfirm"
                v-model="signUpPasswordConfirm"
              />
            </div>
            <SubcomponentsLoadingButton
              class="full-width-btn"
              :isLoading="isLoading"
              :disabled="!signUpFormValid"
              @click="onSignUpSubmit"
              text="Sign Up"
            />
          </form>
          <div class="password-requirements-trigger">
            <button
              type="button"
              class="requirements-button"
              @click="toggleRequirements"
            >
              <span class="icon">ℹ️</span> Show password requirements
            </button>
          </div>
          <transition name="fade">
            <div v-if="signUpError.general" class="error-message">
              {{ signUpError.general }}
            </div>
          </transition>
          <button @click="switchToLogin" class="switch-button">
            Already have an account? Login
          </button>
          <transition name="fade">
            <div
              v-if="showRequirements || forceShowRequirements"
              class="password-requirements-overlay"
              @click.self="toggleRequirements"
            >
              <div class="password-requirements-popup">
                <button class="close-popup" @click="toggleRequirements">
                  ×
                </button>
                <h3>Password requirements</h3>
                <ul>
                  <li :class="passwordValidLength ? 'valid' : 'invalid'">
                    <span>{{ passwordValidLength ? "✔" : "✘" }}</span> 8
                    characters minimum
                  </li>
                  <li :class="passwordHasUppercase ? 'valid' : 'invalid'">
                    <span>{{ passwordHasUppercase ? "✔" : "✘" }}</span> One
                    uppercase letter
                  </li>
                  <li :class="passwordHasNumber ? 'valid' : 'invalid'">
                    <span>{{ passwordHasNumber ? "✔" : "✘" }}</span> One number
                  </li>
                </ul>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const userStore = useUserStore();
const itemStore = useItemStore();
const config = useRuntimeConfig();
const emit = defineEmits(["close"]);

const showSignUp = ref(false);
const isLoading = ref(false);
const loginError = ref({});
const signUpError = ref({});
const showSuccessMessage = ref(false);

const loginEmail = ref("");
const loginPassword = ref("");

const signUpName = ref("");
const signUpEmail = ref("");
const signUpPassword = ref("");
const signUpPasswordConfirm = ref("");

const showRequirements = ref(false);
const forceShowRequirements = ref(false);
const passwordValidLength = ref(false);
const passwordHasUppercase = ref(false);
const passwordHasNumber = ref(false);

const loginFormValid = computed(() => loginEmail.value && loginPassword.value);
const isPasswordMatch = computed(
  () => signUpPassword.value === signUpPasswordConfirm.value
);
const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpEmail.value)
);
const signUpFormValid = computed(
  () =>
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

let oauth2Client = null;

function loadGoogleSdk() {
  return new Promise((resolve) => {
    if (document.getElementById("google-client-script")) return resolve();
    const s = document.createElement("script");
    s.id = "google-client-script";
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

function initGoogle() {
  oauth2Client = window.google.accounts.oauth2.initTokenClient({
    client_id: config.public.GOOGLE_CLIENT_ID,
    scope: "openid email profile",
    callback: handleCredentialResponse, // ← restored
  });
}

function handleCredentialResponse(resp) {
  const token = resp.credential || resp.access_token;
  handleGoogleLogin({ credential: token });
}

async function onGoogleSignIn() {
  if (!oauth2Client) return;
  oauth2Client.requestAccessToken();
}

onMounted(async () => {
  await loadGoogleSdk();
  initGoogle();
});

function closeModal() {
  emit("close");
}
function switchToSignUp() {
  showSignUp.value = true;
}
function switchToLogin() {
  showSignUp.value = false;
}

async function updateUserCart() {
  try {
    await $fetch(`/api/users/cart/add/${userStore.user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: { items: itemStore.cart },
    });
  } catch {}
}

async function onLoginSubmit() {
  isLoading.value = true;
  loginError.value = {};
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: loginEmail.value, password: loginPassword.value },
    });
    userStore.setToken(response.token);
    userStore.setUser(response.user);
    await updateUserCart();
    showSuccessMessage.value = true;
    await new Promise((r) => setTimeout(r, 2000));
    closeModal();
  } catch (error) {
    loginError.value = {
      general: error.data?.message || "Invalid email or password",
    };
  } finally {
    isLoading.value = false;
  }
}

async function handleGoogleLogin(response) {
  const { credential } = response;
  if (!credential) return;
  isLoading.value = true;
  loginError.value = {};
  const { $fbq, $klaviyo, $klaviyoClientApi } = useNuxtApp();
  try {
    const res = await $fetch("/api/auth/google-login", {
      method: "POST",
      body: { token: credential },
    });
    userStore.setToken(res.token);
    userStore.setUser(res.user);
    await $klaviyoClientApi.subscribe(
      config.public.TEST_KLAVIYO_OA_USERS_ID,
      res.user.email,
      null,
      "Office Aestheticas Google Signup"
    );
    $klaviyo("identify", { email: res.user.email });
    $klaviyo("track", "LoggedIn", {
      source: "Login Modal",
      content_name: "Office Aestheticas Google Login",
      email: res.user.email,
    });
    if (
      process.client &&
      !["localhost", "127.0.0.1"].includes(window.location.hostname)
    ) {
      $fbq("track", "LoggedIn", {
        source: "Login Modal",
        content_name: "Office Aestheticas Google Login",
        email: res.user.email,
      });
    }
    await updateUserCart();
    showSuccessMessage.value = true;
    await new Promise((r) => setTimeout(r, 2000));
    closeModal();
  } catch (error) {
    loginError.value = {
      general: error.data?.message || "Google login failed",
    };
  } finally {
    isLoading.value = false;
  }
}

async function handleSignUp(data) {
  const { $klaviyoClientApi, $klaviyo, $fbq } = useNuxtApp();
  await $klaviyoClientApi.subscribe(
    config.public.TEST_KLAVIYO_OA_USERS_ID,
    data.email,
    null,
    "Office Aestheticas Email Signup"
  );
  $klaviyo("identify", { email: data.email });
  $fbq("track", "CompleteRegistration", {
    source: "Login Modal",
    content_name: "Office Aestheticas Email Signup",
    email: data.email,
  });
  isLoading.value = true;
  signUpError.value = {};
  if (data.password !== data.passwordConfirm) {
    signUpError.value = { general: "Passwords do not match" };
    isLoading.value = false;
    return;
  }
  try {
    await $fetch("/api/users", {
      method: "POST",
      body: { email: data.email, password: data.password, name: data.name },
    });
    // auto‑login after signup
    loginEmail.value = data.email;
    loginPassword.value = data.password;
    await onLoginSubmit();
  } catch (error) {
    signUpError.value = {
      general: error.data?.message || "Sign-up failed. Please try again.",
    };
  } finally {
    isLoading.value = false;
  }
}

function onSignUpSubmit() {
  if (!signUpFormValid.value) {
    if (
      !passwordValidLength.value ||
      !passwordHasUppercase.value ||
      !passwordHasNumber.value
    ) {
      forceShowRequirements.value = true;
      showRequirements.value = true;
    }
    signUpError.value = { general: "Please fill in all fields correctly." };
    return;
  }
  handleSignUp({
    email: signUpEmail.value,
    password: signUpPassword.value,
    passwordConfirm: signUpPasswordConfirm.value,
    name: signUpName.value,
  });
}

function toggleRequirements() {
  showRequirements.value = !showRequirements.value;
}

function validatePassword() {
  const pw = signUpPassword.value;
  passwordValidLength.value = pw.length >= 8;
  passwordHasUppercase.value = /[A-Z]/.test(pw);
  passwordHasNumber.value = /[0-9]/.test(pw);
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 2rem;
  width: 30rem;
  max-width: 90%;
  max-height: 85vh;
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
  cursor: pointer;
}
h2 {
  margin-bottom: 1rem;
  color: #000;
  font-size: 1.5rem;
}
.success-message {
  color: #28a745;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}
.form-group {
  position: relative;
  margin-bottom: 1rem;
  height: 50px;
}
.form-group input,
.form-group select,
.form-group .nav-footer-preload-login-password-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 60px;
  padding: 0 12px;
  font-size: 13px;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  transition: all 0.2s ease;
}
.form-group.has-text input,
.form-group.has-text select,
.form-group.has-text .nav-footer-preload-login-password-input {
  line-height: 12px;
  padding-top: 16px;
  border-color: #66afe9;
}
.form-group input:focus,
.form-group select:focus,
.form-group .nav-footer-preload-login-password-input:focus {
  border-color: #66afe9;
  outline: none;
}
.form-group label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #777;
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 1;
}
.form-group.has-text label {
  top: 8px;
  transform: none;
  font-size: 12px;
  color: #555;
}
.password-field {
  position: relative;
}
.password-requirements-trigger {
  margin-top: 1rem;
}
.requirements-button {
  background: none;
  border: none;
  color: #3f654c;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
}
.requirements-button:hover {
  text-decoration: underline;
  color: #2e5e2f;
}
.requirements-button .icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}
.password-requirements-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}
.password-requirements-popup {
  background: #fff;
  padding: 1.25rem;
  border-radius: 4px;
  width: 20rem;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.close-popup {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #777;
}
.close-popup:hover {
  color: #000;
}
.password-requirements-popup ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
}
.password-requirements-popup li {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.password-requirements-popup li.valid {
  color: #28a745;
}
.password-requirements-popup li.invalid {
  color: #dc3545;
}
.password-requirements-popup li span {
  margin-right: 0.5rem;
}
.full-width-btn {
  width: 100%;
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
  background: none;
  border: none;
  color: #3f654c;
  cursor: pointer;
  margin-top: 1rem;
}
.switch-button:hover {
  text-decoration: underline;
  color: #2e5e2f;
}
.alternative-methods {
  margin-top: 1.5rem;
}
.google-btn {
  display: flex;
  align-items: center;
  width: 100%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 0;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  justify-content: center;
}
.google-btn:hover {
  background: #f7f7f7;
  border-color: #aaa;
}
.google-logo {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
}
.error-message {
  color: #f44336;
  font-size: 0.9rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  text-align: left;
}
.form-group.invalid input,
.form-group.invalid select,
.form-group.invalid .nav-footer-preload-login-password-input {
  border-color: #f44336;
}
</style>
