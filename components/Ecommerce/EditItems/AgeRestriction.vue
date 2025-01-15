<template>
  <div class="section">
    <h2>Age Restriction</h2>
    <div class="input-wrapper">
      <input
        type="number"
        :value="selectedItem.ageRestriction.minimumAge"
        @input="onInputChange('ageRestriction.minimumAge', $event.target.value)"
        placeholder=" "
      />
      <label>Minimum Age</label>
    </div>
    <div class="input-wrapper">
      <textarea
        :value="selectedItem.ageRestriction.warningMessage"
        @input="
          onInputChange('ageRestriction.warningMessage', $event.target.value)
        "
        placeholder=" "
      ></textarea>
      <label>Warning Message</label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

function onInputChange(field, value) {
  const fieldParts = field.split(".");
  const updatedItem = { ...props.selectedItem };

  // Nested object update
  updatedItem[fieldParts[0]] = {
    ...updatedItem[fieldParts[0]],
    [fieldParts[1]]: value,
  };

  emit("updateItem", updatedItem);
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
  position: relative;
  margin-bottom: 1.5rem;
}

.input-wrapper input[type="number"],
.input-wrapper textarea {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  margin-bottom: 0.5rem;
  resize: vertical;
}

.input-wrapper input[type="number"]:focus,
.input-wrapper textarea:focus {
  border-color: #4caf50;
  outline: none;
}

.input-wrapper label {
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

.input-wrapper input:focus + label,
.input-wrapper input:not(:placeholder-shown) + label,
.input-wrapper textarea:focus + label,
.input-wrapper textarea:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 0.85rem;
  color: #4caf50;
}

textarea {
  min-height: 100px;
}
</style>
