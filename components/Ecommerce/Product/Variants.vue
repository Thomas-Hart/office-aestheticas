<template>
  <div class="variant-selector">
    <!-- Loop through each available attribute -->
    <div
      v-for="attribute in availableAttributes"
      :key="attribute"
      class="attribute-section"
    >
      <div class="attribute-label">
        <h2 class="attribute-name">{{ capitalize(attribute) }}:</h2>
        <h2 v-if="attribute !== 'color'" class="current-attribute">
          {{ selectedAttributes[attribute] }}
        </h2>
        <h2
          v-else-if="
            attribute === 'color' &&
            selectedAttributes[attribute] &&
            selectedAttributes[attribute].name
          "
          class="current-attribute"
          :style="{ color: '#' + selectedAttributes[attribute].hex }"
        >
          {{ selectedAttributes[attribute].name }}
        </h2>
      </div>

      <!-- Apply class only for non-color attributes -->
      <div
        :class="
          attribute !== 'color'
            ? 'attribute-options'
            : 'color-attribute-options'
        "
      >
        <div
          v-for="option in getOptions(attribute)"
          :key="option.value.name || option.value"
          :class="[
            {
              'attribute-option': attribute !== 'color',
              'color-circle': attribute === 'color',
              selected: isSelected(attribute, option.value),
              unavailable: !option.isAvailable,
              'out-of-stock': option.isOutOfStock,
            },
          ]"
          @click="selectOption(attribute, option)"
        >
          <!-- Display a color circle if the attribute is color, otherwise show text -->
          <div
            v-if="attribute === 'color'"
            :style="{ backgroundColor: '#' + option.value.hex }"
            class="color"
          ></div>
          <div class="option" v-else>
            <div class="option-text">
              {{ option.value }}
            </div>
            <div class="availability-container">
              <h3 v-if="option.isOutOfStock">Out Of Stock</h3>
              <h3 v-else-if="!option.isAvailable">See Available Options</h3>
              <h3 v-else class="in-stock">In Stock</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define props
const props = defineProps({
  variants: {
    type: Array,
    required: true,
  },
});

// Emits event to parent when a variant is selected
const emit = defineEmits(["variant-selected"]);

// Store the selected attributes (e.g., color, size, etc.)
const selectedAttributes = ref({});
const selectedVariant = ref(props.variants[0]);

// Capitalize attribute names for display
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Get unique options for a specific attribute and check availability
const getOptions = (attribute) => {
  const options = props.variants
    .map((variant) => variant[attribute])
    .filter((option) => option !== undefined && option !== null);

  const uniqueOptions = Array.from(
    new Set(options.map((option) => JSON.stringify(option)))
  ).map((str) => JSON.parse(str));

  const optionsWithAvailability = uniqueOptions.map((option) => {
    const isAvailable =
      attribute === availableAttributes[0] ||
      checkAvailability(attribute, option);
    let isOutOfStock = false;
    if (isAvailable) {
      isOutOfStock = checkStock(attribute, option);
    }

    return {
      value: option,
      isAvailable,
      isOutOfStock,
    };
  });

  // Sort options: available first, then out of stock, and then unavailable
  return optionsWithAvailability.sort((a, b) => {
    if (a.isAvailable && !b.isAvailable) return -1;
    if (!a.isAvailable && b.isAvailable) return 1;
    if (a.isAvailable && b.isAvailable) return a.isOutOfStock ? 1 : -1;
    return 0;
  });
};

