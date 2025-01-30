<template>
  <div class="variant-editor">
    <h4>Edit Variant</h4>

    <!-- Essential Inputs (Always Visible) -->
    <div class="input-wrapper">
      <input
        type="number"
        :value="variant.price"
        @input="updateField('price', $event)"
        placeholder=" "
      />
      <label>Price</label>
    </div>

    <div class="input-wrapper">
      <input
        type="number"
        :value="variant.stock"
        @input="updateField('stock', $event)"
        placeholder=" "
      />
      <label>Stock</label>
    </div>

    <div class="input-wrapper">
      <input
        type="text"
        :value="variant.sku"
        @input="updateField('sku', $event)"
        placeholder=" "
      />
      <label>SKU</label>
    </div>

    <div class="input-wrapper">
      <input
        type="text"
        :value="variant.image"
        @input="updateField('image', $event)"
        placeholder=" "
      />
      <label>Image</label>
    </div>

    <!-- Optional Inputs (Hidden until "+" is clicked) -->
    <div class="optional-fields">
      <!-- Grouped Color and Hex Inputs -->
      <div v-if="showField('color')" class="input-wrapper">
        <input
          type="text"
          :value="variant.color.name"
          @input="updateField('color.name', $event)"
          placeholder=" "
        />
        <label>Color</label>
      </div>
      <div v-if="showField('color')" class="input-wrapper">
        <input
          type="text"
          :value="variant.color.hex"
          @input="updateField('color.hex', $event)"
          placeholder=" "
        />
        <label>Hex</label>
      </div>

      <div v-if="showField('size')" class="input-wrapper">
        <input
          type="text"
          :value="variant.size"
          @input="updateField('size', $event)"
          placeholder=" "
        />
        <label>Size</label>
      </div>

      <div v-if="showField('material')" class="input-wrapper">
        <input
          type="text"
          :value="variant.material"
          @input="updateField('material', $event)"
          placeholder=" "
        />
        <label>Material</label>
      </div>

      <div v-if="showField('style')" class="input-wrapper">
        <input
          type="text"
          :value="variant.style"
          @input="updateField('style', $event)"
          placeholder=" "
        />
        <label>Style</label>
      </div>

      <div v-if="showField('capacity')" class="input-wrapper">
        <input
          type="text"
          :value="variant.capacity"
          @input="updateField('capacity', $event)"
          placeholder=" "
        />
        <label>Capacity</label>
      </div>

      <div v-if="showField('flavor')" class="input-wrapper">
        <input
          type="text"
          :value="variant.flavor"
          @input="updateField('flavor', $event)"
          placeholder=" "
        />
        <label>Flavor</label>
      </div>

      <div v-if="showField('scent')" class="input-wrapper">
        <input
          type="text"
          :value="variant.scent"
          @input="updateField('scent', $event)"
          placeholder=" "
        />
        <label>Scent</label>
      </div>

      <div v-if="showField('power')" class="input-wrapper">
        <input
          type="text"
          :value="variant.power"
          @input="updateField('power', $event)"
          placeholder=" "
        />
        <label>Power</label>
      </div>

      <div v-if="showField('length')" class="input-wrapper">
        <input
          type="text"
          :value="variant.length"
          @input="updateField('length', $event)"
          placeholder=" "
        />
        <label>Length</label>
      </div>

      <div v-if="showField('region')" class="input-wrapper">
        <input
          type="text"
          :value="variant.region"
          @input="updateField('region', $event)"
          placeholder=" "
        />
        <label>Region</label>
      </div>

      <!-- Optional Dimensions Input (Length, Width, Height) -->
      <div v-if="showField('dimensions')" class="input-wrapper">
        <input
          type="number"
          :value="variant.dimensions.length"
          @input="updateField('dimensions.length', $event)"
          placeholder=" "
        />
        <label>Length (cm)</label>
      </div>
      <div v-if="showField('dimensions')" class="input-wrapper">
        <input
          type="number"
          :value="variant.dimensions.width"
          @input="updateField('dimensions.width', $event)"
          placeholder=" "
        />
        <label>Width (cm)</label>
      </div>
      <div v-if="showField('dimensions')" class="input-wrapper">
        <input
          type="number"
          :value="variant.dimensions.height"
          @input="updateField('dimensions.height', $event)"
          placeholder=" "
        />
        <label>Height (cm)</label>
      </div>

      <!-- Plus buttons to toggle optional fields -->
      <div class="optional-buttons">
        <button v-if="!showField('color')" @click="toggleField('color')">
          + Add Color
        </button>
        <button v-if="!showField('size')" @click="toggleField('size')">
          + Add Size
        </button>
        <button v-if="!showField('material')" @click="toggleField('material')">
          + Add Material
        </button>
        <button v-if="!showField('style')" @click="toggleField('style')">
          + Add Style
        </button>
        <button v-if="!showField('capacity')" @click="toggleField('capacity')">
          + Add Capacity
        </button>
        <button v-if="!showField('flavor')" @click="toggleField('flavor')">
          + Add Flavor
        </button>
        <button v-if="!showField('scent')" @click="toggleField('scent')">
          + Add Scent
        </button>
        <button v-if="!showField('power')" @click="toggleField('power')">
          + Add Power
        </button>
        <button v-if="!showField('length')" @click="toggleField('length')">
          + Add Length
        </button>
        <button v-if="!showField('region')" @click="toggleField('region')">
          + Add Region
        </button>
        <button
          v-if="!showField('dimensions')"
          @click="toggleField('dimensions')"
        >
          + Add Dimensions
        </button>
      </div>
    </div>

    <!-- Action Buttons (Remove and Duplicate) -->
    <div class="action-buttons">
      <button @click="emitRemove" class="remove-button">Remove Variant</button>
      <button @click="emitDuplicate" class="duplicate-button">
        Duplicate Variant
      </button>
    </div>

    <img :src="'/ItemPics/' + variant.image" alt="" />
  </div>
