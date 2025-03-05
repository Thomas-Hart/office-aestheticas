<template>
  <div class="wrapper">
    <!-- Header -->
    <header class="header">
      <h1>Item Management</h1>
    </header>
    <div class="main-container">
      <!-- Sidebar with Breadcrumbs and List -->
      <aside class="sidebar">
        <div class="breadcrumbs">
          <span class="breadcrumb-item">Dashboard</span>
          <span class="breadcrumb-separator">&gt;</span>
          <span class="breadcrumb-item">Items</span>
        </div>
        <div class="search-filters">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search items..."
          />
          <select v-model="filterStatus">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Discontinued">Discontinued</option>
            <option value="Coming Soon">Coming Soon</option>
          </select>
        </div>
        <ul class="item-list">
          <li
            v-for="item in filteredItems"
            :key="item._id"
            @click="selectItem(item)"
            :class="{ active: selectedItem._id === item._id }"
          >
            {{ item.name || "Untitled Item" }}
          </li>
        </ul>
        <button class="new-item-btn" @click="openNewItemModal">
          <span v-if="isModalLoading" class="spinner"></span>
          + New Item
        </button>
      </aside>

      <!-- Editor Section -->
      <section class="editor">
        <!-- Tab Navigation -->
        <div class="tab-header">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.title }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Variants Tab (unchanged) -->
          <div v-if="activeTab === 'variants'">
            <div class="card">
              <div class="variants-header">
                <h2>Variants</h2>
              </div>
              <div class="variants-list">
                <div
                  v-for="(variant, index) in selectedItem.variants"
                  :key="index"
                  class="variant-card"
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
                    <div class="input-inline">
                      <label>Variant Image URL</label>
                      <input
                        v-model="variant.image"
                        type="text"
                        placeholder="Image URL"
                        @input="markDirty"
                        @blur="updateVariantSKU(index)"
                      />
                    </div>
                    <div class="input-inline">
                      <label>Price</label>
                      <input
                        v-model.number="variant.price"
                        type="number"
                        step="0.01"
                        required
                        @input="markDirty"
                        @blur="updateVariantSKU(index)"
                      />
                    </div>
                    <div class="input-inline">
                      <label>Old Price</label>
                      <input
                        v-model.number="variant.oldPrice"
                        type="number"
                        step="0.01"
                        @input="markDirty"
                        @blur="updateVariantSKU(index)"
                      />
                    </div>
                    <div class="input-inline">
                      <label>Stock</label>
                      <input
                        v-model.number="variant.stock"
                        type="number"
                        min="0"
                        required
                        @input="markDirty"
                      />
                    </div>
                    <div class="input-inline" v-if="variant.sku">
                      <label>SKU</label>
                      <input v-model="variant.sku" type="text" readonly />
                    </div>
                    <div class="attribute">
                      <template
                        v-if="
                          (variant.color &&
                            (variant.color.name || variant.color.hex)) ||
                          isVariantAttributeExpanded(index, 'color')
                        "
                      >
                        <label>Color</label>
                        <input
                          v-model="variant.color.name"
                          placeholder="Color Name"
                          @input="markDirty"
                          @blur="updateVariantSKU(index)"
                        />
                        <input
                          v-model="variant.color.hex"
                          placeholder="Color Hex"
                          @input="markDirty"
                          @blur="updateVariantSKU(index)"
                        />
                      </template>
                      <template v-else>
                        <button
                          type="button"
                          @click="expandVariantAttribute(index, 'color')"
                        >
                          + Color
                        </button>
                      </template>
                    </div>
                    <div class="attribute">
                      <template
                        v-if="
                          variant.size ||
                          isVariantAttributeExpanded(index, 'size')
                        "
                      >
                        <label>Size</label>
                        <input
                          v-model="variant.size"
                          type="text"
                          @input="markDirty"
                          @blur="updateVariantSKU(index)"
                        />
                      </template>
                      <template v-else>
                        <button
                          type="button"
                          @click="expandVariantAttribute(index, 'size')"
                        >
                          + Size
                        </button>
                      </template>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="remove-btn"
                    @click="removeVariant(index)"
                  >
                    Remove
                  </button>
                </div>
                <button type="button" class="add-btn" @click="addVariant">
                  + Add Variant
                </button>
              </div>
            </div>
          </div>

          <!-- Custom Layout for General Tab -->
          <div v-else-if="activeTab === 'general'">
            <form @submit.prevent="handleSubmit" @input="markDirty">
              <div class="general-layout">
                <div class="left-column">
                  <div class="photo-preview">
                    <NuxtImg
                      v-if="selectedItem.image"
                      :src="`/ItemPics/${selectedItem.image}`"
                      alt="Product Photo"
                      width="300"
                      height="300"
                    />
                  </div>
                  <div class="photo-input">
                    <label for="image">Photo URL</label>
                    <input
                      type="text"
                      id="image"
                      v-model="selectedItem.image"
                      placeholder="Enter photo URL"
                    />
                  </div>
                  <div class="additional-images">
                    <label for="moreImages">Additional Images</label>
                    <input
                      type="text"
                      id="moreImages"
                      v-model="selectedItem.moreImagesInput"
                      placeholder="Enter additional image URL and press Enter"
                      @keyup.enter="addAdditionalImage"
                    />
                    <div
                      class="additional-images-overlay"
                      v-if="selectedItem.moreImages.length"
                    >
                      <NuxtImg
                        v-for="(img, i) in selectedItem.moreImages"
                        :key="i"
                        :src="`/ItemPics/${img}`"
                        alt="Additional Image"
                        width="50"
                        height="50"
                      />
                    </div>
                  </div>
                </div>
                <div class="right-column">
                  <div class="form-group">
                    <label for="name">Title</label>
                    <input
                      type="text"
                      id="name"
                      v-model="selectedItem.name"
                      placeholder="Enter item title"
                    />
                  </div>
                  <div class="form-group">
                    <label for="preview">Preview Text</label>
                    <input
                      type="text"
                      id="preview"
                      v-model="selectedItem.preview"
                      placeholder="Enter preview text"
                    />
                  </div>
                  <div class="form-group">
                    <label for="description">Description</label>
                    <textarea
                      id="description"
                      v-model="selectedItem.description"
                      placeholder="Enter description"
                    ></textarea>
                  </div>
                  <div class="price-row">
                    <div class="form-group">
                      <label for="price">Price</label>
                      <input
                        type="number"
                        id="price"
                        v-model.number="selectedItem.price"
                        step="0.01"
                        placeholder="Price"
                      />
                    </div>
                    <div class="form-group">
                      <label for="oldPrice">Old Price</label>
                      <input
                        type="number"
                        id="oldPrice"
                        v-model.number="selectedItem.oldPrice"
                        step="0.01"
                        placeholder="Old Price"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" class="submit-btn">
                {{ selectedItem._id ? "Update" : "Add" }} Item
              </button>
            </form>
          </div>

          <!-- Fallback for other tabs -->
          <div v-else>
            <div class="card">
              <form @submit.prevent="handleSubmit" @input="markDirty">
                <div class="section">
                  <h2>{{ activeSection.title }}</h2>
                  <div class="grid">
                    <div
                      v-for="field in activeSection.fields"
                      :key="field.model"
                      class="form-group"
                    >
                      <label :for="field.model">{{ field.label }}</label>
                      <component
                        :is="field.component"
                        :id="field.model"
                        v-bind="field.props"
                        :value="getValue(activeSection, field.model)"
                        v-on="
                          field.props.type === 'checkbox'
                            ? {
                                change: (e) =>
                                  handleInput(activeSection, field, e),
                              }
                            : {
                                input: (e) =>
                                  handleInput(activeSection, field, e),
                              }
                        "
                      />
                    </div>
                  </div>
                  <!-- Render sub-fields & list editors if defined -->
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Fixed Action Bar (unchanged) -->
    <div class="fixed-actions">
      <div class="unsaved" v-if="hasUnsavedChanges">Unsaved Changes</div>
      <button @click="handleSubmit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner"></span>
        {{ selectedItem._id ? "Update" : "Add" }} Item
      </button>
      <button
        @click="deleteItem"
        v-if="selectedItem._id"
        :disabled="isDeleting"
      >
        <span v-if="isDeleting" class="spinner"></span>
        Delete Item
      </button>
      <div class="action-notification" v-if="actionNotification">
        {{ actionNotification }}
      </div>
    </div>

    <!-- Modal for New Item Creation (unchanged) -->
    <div class="modal-overlay" v-if="showNewItemModal">
      <div class="modal">
        <h2>New Item</h2>
        <form @submit.prevent="submitNewItemModal">
          <div class="modal-form-group">
            <label>Name</label>
            <input type="text" v-model="newItemForm.name" required />
          </div>
          <div class="modal-form-group">
            <label>Price</label>
            <input
              type="number"
              v-model.number="newItemForm.price"
              step="0.01"
              required
            />
          </div>
          <div class="modal-form-group">
            <label>Old Price</label>
            <input
              type="number"
              v-model.number="newItemForm.oldPrice"
              step="0.01"
            />
          </div>
          <div class="modal-form-group">
            <label>Description</label>
            <textarea v-model="newItemForm.description"></textarea>
          </div>
          <div class="modal-form-group">
            <label>Image URL</label>
            <input type="text" v-model="newItemForm.image" />
          </div>
          <div class="modal-actions">
            <button
              type="submit"
              class="modal-submit-btn"
              :disabled="isModalLoading"
            >
              <span v-if="isModalLoading" class="spinner"></span>
              Create Item
            </button>
            <button
              type="button"
              class="modal-cancel-btn"
              @click="closeNewItemModal"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { NuxtImg } from "#components";

