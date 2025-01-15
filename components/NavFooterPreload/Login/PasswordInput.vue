<template>
  <div class="password-input-wrapper input-wrapper">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="passwordVisible ? 'text' : 'password'"
      required
      class="input"
      placeholder=" "
    />
    <label>{{ placeholder }}</label>
    <span @click="togglePasswordVisibility" class="eye-icon">
      <img
        :src="passwordVisible ? '/Eye2Black.svg' : '/Eye1Black.svg'"
        alt="Toggle visibility"
      />
    </span>
  </div>
</template>

<script setup>
import { ref } from "vue";

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
  margin-bottom: 1rem;
  color: black;
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

.eye-icon {
  position: absolute;
  top: 50%;
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
