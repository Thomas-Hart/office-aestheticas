<template>
  <div class="wrapper">
    <!-- Sleek Header Bar -->
    <header class="header">
      <h1>Item Management</h1>
    </header>
    <div class="main-container">
      <!-- Sidebar: Item list -->
      <aside class="sidebar">
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
      <!-- Editor: Tabbed interface -->
      <section class="editor">
        <div class="tab-header">
          <button
            :class="{ active: activeTab === 'general' }"
            @click="activeTab = 'general'"
          >
            General Information
          </button>
          <button
            :class="{ active: activeTab === 'variants' }"
            @click="activeTab = 'variants'"
          >
            Variants
          </button>
        </div>
        <div class="tab-content">
          <!-- General Information Tab -->
          <div v-if="activeTab === 'general'">
            <!-- Main Product Image Preview -->
            <div class="product-image-preview" v-if="selectedItem.image">
              <NuxtImg
                :src="selectedItem.image"
                alt="Product Image"
                width="300"
                height="300"
              />
            </div>
            <form @submit.prevent="handleSubmit" @input="markDirty">
              <!-- Basic Fields (Static Form Sections) -->
              <div
                v-for="section in formSections"
                :key="section.id"
                class="section"
                :id="section.id"
              >
                <h2>{{ section.title }}</h2>
                <div class="grid">
                  <div
                    v-for="field in section.fields"
                    :key="field.model"
                    class="form-group"
                  >
                    <label :for="field.model">{{ field.label }}</label>
                    <component
                      :is="field.component"
                      :id="field.model"
                      v-bind="field.props"
                      :value="getValue(section, field.model)"
                      v-on="
                        field.props.type === 'checkbox'
                          ? {
                              change: (event) =>
                                handleInput(section, field, event),
                            }
                          : {
                              input: (event) =>
                                handleInput(section, field, event),
                            }
                      "
                    />
                  </div>
                </div>
                <!-- Sub-fields (e.g. dimensions) -->
                <div v-if="section.subFields">
                  <h3>{{ section.subTitle }}</h3>
                  <div class="grid">
                    <div
                      v-for="subField in section.subFields.dimensions"
                      :key="subField.model"
                      class="form-group"
                    >
                      <label :for="subField.model">{{ subField.label }}</label>
                      <component
                        :is="subField.component"
                        :id="subField.model"
                        v-bind="subField.props"
                        :value="
                          getNestedValue(section, 'dimensions', subField.model)
                        "
                        v-on="
                          subField.props.type === 'checkbox'
                            ? {
                                change: (event) =>
                                  handleNestedInput(
                                    section,
                                    'dimensions',
                                    subField,
                                    event
                                  ),
                              }
                            : {
                                input: (event) =>
                                  handleNestedInput(
                                    section,
                                    'dimensions',
                                    subField,
                                    event
                                  ),
                              }
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- Additional Information: List Editors & Structured Data -->
              <div class="additional-info">
                <h2>Additional Information</h2>
                <!-- More Images -->
                <div class="list-editor">
                  <h3>More Images</h3>
                  <div
                    v-for="(img, index) in selectedItem.moreImages"
                    :key="'img' + index"
                    class="list-item"
                  >
                    <input
                      type="text"
                      v-model="selectedItem.moreImages[index]"
                      placeholder="Image URL"
                    />
                    <button
                      type="button"
                      @click="selectedItem.moreImages.splice(index, 1)"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-list-btn"
                    @click="selectedItem.moreImages.push('')"
                  >
                    Add More Image
                  </button>
                </div>
                <!-- Tags -->
                <div class="list-editor">
                  <h3>Tags</h3>
                  <div
                    v-for="(tag, index) in selectedItem.tags"
                    :key="'tag' + index"
                    class="list-item"
                  >
                    <input
                      type="text"
                      v-model="selectedItem.tags[index]"
                      placeholder="Tag"
                    />
                    <button
                      type="button"
                      @click="selectedItem.tags.splice(index, 1)"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-list-btn"
                    @click="selectedItem.tags.push('')"
                  >
                    Add Tag
                  </button>
                </div>
                <!-- Gift Messages -->
                <div class="list-editor">
                  <h3>Gift Messages</h3>
                  <div
                    v-for="(msg, index) in selectedItem.giftOptions
                      .availableGiftMessages"
                    :key="'msg' + index"
                    class="list-item"
                  >
                    <input
                      type="text"
                      v-model="
                        selectedItem.giftOptions.availableGiftMessages[index]
                      "
                      placeholder="Gift Message"
                    />
                    <button
                      type="button"
                      @click="
                        selectedItem.giftOptions.availableGiftMessages.splice(
                          index,
                          1
                        )
                      "
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-list-btn"
                    @click="
                      selectedItem.giftOptions.availableGiftMessages.push('')
                    "
                  >
                    Add Gift Message
                  </button>
                </div>
                <!-- Shipping Regions -->
                <div class="list-editor">
                  <h3>Shipping Regions</h3>
                  <div
                    v-for="(region, index) in selectedItem.shippingInfo
                      .availableRegions"
                    :key="'region' + index"
                    class="list-item"
                  >
                    <input
                      type="text"
                      v-model="
                        selectedItem.shippingInfo.availableRegions[index]
                      "
                      placeholder="Region"
                    />
                    <button
                      type="button"
                      @click="
                        selectedItem.shippingInfo.availableRegions.splice(
                          index,
                          1
                        )
                      "
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-list-btn"
                    @click="selectedItem.shippingInfo.availableRegions.push('')"
                  >
                    Add Region
                  </button>
                </div>
                <!-- Frequently Bought Together -->
                <div class="list-editor">
                  <h3>Frequently Bought Together</h3>
                  <div
                    v-for="(
                      itemId, index
                    ) in selectedItem.frequentlyBoughtTogether"
                    :key="'fbt' + index"
                    class="list-item"
                  >
                    <input
                      type="text"
                      v-model="selectedItem.frequentlyBoughtTogether[index]"
                      placeholder="Item ID"
                    />
                    <button
                      type="button"
                      @click="
                        selectedItem.frequentlyBoughtTogether.splice(index, 1)
                      "
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-list-btn"
                    @click="selectedItem.frequentlyBoughtTogether.push('')"
                  >
                    Add Item
                  </button>
                </div>
                <!-- AR Links -->
                <div class="list-editor">
                  <h3>AR Links</h3>
                  <div
                    v-for="(link, index) in selectedItem.arLinks"
                    :key="'ar' + index"
                    class="list-item"
                  >
                    <input
                      type="text"
                      v-model="selectedItem.arLinks[index]"
                      placeholder="AR Link URL"
                    />
                    <button
                      type="button"
                      @click="selectedItem.arLinks.splice(index, 1)"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-list-btn"
                    @click="selectedItem.arLinks.push('')"
                  >
                    Add AR Link
                  </button>
                </div>
                <!-- 3D Model Links -->
                <div class="list-editor">
                  <h3>3D Model Links</h3>
                  <div
                    v-for="(link, index) in selectedItem.model3DLinks"
                    :key="'3d' + index"
                    class="list-item"
                  >
                    <input
                      type="text"
                      v-model="selectedItem.model3DLinks[index]"
                      placeholder="3D Model Link URL"
                    />
                    <button
                      type="button"
                      @click="selectedItem.model3DLinks.splice(index, 1)"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-list-btn"
                    @click="selectedItem.model3DLinks.push('')"
                  >
                    Add 3D Model Link
                  </button>
                </div>
                <!-- Sales Channels -->
                <div class="list-editor">
                  <h3>Sales Channels</h3>
                  <div
                    v-for="(channel, index) in selectedItem.salesChannels"
                    :key="'sales' + index"
                    class="list-item"
                  >
                    <input
                      type="text"
                      v-model="selectedItem.salesChannels[index]"
                      placeholder="Sales Channel"
                    />
                    <button
                      type="button"
                      @click="selectedItem.salesChannels.splice(index, 1)"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-list-btn"
                    @click="selectedItem.salesChannels.push('')"
                  >
                    Add Sales Channel
                  </button>
                </div>
                <!-- Structured Data (Key–Value Editor) -->
                <div class="list-editor">
                  <h3>Structured Data</h3>
                  <div
                    v-for="(entry, index) in structuredDataEntries"
                    :key="'sd' + index"
                    class="list-item"
                  >
                    <input type="text" v-model="entry.key" placeholder="Key" />
                    <input
                      type="text"
                      v-model="entry.value"
                      placeholder="Value"
                    />
                    <button
                      type="button"
                      @click="structuredDataEntries.splice(index, 1)"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    class="add-list-btn"
                    @click="structuredDataEntries.push({ key: '', value: '' })"
                  >
                    Add Structured Data Entry
                  </button>
                </div>
              </div>
            </form>
          </div>
          <!-- Variants Tab -->
          <div v-if="activeTab === 'variants'">
            <div class="variants-header">
              <h2>Variants</h2>
            </div>
            <div class="variants-list">
              <div
                v-for="(variant, index) in selectedItem.variants"
                :key="index"
                class="variant-row"
              >
                <div class="variant-preview">
                  <NuxtImg
                    v-if="`/ItemPics/${variant.image}`"
                    :src="`/ItemPics/${variant.image}`"
                    alt="Variant Image"
                    width="80"
                    height="80"
                  />
                </div>
                <div class="variant-fields">
                  <!-- Field for variant image URL -->
                  <div class="input-inline">
                    <label>Variant Image URL</label>
                    <input
                      v-model="variant.image"
                      type="text"
                      placeholder="Enter variant image URL"
                    />
                  </div>
                  <div class="input-inline">
                    <label>Price</label>
                    <input
                      v-model.number="variant.price"
                      type="number"
                      step="0.01"
                      required
                    />
                  </div>
                  <div class="input-inline">
                    <label>Stock</label>
                    <input
                      v-model.number="variant.stock"
                      type="number"
                      min="0"
                      required
                    />
                  </div>
                  <div class="input-inline" v-if="variant.sku">
                    <label>SKU</label>
                    <input v-model="variant.sku" type="text" readonly />
                  </div>
                  <div class="variant-attributes">
                    <!-- Color attribute -->
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
                        />
                        <input
                          v-model="variant.color.hex"
                          placeholder="Color Hex"
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
                    <!-- Other dynamic variant attributes -->
                    <template v-for="attr in variantAttributes" :key="attr">
                      <div class="attribute">
                        <template
                          v-if="
                            variant[attr] ||
                            isVariantAttributeExpanded(index, attr)
                          "
                        >
                          <label>{{ capitalize(attr) }}</label>
                          <input v-model="variant[attr]" type="text" />
                        </template>
                        <template v-else>
                          <button
                            type="button"
                            @click="expandVariantAttribute(index, attr)"
                          >
                            + {{ capitalize(attr) }}
                          </button>
                        </template>
                      </div>
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
      </section>
    </div>
    <!-- Fixed Action Bar -->
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
    <!-- New Item Modal -->
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

