<template>
  <transition name="fade">
    <div v-if="visible" class="notification-popup" :class="type">
      <span>{{ message }}</span>
      <button class="close-button" @click="closePopup">×</button>
    </div>
  </transition>
</template>
  
  <script setup>
import { ref, watch } from "vue";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "info", // Can be 'info', 'success', 'warning', 'error'
  },
  duration: {
    type: Number,
    default: 3000, // Duration in milliseconds
  },
});

const visible = ref(true);

const closePopup = () => {
  visible.value = false;
};

// Automatically hide the popup after a certain duration
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
      }, props.duration);
    }
  }
);
</script>
  
  <style scoped>
.notification-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translateY(0);
  opacity: 1;
  max-width: 300px;
  z-index: 1000;
}

.notification-popup.success {
  background-color: #4caf50;
}

.notification-popup.error {
  background-color: #f44336;
}

.notification-popup.info {
  background-color: #2196f3;
}

.notification-popup.warning {
  background-color: #ff9800;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: translateY(20px);
}
</style>
  