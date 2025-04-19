<template>
  <div
    class="form-group password-input-wrapper"
    :class="{ 'has-text': modelValue?.length > 0 }"
  >
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="passwordVisible ? 'text' : 'password'"
      required
      placeholder=" "
    />
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
});

const passwordVisible = ref(false);
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
</script>

<style scoped>
.form-group {
  position: relative;
  margin-bottom: 1rem;
  height: 50px;
}
.form-group input {
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
.form-group.has-text input {
  line-height: 12px;
  padding-top: 16px;
  border-color: #66afe9;
}
.form-group input:focus {
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

/* preserve your extra wrapper spacing if you need it */
.password-input-wrapper {
  /* no extra overrides needed */
}

.eye-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.eye-icon img {
  width: 20px;
  height: 20px;
  transition: opacity 0.3s ease;
}
.eye-icon:hover img {
  opacity: 0.7;
}
</style>
