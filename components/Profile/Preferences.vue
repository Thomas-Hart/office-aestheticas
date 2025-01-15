<template>
  <div class="wrapper">
    <!-- Notification Popup -->
    <SubcomponentsNotificationPopup
      v-if="notificationMessage"
      :message="notificationMessage"
      :type="notificationType"
      @close-popup="notificationMessage = null"
    />

    <!-- Profile Image and Edit Section -->
    <div class="top-image-banner">
      <div class="overlay">
        <div class="profile-image-wrapper" @click="triggerFileInput">
          <img
            class="profile-image"
            :src="userStore.user.profilePicture || '/OAName.webp'"
            alt="Profile Image"
          />
          <div class="edit-icon">
            <img src="/Graphics/EditPencil.svg" alt="Edit Icon" />
          </div>
          <!-- Hidden file input for selecting images -->
          <input
            type="file"
            ref="fileInput"
            class="file-input"
            @change="uploadImage"
            accept="image/*"
          />
        </div>
      </div>
    </div>

    <!-- Manage Your Account Banner -->
    <div class="manage-account-banner">
      <p>Manage Your Account</p>
    </div>

    <!-- Manage Your Account Fields (Two Columns) -->
    <div class="account-section">
      <div class="input-grid two-columns">
        <div class="input-field">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            :value="userStore.user.email"
            disabled
            class="disabled-field"
          />
        </div>

        <div class="input-field">
          <label for="new-password">New Password</label>
          <input type="password" id="new-password" v-model="password" />
        </div>
        <div class="input-field">
          <label for="confirm-password">Confirm New Password</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
          />
        </div>
      </div>
      <button class="confirm-button" @click="saveAccountChanges">
        Confirm Changes
      </button>
    </div>

    <!-- Personal Section Banner -->
    <div class="section-banner">
      <p>Personal</p>
    </div>

    <!-- Personal Fields (Three Columns) -->
    <div class="personal-section">
      <div class="input-grid three-columns">
        <div class="input-field">
          <label for="first-name">Full Name</label>
          <input type="text" id="first-name" v-model="userStore.user.name" />
        </div>
        <div class="input-field">
          <label for="preferred-name">Preferred Name</label>
          <input
            type="text"
            id="preferred-name"
            v-model="userStore.user.preferredName"
          />
        </div>
        <div class="input-field">
          <label for="dob">Date of Birth</label>
          <input type="date" id="dob" v-model="formattedDateOfBirth" />
        </div>
      </div>
      <button class="confirm-button" @click="savePersonalChanges">
        Confirm Changes
      </button>
    </div>

    <!-- Contact Section Banner -->
    <div class="section-banner">
      <p>Contact</p>
    </div>

    <!-- Contact Fields (Three Columns) -->
    <div class="contact-section">
      <div class="input-grid three-columns">
        <div class="input-field">
          <label for="phone-number">Phone Number</label>
          <input
            type="tel"
            id="phone-number"
            v-model="userStore.user.contact.phone"
          />
        </div>
        <div class="input-field">
          <label for="address">Address</label>
          <input
            type="text"
            id="address"
            v-model="userStore.user.contact.street"
          />
        </div>
        <div class="input-field">
          <label for="city">City</label>
          <input type="text" id="city" v-model="userStore.user.contact.city" />
        </div>
        <div class="input-field">
          <label for="state">State</label>
          <input
            type="text"
            id="state"
            v-model="userStore.user.contact.state"
          />
        </div>
        <div class="input-field">
          <label for="zip-code">Zip Code</label>
          <input
            type="text"
            id="zip-code"
            v-model="userStore.user.contact.zip"
          />
        </div>
      </div>
      <button class="confirm-button" @click="saveContactChanges">
        Confirm Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const userStore = useUserStore();
const fileInput = ref(null);
const password = ref("");
const confirmPassword = ref("");
const notificationMessage = ref("");
const notificationType = ref("info");

// Computed property to format the date for the input field
const formattedDateOfBirth = computed({
  get() {
    return userStore.user?.dateOfBirth
      ? new Date(userStore.user.dateOfBirth).toISOString().split("T")[0]
      : "";
  },
  set(value) {
    userStore.user.dateOfBirth = value ? new Date(value).toISOString() : null;
  },
});

// Trigger the hidden file input
const triggerFileInput = () => {
  fileInput.value.click();
};