// --- Notifications & Dirty Tracking ---
const actionNotification = ref("");
const hasUnsavedChanges = ref(false);
function markDirty() {
  hasUnsavedChanges.value = true;
}
function showActionNotification(message, type = "success") {
  actionNotification.value = message;
  setTimeout(() => {
    actionNotification.value = "";
  }, 3000);
}

// --- Loading States ---
const isSubmitting = ref(false);
const isDeleting = ref(false);
const isModalLoading = ref(false);

// --- Search & Filter ---
const searchTerm = ref("");
const filterStatus = ref("");
const items = ref([]);
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

// --- Selected Item (All Fields) ---
const selectedItem = reactive({
  _id: null,
  name: "",
  price: 0,
  oldPrice: 0,
  savingsAmount: 0,
  savingsPercentage: "",
  preview: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
  structuredData: {},
  image: "",
  moreImages: [],
  tags: [],
  stock: 0,
  variants: [],
  subscriptionOptions: [],
  returnPolicy: {
    isReturnable: true,
    returnPeriod: 30,
    restockingFeePercentage: 0,
  },
  preOrder: { available: false, estimatedShippingDate: "" },
  giftOptions: { isGiftWrappable: false, availableGiftMessages: [] },
  affiliateInfo: [],
  ageRestriction: { minimumAge: 0, warningMessage: "" },
  warranty: { durationInMonths: 0, warrantyDetails: "", provider: "" },
  shippingInfo: {
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    freeShippingEligible: false,
    availableRegions: [],
    estimatedDeliveryTime: "",
  },
  reviewCount: 0,
  ratings: 0,
  frequentlyBoughtTogether: [],
  productVideos: [],
  arLinks: [],
  model3DLinks: [],
  externalLinks: [],
  lifecycleStatus: "Active",
  customerSupport: { supportEmail: "", supportPhone: "", supportHours: "" },
  salesChannels: [],
});

