<template>
  <div class="card variants-card">
    <div class="variants-header">
      <h2>Variants</h2>
    </div>
    <div class="variants-list">
      <div
        v-for="(variant, index) in variants"
        :key="index"
        class="variant-row"
      >
        <div class="variant-preview">
          <NuxtImg
            v-if="variant.image"
            :src="`/ItemPics/${variant.image}`"
            alt="Variant Image"
            width="80"
            height="80"
          />
        </div>
        <div class="variant-fields">
          <!-- Image URL -->
          <div class="input-inline">
            <div class="form-group" :class="{ 'has-text': variant.image }">
              <label :for="'variantImage' + index">Variant Image URL</label>
              <input
                :id="'variantImage' + index"
                v-model="variant.image"
                type="text"
                @input="markDirty"
                @blur="updateVariantSKU(index)"
              />
            </div>
          </div>

          <!-- Price -->
          <div class="input-inline">
            <div
              class="form-group"
              :class="{ 'has-text': variant.price != null }"
            >
              <label :for="'variantPrice' + index">Price</label>
              <input
                :id="'variantPrice' + index"
                v-model.number="variant.price"
                type="number"
                step="0.01"
                required
                @input="markDirty"
                @blur="updateVariantSKU(index)"
              />
            </div>
          </div>

          <!-- Old Price -->
          <div class="input-inline">
            <div
              class="form-group"
              :class="{ 'has-text': variant.oldPrice != null }"
            >
              <label :for="'variantOldPrice' + index">Old Price</label>
              <input
                :id="'variantOldPrice' + index"
                v-model.number="variant.oldPrice"
                type="number"
                step="0.01"
                @input="markDirty"
                @blur="updateVariantSKU(index)"
              />
            </div>
          </div>

          <!-- Stock -->
          <div class="input-inline">
            <div
              class="form-group"
              :class="{ 'has-text': variant.stock != null }"
            >
              <label :for="'variantStock' + index">Stock</label>
              <input
                :id="'variantStock' + index"
                v-model.number="variant.stock"
                type="number"
                min="0"
                required
                @input="markDirty"
              />
            </div>
          </div>

          <!-- SKU -->
          <div class="input-inline" v-if="variant.sku">
            <div class="form-group" :class="{ 'has-text': variant.sku }">
              <label :for="'variantSku' + index">SKU</label>
              <input
                :id="'variantSku' + index"
                v-model="variant.sku"
                type="text"
                readonly
              />
            </div>
          </div>

          <!-- Attributes -->
          <div class="variant-attributes">
            <button
              type="button"
              class="add-attribute-btn"
              @click="toggleAttributeDropdown(index)"
            >
              + Add Attribute
            </button>

            <div
              v-if="isAttributeDropdownOpen(index)"
              class="attribute-dropdown"
            >
              <select
                v-model="selectedAttribute[index]"
                @change="addAttribute(index)"
              >
                <option disabled value="">Select attribute</option>
                <option
                  v-for="attr in availableAttributes(index)"
                  :key="attr"
                  :value="attr"
                >
                  {{ capitalize(attr) }}
                </option>
              </select>
            </div>

            <!-- Color -->
            <div
              class="attribute"
              v-if="isVariantAttributeExpanded(index, 'color')"
            >
              <div
                class="form-group"
                :class="{ 'has-text': variant.color.name }"
              >
                <label :for="'variantColorName' + index">Color Name</label>
                <input
                  :id="'variantColorName' + index"
                  v-model="variant.color.name"
                  @input="markDirty"
                  @blur="updateVariantSKU(index)"
                />
              </div>
              <div
                class="form-group"
                :class="{ 'has-text': variant.color.hex }"
              >
                <label :for="'variantColorHex' + index">Color Hex</label>
                <input
                  :id="'variantColorHex' + index"
                  v-model="variant.color.hex"
                  @input="markDirty"
                  @blur="updateVariantSKU(index)"
                />
              </div>
            </div>

            <!-- Other attributes -->
            <div
              class="attribute"
              v-for="attr in variantAttributes"
              :key="attr"
              v-if="isVariantAttributeExpanded(index, attr)"
            >
              <div
                class="form-group"
                :class="{ 'has-text': variant[attr] != null }"
              >
                <label :for="`variant${capitalize(attr)}${index}`">
                  {{ capitalize(attr) }}
                </label>
                <input
                  :id="`variant${capitalize(attr)}${index}`"
                  v-model="variant[attr]"
                  type="text"
                  @input="markDirty"
                  @blur="updateVariantSKU(index)"
                />
              </div>
            </div>
          </div>
        </div>

        <button type="button" class="remove-btn" @click="removeVariant(index)">
          Remove
        </button>
      </div>

      <button type="button" class="add-btn" @click="addVariant">
        + Add Variant
      </button>
    </div>
  </div>
