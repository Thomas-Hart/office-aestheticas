<template>
  <div class="wrapper">
    <h1>Add/Update Item</h1>

    <div class="columns-container">
      <!-- Column 1 -->
      <div class="column">
        <div class="section">
          <EcommerceEditItemsSelectItem
            :items="items"
            @itemSelected="selectItem"
          />
        </div>
        <div class="section">
          <h2>General Information</h2>
          <EcommerceEditItemsGeneralInfo
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
        </div>
        <div class="section">
          <h2>External Links and Support</h2>
          <EcommerceEditItemsExternalLinks
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsCustomerSupport
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
        </div>
        <!-- Action Buttons -->
        <div class="action-buttons">
          <EcommerceEditItemsActionButtons
            :item="selectedItem"
            @add-item="addItem"
            @update-item="updateItem"
            @delete-item="deleteItem"
          />
        </div>
      </div>

      <!-- Column 2 -->
      <div class="column">
        <div class="section">
          <h2>Images and Media</h2>
          <EcommerceEditItemsAdditionalImages
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsProductVideos
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsARLinks
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItems3DModelLinks
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
        </div>
        <div class="section">
          <h2>Pricing and Promotions</h2>
          <EcommerceEditItemsSubscriptionOptions
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsFrequentlyBoughtTogether
            :selectedItem="selectedItem"
            :items="items"
            @updateItem="updateSelectedItem($event)"
          />
        </div>
      </div>

      <!-- Column 3 -->
      <div class="column">
        <div class="section">
          <h2>Policies</h2>
          <EcommerceEditItemsReturnPolicy
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsGiftOptions
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsAffiliateInfo
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsAgeRestriction
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsWarranty
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
        </div>
        <div class="section">
          <h2>Shipping and Handling</h2>
          <EcommerceEditItemsShippingInfo
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsPreOrder
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
        </div>
      </div>

      <!-- Column 4 -->
      <div class="column">
        <div class="section">
          <h2>Sales Channels and Metadata</h2>
          <EcommerceEditItemsSalesChannels
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsLifecycleStatus
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsCustomMetaData
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
          <EcommerceEditItemsStructuredData
            :selectedItem="selectedItem"
            @updateItem="updateSelectedItem($event)"
          />
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Inventory and Variants</h2>
      <EcommerceEditItemsInventory
        :selectedItem="selectedItem"
        @updateItem="updateSelectedItem($event)"
      />
      <EcommerceEditItemsVariants
        :selectedItem="selectedItem"
        @updateItem="updateSelectedItem($event)"
      />
    </div>

    <!-- Notification Popup -->
    <SubcomponentsNotificationPopup
      v-if="notificationMessage"
      :message="notificationMessage"
      :type="notificationType"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// State management
const selectedItem = ref({
  name: "",
  price: "",
  oldPrice: "",
  preview: "",
  description: "",
  image: "",
  moreImages: [],
  stock: 0,
  tags: [],
  variants: [],
  subscriptionOptions: [],
  returnPolicy: {
    isReturnable: true,
    returnPeriod: 30,
    restockingFeePercentage: 0,
  },
  giftOptions: {
    isGiftWrappable: false,
    availableGiftMessages: [],
  },
  affiliateInfo: [],
  ageRestriction: {
    minimumAge: 0,
    warningMessage: "",
  },
  warranty: {
    durationInMonths: 0,
    warrantyDetails: "",
    provider: "",
  },
  shippingInfo: {
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    freeShippingEligible: false,
    availableRegions: [],
    estimatedDeliveryTime: "",
  },
  frequentlyBoughtTogether: [],
  productVideos: [],
  arLinks: [],
  model3DLinks: [],
  preOrder: {
    available: false,
    estimatedShippingDate: null,
  },
  externalLinks: [],
  customerSupport: {
    supportEmail: "",
    supportPhone: "",
    supportHours: "",
  },
  salesChannels: [],
  customMetadata: new Map(),
  lifecycleStatus: "Active",
});

// Notification state
const notificationMessage = ref("");
const notificationType = ref("info");

// Fetch items using useFetch
const { data: fetchedItems, error: fetchError } = await useFetch("/api/items");
const items = computed(() =>
  Array.isArray(fetchedItems.value) ? fetchedItems.value : []
);

if (fetchError.value) {
  showNotification(
    "Error fetching items: " + fetchError.value.message,
    "error"
  );
}

// Load selected item
function selectItem(itemId) {
  const foundItem = items.value.find((i) => i._id === itemId);
  if (foundItem) {
    selectedItem.value = { ...foundItem };
  }
}

// Add item
async function addItem() {
  try {
    await $fetch("/api/items", {
      method: "POST",
      body: selectedItem.value,
    });
    showNotification("Item added successfully", "success");
    await refreshItems();
  } catch (error) {
    showNotification("Error adding item: " + error.message, "error");
  }
}

// Update item
async function updateItem() {
  try {
    if (selectedItem.value._id) {
      await $fetch(`/api/items/${selectedItem.value._id}`, {
        method: "PUT",
        body: selectedItem.value,
      });
      showNotification("Item updated successfully", "success");
      await refreshItems();
    }
  } catch (error) {
    showNotification("Error updating item: " + error.message, "error");
  }
}

// Delete item
async function deleteItem() {
  if (!selectedItem.value) {
    showNotification("Please select an item to delete", "error");
    return;
  }

  try {
    await $fetch(`/api/items/${selectedItem.value._id}`, {
      method: "DELETE",
    });
    showNotification("Item deleted successfully", "success");
    await refreshItems();
  } catch (error) {
    showNotification("Error deleting item: " + error.message, "error");
  }
}

// Refresh items after adding, updating, or deleting
async function refreshItems() {
  try {
    const updatedItems = await $fetch("/api/items");
    fetchedItems.value = updatedItems;
  } catch (error) {
    showNotification("Error refreshing items: " + error.message, "error");
  }
}

// Show notification
function showNotification(message, type = "info") {
  notificationMessage.value = message;
  notificationType.value = type;
}

// Update individual sections
function updateSelectedItem(updatedSelectedItem) {
  selectedItem.value = updatedSelectedItem;
}

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>


<style scoped>
.wrapper {
  padding: 2rem;
  width: 100%;
  margin: 0;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
  background-color: #f7f7f7;
}

h1 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.columns-container {
  display: flex;
  gap: 1rem;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section {
  background: #fff;
  padding: 1rem;
  border-radius: 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 0.75rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.action-buttons button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-buttons button:hover {
  background-color: #4caf50;
  color: white;
}
</style>