// --- Tab State ---
const activeTab = ref("general");

// --- Structured Data Editor ---
const structuredDataEntries = ref([]);

// --- New Item Modal State & Form ---
const showNewItemModal = ref(false);
const newItemForm = reactive({
  name: "",
  price: 0,
  oldPrice: 0,
  description: "",
  image: "",
});
function openNewItemModal() {
  clearSelectedItem();
  newItemForm.name = "";
  newItemForm.price = 0;
  newItemForm.oldPrice = 0;
  newItemForm.description = "";
  newItemForm.image = "";
  structuredDataEntries.value = [];
  showNewItemModal.value = true;
}
function closeNewItemModal() {
  showNewItemModal.value = false;
}
async function submitNewItemModal() {
  isModalLoading.value = true;
  // Set core fields from modal; the rest remain defaults.
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

// --- Dynamic Form Sections Schema ---
// (Removed redundant AR & Sales Channels sections)
const formSections = [
  {
    id: "general-info",
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
        props: { type: "text" },
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
        label: "Meta Title",
        model: "metaTitle",
        component: "input",
        props: { type: "text" },
      },
      {
        label: "Meta Description",
        model: "metaDescription",
        component: "textarea",
        props: {},
      },
      {
        label: "Image URL",
        model: "image",
        component: "input",
        props: { type: "text" },
      },
    ],
  },
  {
    id: "shipping-info",
    title: "Shipping Information",
    modelPath: "shippingInfo",
    fields: [
      {
        label: "Weight (kg)",
        model: "weight",
        component: "input",
        props: { type: "number", step: "0.01" },
      },
      {
        label: "Estimated Delivery Time",
        model: "estimatedDeliveryTime",
        component: "input",
        props: { type: "text", placeholder: "e.g., 3-5 business days" },
      },
    ],
    subFields: {
      dimensions: [
        {
          label: "Dimension Length (cm)",
          model: "length",
          component: "input",
          props: { type: "number", step: "0.1" },
        },
        {
          label: "Dimension Width (cm)",
          model: "width",
          component: "input",
          props: { type: "number", step: "0.1" },
        },
        {
          label: "Dimension Height (cm)",
          model: "height",
          component: "input",
          props: { type: "number", step: "0.1" },
        },
      ],
    },
  },
  {
    id: "review-ratings",
    title: "Review & Ratings",
    modelPath: "",
    fields: [
      {
        label: "Review Count",
        model: "reviewCount",
        component: "input",
        props: { type: "number", min: 0 },
      },
      {
        label: "Ratings",
        model: "ratings",
        component: "input",
        props: { type: "number", step: "0.1", min: 0 },
      },
    ],
  },
  {
    id: "gift-options",
    title: "Gift Options",
    modelPath: "giftOptions",
    fields: [
      {
        label: "Is Gift Wrappable",
        model: "isGiftWrappable",
        component: "input",
        props: { type: "checkbox" },
      },
    ],
  },
  {
    id: "age-restriction",
    title: "Age Restriction",
    modelPath: "ageRestriction",
    fields: [
      {
        label: "Minimum Age",
        model: "minimumAge",
        component: "input",
        props: { type: "number" },
      },
      {
        label: "Warning Message",
        model: "warningMessage",
        component: "input",
        props: { type: "text" },
      },
    ],
  },
  {
    id: "warranty",
    title: "Warranty",
    modelPath: "warranty",
    fields: [
      {
        label: "Duration (Months)",
        model: "durationInMonths",
        component: "input",
        props: { type: "number" },
      },
      {
        label: "Warranty Details",
        model: "warrantyDetails",
        component: "input",
        props: { type: "text" },
      },
      {
        label: "Provider",
        model: "provider",
        component: "input",
        props: { type: "text" },
      },
    ],
  },
  {
    id: "customer-support",
    title: "Customer Support",
    modelPath: "customerSupport",
    fields: [
      {
        label: "Support Email",
        model: "supportEmail",
        component: "input",
        props: { type: "email" },
      },
      {
        label: "Support Phone",
        model: "supportPhone",
        component: "input",
        props: { type: "text" },
      },
      {
        label: "Support Hours",
        model: "supportHours",
        component: "input",
        props: { type: "text" },
      },
    ],
  },
];

