<template>
  <div class="section">
    <h2>Shipping Info</h2>
    <div class="input-wrapper">
      <input
        type="number"
        :value="selectedItem.shippingInfo.weight"
        @input="onInputChange('shippingInfo.weight', $event.target.value)"
        placeholder=" "
      />
      <label>Weight (kg)</label>
    </div>
    <div class="input-wrapper">
      <input
        type="number"
        :value="selectedItem.shippingInfo.dimensions.length"
        @input="
          onInputChange('shippingInfo.dimensions.length', $event.target.value)
        "
        placeholder=" "
      />
      <label>Length (cm)</label>
    </div>
    <div class="input-wrapper">
      <input
        type="number"
        :value="selectedItem.shippingInfo.dimensions.width"
        @input="
          onInputChange('shippingInfo.dimensions.width', $event.target.value)
        "
        placeholder=" "
      />
      <label>Width (cm)</label>
    </div>
    <div class="input-wrapper">
      <input
        type="number"
        :value="selectedItem.shippingInfo.dimensions.height"
        @input="
          onInputChange('shippingInfo.dimensions.height', $event.target.value)
        "
        placeholder=" "
      />
      <label>Height (cm)</label>
    </div>
    <div class="checkbox-wrapper">
      <input
        type="checkbox"
        :checked="selectedItem.shippingInfo.freeShippingEligible"
        @change="
          onInputChange(
            'shippingInfo.freeShippingEligible',
            $event.target.checked
          )
        "
        id="freeShippingEligible"
      />
      <label for="freeShippingEligible">Free Shipping Eligible</label>
    </div>
    <div class="input-wrapper">
      <textarea
        :value="availableRegions"
        @input="
          onInputChange('shippingInfo.availableRegions', $event.target.value)
        "
        placeholder=" "
      ></textarea>
      <label>Available Regions (comma-separated)</label>
    </div>
    <div class="input-wrapper">
      <input
        type="text"
        :value="selectedItem.shippingInfo.estimatedDeliveryTime"
        @input="
          onInputChange(
            'shippingInfo.estimatedDeliveryTime',
            $event.target.value
          )
        "
        placeholder=" "
      />
      <label>Estimated Delivery Time</label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

// Handling availableRegions as a computed property for proper two-way binding
const availableRegions = computed({
  get() {
    return (props.selectedItem.shippingInfo.availableRegions || []).join(", ");
  },
  set(newValue) {
    onInputChange(
      "shippingInfo.availableRegions",
      newValue.split(",").map((region) => region.trim())
    );
  },
});

// Function to handle input changes and emit updates
function onInputChange(field, value) {
  const fieldParts = field.split(".");
  const updatedItem = { ...props.selectedItem };

  if (fieldParts.length === 2) {
    updatedItem[fieldParts[0]] = {
      ...updatedItem[fieldParts[0]],
      [fieldParts[1]]: value,
    };
  } else if (fieldParts.length === 3) {
    updatedItem[fieldParts[0]] = {
      ...updatedItem[fieldParts[0]],
      [fieldParts[1]]: {
        ...updatedItem[fieldParts[0]][fieldParts[1]],
        [fieldParts[2]]: value,
      },
    };
  }

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
.input-wrapper input[type="text"],
.input-wrapper textarea {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-wrapper input[type="number"]:focus,
.input-wrapper input[type="text"]:focus,
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
</style>
