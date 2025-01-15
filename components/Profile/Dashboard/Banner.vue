<template>
  <div class="top-image-banner">
    <div class="overlay">
      <div class="profile-image-wrapper" @click="$emit('trigger-file-input')">
        <img
          class="profile-image"
          :src="
            userStore.user.profilePicture || 'https://via.placeholder.com/150'
          "
          alt="Profile Image"
        />
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
</script>
  
  <style scoped>
/* Profile Image Section */
.top-image-banner {
  width: 100%;
  height: 17.25rem;
  background: url("/BlogPics/BlogPic1.webp") center center/cover no-repeat;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid white;
}

.top-image-banner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0)
    ),
    rgba(255, 128, 0, 0.3);
  pointer-events: none;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-image-wrapper {
  width: 12rem;
  height: 12rem;
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.profile-image-wrapper:hover {
  transform: scale(1.05);
}

.profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
}
</style>
  