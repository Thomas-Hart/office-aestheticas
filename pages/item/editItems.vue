<template>
  <div class="wrapper">
    <!-- Header -->
    <header class="header">
      <h1>Item Management</h1>
    </header>
    <div class="main-container">
      <!-- Sidebar with Breadcrumbs -->
      <aside class="sidebar">
        <div class="breadcrumbs">
          <span class="breadcrumb-item">Dashboard</span>
          <span class="breadcrumb-separator">&gt;</span>
          <span class="breadcrumb-item">Items</span>
        </div>
        <!-- Sidebar Navigation (icons can be added as needed) -->
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
          <!-- General Tab -->
          <div v-if="activeTab === 'general'">
            <!-- Top: Key Product Information Card -->
            <div class="card form-card">
              <div class="product-image-preview" v-if="selectedItem.image">
                <NuxtImg
                  class="zoomable"
                  :src="`/ItemPics/${selectedItem.image}`"
                  alt="Product Image"
                  width="300"
                  height="300"
                />
              </div>
              <form @submit.prevent="handleSubmit" @input="markDirty">
                <div
                  v-for="section in topSections"
                  :key="section.id"
                  class="section"
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
                            ? { change: (e) => handleInput(section, field, e) }
                            : { input: (e) => handleInput(section, field, e) }
                        "
                      />
                    </div>
                  </div>
                  <div v-if="section.subFields">
                    <h3>{{ section.subTitle }}</h3>
                    <div class="grid">
                      <div
                        v-for="subField in section.subFields.dimensions"
                        :key="subField.model"
                        class="form-group"
                      >
                        <label :for="subField.model">{{
                          subField.label
                        }}</label>
                        <component
                          :is="subField.component"
                          :id="subField.model"
                          v-bind="subField.props"
                          :value="
                            getNestedValue(
                              section,
                              'dimensions',
                              subField.model
                            )
                          "
                          v-on="
                            subField.props.type === 'checkbox'
                              ? {
                                  change: (e) =>
                                    handleNestedInput(
                                      section,
                                      'dimensions',
                                      subField,
                                      e
                                    ),
                                }
                              : {
                                  input: (e) =>
                                    handleNestedInput(
                                      section,
                                      'dimensions',
                                      subField,
                                      e
                                    ),
                                }
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <!-- Bottom: Additional Information Card -->
            <div class="card additional-info-card">
              <div
                v-for="section in bottomSections"
                :key="section.id"
                class="section"
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
                          ? { change: (e) => handleInput(section, field, e) }
                          : { input: (e) => handleInput(section, field, e) }
                      "
                    />
                  </div>
                </div>
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
                                change: (e) =>
                                  handleNestedInput(
                                    section,
                                    'dimensions',
                                    subField,
                                    e
                                  ),
                              }
                            : {
                                input: (e) =>
                                  handleNestedInput(
                                    section,
                                    'dimensions',
                                    subField,
                                    e
                                  ),
                              }
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- List Editors -->
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
                    v-model="selectedItem.shippingInfo.availableRegions[index]"
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
              <div class="list-editor">
                <h3>Frequently Bought Together</h3>
                <div
                  v-for="(
                    itemId, index
                  ) in selectedItem.frequentlyBoughtTogether"
                  :key="'fbt' + index"
                  class="list-item"
                >
                  <select
                    v-model="selectedItem.frequentlyBoughtTogether[index]"
                  >
                    <option value="">Select an item</option>
                    <option
                      v-for="item in getFrequentlyBoughtOptions(index)"
                      :key="item._id"
                      :value="item._id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
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
            </div>
          </div>
          <!-- Variants Tab -->
          <div v-if="activeTab === 'variants'">
            <div class="card variants-card">
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
                        placeholder="Enter variant image URL"
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
                    <div class="variant-attributes">
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
                      <template v-for="attr in variantAttributes" :key="attr">
                        <div class="attribute">
                          <template
                            v-if="
                              variant[attr] ||
                              isVariantAttributeExpanded(index, attr)
                            "
                          >
                            <label>{{ capitalize(attr) }}</label>
                            <input
                              v-model="variant[attr]"
                              type="text"
                              @input="markDirty"
                              @blur="updateVariantSKU(index)"
                            />
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
    <!-- Modal for New Item Creation -->
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