// Helper functions for dynamic field binding
function getValue(section, fieldModel) {
  if (section.modelPath) {
    return selectedItem[section.modelPath][fieldModel];
  }
  return selectedItem[fieldModel];
}
function updateValue(section, fieldModel, newValue) {
  if (section.modelPath) {
    selectedItem[section.modelPath][fieldModel] = newValue;
  } else {
    selectedItem[fieldModel] = newValue;
  }
}
function handleInput(section, field, event) {
  const value =
    field.props && field.props.type === "checkbox"
      ? event.target.checked
      : event.target.value;
  updateValue(section, field.model, value);
}
function getNestedValue(section, subKey, fieldModel) {
  return selectedItem[section.modelPath][subKey][fieldModel];
}
function updateNestedValue(section, subKey, fieldModel, newValue) {
  selectedItem[section.modelPath][subKey][fieldModel] = newValue;
}
function handleNestedInput(section, subKey, field, event) {
  const value =
    field.props && field.props.type === "checkbox"
      ? event.target.checked
      : event.target.value;
  updateNestedValue(section, subKey, field.model, value);
}

// --- API and Item Selection ---
async function fetchItems() {
  try {
    const data = await $fetch("/api/items");
    items.value = Array.isArray(data) ? data : [];
  } catch (error) {
    showActionNotification("Error fetching items: " + error.message, "error");
  }
}
onMounted(fetchItems);
function selectItem(item) {
  Object.assign(selectedItem, JSON.parse(JSON.stringify(item)));
  structuredDataEntries.value = Object.entries(
    selectedItem.structuredData || {}
  ).map(([key, value]) => ({ key, value }));
  hasUnsavedChanges.value = false;
}
function clearSelectedItem() {
  Object.assign(selectedItem, {
    _id: null,
    name: "",
    price: 0,
    oldPrice: 0,
    savingsAmount: 0,
    savingsPercentage: "",
    preview: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    structuredData: {},
    image: "",
    moreImages: [],
    tags: [],
    stock: 0,
    variants: [],
    subscriptionOptions: [],
    returnPolicy: {
      isReturnable: true,
      returnPeriod: 30,
      restockingFeePercentage: 0,
    },
    preOrder: { available: false, estimatedShippingDate: "" },
    giftOptions: { isGiftWrappable: false, availableGiftMessages: [] },
    affiliateInfo: [],
    ageRestriction: { minimumAge: 0, warningMessage: "" },
    warranty: { durationInMonths: 0, warrantyDetails: "", provider: "" },
    shippingInfo: {
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      freeShippingEligible: false,
      availableRegions: [],
      estimatedDeliveryTime: "",
    },
    reviewCount: 0,
    ratings: 0,
    frequentlyBoughtTogether: [],
    productVideos: [],
    arLinks: [],
    model3DLinks: [],
    externalLinks: [],
    lifecycleStatus: "Active",
    customerSupport: { supportEmail: "", supportPhone: "", supportHours: "" },
    salesChannels: [],
  });
  structuredDataEntries.value = [];
  hasUnsavedChanges.value = false;
}