// JUST GOTTA FIX THIS FUNCTION TO PROPERLY FIND STOCK
// Check if an option is out of stock based on selected attributes
const checkStock = (attribute, option) => {
  const attributeIndex = availableAttributes.value.indexOf(attribute);

  // Step 1: Loop through variants and check if any matching ones are in stock
  const isOutOfStock = props.variants.every((variant) => {
    let isMatching = true;

    // Loop through attributes up to and including the current one
    for (let i = 0; i <= attributeIndex; i++) {
      const currentAttr = availableAttributes.value[i];
      const selectedValue = selectedAttributes.value[currentAttr];

      // Special case for color comparison
      if (currentAttr === "color") {
        // If we are checking color attribute, compare color objects
        const optionMatches =
          currentAttr === attribute
            ? variant[currentAttr]?.name === option.name // Compare with the option being checked
            : variant[currentAttr]?.name === selectedValue?.name; // Compare with selected color

        isMatching = isMatching && optionMatches;
      } else {
        // For all other attributes, use direct comparison
        const optionMatches =
          currentAttr === attribute
            ? variant[currentAttr] === option // Compare with the option being checked
            : variant[currentAttr] === selectedValue; // Compare with selected option

        isMatching = isMatching && optionMatches;
      }

      // If a mismatch is found, break out of the loop
      if (!isMatching) break;
    }

    // If the variant matches all required attributes, check its stock
    if (isMatching) {
      return variant.stock === 0; // If variant is out of stock, keep checking others
    }

    // If no match, it's irrelevant, keep looking at other variants
    return true;
  });

  // Step 2: If any variant matches and is in stock, return false; otherwise, return true
  return isOutOfStock;
};

// Function to handle option selection
function selectOption(attribute, option) {
  if (!option.isAvailable) {
    const availableVariant = props.variants.find((variant) =>
      attribute === "color"
        ? variant[attribute]?.name === option.value.name // Handle color comparison
        : variant[attribute] === option.value
    );

    if (availableVariant) {
      // Update the selectedAttributes to match the found variant
      const newSelectedAttributes = { ...selectedAttributes.value }; // Create a new object to trigger reactivity
      Object.keys(newSelectedAttributes).forEach((key) => {
        newSelectedAttributes[key] = availableVariant[key];
      });
      selectedAttributes.value = newSelectedAttributes; // Assign the new object
    }
  } else {
    const newSelectedAttributes = { ...selectedAttributes.value }; // Create a new object to trigger reactivity
    newSelectedAttributes[attribute] = option.value; // Update the changed attribute
    selectedAttributes.value = newSelectedAttributes; // Assign the new object
  }

  // Recalculate lower attributes if a higher attribute is changed
  const attributeIndex = availableAttributes.value.indexOf(attribute);

  if (attributeIndex < availableAttributes.value.length - 1) {
    availableAttributes.value
      .slice(attributeIndex + 1)
      .forEach((lowerAttribute) => {
        const options = getOptions(lowerAttribute);
        const availableOption = options.find((option) => option.isAvailable);
        const newSelectedAttributes = { ...selectedAttributes.value }; // Create a new object to trigger reactivity
        newSelectedAttributes[lowerAttribute] = availableOption
          ? availableOption.value
          : null;
        selectedAttributes.value = newSelectedAttributes; // Assign the new object
      });
  }

  // Ensure the selected variant is an exact match from the variants array
  const variant = props.variants.find((v) =>
    Object.keys(selectedAttributes.value).every((attribute) =>
      attribute === "color"
        ? v[attribute]?.name === selectedAttributes.value[attribute]?.name // Handle color comparison
        : v[attribute] === selectedAttributes.value[attribute]
    )
  );

  selectedVariant.value = variant || props.variants[0]; // Default to first variant
  emit("variant-selected", selectedVariant.value);
}

// On mount, select the first variant by default and set up the initial attributes
onMounted(() => {
  const defaultVariant = props.variants[0];
  Object.keys(defaultVariant).forEach((attribute) => {
    if (
      availableAttributes.value.includes(attribute) &&
      selectableAttributes.includes(attribute)
    ) {
      selectedAttributes.value[attribute] = defaultVariant[attribute];
    }
  });
  selectedVariant.value = defaultVariant;
  emit("variant-selected", selectedVariant.value);
});

