<template>
  <div class="section">
    <h2>General Information</h2>
    <!-- Bundle Name -->
    <div class="input-wrapper">
      <input
        type="text"
        :value="selectedBundle.name"
        @input="onInputChange('name', $event.target.value)"
        placeholder=" "
      />
      <label>Bundle Name</label>
    </div>

    <!-- Bundle Price -->
    <div class="input-wrapper">
      <input
        type="number"
        :value="selectedBundle.price"
        @input="onInputChange('price', $event.target.value)"
        placeholder=" "
      />
      <label>Bundle Price</label>
    </div>

    <!-- Bundle Discount Percentage -->
    <div class="input-wrapper">
      <input
        type="number"
        :value="selectedBundle.discountPercentage"
        @input="onInputChange('discountPercentage', $event.target.value)"
        placeholder=" "
      />
      <label>Discount Percentage</label>
    </div>

    <!-- Bundle Stock -->
    <div class="input-wrapper">
      <input
        type="number"
        :value="selectedBundle.stock"
        @input="onInputChange('stock', $event.target.value)"
        placeholder=" "
      />
      <label>Bundle Stock</label>
    </div>

    <!-- Bundle Description -->
    <div class="input-wrapper">
      <textarea
        :value="selectedBundle.description"
        @input="onInputChange('description', $event.target.value)"
        placeholder=" "
      ></textarea>
      <label>Bundle Description</label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedBundle: Object,
});

const emit = defineEmits(["updateBundle"]);

// Function to handle input changes
function onInputChange(field, value) {
  const updatedBundle = { ...props.selectedBundle, [field]: value };
  emit("updateBundle", updatedBundle);
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

.input-wrapper input[type="text"],
.input-wrapper input[type="number"],
.input-wrapper textarea {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-wrapper input[type="text"]:focus,
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
  left: 5px;
  font-size: 0.85rem;
  color: #4caf50;
}
</style>
