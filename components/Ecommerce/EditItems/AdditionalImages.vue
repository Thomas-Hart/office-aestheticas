<template>
  <div class="section">
    <h2>Additional Images</h2>
    <div
      v-for="(image, index) in selectedItem.moreImages"
      :key="index"
      class="input-wrapper"
    >
      <input
        type="text"
        :value="image"
        @input="onImageChange(index, $event.target.value)"
        placeholder=" "
      />
      <label>Additional Image Path</label>
      <button @click="removeImage(index)" class="remove-button">
        Remove Image
      </button>
    </div>
    <button @click="addImage" class="action-button">Add Image</button>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

function onImageChange(index, value) {
  const updatedImages = [...props.selectedItem.moreImages];
  updatedImages[index] = value;
  emit("updateItem", { ...props.selectedItem, moreImages: updatedImages });
}

function addImage() {
  const updatedImages = [...props.selectedItem.moreImages, ""];
  emit("updateItem", { ...props.selectedItem, moreImages: updatedImages });
}

function removeImage(index) {
  const updatedImages = props.selectedItem.moreImages.filter(
    (_, i) => i !== index
  );
  emit("updateItem", { ...props.selectedItem, moreImages: updatedImages });
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
  font-size: 1.5rem;
  color: #333;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-wrapper input[type="text"] {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-wrapper input[type="text"]:focus {
  border-color: #4caf50;
  outline: none;
}

.input-wrapper label {
  position: absolute;
  top: 30%;
  left: 10px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  background: #fff;
  padding: 0 5px;
  color: #999;
  pointer-events: none;
}

.input-wrapper input:focus + label,
.input-wrapper input:not(:placeholder-shown) + label {
  top: -10px;
  left: 5px;
  font-size: 0.85rem;
  color: #4caf50;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  margin-top: 0.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  width: 100%;
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
