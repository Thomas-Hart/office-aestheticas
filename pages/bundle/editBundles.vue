<template>
  <div class="wrapper">
    <h1>Add/Update Bundle</h1>

    <!-- Inline Notification Popup -->
    <div
      v-if="notificationMessage"
      class="notification"
      :class="notificationType"
    >
      <span>{{ notificationMessage }}</span>
      <button @click="closeNotification" class="close-button">x</button>
    </div>

    <div class="content">
      <!-- Inline: Select Bundle Section -->
      <div class="section">
        <h2>Select Bundle</h2>
        <select
          v-model="selectedBundleId"
          @change="onBundleSelected"
          class="dropdown-button"
        >
          <option disabled value="">Please select one</option>
          <option
            v-for="bundle in sortedBundles"
            :key="bundle._id"
            :value="bundle._id"
          >
            {{ bundle.name }}
          </option>
        </select>
      </div>

      <!-- Inline: General Information Section -->
      <div class="section">
        <h2>General Information</h2>
        <!-- Bundle Name -->
        <div class="input-wrapper">
          <input
            type="text"
            :value="selectedBundle.name"
            @input="onGeneralInputChange('name', $event.target.value)"
            placeholder=" "
          />
          <label>Bundle Name</label>
        </div>
        <!-- Bundle Price -->
        <div class="input-wrapper">
          <input
            type="number"
            :value="selectedBundle.price"
            @input="onGeneralInputChange('price', $event.target.value)"
            placeholder=" "
          />
          <label>Bundle Price</label>
        </div>
        <!-- Bundle Discount Percentage -->
        <div class="input-wrapper">
          <input
            type="number"
            :value="selectedBundle.discountPercentage"
            @input="
              onGeneralInputChange('discountPercentage', $event.target.value)
            "
            placeholder=" "
          />
          <label>Discount Percentage</label>
        </div>
        <!-- Bundle Stock -->
        <div class="input-wrapper">
          <input
            type="number"
            :value="selectedBundle.stock"
            @input="onGeneralInputChange('stock', $event.target.value)"
            placeholder=" "
          />
          <label>Bundle Stock</label>
        </div>
        <!-- Bundle Description -->
        <div class="input-wrapper">
          <textarea
            :value="selectedBundle.description"
            @input="onGeneralInputChange('description', $event.target.value)"
            placeholder=" "
          ></textarea>
          <label>Bundle Description</label>
        </div>
      </div>

      <!-- Inline: Bundled Products Section -->
      <div class="section">
        <h2>Bundled Products</h2>
        <div
          v-for="(product, index) in selectedBundle.items"
          :key="index"
          class="input-wrapper"
        >
          <div class="input-group">
            <select
              v-model="selectedBundle.items[index].itemId"
              @change="onProductIdChange(index)"
              class="dropdown-button"
            >
              <option disabled value="">Select Item</option>
              <option
                v-for="item in availableItems(index)"
                :key="item._id"
                :value="item._id"
              >
                {{ item.name }}
              </option>
            </select>
            <label>Item</label>
          </div>
          <div class="input-group">
            <input
              type="number"
              v-model="selectedBundle.items[index].quantity"
              placeholder=" "
              @input="onQuantityChange(index, $event.target.value)"
            />
            <label>Quantity</label>
          </div>
          <button @click="removeProduct(index)" class="remove-button">
            Remove Product
          </button>
        </div>
        <button @click="addProduct" class="action-button">
          Add Bundled Product
        </button>
      </div>

      <!-- Inline: Action Buttons Section -->
      <div class="section action-buttons">
        <h2>Available Actions</h2>
        <button @click="addBundle" class="action-button">Add Bundle</button>
        <button @click="updateBundle" class="action-button">
          Update Bundle
        </button>
        <button @click="deleteBundle" class="action-button">
          Delete Bundle
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// --- Notification State and Controls ---
const notificationMessage = ref("");
const notificationType = ref("info");

function showNotification(message, type = "info") {
  notificationMessage.value = message;
  notificationType.value = type;
}

function closeNotification() {
  notificationMessage.value = "";
}

// --- Parent State ---
const selectedBundle = ref({
  name: "",
  items: [],
  price: 0,
  discountPercentage: 0,
  stock: 0,
  description: "",
});
const selectedBundleId = ref("");

// --- Fetch Bundles and Items ---
const { data: fetchedBundles, error: bundlesError } = await useFetch(
  "/api/bundles"
);
const { data: fetchedItems, error: itemsError } = await useFetch("/api/items");

const bundles = computed(() =>
  Array.isArray(fetchedBundles.value) ? fetchedBundles.value : []
);
const items = computed(() =>
  Array.isArray(fetchedItems.value) ? fetchedItems.value : []
);

if (bundlesError.value) {
  showNotification(
    "Error fetching bundles: " + bundlesError.value.message,
    "error"
  );
}

if (itemsError.value) {
  showNotification(
    "Error fetching items: " + itemsError.value.message,
    "error"
  );
}

