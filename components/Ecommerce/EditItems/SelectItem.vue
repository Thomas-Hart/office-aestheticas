<template>
  <div class="section">
    <h2>Select Item</h2>
    <select
      v-model="selectedItemId"
      @change="onItemSelected"
      class="dropdown-button"
    >
      <option disabled value="">Please select one</option>
      <option v-for="item in sortedItems" :key="item._id" :value="item._id">
        {{ item.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  items: Array,
});

const emit = defineEmits(["itemSelected"]);

const selectedItemId = ref(""); // Ensure no item is selected by default

const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => a.name.localeCompare(b.name));
});

function onItemSelected(event) {
  emit("itemSelected", selectedItemId.value);
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