</template>
  
  <script setup>
import { reactive } from "vue";

const props = defineProps({
  variants: { type: Array, required: true },
});
const emit = defineEmits([
  "mark-dirty",
  "update-variant-sku",
  "add-variant",
  "remove-variant",
]);

const allVariantAttributes = [
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
const variantAttributes = allVariantAttributes.filter((a) => a !== "color");

// Reactive state
const variantExpanded = reactive({});
const attributeDropdownOpen = reactive({});
const selectedAttribute = reactive({});

// Seed expansion based on existing variant values
props.variants.forEach((variant, idx) => {
  variantExpanded[idx] = {};
  allVariantAttributes.forEach((attr) => {
    if (attr === "color") {
      if (variant.color?.name || variant.color?.hex) {
        variantExpanded[idx].color = true;
      }
    } else if (variant[attr] != null) {
      variantExpanded[idx][attr] = true;
    }
  });
});

const markDirty = () => emit("mark-dirty");

const toggleAttributeDropdown = (i) => {
  attributeDropdownOpen[i] = !attributeDropdownOpen[i];
};
const isAttributeDropdownOpen = (i) => !!attributeDropdownOpen[i];

const availableAttributes = (i) =>
  allVariantAttributes.filter((attr) => !isVariantAttributeExpanded(i, attr));

const addAttribute = (index) => {
  const attr = selectedAttribute[index];
  variantExpanded[index][attr] = true;
  selectedAttribute[index] = "";
  attributeDropdownOpen[index] = false;
  updateVariantSKU(index);
};

const isVariantAttributeExpanded = (i, attr) =>
  variantExpanded[i] && variantExpanded[i][attr];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const updateVariantSKU = (index) => emit("update-variant-sku", index);
const addVariant = () => emit("add-variant");
const removeVariant = (index) => emit("remove-variant", index);
</script>
  
  <style scoped>
/* Floating‐label inputs */
.form-group {
  position: relative;
  margin-bottom: 1rem;
  height: 50px;
}
.form-group input,
.form-group select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 60px;
  padding: 0 12px;
  font-size: 13px;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  transition: all 0.2s ease;
}
.form-group.has-text input,
.form-group.has-text select {
  line-height: 12px;
  padding-top: 16px;
  border-color: #66afe9;
}
.form-group input:focus,
.form-group select:focus {
  border-color: #66afe9;
  outline: none;
}
.form-group label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #777;
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 1;
}
.form-group.has-text label {
  top: 8px;
  transform: none;
  font-size: 12px;
  color: #555;
}

/* Layout & buttons */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
.variants-card .variants-header h2 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 1.4rem;
  color: #374151;
}
.variants-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.variant-row {
  display: flex;
  flex-direction: column;
  flex: 1 1 calc(33.333% - 10px);
  box-sizing: border-box;
  padding: 10px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}
.variant-preview {
  flex: 0 0 auto;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.input-inline {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 8px;
}
.variant-attributes {
  margin-top: 10px;
}
.add-attribute-btn {
  background: #3b82f6;
  color: #fff;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
}
.attribute-dropdown select {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}
.attribute {
  margin-bottom: 10px;
}
.remove-btn {
  background: #dc2626;
  color: #fff;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: auto;
}
.remove-btn:hover {
  background: #c11b1b;
}
.add-btn {
  background: #16a34a;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  align-self: center;
  margin-top: 15px;
}
.add-btn:hover {
  background: #15803d;
}
</style>
  