<template>
  <div class="section">
    <h2>Gift Options</h2>
    <div class="checkbox-wrapper">
      <input
        type="checkbox"
        v-model="localSelectedItem.giftOptions.isGiftWrappable"
        id="isGiftWrappable"
        @change="emitUpdate"
      />
      <label for="isGiftWrappable">Is Gift Wrappable</label>
    </div>
    <div class="input-wrapper">
      <div
        v-for="(message, index) in localSelectedItem.giftOptions
          .availableGiftMessages"
        :key="index"
        class="message-group"
      >
        <input
          type="text"
          v-model="localSelectedItem.giftOptions.availableGiftMessages[index]"
          @input="emitUpdate"
          placeholder="Enter gift message"
        />
        <button @click="removeMessage(index)" class="remove-button">
          Remove Message
        </button>
      </div>
      <button @click="addMessage" class="action-button">
        Add Gift Message
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

const localSelectedItem = ref({ ...props.selectedItem });

function emitUpdate() {
  emit("updateItem", { ...localSelectedItem.value });
}

function addMessage() {
  localSelectedItem.value.giftOptions.availableGiftMessages.push("");
  emitUpdate();
}

function removeMessage(index) {
  localSelectedItem.value.giftOptions.availableGiftMessages.splice(index, 1);
  emitUpdate();
}

// Keep localSelectedItem in sync with props.selectedItem
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

.checkbox-wrapper {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.checkbox-wrapper input[type="checkbox"] {
  margin-right: 10px;
}

.checkbox-wrapper label {
  margin: 0;
  padding: 0;
  font-size: 1rem;
  color: #666;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.message-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.message-group input[type="text"] {
  flex: 1;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.message-group input[type="text"]:focus {
  border-color: #4caf50;
  outline: none;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  margin-left: 10px;
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