// Upload the image to S3 via the API route
const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const oldProfilePicture = userStore.user.profilePicture;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await $fetch("/api/aws/upload", {
      method: "POST",
      body: formData,
    });

    if (response?.url) {
      const newImageUrl = response.url;

      try {
        const userResponse = await $fetch(`/api/users/${userStore.user._id}`, {
          method: "PUT",
          body: { profilePicture: newImageUrl },
        });

        userStore.setUser(userResponse);

        if (oldProfilePicture) {
          try {
            const oldKey = oldProfilePicture.split("/").pop();
            await $fetch("/api/aws/upload", {
              method: "DELETE",
              body: { key: oldKey },
            });
          } catch (deleteError) {
            showNotification(
              "New profile image uploaded, but failed to delete the old one.",
              "warning"
            );
          }
        }

        showNotification("Profile image updated successfully!", "success");
      } catch (updateError) {
        showNotification("Error updating user profile image.", "error");
      }
    }
  } catch (uploadError) {
    showNotification("Failed to upload image.", "error");
  }
};

// Save Account Changes
const saveAccountChanges = async () => {
  if (password.value == confirmPassword.value) {
    try {
      const userResponse = await $fetch(`/api/users/${userStore.user._id}`, {
        method: "PUT",
        body: { password: password.value },
      });
      userStore.setUser(userResponse);
      showNotification("Account changes saved successfully!", "success");
    } catch (error) {
      showNotification("Error updating account changes.", "error");
    }
  } else {
    showNotification("Passwords don't match", "error");
  }
};

// Save Personal Changes
const savePersonalChanges = async () => {
  try {
    const userResponse = await $fetch(`/api/users/${userStore.user._id}`, {
      method: "PUT",
      body: userStore.user,
    });
    userStore.setUser(userResponse);
    showNotification("Personal details updated successfully!", "success");
  } catch (error) {
    showNotification("Error updating personal changes.", "error");
  }
};

// Save Contact Changes
const saveContactChanges = async () => {
  try {
    const userResponse = await $fetch(`/api/users/${userStore.user._id}`, {
      method: "PUT",
      body: userStore.user,
    });
    userStore.setUser(userResponse);
    showNotification("Contact details updated successfully!", "success");
  } catch (error) {
    showNotification("Error updating contact changes.", "error");
  }
};

// Show Notification
const showNotification = (message, type) => {
  notificationMessage.value = message;
  notificationType.value = type;
};
</script>

<style scoped>
.wrapper {
  position: relative;
  /* overflow: auto; */
}

/* Profile Image Section */
.top-image-banner {
  width: 100%;
  height: 17.25rem;
  background: url("/BlogPics/BlogPic1.webp") center center/cover no-repeat;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
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
  position: relative;
  cursor: pointer;
  width: 12rem !important;
  height: 12rem !important;
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
  aspect-ratio: 1 / 1;
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
  transition: border-color 0.3s ease-in-out;
}

.profile-image-wrapper:hover .profile-image {
  border-color: rgba(255, 255, 255, 0.8);
}

.edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  border-radius: 50%;
  padding: 0.4rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-in-out;
}

.edit-icon img {
  width: 1rem;
  height: 1rem;
}

.file-input {
  display: none;
}

/* Banner Styles */
.manage-account-banner,
.section-banner {
  background-color: #ff8000;
  color: white;
  text-align: left;
  padding: 0.5rem 1rem;
  font-weight: bold;
}

.account-section,
.personal-section,
.contact-section {
  padding: 1rem;
  background-color: #f0f0f0;
}

.input-grid.two-columns,
.input-grid.three-columns {
  display: grid;
  gap: 1rem;
}

.input-grid.two-columns {
  grid-template-columns: repeat(2, 1fr);
}

.input-grid.three-columns {
  grid-template-columns: repeat(3, 1fr);
}

.input-field {
  margin-bottom: 1rem;
}

.input-field label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.input-field input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.disabled-field {
  background-color: #f0f0f0;
  color: #aaa;
  pointer-events: none;
}

.confirm-button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .input-grid.two-columns,
  .input-grid.three-columns {
    grid-template-columns: 1fr;
  }

  .top-image-banner {
    height: 14rem;
  }

  .profile-image-wrapper {
    width: 10rem !important;
    height: 10rem !important;
  }

  .confirm-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .top-image-banner {
    height: 12rem;
  }

  .profile-image-wrapper {
    width: 8rem !important;
    height: 8rem !important;
  }

  .input-field input {
    padding: 0.4rem;
  }
}
</style>
