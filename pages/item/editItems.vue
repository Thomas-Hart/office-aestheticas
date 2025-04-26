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
          <div class="form-group" :class="{ 'has-text': searchTerm }">
            <label for="searchTerm">Search items...</label>
            <input
              id="searchTerm"
              type="text"
              v-model="searchTerm"
              placeholder="Search items..."
            />
          </div>
          <div class="form-group" :class="{ 'has-text': filterStatus }">
            <label for="filterStatus">Status</label>
            <select id="filterStatus" v-model="filterStatus">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Discontinued">Discontinued</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>
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
              <div v-if="selectedItem.image" class="product-image-preview">
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
                      :class="{
                        'has-text':
                          field.props.type === 'number'
                            ? getValue(section, field.model) != null
                            : getValue(section, field.model),
                      }"
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
                        :class="{
                          'has-text':
                            subField.props.type === 'number'
                              ? getNestedValue(
                                  section,
                                  'dimensions',
                                  subField.model
                                ) != null
                              : getNestedValue(
                                  section,
                                  'dimensions',
                                  subField.model
                                ),
                        }"
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
                    :class="{
                      'has-text':
                        field.props.type === 'number'
                          ? getValue(section, field.model) != null
                          : getValue(section, field.model),
                    }"
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
                      :class="{
                        'has-text':
                          subField.props.type === 'number'
                            ? getNestedValue(
                                section,
                                'dimensions',
                                subField.model
                              ) != null
                            : getNestedValue(
                                section,
                                'dimensions',
                                subField.model
                              ),
                      }"
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
                  <div class="form-group has-text">
                    <label :for="'moreImage' + index">Image URL</label>
                    <input
                      :id="'moreImage' + index"
                      type="text"
                      v-model="selectedItem.moreImages[index]"
                      placeholder="Image URL"
                    />
                  </div>
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
                  <div class="form-group has-text">
                    <label :for="'tag' + index">Tag</label>
                    <input
                      :id="'tag' + index"
                      type="text"
                      v-model="selectedItem.tags[index]"
                      placeholder="Tag"
                    />
                  </div>
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
                  <div class="form-group has-text">
                    <label :for="'giftMsg' + index">Gift Message</label>
                    <input
                      :id="'giftMsg' + index"
                      type="text"
                      v-model="
                        selectedItem.giftOptions.availableGiftMessages[index]
                      "
                      placeholder="Gift Message"
                    />
                  </div>
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
                  <div class="form-group has-text">
                    <label :for="'region' + index">Region</label>
                    <input
                      :id="'region' + index"
                      type="text"
                      v-model="
                        selectedItem.shippingInfo.availableRegions[index]
                      "
                      placeholder="Region"
                    />
                  </div>
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
                  <div class="form-group has-text">
                    <label :for="'fbt' + index">Select Item</label>
                    <select
                      :id="'fbt' + index"
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
                  </div>
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
            <EditItemVariants
              :variants="selectedItem.variants"
              @mark-dirty="markDirty"
              @update-variant-sku="updateVariantSKU"
              @add-variant="addVariant"
              @remove-variant="removeVariant"
            />
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
          <div class="form-group" :class="{ 'has-text': newItemForm.name }">
            <label for="newItemName">Name</label>
            <input
              id="newItemName"
              type="text"
              v-model="newItemForm.name"
              required
            />
          </div>
          <div
            class="form-group"
            :class="{ 'has-text': newItemForm.price != null }"
          >
            <label for="newItemPrice">Price</label>
            <input
              id="newItemPrice"
              type="number"
              v-model.number="newItemForm.price"
              step="0.01"
              required
            />
          </div>
          <div
            class="form-group"
            :class="{ 'has-text': newItemForm.oldPrice != null }"
          >
            <label for="newItemOldPrice">Old Price</label>
            <input
              id="newItemOldPrice"
              type="number"
              v-model.number="newItemForm.oldPrice"
              step="0.01"
            />
          </div>
          <div
            class="form-group"
            :class="{ 'has-text': newItemForm.description }"
          >
            <label for="newItemDescription">Description</label>
            <textarea
              id="newItemDescription"
              v-model="newItemForm.description"
            ></textarea>
          </div>
          <div class="form-group" :class="{ 'has-text': newItemForm.image }">
            <label for="newItemImage">Image URL</label>
            <input id="newItemImage" type="text" v-model="newItemForm.image" />
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
        props: { type: "text" },
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
  const alreadySelected = selectedItem.frequentlyBoughtTogether.filter(
    (val, i) => i !== index
  );
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

// Variant functions
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
</script>

<style scoped>
/* INPUT & FORM-GROUP STYLES FROM MODAL COMPONENT */

.form-group {
  position: relative;
  margin-bottom: 1rem;
  height: 50px;
}
.form-group input,
.form-group select,
.form-group textarea {
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
.form-group.has-text select,
.form-group.has-text textarea {
  line-height: 12px;
  padding-top: 16px;
  border-color: #66afe9;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
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

/* REST OF ORIGINAL STYLES */
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

.wrapper {
  padding: 20px;
}
.main-container {
  display: flex;
  gap: 20px;
}

/* Sidebar */
.sidebar {
  flex: 0 0 250px;
  background: #fff;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
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
}
.new-item-btn:hover {
  background: #1d4ed8;
}

/* Editor */
.editor {
  flex: 1;
  background: #fff;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
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
}
.tab-header button.active,
.tab-header button:hover {
  background-color: #f0f0f0;
  color: #2563eb;
  font-weight: 500;
}
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
.grid {
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.list-editor {
  margin-bottom: 15px;
}
.add-list-btn {
  background: transparent;
  border: 1px solid #2563eb;
  color: #2563eb;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.add-list-btn:hover {
  background: #e5e7eb;
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
  cursor: pointer;
  transition: background 0.2s ease;
}
.fixed-actions button:hover {
  background: #1d4ed8;
}
.unsaved {
  background: #fbbf24;
  color: #1f2937;
  padding: 10px 15px;
}

/* Modal */
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
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
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
}
.modal-cancel-btn:hover {
  background: #c11b1b;
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
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