const sortedBundles = computed(() => {
  return [...bundles.value].sort((a, b) => a.name.localeCompare(b.name));
});

// --- Select Bundle Logic ---
function onBundleSelected() {
  const bundleId = selectedBundleId.value;
  const foundBundle = bundles.value.find((b) => b._id === bundleId);
  if (foundBundle) {
    selectedBundle.value = { ...foundBundle };
  } else {
    resetBundle();
  }
}

function resetBundle() {
  selectedBundle.value = {
    name: "",
    items: [],
    price: 0,
    discountPercentage: 0,
    stock: 0,
    description: "",
  };
}

// --- General Information Logic ---
function onGeneralInputChange(field, value) {
  selectedBundle.value = { ...selectedBundle.value, [field]: value };
}

// --- Bundled Products Logic ---
function availableItems(index) {
  const selectedIds = selectedBundle.value.items
    .map((product, i) => (i !== index ? product.itemId : null))
    .filter((id) => id !== null);
  return items.value.filter(
    (item) =>
      !selectedIds.includes(item._id) ||
      item._id === selectedBundle.value.items[index].itemId
  );
}

function onProductIdChange(index) {
  selectedBundle.value = {
    ...selectedBundle.value,
    items: [...selectedBundle.value.items],
  };
}

function onQuantityChange(index, newQuantity) {
  selectedBundle.value.items[index].quantity = newQuantity;
  selectedBundle.value = {
    ...selectedBundle.value,
    items: [...selectedBundle.value.items],
  };
}

function addProduct() {
  const newProduct = { itemId: "", quantity: 1 };
  selectedBundle.value = {
    ...selectedBundle.value,
    items: [...selectedBundle.value.items, newProduct],
  };
}

function removeProduct(index) {
  const updatedItems = [...selectedBundle.value.items];
  updatedItems.splice(index, 1);
  selectedBundle.value = {
    ...selectedBundle.value,
    items: updatedItems,
  };
}

// --- Action Buttons Logic ---
async function fetchBundles() {
  // Re-fetch bundles (implementation may vary)
  const { data } = await useFetch("/api/bundles");
  // In a real app, you might update a reactive variable here.
}

async function addBundle() {
  try {
    await $fetch("/api/bundles", {
      method: "POST",
      body: selectedBundle.value,
    });
    showNotification("Bundle added successfully", "success");
    await fetchBundles();
  } catch (error) {
    showNotification("Error adding bundle: " + error.message, "error");
  }
}

async function updateBundle() {
  try {
    if (selectedBundle.value._id) {
      await $fetch(`/api/bundles/${selectedBundle.value._id}`, {
        method: "PUT",
        body: selectedBundle.value,
      });
      showNotification("Bundle updated successfully", "success");
      await fetchBundles();
    }
  } catch (error) {
    showNotification("Error updating bundle: " + error.message, "error");
  }
}

async function deleteBundle() {
  if (!selectedBundle.value._id) {
    showNotification("Please select a bundle to delete", "error");
    return;
  }

  try {
    await $fetch(`/api/bundles/${selectedBundle.value._id}`, {
      method: "DELETE",
    });
    showNotification("Bundle deleted successfully", "success");
    await fetchBundles();
  } catch (error) {
    showNotification("Error deleting bundle: " + error.message, "error");
  }
}
</script>

<style scoped>
/* Global Parent Styles */
.wrapper {
  padding: 2rem;
  width: 100%;
  margin: 0;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 700;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
}

/* Notification Styling */
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 4px;
  font-weight: bold;
  z-index: 1000;
  display: flex;
  align-items: center;
}
.notification.error {
  background-color: #e74c3c;
  color: white;
}
.notification.success {
  background-color: #2ecc71;
  color: white;
}
.close-button {
  background: transparent;
  border: none;
  color: inherit;
  margin-left: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
}

/* Section Styling */
.section {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
}

/* Input Wrapper & Label Styling */
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
.input-wrapper input:focus,
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

/* Dropdown Button Styling */
.dropdown-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  transition: background-color 0.3s, color 0.3s;
}
.dropdown-button:hover {
  background-color: #ff8210;
  color: white;
}

/* Input Group Styling (for bundled products) */
.input-group {
  position: relative;
  margin-bottom: 1rem;
}
.input-group input[type="text"],
.input-group input[type="number"],
.dropdown-button {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  margin-bottom: 0.5rem;
}
.input-group input:focus,
.input-group .dropdown-button:focus {
  border-color: #4caf50;
  outline: none;
}
.input-group label {
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
.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label,
.dropdown-button:focus + label,
.dropdown-button:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 0.85rem;
  color: #4caf50;
}

/* Remove Button Styling */
.remove-button {
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  width: 100%;
  margin-top: 1rem;
}
.remove-button:hover {
  background-color: #c0392b;
}

/* Action Buttons Styling */
.action-buttons {
  text-align: center;
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
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
