<template>
  <div class="section">
    <h2>Product Videos</h2>
    <div
      v-for="(video, index) in localSelectedItem.productVideos"
      :key="index"
      class="input-wrapper"
    >
      <div class="input-group">
        <input
          type="text"
          v-model="localSelectedItem.productVideos[index].url"
          placeholder=" "
          @input="emitUpdate"
        />
        <label>Video URL</label>
      </div>
      <div class="input-group">
        <textarea
          v-model="localSelectedItem.productVideos[index].description"
          placeholder=" "
          @input="emitUpdate"
        ></textarea>
        <label>Video Description</label>
      </div>
      <button @click="removeVideo(index)" class="remove-button">
        Remove Video
      </button>
    </div>
    <button @click="addVideo" class="action-button">Add Video</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

const localSelectedItem = ref({ ...props.selectedItem });

function emitUpdate() {
  emit("updateItem", { ...localSelectedItem.value });
}

function addVideo() {
  localSelectedItem.value.productVideos.push({
    url: "",
    description: "",
  });
  emitUpdate();
}

function removeVideo(index) {
  localSelectedItem.value.productVideos.splice(index, 1);
  emitUpdate();
}

// Sync the prop changes with the local state
watch(
  () => props.selectedItem,
  (newVal) => {
    localSelectedItem.value = { ...newVal };
  },
  { deep: true }
);
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

.input-group input[type="text"],
.input-group textarea {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-group input[type="text"]:focus,
.input-group textarea:focus {
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
.input-group input:not(:placeholder-shown) + label,
.input-group textarea:focus + label,
.input-group textarea:not(:placeholder-shown) + label {
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
