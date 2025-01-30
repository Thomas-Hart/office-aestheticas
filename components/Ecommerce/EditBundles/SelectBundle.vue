<template>
  <div class="section">
    <h2>Select Bundle</h2>
    <select
      v-model="selectedBundleId"
      @change="onBundleSelected"
      class="dropdown-button"
    >
      <option disabled value="">Please select one</option>
      <option
        v-for="bundle in sortedBundles"
        :key="bundle._id"
        :value="bundle._id"
      >
        {{ bundle.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  bundles: Array, // Array of available bundles
});

const emit = defineEmits(["bundleSelected"]);

const selectedBundleId = ref(""); // Ensure no bundle is selected by default

// Sort the bundles alphabetically by name
const sortedBundles = computed(() => {
  return [...props.bundles].sort((a, b) => a.name.localeCompare(b.name));
});

// Emit the selected bundle ID to the parent component when a bundle is selected
function onBundleSelected() {
  emit("bundleSelected", selectedBundleId.value);
}
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

.dropdown-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  transition: background-color 0.3s, color 0.3s;
}

.dropdown-button:hover {
  background-color: #ff8210;
  color: white;
}
</style>