// Check if an option is available based on higher selected attributes
const checkAvailability = (attribute, option) => {
  const attributeIndex = availableAttributes.value.indexOf(attribute);

  // If this is the first attribute in the hierarchy (e.g., color), always return true
  if (attributeIndex === 0) {
    return true;
  }

  // For other attributes, check the availability based on selected attributes above it in the hierarchy
  return props.variants.some((variant) => {
    const matchesCurrentOption =
      attribute === "color"
        ? variant[attribute]?.name === option.name // Special case for color object comparison
        : variant[attribute] === option;

    if (!matchesCurrentOption) {
      return false; // Skip this variant
    }

    // Check if the variant matches the selected options for all previous attributes in the hierarchy
    const matchesPreviousAttributes = availableAttributes.value
      .slice(0, attributeIndex)
      .every((prevAttribute) => {
        const selectedValue = selectedAttributes.value[prevAttribute];
        if (prevAttribute === "color") {
          return selectedValue?.name === variant[prevAttribute]?.name; // Special handling for color comparison
        }
        return selectedValue === variant[prevAttribute];
      });

    return matchesCurrentOption && matchesPreviousAttributes;
  });
};

const selectableAttributes = [
  "color",
  "size",
  "material",
  "style",
  "capacity",
  "flavor",
  "scent",
  "power",
  "length",
  "region",
];

// Compute which attributes are available across all variants
const availableAttributes = computed(() => {
  const attributes = [
    "color",
    "size",
    "material",
    "style",
    "capacity",
    "flavor",
    "scent",
    "power",
    "length",
    "region",
  ];
  return attributes.filter((attribute) =>
    props.variants.some((variant) => variant[attribute])
  );
});

// Determine if an option is selected (for styles)
const isSelected = (attribute, option) =>
  attribute === "color"
    ? selectedAttributes.value[attribute]?.name === option.name // Special handling for color comparison
    : selectedAttributes.value[attribute] === option;
</script>

<style scoped>
.variants {
  margin-top: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: white;
}

.attribute-section {
  margin-bottom: 2rem;
}

.attribute-label {
  display: flex;
  gap: 0.3rem;
}

.attribute-name {
  color: #ccc;
  font-weight: lighter;
}

.current-attribute {
  color: white;
}

.attribute-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.color-attribute-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.attribute-option {
  padding: 2px;
  border: 5px solid transparent;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-width: 7rem;
  text-align: center;
  background: white;
  position: relative;
  color: black;
  border-radius: 10px;
  overflow: hidden;
}

.attribute-option.selected {
  border-color: rgb(0, 113, 133);
  background: rgb(237, 253, 255);
}

.attribute-option:hover {
  border-color: rgb(0, 113, 133);
}

.unavailable {
  color: white;
  background-color: rgba(0, 0, 0, 0.1); /* Red background for unavailable */
  cursor: not-allowed;
  opacity: 0.8;
  border-color: rgba(0, 0, 0, 0.1);
  position: relative;
}

.out-of-stock {
  color: #757575; /* Gray text for out-of-stock */
  background-color: #e0e0e0; /* Light gray background for out-of-stock */
  cursor: not-allowed;
  border-color: #757575;
  position: relative;
}

.color-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.color {
  width: 110%;
  height: 110%;
}

.option {
  display: flex;
  flex-direction: column;
}

.option-text {
  flex: 2;
  padding: 5px;
  font-weight: bold;
  border-bottom: 2px solid #333;
}

.availability-container {
  background: white;
  color: black;
  padding: 5px;
  font-size: 0.7rem;
  border-radius: 5px;
  flex: 1;
}

.availability-container .out-of-stock {
  color: gray;
}

.availability-container .unavailable {
  color: #d32f2f;
}

.in-stock {
  color: green;
}

.label {
  margin-top: 5px;
  color: white;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  white-space: nowrap;
}

.unavailable-label {
  background-color: #d32f2f; /* Red for unavailable label */
}

.out-of-stock-label {
  background-color: #757575; /* Gray for out of stock label */
}

.color-circle.selected {
  border-color: rgb(0, 113, 133);
  transform: scale(1.15);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
}
</style>
