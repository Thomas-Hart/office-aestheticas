<template>
  <div class="wrapper">
    <div class="hero">
      <h2>Add/Update Order</h2>
    </div>

    <div class="order-management-wrapper">
      <!-- Sidebar for managing orders -->
      <div class="left">
        <EditOrderSelectOrder :orders="orders" @orderSelected="selectOrder" />

        <!-- Action Buttons -->
        <EditOrderActionButtons
          :order="selectedOrder"
          @add-order="showAddOrderModal"
          @update-order="updateOrder"
          @delete-order="deleteOrder"
        />
      </div>

      <!-- Main content for order details and actions -->
      <div class="order-details">
        <!-- If an order is selected, show the subcomponents -->
        <div v-if="selectedOrder">
          <!-- General Information -->
          <EditOrderGeneralInfo
            :selectedOrder="selectedOrder"
            @updateOrder="handleUnsavedChanges"
          />

          <!-- Manage Order Items -->
          <EditOrderItemList
            :selectedOrder="selectedOrder"
            :items="items"
            @updateOrder="handleUnsavedChanges"
          />

          <!-- Shipping and Billing Addresses -->
          <!-- <EditOrderAddressInfo
              :selectedOrder="selectedOrder"
              @updateOrder="handleUnsavedChanges"
            /> -->

          <!-- Payment Information -->
          <!-- <EditOrderPaymentInfo
              :selectedOrder="selectedOrder"
              @updateOrder="handleUnsavedChanges"
            /> -->

          <!-- Sellers Business Information -->
          <!-- <EditOrderSellerInfo
              :selectedOrder="selectedOrder"
              @updateOrder="handleUnsavedChanges"
            /> -->
        </div>

        <!-- Informational message when no order is selected -->
        <div v-else class="no-order-selected">
          <p>
            Please select an order from the list or create a new one to edit.
          </p>
        </div>
      </div>

      <!-- Unsaved Changes Popup -->
      <div v-if="hasUnsavedChanges" class="unsaved-changes-popup">
        <img
          src="/Graphics/EditPages/Alert.webp"
          alt="Alert Icon"
          class="popup-icon"
        />
        <div class="popup-content">
          <p class="popup-message">You have unsaved changes.</p>
          <button class="popup-save-button" @click="updateOrder">
            Save Changes
          </button>
        </div>
      </div>

      <!-- Add Order Modal -->
      <EditOrderAddOrderModal
        :visible="showModal"
        @close="closeModal"
        @add-order="addOrder"
      />

      <!-- Notification Popup -->
      <SubcomponentsNotificationPopup
        v-if="notificationMessage"
        :message="notificationMessage"
        :type="notificationType"
        @close-popup="notificationMessage = null"
      />
    </div>
  </div>
</template>
  
  <script setup>
// State management
const selectedOrder = ref(null); // Initialize as null
const hasUnsavedChanges = ref(false);
const notificationMessage = ref("");
const notificationType = ref("info");
const showModal = ref(false);

// Fetch orders and items using useFetch
const { data: fetchedOrders, error: ordersError } = await useFetch(
  "/api/orders"
);
const orders = computed(() =>
  Array.isArray(fetchedOrders.value) ? fetchedOrders.value : []
);

const { data: fetchedItems, error: itemsError } = await useFetch("/api/items");
const items = computed(() =>
  Array.isArray(fetchedItems.value) ? fetchedItems.value : []
);

if (ordersError.value) {
  showNotification(
    "Error fetching orders: " + ordersError.value.message,
    "error"
  );
}

if (itemsError.value) {
  showNotification(
    "Error fetching items: " + itemsError.value.message,
    "error"
  );
}

// Select an order
function selectOrder(orderId) {
  const foundOrder = orders.value.find((o) => o._id === orderId);
  if (foundOrder) {
    selectedOrder.value = { ...foundOrder };
    hasUnsavedChanges.value = false; // Reset unsaved changes flag when an order is selected
  }
}

// Add a new order
async function addOrder(newOrderData) {
  try {
    await $fetch("/api/orders", {
      method: "POST",
      body: {
        ...newOrderData,
        ...getDefaultOrderFields(),
      },
    });
    showNotification("Order added successfully", "success");
    refreshOrders();
    showModal.value = false; // Close the modal after adding
  } catch (error) {
    showNotification("Error adding order: " + error.message, "error");
  }
}