// Notification and dirty-checking
const actionNotification = ref("");
const hasUnsavedChanges = ref(false);
const markDirty = () => (hasUnsavedChanges.value = true);
const showActionNotification = (msg) => {
  actionNotification.value = msg;
  setTimeout(() => (actionNotification.value = ""), 3000);
};

const isSubmitting = ref(false);
const isDeleting = ref(false);
const isModalLoading = ref(false);
const searchTerm = ref("");
const filterStatus = ref("");
const items = ref([]);

// Fetch and filter items
const filteredItems = computed(() =>
  items.value.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
    const matchesStatus = filterStatus.value
      ? item.lifecycleStatus === filterStatus.value
      : true;
    return matchesSearch && matchesStatus;
  })
);

// Main item model; note the addition of moreImagesInput for the overlay input
const selectedItem = reactive({
  _id: null,
  name: "",
  price: 0,
  oldPrice: 0,
  savingsAmount: 0,
  savingsPercentage: "",
  preview: "",
  description: "",
  image: "",
  moreImages: [],
  moreImagesInput: "",
  tags: [],
  stock: 0,
  variants: [],
  subscriptionOptions: [],
  giftOptions: { isGiftWrappable: false, availableGiftMessages: [] },
  affiliateInfo: [],
  ageRestriction: { minimumAge: 0, warningMessage: "" },
  warranty: { durationInMonths: 0, warrantyDetails: "", provider: "" },
  shippingInfo: {
    weight: 0,
    freeShippingEligible: false,
    dimensions: { length: 0, width: 0, height: 0 },
    availableRegions: [],
    estimatedDeliveryTime: "",
  },
  frequentlyBoughtTogether: [],
  productVideos: [],
  lifecycleStatus: "Active",
  reviewCount: 0,
  ratings: 0,
});

