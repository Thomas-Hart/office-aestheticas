<template>
  <div class="sidebar">
    <h2>Select User</h2>
    <div class="input-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by name or email"
        class="search-bar"
      />
    </div>
    <ul class="user-list">
      <li
        v-for="user in filteredUsers"
        :key="user._id"
        :class="{ active: user._id === selectedUserId }"
        @click="selectUser(user._id)"
      >
        <div v-html="highlightMatch(user.name)"></div>
        <div class="email" v-html="highlightMatch(user.email)"></div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({ users: Array });
const emit = defineEmits(["userSelected"]);
const selectedUserId = ref("");
const searchQuery = ref("");

// Sort and filter users based on the search query
const filteredUsers = computed(() => {
  return [...props.users]
    .filter((user) => {
      const searchLower = searchQuery.value.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));
});

// Highlight matching text in the name or email
function highlightMatch(text) {
  if (!searchQuery.value) return text;
  const regex = new RegExp(`(${searchQuery.value})`, "gi");
  return text.replace(regex, "<span class='highlight'>$1</span>");
}

function selectUser(userId) {
  selectedUserId.value = userId;
  emit("userSelected", userId);
}
</script>

<style scoped>
.sidebar {
  width: 300px;
  background: #f4f5f7;
  border-right: 1px solid #ddd;
}

h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 1rem 0 1rem 18px;
}

.input-wrapper {
  padding: 0 10px;
}

.search-bar {
  width: 100%;
  padding: 8px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(173, 216, 230, 0.15); /* Light transparent blue */
}

.user-list li {
  padding: 10px 18px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #ddd;
}

.user-list li:hover,
.user-list li.active {
  background: rgba(74, 144, 226, 0.3); /* Active blue */
}

.email {
  color: #444;
  font-weight: lighter;
}

.highlight {
  background-color: yellow;
  font-weight: bold;
}

@media (max-width: 1160px) {
  .sidebar {
    width: 100%;
    border-right: none;
  }
}
</style>