// Default fields for a new order
function getDefaultOrderFields() {
  return {
    invoiceNumber: "",
    orderDate: new Date(),
    shippedDate: null,
    expectedDeliveryDate: null,
    deliveryDate: null,
    status: "Pending",
    totalCost: 0,
    itemizedList: [],
    salesTax: 0,
    salesTaxRate: 0,
    buyersBillingAddress: {},
    buyersShippingAddress: {},
    sellersBusinessInformation: {
      businessName: "",
      address: {},
      taxIDNum: "",
    },
    paymentMethod: "",
    trackingNumber: "",
  };
}

// Update the selected order
async function updateOrder() {
  try {
    if (selectedOrder.value && selectedOrder.value._id) {
      await $fetch(`/api/orders/${selectedOrder.value._id}`, {
        method: "PUT",
        body: selectedOrder.value,
      });
      showNotification("Order updated successfully", "success");
      refreshOrders();
      hasUnsavedChanges.value = false; // Reset unsaved changes flag after successful save
    }
  } catch (error) {
    showNotification("Error updating order: " + error.message, "error");
  }
}

// Delete the selected order
async function deleteOrder() {
  if (!selectedOrder.value) {
    showNotification("Please select an order to delete", "error");
    return;
  }

  try {
    await $fetch(`/api/orders/${selectedOrder.value._id}`, {
      method: "DELETE",
    });
    showNotification("Order deleted successfully", "success");
    refreshOrders();
    hasUnsavedChanges.value = false;
    selectedOrder.value = null; // Clear selected order
  } catch (error) {
    showNotification("Error deleting order: " + error.message, "error");
  }
}

// Refresh orders after changes
async function refreshOrders() {
  try {
    const updatedOrders = await $fetch("/api/orders");
    fetchedOrders.value = updatedOrders;
  } catch (error) {
    showNotification("Error refreshing orders: " + error.message, "error");
  }
}

// Track unsaved changes
function handleUnsavedChanges(updatedOrder) {
  selectedOrder.value = updatedOrder;
  hasUnsavedChanges.value = true;
}

// Show modal for adding an order
function showAddOrderModal() {
  showModal.value = true;
}

// Close modal
function closeModal() {
  showModal.value = false;
}

// Show notifications
function showNotification(message, type = "info") {
  notificationMessage.value = message;
  notificationType.value = type;
  setTimeout(() => {
    notificationMessage.value = null;
  }, 5000);
}
</script>
  
  <style scoped>
.wrapper {
  max-width: 100vw;
}

.order-management-wrapper {
  display: flex;
  min-height: 100vh;
  max-width: 100%;
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
}

.left {
  max-width: 100%;
}

.hero {
  width: 100%;
  text-align: left;
  border-bottom: 1px solid #ddd;
  padding: 0.75rem 10px;
  color: white;
  background: #3f654c;
}

.hero h2 {
  margin: 0;
  color: white;
  font-size: 18px;
}

.unsaved-changes-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  gap: 1rem;
  z-index: 1000;
  max-width: 320px;
}

.popup-icon {
  width: 32px;
  height: 32px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.popup-message {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.popup-save-button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.popup-save-button:hover {
  background-color: #0056b3;
}

.order-details {
  width: 100%;
  padding: 2rem;
  max-width: 100%;
}

.no-order-selected {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.no-order-selected p {
  font-size: 1.2rem;
}

/* Media query for tablets and smaller screens */
@media (max-width: 1160px) {
  .order-management-wrapper {
    flex-direction: column;
  }

  .order-details {
    padding: 1rem;
    max-width: 100%;
  }

  .unsaved-changes-popup {
    bottom: 10px;
    right: 10px;
    max-width: 90%;
  }
}

/* Media query for mobile devices */
@media (max-width: 768px) {
  .order-management-wrapper {
    padding: 0.5rem;
  }

  .order-details {
    padding: 0.5rem;
    max-width: 100%;
    width: 100%;
  }

  .unsaved-changes-popup {
    flex-direction: column;
    align-items: center;
    bottom: 10px;
    right: 10px;
    max-width: 100%;
    padding: 1rem;
  }

  .popup-content {
    align-items: center;
    text-align: center;
  }

  .popup-icon {
    width: 24px;
    height: 24px;
  }

  .popup-message {
    font-size: 0.9rem;
  }

  .popup-save-button {
    width: 100%;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

/* Media query for small mobile screens */
@media (max-width: 480px) {
  .popup-message {
    font-size: 0.8rem;
  }

  .order-details {
    padding: 0.5rem;
    width: 100%;
    max-width: 100%;
  }

  .popup-save-button {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
  