<template>
  <div class="section">
    <h2>Account Preferences</h2>

    <!-- Email Preferences -->
    <h3>Email Preferences</h3>
    <div
      class="input-wrapper"
      v-for="(value, key) in selectedUser.accountSettings.emailPreferences"
      :key="key"
    >
      <input
        type="checkbox"
        :checked="value"
        @change="
          onPreferencesChange(['emailPreferences', key], $event.target.checked)
        "
      />
      <label>{{ key.replace(/([A-Z])/g, " $1") }}</label>
    </div>

    <!-- Browser Notifications -->
    <h3>Browser Notifications</h3>
    <div
      class="input-wrapper"
      v-for="(value, key) in selectedUser.accountSettings.browserNotifications"
      :key="key"
    >
      <input
        type="checkbox"
        :checked="value"
        @change="
          onPreferencesChange(
            ['browserNotifications', key],
            $event.target.checked
          )
        "
      />
      <label>{{ key.replace(/([A-Z])/g, " $1") }}</label>
    </div>

    <!-- App Preferences -->
    <h3>App Preferences</h3>
    <div class="input-wrapper">
      <label>Theme:</label>
      <select
        :value="selectedUser.accountSettings.appPreferences.theme"
        @change="
          onPreferencesChange(['appPreferences', 'theme'], $event.target.value)
        "
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>

    <div class="input-wrapper">
      <label>Language:</label>
      <input
        type="text"
        :value="selectedUser.accountSettings.appPreferences.language"
        @input="
          onPreferencesChange(
            ['appPreferences', 'language'],
            $event.target.value
          )
        "
        placeholder="Language"
      />
    </div>

    <div class="input-wrapper">
      <label>Time Zone:</label>
      <input
        type="text"
        :value="selectedUser.accountSettings.appPreferences.timeZone"
        @input="
          onPreferencesChange(
            ['appPreferences', 'timeZone'],
            $event.target.value
          )
        "
        placeholder="Time Zone"
      />
    </div>

    <!-- Data Privacy Settings -->
    <h3>Data Privacy</h3>
    <div
      class="input-wrapper"
      v-for="(value, key) in selectedUser.accountSettings.dataPrivacy"
      :key="key"
    >
      <input
        type="checkbox"
        :checked="value"
        @change="
          onPreferencesChange(['dataPrivacy', key], $event.target.checked)
        "
      />
      <label>{{ key.replace(/([A-Z])/g, " $1") }}</label>
    </div>

    <!-- Enable All Notifications -->
    <div class="input-wrapper">
      <input
        type="checkbox"
        :checked="
          selectedUser.accountSettings.notifications.enableAllNotifications
        "
        @change="
          onPreferencesChange(
            ['notifications', 'enableAllNotifications'],
            $event.target.checked
          )
        "
      />
      <label>Enable All Notifications</label>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  selectedUser: Object,
});

const emit = defineEmits(["updateUser"]);

// Function to update nested user account settings
function onPreferencesChange(path, value) {
  const [category, subField] = path;

  const updatedPreferences = {
    ...props.selectedUser.accountSettings,
    [category]: {
      ...props.selectedUser.accountSettings[category],
      [subField]: value,
    },
  };

  const updatedUser = {
    ...props.selectedUser,
    accountSettings: updatedPreferences,
  };

  emit("updateUser", updatedUser);
}
</script>
  
  <style scoped>
.section {
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
}

h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #555;
}

.input-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.input-wrapper input[type="checkbox"] {
  margin-right: 10px;
  cursor: pointer;
}

.input-wrapper label {
  font-size: 1rem;
  color: #333;
}

.input-wrapper select,
.input-wrapper input[type="text"] {
  margin-left: 10px;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  flex: 1;
}

input[type="text"]:focus,
select:focus {
  border-color: #4caf50;
  outline: none;
}
</style>
  