const actionNotification = ref(""),
  hasUnsavedChanges = ref(false);
const markDirty = () => (hasUnsavedChanges.value = true);
const showActionNotification = (msg, type = "success") => {
  actionNotification.value = msg;
  setTimeout(() => (actionNotification.value = ""), 3000);
};

const isSubmitting = ref(false),
  isDeleting = ref(false),
  isModalLoading = ref(false);
const searchTerm = ref(""),
  filterStatus = ref(""),
  items = ref([]);
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
    dimensions: { length: 0, width: 0, height: 0 },
    freeShippingEligible: false,
    availableRegions: [],
    estimatedDeliveryTime: "",
  },
  reviewCount: 0,
  ratings: 0,
  frequentlyBoughtTogether: [],
  productVideos: [],
  lifecycleStatus: "Active",
});

const activeTab = ref("general");
const showNewItemModal = ref(false);
const newItemForm = reactive({
  name: "",
  price: 0,
  oldPrice: 0,
  description: "",
  image: "",
});

// Define form sections and split into top (key info) and bottom (additional fields)
const formSections = [
  {
    id: "general-info",
    title: "Key Product Information",
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
];

const getFrequentlyBoughtOptions = (index) => {
  // Get the already selected items in the frequently bought list (except current index)
  const alreadySelected = selectedItem.frequentlyBoughtTogether.filter(
    (val, i) => i !== index
  );
  // Return items excluding the current item and those already selected
  return items.value.filter(
    (item) =>
      item._id !== selectedItem._id && !alreadySelected.includes(item._id)
  );
};

const topSections = formSections.filter(
  (section) => section.id === "general-info"
);
const bottomSections = formSections.filter(
  (section) => section.id !== "general-info"
);

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

const addVariant = () => {
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
  markDirty();
};
const removeVariant = (index) => {
  selectedItem.variants.splice(index, 1);
  markDirty();
};
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
const expandVariantAttribute = (i, attr) => {
  if (!variantExpanded[i]) variantExpanded[i] = {};
  variantExpanded[i][attr] = true;
};
const isVariantAttributeExpanded = (i, attr) =>
  variantExpanded[i] && variantExpanded[i][attr];
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
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
    showActionNotification("Error fetching items: " + error.message, "error");
  }
};
onMounted(fetchItems);
const selectItem = (item) => {
  Object.assign(selectedItem, JSON.parse(JSON.stringify(item)));
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
      dimensions: { length: 0, width: 0, height: 0 },
      freeShippingEligible: false,
      availableRegions: [],
      estimatedDeliveryTime: "",
    },
    reviewCount: 0,
    ratings: 0,
    frequentlyBoughtTogether: [],
    productVideos: [],
    lifecycleStatus: "Active",
  });
  hasUnsavedChanges.value = false;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    selectedItem._id ? await updateItem() : await addItem();
    hasUnsavedChanges.value = false;
  } catch (error) {
    showActionNotification("Error: " + error.message, "error");
  } finally {
    isSubmitting.value = false;
  }
};
const addItem = async () => {
  try {
    await $fetch("/api/items", { method: "POST", body: selectedItem });
    showActionNotification("Item added successfully", "success");
    await fetchItems();
    clearSelectedItem();
  } catch (error) {
    showActionNotification("Error adding item: " + error.message, "error");
  }
};
const updateItem = async () => {
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
};
const deleteItem = async () => {
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
</script>

<style scoped>
/* Use Inter font (or Roboto fallback) with clear typography and ample whitespace */
.wrapper,
body {
  font-family: "Inter", "Roboto", sans-serif;
  line-height: 1.6;
  background-color: #f9fafb;
  color: #333;
  font-size: 1rem;
  margin: 0;
  padding: 0;
}

/* Layout & Spacing */
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
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Enhanced shadow for depth */
}
.breadcrumbs {
  font-size: 0.9rem;
  margin-bottom: 15px;
  color: #6b7280;
}
.breadcrumb-item {
  margin-right: 5px;
}
.breadcrumb-separator {
  margin-right: 5px;
}
.search-filters input,
.search-filters select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #e5e7eb;
  min-width: 200px;
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
  transition: background 0.2s ease;
  min-width: 200px;
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
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Enhanced shadow for depth */
}

