<template>
  <div class="password-input-wrapper input-wrapper">
    <label>{{ placeholder }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="passwordVisible ? 'text' : 'password'"
      required
      class="input"
      placeholder=" "
    />
    <span @click="togglePasswordVisibility" class="eye-icon">
      <img
        :src="
          passwordVisible
            ? '/Graphics/Eye1Black.svg'
            : '/Graphics/Eye1Black.svg'
        "
        alt="Toggle visibility"
      />
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
});

const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
</script>

<style scoped>
.input-wrapper {
  position: relative;
  width: 100%;
  /* margin-bottom: 1rem; */
  color: black;
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
  color: #ccc; /* Change the color */
  font-size: 16px; /* Change the font size */
  opacity: 1; /* Ensure the opacity is 100% (default can be less) */
}

/* Target the placeholder in different input states (optional) */
input:focus::placeholder {
  color: #aaa; /* Change color when input is focused */
}

input:disabled::placeholder {
  color: #888; /* Placeholder style for disabled inputs */
}

.eye-icon {
  position: absolute;
  top: 70%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon img {
  width: 20px; /* Adjust the size as needed */
  height: 20px; /* Adjust the size as needed */
  transition: opacity 0.3s ease;
}

.eye-icon:hover img {
  opacity: 0.7;
}
</style>