// Form sections for other tabs remain unchanged
const formSections = [
  {
    id: "general",
    title: "General Information",
    modelPath: "",
    fields: [
      {
        label: "Name",
        model: "name",
        component: "input",
        props: { type: "text", required: true },
      },
      {
        label: "Price",
        model: "price",
        component: "input",
        props: { type: "number", step: "0.01", required: true },
      },
      {
        label: "Old Price",
        model: "oldPrice",
        component: "input",
        props: { type: "number", step: "0.01" },
      },
      {
        label: "Savings Amount",
        model: "savingsAmount",
        component: "input",
        props: { type: "number", step: "0.01" },
      },
      {
        label: "Savings Percentage",
        model: "savingsPercentage",
        component: "input",
        props: { type: "text", readonly: true },
      },
      {
        label: "Preview Text",
        model: "preview",
        component: "input",
        props: { type: "text" },
      },
      {
        label: "Description",
        model: "description",
        component: "textarea",
        props: {},
      },
      {
        label: "Image URL",
        model: "image",
        component: "input",
        props: { type: "text" },
      },
      {
        label: "Stock",
        model: "stock",
        component: "input",
        props: { type: "number", min: 0 },
      },
      {
        label: "Lifecycle Status",
        model: "lifecycleStatus",
        component: "select",
        props: {},
      },
    ],
    listEditors: [{ title: "Tags", model: "tags", placeholder: "Tag" }],
  },
  // ... other sections remain unchanged ...
];

const tabs = [
  ...formSections.map((section) => ({ id: section.id, title: section.title })),
  { id: "variants", title: "Variants" },
];

const activeTab = ref("general");
const activeSection = computed(() =>
  formSections.find((section) => section.id === activeTab.value)
);

// Standard field helpers
const getValue = (section, model) =>
  section.modelPath
    ? selectedItem[section.modelPath][model]
    : selectedItem[model];
const updateValue = (section, model, val) =>
  section.modelPath
    ? (selectedItem[section.modelPath][model] = val)
    : (selectedItem[model] = val);
const handleInput = (section, field, e) =>
  updateValue(
    section,
    field.model,
    field.props.type === "checkbox" ? e.target.checked : e.target.value
  );

