<template>
  <div class="section">
    <h2>AR Links</h2>
    <div
      v-for="(link, index) in selectedItem.arLinks"
      :key="index"
      class="input-wrapper"
    >
      <div class="input-group">
        <input
          type="text"
          v-model="selectedItem.arLinks[index]"
          placeholder=" "
        />
        <label>AR Link</label>
      </div>
      <button @click="removeLink(index)" class="remove-button">
        Remove Link
      </button>
    </div>
    <button @click="addLink" class="action-button">Add AR Link</button>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  selectedItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["updateItem"]);

function addLink() {
  const updatedLinks = [...props.selectedItem.arLinks, ""];
  emit("updateItem", {
    ...props.selectedItem,
    arLinks: updatedLinks,
  });
}

function removeLink(index) {
  const updatedLinks = [...props.selectedItem.arLinks];
  updatedLinks.splice(index, 1);
  emit("updateItem", {
    ...props.selectedItem,
    arLinks: updatedLinks,
  });
}
</script>
  
  <style scoped>
.section {
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
}

.input-wrapper {
  margin-bottom: 1.5rem;
}

.input-group {
  position: relative;
  margin-bottom: 1rem;
}

.input-group input[type="text"] {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  margin-bottom: 0.5rem;
}

.input-group input[type="text"]:focus {
  border-color: #4caf50;
  outline: none;
}

.input-group label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  background: #fff;
  padding: 0 5px;
  color: #999;
  pointer-events: none;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 0.85rem;
  color: #4caf50;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  width: 100%;
  margin-top: 0.5rem;
}

.remove-button:hover {
  background-color: #c0392b;
}

.action-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  margin-bottom: 1rem;
  width: 100%;
  transition: background-color 0.3s, color 0.3s;
}

.action-button:hover {
  background-color: #ff8210;
  color: white;
}
</style>
  