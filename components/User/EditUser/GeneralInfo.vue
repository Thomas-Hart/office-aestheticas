<template>
  <div class="section">
    <div class="section-header" @click="toggleCollapse" @mousedown.prevent>
      <h2>General Information</h2>
      <span :class="['collapse-icon', isCollapsed ? 'collapsed' : 'expanded']">
        ▼
      </span>
    </div>

    <div
      ref="content"
      :style="{ maxHeight: isCollapsed ? '0px' : contentHeight }"
      class="content"
    >
      <!-- Profile Picture Display -->
      <div class="profile-picture">
        <img
          :src="selectedUser.profilePicture || '/Logos/NexgenLogo.webp'"
          alt="Profile Picture"
        />
      </div>

      <div class="input-grid">
        <!-- User Name -->
        <div class="input-group">
          <label>User Name</label>
          <input
            type="text"
            :value="selectedUser.name"
            @input="onInputChange('name', $event.target.value)"
            placeholder="User Name"
          />
        </div>

        <!-- User Email -->
        <div class="input-group">
          <label>User Email</label>
          <input
            type="text"
            :value="selectedUser.email"
            @input="onInputChange('email', $event.target.value)"
            placeholder="User Email"
          />
        </div>

        <!-- Profile Picture URL -->
        <div class="input-group">
          <label>Profile Picture URL</label>
          <input
            type="text"
            :value="selectedUser.profilePicture"
            @input="onInputChange('profilePicture', $event.target.value)"
            placeholder="Profile Picture URL"
          />
        </div>

        <!-- User Bio -->
        <div class="input-group">
          <label>User Bio</label>
          <textarea
            :value="selectedUser.bio"
            @input="onInputChange('bio', $event.target.value)"
            placeholder="User Bio"
          ></textarea>
        </div>

        <!-- User Role Dropdown -->
        <div class="input-group">
          <label>User Role</label>
          <select
            :value="selectedUser.role"
            @change="onInputChange('role', $event.target.value)"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- Password Fields -->
        <div class="input-group">
          <label>New Password</label>
          <input
            type="password"
            v-model="newPassword"
            placeholder="New Password"
          />
        </div>

        <div class="input-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm Password"
          />
        </div>
      </div>

      <button @click="updatePassword" class="password-button">
        Update Password
      </button>
      <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
      <p v-if="passwordSuccess" class="success-message">
        {{ passwordSuccess }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedUser: Object,
});

const emit = defineEmits(["updateUser"]);

const newPassword = ref("");
const confirmPassword = ref("");
const passwordError = ref("");
const passwordSuccess = ref("");
const isCollapsed = ref(false);
const contentHeight = ref("0px");
const content = ref(null);

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  adjustContentHeight();
}

function adjustContentHeight() {
  nextTick(() => {
    contentHeight.value = isCollapsed.value
      ? "0px"
      : `${content.value.scrollHeight}px`;
  });
}

onMounted(() => {
  adjustContentHeight();
});

function onInputChange(field, value) {
  const updatedUser = { ...props.selectedUser, [field]: value };
  emit("updateUser", updatedUser);
}

function updatePassword() {
  if (
    newPassword.value === confirmPassword.value &&
    newPassword.value.length >= 6
  ) {
    const updatedUser = { ...props.selectedUser, password: newPassword.value };
    emit("updateUser", updatedUser);
    passwordSuccess.value = "Password updated successfully!";
    passwordError.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } else if (newPassword.value !== confirmPassword.value) {
    passwordError.value = "Passwords do not match.";
    passwordSuccess.value = "";
  } else {
    passwordError.value = "Password must be at least 6 characters long.";
    passwordSuccess.value = "";
  }
}
</script>

<style scoped>
.section {
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  user-select: none;
  outline: none;
}

.section-header h2,
.section-header .collapse-icon {
  user-select: none;
  outline: none;
}

.collapse-icon {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.collapsed {
  transform: rotate(-90deg);
}

h2 {
  font-size: 1.4rem;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.content {
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.profile-picture {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.profile-picture img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-group label {
  font-size: 0.8rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.input-group input[type="text"],
.input-group input[type="password"],
.input-group textarea,
.input-group select {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  transition: all 0.3s ease;
  width: 100%;
}

.input-group input:focus,
.input-group textarea:focus,
.input-group select:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
}

.password-button {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  border: none;
  background-color: #4a90e2;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: 500;
  margin: 1rem;
}

.password-button:hover {
  background-color: #357abd;
}

.error-message,
.success-message {
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.error-message {
  color: #d9534f;
}

.success-message {
  color: #5cb85c;
}

/* Responsive adjustments for screens 830px or smaller */
@media (max-width: 830px) {
  .section-header h2 {
    font-size: 1.2rem;
  }

  .profile-picture img {
    width: 80px;
    height: 80px;
  }

  .input-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .password-button {
    width: 100%;
    max-width: 200px;
  }
}
</style>