// --- Variants Management ---
function addVariant() {
  selectedItem.variants.push({
    color: { name: "", hex: "" },
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
    savingsPercentage: "",
    image: "",
    stock: 0,
    sku: "",
    dimensions: { length: 0, width: 0, height: 0 },
  });
}
function removeVariant(index) {
  selectedItem.variants.splice(index, 1);
}
const variantAttributes = [
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
const variantExpanded = reactive({});
function expandVariantAttribute(index, attr) {
  if (!variantExpanded[index]) variantExpanded[index] = {};
  variantExpanded[index][attr] = true;
}
function isVariantAttributeExpanded(index, attr) {
  return variantExpanded[index] && variantExpanded[index][attr];
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Form Submission & API Calls ---
async function handleSubmit() {
  isSubmitting.value = true;
  const newStructuredData = {};
  structuredDataEntries.value.forEach((entry) => {
    if (entry.key.trim() !== "") {
      newStructuredData[entry.key.trim()] = entry.value;
    }
  });
  selectedItem.structuredData = newStructuredData;
  try {
    if (selectedItem._id) {
      await updateItem();
    } else {
      await addItem();
    }
    hasUnsavedChanges.value = false;
  } catch (error) {
    showActionNotification("Error: " + error.message, "error");
  } finally {
    isSubmitting.value = false;
  }
}
async function addItem() {
  try {
    await $fetch("/api/items", { method: "POST", body: selectedItem });
    showActionNotification("Item added successfully", "success");
    await fetchItems();
    clearSelectedItem();
  } catch (error) {
    showActionNotification("Error adding item: " + error.message, "error");
  }
}
async function updateItem() {
  try {
    await $fetch(`/api/items/${selectedItem._id}`, {
      method: "PUT",
      body: selectedItem,
    });
    showActionNotification("Item updated successfully", "success");
    await fetchItems();
  } catch (error) {
    showActionNotification("Error updating item: " + error.message, "error");
  }
}
async function deleteItem() {
  if (!selectedItem._id) {
    showActionNotification("No item selected to delete", "error");
    return;
  }
  isDeleting.value = true;
  try {
    await $fetch(`/api/items/${selectedItem._id}`, { method: "DELETE" });
    showActionNotification("Item deleted successfully", "success");
    await fetchItems();
    clearSelectedItem();
  } catch (error) {
    showActionNotification("Error deleting item: " + error.message, "error");
  } finally {
    isDeleting.value = false;
  }
}
</script>

<style scoped>
/* Reset & Global Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: #f3f4f6;
  color: #333;
  line-height: 1.6;
}

/* Wrapper */
.wrapper {
  width: 100%;
  padding: 20px;
}

/* Header Bar (Sleek, full‑width, no border radius) */
.header {
  width: 100%;
  background: #111;
  color: #fff;
  padding: 20px;
  text-align: center;
}
.header h1 {
  font-size: 2.5rem;
  font-weight: 300;
}

/* Main Container */
.main-container {
  display: flex;
  gap: 20px;
}

/* Sidebar */
.sidebar {
  flex: 0 0 250px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.search-filters input,
.search-filters select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
}
.item-list {
  list-style: none;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 15px;
}
.item-list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease;
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
  transition: background 0.2s ease;
}
.new-item-btn:hover {
  background: #1d4ed8;
}

/* Editor */
.editor {
  flex: 1;
  background: #fff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Tabs */
.tab-header {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 20px;
}
.tab-header button {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease;
}
.tab-header button.active {
  border-bottom: 3px solid #2563eb;
  color: #2563eb;
  font-weight: 500;
}
.tab-header button:hover {
  color: #2563eb;
}

/* Tab Content */
.tab-content {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* Product Image Preview */
.product-image-preview {
  text-align: center;
  margin-bottom: 20px;
}
.product-image-preview img {
  max-width: 100%;
  height: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Form Sections */
.section {
  margin-bottom: 30px;
}
.section h2 {
  font-size: 1.6rem;
  margin-bottom: 15px;
  color: #374151;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #4b5563;
}
.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}

/* Additional Information (List Editors) */
.additional-info {
  margin-top: 30px;
  padding: 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}
.additional-info h2 {
  margin-bottom: 15px;
  font-size: 1.6rem;
  color: #374151;
}
.list-editor {
  margin-bottom: 20px;
}
.list-editor h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #4b5563;
}
.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.list-item input {
  flex: 1;
  padding: 8px;
  border: 1px solid #d1d5db;
  margin-right: 10px;
}
.add-list-btn {
  background: #16a34a;
  color: #fff;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
}
.add-list-btn:hover {
  background: #15803d;
}

/* Variants List */
.variants-header {
  text-align: center;
  margin-bottom: 20px;
}
.variants-header h2 {
  font-size: 1.8rem;
  color: #374151;
}
.variants-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.variant-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}
.variant-preview {
  flex: 0 0 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.variant-fields {
  flex: 1;
}
.input-inline {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}
.input-inline label {
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: #4b5563;
}
.input-inline input {
  padding: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}
.variant-attributes {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.attribute {
  display: flex;
  flex-direction: column;
}
.attribute label {
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: #4b5563;
}
.attribute input {
  padding: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}
.remove-btn {
  background: #dc2626;
  color: #fff;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}
.remove-btn:hover {
  background: #b91c1c;
}
.add-btn {
  background: #16a34a;
  color: #fff;
  padding: 12px 20px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
  align-self: center;
}
.add-btn:hover {
  background: #15803d;
}

/* Fixed Action Bar */
.fixed-actions {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.fixed-actions button {
  padding: 12px 20px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
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
}
.fixed-actions .action-notification {
  background: #0ea5e9;
  color: #fff;
  padding: 10px 15px;
  font-size: 1rem;
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
}
.modal {
  background: #fff;
  padding: 20px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
}
.modal-form-group input,
.modal-form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
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
}
.modal-cancel-btn {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

/* Spinner */
.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #2563eb;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 5px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Remove Border Radius Globally */
button,
input,
textarea,
select,
.modal,
.sidebar,
.editor,
.header {
  border-radius: 0 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  .sidebar,
  .editor {
    width: 100%;
  }
}
</style>