/* Tab Header */
.tab-header {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}
.tab-header button {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.2s ease;
  min-width: 200px;
}
.tab-header button.active,
.tab-header button:hover {
  background-color: #f0f0f0;
  color: #2563eb;
  font-weight: 500;
}

/* Card Layouts */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Enhanced shadow for depth */
}
.form-card {
  margin-bottom: 20px;
}
.additional-info-card,
.variants-card {
  /* Card layout for additional information and variants */
}

/* Grid System for Forms */
.grid {
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-group label {
  font-size: 0.9rem;
  color: #4b5563;
}

/* Product Image with Zoom Effect */
.product-image-preview {
  text-align: center;
  margin-bottom: 20px;
}
.product-image-preview img {
  max-width: 100%;
  height: auto;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Enhanced shadow for depth */
  transition: transform 0.3s ease;
}
.product-image-preview img.zoomable:hover {
  transform: scale(1.05);
}

/* List Editors */
.list-editor {
  margin-bottom: 15px;
}
.list-editor h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #4b5563;
}
.list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

input {
  padding-left: 5px;
}
.list-item input {
  flex: 1;
  padding: 10px;
  border: 1px solid #e5e7eb;
  min-width: 200px;
}
/* Secondary style for list editor buttons */
.add-list-btn {
  background: transparent;
  border: 1px solid #2563eb;
  color: #2563eb;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s ease;
  min-width: 200px;
}
.add-list-btn:hover {
  background: #e5e7eb;
}

/* Variants */
.variants-header {
  text-align: center;
  margin-bottom: 20px;
}
.variants-header h2 {
  font-size: 1.6rem;
  color: #374151;
}
.variants-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.variant-row {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  padding: 20px;
  background: #ffffff; /* Distinct background for variant rows */
  border: 1px solid #e5e7eb; /* Distinct border for variant rows */
  border-radius: 4px;
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
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}
.input-inline label {
  font-size: 0.9rem;
  color: #4b5563;
}
.input-inline input {
  padding: 10px;
  border: 1px solid #e5e7eb;
  min-width: 200px;
}
.variant-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}
.attribute {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.attribute label {
  font-size: 0.9rem;
  color: #4b5563;
}
.attribute input {
  padding: 10px;
  border: 1px solid #e5e7eb;
  min-width: 200px;
}
.remove-btn {
  background: #dc2626;
  color: #fff;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
  min-width: 200px;
}
.remove-btn:hover {
  background: #c11b1b;
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
  min-width: 200px;
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
  gap: 20px; /* Increased gap for better spacing */
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
  min-width: 200px;
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
  background: #2563eb;
  color: #fff;
  padding: 10px 15px;
  font-size: 1rem;
}

/* Modal with Fade-in and Scale Animation */
/* Modal animation with scale */
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
  opacity: 1;
  transition: opacity 0.3s ease;
}
.modal {
  background: #fff;
  padding: 20px;
  width: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Enhanced shadow for depth */
  animation: fadeIn 0.3s ease; /* Modal animation with scale */
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
  padding: 10px;
  border: 1px solid #e5e7eb;
  min-width: 200px;
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
  transition: background 0.2s ease;
  min-width: 200px;
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
  transition: background 0.2s ease;
  min-width: 200px;
}
.modal-cancel-btn:hover {
  background: #c11b1b;
}

/* Focus states for accessibility */
/* Focus states for accessibility */
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Global Reset for Form Elements */
button,
input,
textarea,
select {
  border-radius: 4px;
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
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
