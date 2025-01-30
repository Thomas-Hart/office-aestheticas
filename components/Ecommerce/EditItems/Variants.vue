<template>
  <div class="section">
    <h2>Variants</h2>

    <!-- Add New Variant -->
    <button @click="addVariant" class="action-button">Add Variant</button>

    <!-- Variant List -->
    <div
      v-for="(variant, index) in variants"
      :key="index"
      class="variant-wrapper"
    >
      <EcommerceEditItemsVariantEditor
        :variant="variant"
        @updateVariant="updateVariant(index, $event)"
        @removeVariant="removeVariant(index)"
        @duplicateVariant="duplicateVariant($event)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

// Store all variants as an array
const variants = ref([]);

// Initialize the variants from the selectedItem prop
function initializeVariants() {
  variants.value = [...props.selectedItem.variants];
}

onMounted(() => {
  initializeVariants();
});

// Watch for changes to the selectedItem prop and reinitialize the variants
watch(
  () => props.selectedItem,
  () => {
    initializeVariants();
  },
  { deep: true }
);

// Function to add a new variant
function addVariant() {
  const newVariant = {
    color: {
      name: "", // Name of the color (e.g., "Red")
      hex: "", // Hex code of the color (e.g., "#FF0000")
    },
    size: "",
    material: "",
    style: "",
    capacity: "",
    flavor: "",
    scent: "",
    power: "",
    length: "",
    region: "",
    price: 0,
    oldPrice: 0,
    savingsAmount: 0,
    savingsPercentage: "0%",
    image: "",
    stock: 0,
    sku: "",
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
  };

  variants.value.push(newVariant);
  updateParentVariants();
}

// Function to update a variant
function updateVariant(index, updatedVariant) {
  variants.value[index] = updatedVariant;
  updateParentVariants();
}

// Function to remove a variant
function removeVariant(index) {
  variants.value.splice(index, 1);
  updateParentVariants();
}

function duplicateVariant(duplicateVariant) {
  variants.value.push({ ...duplicateVariant });
  updateParentVariants();
}

// Function to emit the updated variants to the parent
function updateParentVariants() {
  emit("updateItem", { ...props.selectedItem, variants: variants.value });
}
</script>

<style scoped>
.section {
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
}

.variant-wrapper {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  display: grid;
  grid-template-columns: 1fr;
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
