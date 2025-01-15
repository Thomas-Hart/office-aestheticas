<template>
  <div class="email-container">
    <h2>Contact</h2>

    <!--prettier-ignore-->
    <div class="form-group" :class="{ 'input-filled': email, 'invalid': invalid }">
      <label for="email">Email</label>
      <!--prettier-ignore-->
      <input type="email" id="email" v-model="email" required placeholder="Email"/>
    </div>

    <!--prettier-ignore-->
    <div class="form-group" :class="{ 'input-filled': email, 'invalid': invalid }">
      <label for="email">Verify Email</label>
      <!--prettier-ignore-->
      <input type="email" id="email" v-model="verifyEmail" required placeholder="Verify Email"/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  invalid: String,
});

const email = ref("");
const verifyEmail = ref("");

const emit = defineEmits(["email-changed", "verify-email-changed"]);

watch(email, (newEmail) => {
  emit("email-changed", newEmail);
});

watch(verifyEmail, (newVerifyEmail) => {
  emit("verify-email-changed", newVerifyEmail);
});
</script>


<style scoped>
.email-container {
  display: flex;
  flex-direction: column;
}

h2 {
  margin-top: 2rem;
  font-size: 24px;
  margin-bottom: 20px;
}
.form-group {
  position: relative;
  margin-bottom: 20px;
  color: black;
  height: 3.5rem;
  /* overflow: hidden; */
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 15px;
  height: 3.5rem;
  /* border-radius: 10px; */
  border: 3px solid transparent;
  transition: border 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #ff8000;
  outline: none;
}

.form-group.input-filled input {
  padding-top: 24px;
}

.form-group input::placeholder {
  color: #3a3a3b;
}

.form-group label {
  position: absolute;
  left: 13px;
  top: 50px;
  opacity: 0;
  transition: opacity 0.2s ease, top 0.5s ease;
  pointer-events: none;
  font-size: 15px;
  color: #3a3a3b;
}

.form-group.input-filled label {
  top: 10px;
  font-size: 12px;
  opacity: 1;
  color: #3a3a3b;
}

.form-group.invalid input {
  border-color: red;
}

.error,
.popup {
  position: absolute;
  color: #f44336;
  text-align: left;
  /* border-radius: 6px; */
  z-index: 1;
  left: 0;
  top: -1.25rem;
}

h1 {
  color: red;
}
</style>