</template>
    
<script setup>
const props = defineProps({
  variant: Object,
});

const emit = defineEmits(["updateVariant", "removeVariant", "emitDuplicate"]);

// Initialize visibleFields based on whether the variant object has values or not
const visibleFields = ref({});

function initializeVisibleFields() {
  visibleFields.value = {
    color:
      props.variant.color &&
      (props.variant.color.name || props.variant.color.hex),
    size: !!props.variant.size,
    material: !!props.variant.material,
    style: !!props.variant.style,
    capacity: !!props.variant.capacity,
    flavor: !!props.variant.flavor,
    scent: !!props.variant.scent,
    power: !!props.variant.power,
    length: !!props.variant.length,
    region: !!props.variant.region,
    dimensions:
      props.variant.dimensions &&
      (props.variant.dimensions.length ||
        props.variant.dimensions.width ||
        props.variant.dimensions.height),
  };
}

// Call initializeVisibleFields on component mount
onMounted(() => {
  initializeVisibleFields();
});

// Also watch for changes to the variant prop and reinitialize visibleFields
watch(() => props.variant, initializeVisibleFields, { deep: true });

// Function to update the field value in the variant
function updateField(field, event) {
  const value = event.target.value;
  const updatedVariant = { ...props.variant };

  // Handle nested fields (e.g., color.name, color.hex, dimensions.length)
  if (field.includes(".")) {
    const [key, subKey] = field.split(".");
    updatedVariant[key][subKey] = value;
  } else {
    updatedVariant[field] = value;
  }

  // Emit the updated variant to the parent component
  emit("updateVariant", updatedVariant);
}

// Toggle the visibility of a field
function toggleField(field) {
  visibleFields.value[field] = !visibleFields.value[field];
}

// Check if a field should be shown
function showField(field) {
  return visibleFields.value[field];
}

// Emit the 'removeVariant' event to the parent component
function emitRemove() {
  emit("removeVariant");
}

function emitDuplicate() {
  // Perform a deep copy of the variant to break references to nested objects
  const duplicateVariant = JSON.parse(JSON.stringify(props.variant));

  // Optionally clear the SKU for the duplicated variant to avoid duplication issues
  duplicateVariant.sku = "";
  delete duplicateVariant._id;

  emit("duplicateVariant", duplicateVariant);
}
</script>

<style scoped>
.variant-editor {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Use 2 columns for tighter layout */
  gap: 1rem;
}

.input-wrapper {
  position: relative;
  margin-bottom: 0.75rem;
}

.input-wrapper input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-wrapper label {
  position: absolute;
  top: -8px;
  left: 10px;
  background: #f9f9f9;
  padding: 0 4px;
  font-size: 0.8rem;
  color: #999;
}

.remove-button {
  grid-column: 1;
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.remove-button:hover {
  background-color: #c0392b;
}

.duplicate-button {
  background-color: #007bff;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.duplicate-button:hover {
  background-color: #0056b3;
}

.optional-buttons {
  grid-column: span 2; /* Make the buttons span across all columns */
}

.optional-buttons button {
  margin-right: 0.5rem;
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.optional-buttons button:hover {
  background-color: #0056b3;
}

img {
  width: 100%;
}
</style>
  