// Nested field helpers
const getNestedValue = (section, subKey, model) =>
  selectedItem[section.modelPath][subKey][model];
const updateNestedValue = (section, subKey, model, val) =>
  (selectedItem[section.modelPath][subKey][model] = val);
const handleNestedInput = (section, subKey, field, e) =>
  updateNestedValue(
    section,
    subKey,
    field.model,
    field.props.type === "checkbox" ? e.target.checked : e.target.value
  );

// Variants handling (unchanged)
const addVariant = () => {
  selectedItem.variants.push({
    color: { name: "", hex: "" },
    size: "",
    price: 0,
    oldPrice: 0,
    savingsAmount: 0,
    savingsPercentage: "",
    image: "",
    stock: 0,
    sku: "",
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
  });
  markDirty();
};
const removeVariant = (index) => {
  selectedItem.variants.splice(index, 1);
  markDirty();
};
const variantExpanded = reactive({});
const expandVariantAttribute = (i, attr) => {
  if (!variantExpanded[i]) variantExpanded[i] = {};
  variantExpanded[i][attr] = true;
};
const isVariantAttributeExpanded = (i, attr) =>
  variantExpanded[i] && variantExpanded[i][attr];
const updateVariantSKU = (index) => {
  const variant = selectedItem.variants[index];
  const attributes = [variant.color?.name || "", variant.size || ""]
    .filter(Boolean)
    .join("-");
  variant.sku = `${selectedItem.name.replace(/\s+/g, "").toUpperCase()}-${
    attributes || "BASE"
  }-${index + 1}`;
  markDirty();
};

const fetchItems = async () => {
  try {
    const data = await $fetch("/api/items");
    items.value = Array.isArray(data) ? data : [];
  } catch (error) {
    showActionNotification("Error fetching items: " + error.message);
  }
};
onMounted(fetchItems);
const selectItem = (item) => {
  Object.assign(selectedItem, JSON.parse(JSON.stringify(item)));
  // Ensure moreImagesInput is reset
  selectedItem.moreImagesInput = "";
  hasUnsavedChanges.value = false;
};
const clearSelectedItem = () => {
  Object.assign(selectedItem, {
    _id: null,
    name: "",
    price: 0,
    oldPrice: 0,
    savingsAmount: 0,
    savingsPercentage: "",
    preview: "",
    description: "",
    image: "",
    moreImages: [],
    moreImagesInput: "",
    tags: [],
    stock: 0,
    variants: [],
    subscriptionOptions: [],
    giftOptions: { isGiftWrappable: false, availableGiftMessages: [] },
    affiliateInfo: [],
    ageRestriction: { minimumAge: 0, warningMessage: "" },
    warranty: { durationInMonths: 0, warrantyDetails: "", provider: "" },
    shippingInfo: {
      weight: 0,
      freeShippingEligible: false,
      dimensions: { length: 0, width: 0, height: 0 },
      availableRegions: [],
      estimatedDeliveryTime: "",
    },
    frequentlyBoughtTogether: [],
    productVideos: [],
    lifecycleStatus: "Active",
    reviewCount: 0,
    ratings: 0,
  });
  hasUnsavedChanges.value = false;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    selectedItem._id ? await updateItem() : await addItem();
    hasUnsavedChanges.value = false;
  } catch (error) {
    showActionNotification("Error: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};
const addItem = async () => {
  try {
    await $fetch("/api/items", { method: "POST", body: selectedItem });
    showActionNotification("Item added successfully");
    await fetchItems();
    clearSelectedItem();
  } catch (error) {
    showActionNotification("Error adding item: " + error.message);
  }
};
const updateItem = async () => {
  try {
    await $fetch(`/api/items/${selectedItem._id}`, {
      method: "PUT",
      body: selectedItem,
    });
    showActionNotification("Item updated successfully");
    await fetchItems();
  } catch (error) {
    showActionNotification("Error updating item: " + error.message);
  }
};
const deleteItem = async () => {
  if (!selectedItem._id) {
    showActionNotification("No item selected to delete");
    return;
  }
  isDeleting.value = true;
  try {
    await $fetch(`/api/items/${selectedItem._id}`, { method: "DELETE" });
    showActionNotification("Item deleted successfully");
    await fetchItems();
    clearSelectedItem();
  } catch (error) {
    showActionNotification("Error deleting item: " + error.message);
  } finally {
    isDeleting.value = false;
  }
};

function openNewItemModal() {
  clearSelectedItem();
  newItemForm.name = "";
  newItemForm.price = 0;
  newItemForm.oldPrice = 0;
  newItemForm.description = "";
  newItemForm.image = "";
  showNewItemModal.value = true;
}
function closeNewItemModal() {
  showNewItemModal.value = false;
}
async function submitNewItemModal() {
  isModalLoading.value = true;
  selectedItem._id = null;
  selectedItem.name = newItemForm.name;
  selectedItem.price = newItemForm.price;
  selectedItem.oldPrice = newItemForm.oldPrice;
  selectedItem.description = newItemForm.description;
  selectedItem.image = newItemForm.image;
  showNewItemModal.value = false;
  activeTab.value = "general";
  isModalLoading.value = false;
}

function addAdditionalImage() {
  if (selectedItem.moreImagesInput.trim() !== "") {
    selectedItem.moreImages.push(selectedItem.moreImagesInput.trim());
    selectedItem.moreImagesInput = "";
    markDirty();
  }
}

const newItemForm = reactive({
  name: "",
  price: 0,
  oldPrice: 0,
  description: "",
  image: "",
});
</script>

<style scoped>
/* Base Typography & Layout */
.wrapper,
body {
  font-family: "Inter", "Roboto", sans-serif;
  background-color: #f9fafb;
  color: #333;
  margin: 0;
  padding: 0;
}
.wrapper {
  padding: 20px;
}
.main-container {
  display: flex;
  gap: 20px;
}

/* Sidebar Styling */
.sidebar {
  flex: 0 0 250px;
  background: #fff;
  padding: 20px;
  border: 1px solid #e5e7eb;
}
.breadcrumbs {
  font-size: 0.9rem;
  margin-bottom: 15px;
  color: #6b7280;
}
.breadcrumb-item,
.breadcrumb-separator {
  margin-right: 5px;
}
.search-filters input,
.search-filters select {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.item-list {
  list-style: none;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 15px;
  padding: 0;
}
.item-list li {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background 0.2s ease;
}
.item-list li:hover,
.item-list li.active {
  background-color: #f0f0f0;
}
.new-item-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}
.new-item-btn:hover {
  background: #1d4ed8;
}

/* Editor Styling */
.editor {
  flex: 1;
  background: #fff;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

/* Tab Header */
.tab-header {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.tab-header button {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.2s ease;
  border-radius: 4px;
}
.tab-header button.active,
.tab-header button:hover {
  background-color: #f0f0f0;
  color: #2563eb;
  font-weight: 500;
}

/* Custom General Layout */
.general-layout {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.right-column {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.photo-preview {
  position: relative;
}
.photo-input label,
.additional-images label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}
.additional-images {
  position: relative;
}
.additional-images-overlay {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
}
.price-row {
  display: flex;
  gap: 15px;
}
.price-row .form-group {
  flex: 1;
}

/* Standard Form Groups & Inputs */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-group label {
  font-size: 0.9rem;
  color: #4b5563;
}
input,
select,
textarea {
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s;
}
input:focus,
select:focus,
textarea:focus {
  border-color: #2563eb;
  outline: none;
}
/* Numeric fields get a max-width */
input[type="number"] {
  max-width: 120px;
}

/* Product Image Preview */
.product-image-preview {
  text-align: center;
  margin-bottom: 20px;
}
.product-image-preview img {
  max-width: 100%;
  height: auto;
  transition: transform 0.3s ease;
}
.product-image-preview img:hover {
  transform: scale(1.05);
}

/* Variants Styles */
.variants-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}
.variant-card {
  max-width: 250px;
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.variant-preview {
  width: 100%;
  text-align: center;
}
.variant-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.variant-card input[type="number"] {
  max-width: 100px;
}
.variant-card .remove-btn {
  align-self: flex-end;
}

/* Fixed Action Bar */
.fixed-actions {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}
.fixed-actions button {
  padding: 12px 20px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}
.fixed-actions button:hover {
  background: #1d4ed8;
}
.fixed-actions .unsaved {
  background: #fbbf24;
  color: #1f2937;
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 4px;
}
.fixed-actions .action-notification {
  background: #2563eb;
  color: #fff;
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 4px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
}
.modal {
  background: #fff;
  padding: 20px;
  width: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.modal h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #374151;
}
.modal-form-group {
  margin-bottom: 15px;
}
.modal-form-group label {
  display: block;
  margin-bottom: 5px;
  color: #4b5563;
  font-size: 0.9rem;
}
.modal-form-group input,
.modal-form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.modal-submit-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}
.modal-submit-btn:hover {
  background: #1d4ed8;
}
.modal-cancel-btn {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}
.modal-cancel-btn:hover {
  background: #c11b1b;
}

/* Focus States */
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  .sidebar,
  .editor {
    width: 100%;
  }
  .general-layout {
    flex-direction: column;
  }
}
</style>
