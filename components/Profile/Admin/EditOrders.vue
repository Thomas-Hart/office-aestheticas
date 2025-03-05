<template>
  <div class="wrapper">
    <!-- Header -->
    <header class="header">
      <h1>Order Management</h1>
    </header>
    <div class="main-container">
      <!-- Sidebar with Order List -->
      <aside class="sidebar">
        <div class="search-filters">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search orders by invoice..."
          />
        </div>
        <ul class="order-list">
          <li
            v-for="order in filteredOrders"
            :key="order._id"
            @click="selectOrder(order)"
            :class="{ active: selectedOrder._id === order._id }"
          >
            {{ order.invoiceNumber }}
          </li>
        </ul>
        <button class="new-order-btn" @click="openNewOrderModal">
          + New Order
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
          <!-- General Info Tab -->
          <div v-if="activeTab === 'general'" class="general-info">
            <div class="row">
              <!-- Left Column: Invoice, Dates, Status, and Cost -->
              <div class="column left">
                <div class="form-group">
                  <label for="invoiceNumber">Invoice Number</label>
                  <input
                    type="text"
                    id="invoiceNumber"
                    v-model="selectedOrder.invoiceNumber"
                    placeholder="Invoice #"
                  />
                </div>
                <div class="form-group">
                  <label for="orderDate">Order Date</label>
                  <input
                    type="date"
                    id="orderDate"
                    v-model="selectedOrder.orderDate"
                  />
                </div>
                <div class="form-group">
                  <label for="shippedDate">Shipped Date</label>
                  <input
                    type="date"
                    id="shippedDate"
                    v-model="selectedOrder.shippedDate"
                  />
                </div>
                <div class="form-group">
                  <label for="expectedDeliveryDate">Expected Delivery</label>
                  <input
                    type="date"
                    id="expectedDeliveryDate"
                    v-model="selectedOrder.expectedDeliveryDate"
                  />
                </div>
                <div class="form-group">
                  <label for="status">Status</label>
                  <select id="status" v-model="selectedOrder.status">
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="totalCost">Total Cost</label>
                  <input
                    type="number"
                    id="totalCost"
                    v-model.number="selectedOrder.totalCost"
                    step="0.01"
                    readonly
                  />
                </div>
                <div class="form-group">
                  <label for="salesTax">Sales Tax</label>
                  <input
                    type="number"
                    id="salesTax"
                    v-model.number="selectedOrder.salesTax"
                    step="0.01"
                  />
                </div>
                <div class="form-group">
                  <label for="salesTaxRate">Sales Tax Rate</label>
                  <input
                    type="number"
                    id="salesTaxRate"
                    v-model.number="selectedOrder.salesTaxRate"
                    step="0.01"
                  />
                </div>
              </div>
              <!-- Right Column: Payment, Tracking, and Customer Email -->
              <div class="column right">
                <div class="form-group">
                  <label for="paymentMethod">Payment Method</label>
                  <input
                    type="text"
                    id="paymentMethod"
                    v-model="selectedOrder.paymentMethod"
                    placeholder="e.g., Credit Card"
                  />
                </div>
                <div class="form-group">
                  <label for="trackingNumber">Tracking Number</label>
                  <input
                    type="text"
                    id="trackingNumber"
                    v-model="selectedOrder.trackingNumber"
                    placeholder="Tracking #"
                  />
                </div>
                <div class="form-group">
                  <label for="associatedEmail">Associated Email</label>
                  <input
                    type="email"
                    id="associatedEmail"
                    v-model="selectedOrder.associatedEmail"
                    placeholder="Customer Email"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Address Tab -->
          <div v-if="activeTab === 'shipping'" class="shipping-info">
            <h2>Buyer's Shipping Address</h2>
            <div class="grid">
              <div class="form-group">
                <label for="shipFirstName">First Name</label>
                <input
                  type="text"
                  id="shipFirstName"
                  v-model="selectedOrder.buyersShippingAddress.firstName"
                  placeholder="First Name"
                />
              </div>
              <div class="form-group">
                <label for="shipLastName">Last Name</label>
                <input
                  type="text"
                  id="shipLastName"
                  v-model="selectedOrder.buyersShippingAddress.lastName"
                  placeholder="Last Name"
                />
              </div>
              <div class="form-group">
                <label for="shipStreet">Street Address</label>
                <input
                  type="text"
                  id="shipStreet"
                  v-model="selectedOrder.buyersShippingAddress.streetAddress"
                  placeholder="Street Address"
                />
              </div>
              <div class="form-group">
                <label for="shipSecondary">Secondary Address</label>
                <input
                  type="text"
                  id="shipSecondary"
                  v-model="selectedOrder.buyersShippingAddress.secondaryAddress"
                  placeholder="Apt, Suite, etc."
                />
              </div>
              <div class="form-group">
                <label for="shipCity">City</label>
                <input
                  type="text"
                  id="shipCity"
                  v-model="selectedOrder.buyersShippingAddress.city"
                  placeholder="City"
                />
              </div>
              <div class="form-group">
                <label for="shipState">State</label>
                <input
                  type="text"
                  id="shipState"
                  v-model="selectedOrder.buyersShippingAddress.state"
                  placeholder="State"
                />
              </div>
              <div class="form-group">
                <label for="shipZIP">ZIP Code</label>
                <input
                  type="text"
                  id="shipZIP"
                  v-model="selectedOrder.buyersShippingAddress.ZIPCode"
                  placeholder="ZIP Code"
                />
              </div>
              <div class="form-group">
                <label for="shipZIPPlus4">ZIP+4</label>
                <input
                  type="text"
                  id="shipZIPPlus4"
                  v-model="selectedOrder.buyersShippingAddress.ZIPPlus4"
                  placeholder="ZIP+4"
                />
              </div>
            </div>
          </div>

          <!-- Billing Address Tab -->
          <div v-if="activeTab === 'billing'" class="billing-info">
            <h2>Buyer's Billing Address</h2>
            <div class="grid">
              <div class="form-group">
                <label for="billFirstName">First Name</label>
                <input
                  type="text"
                  id="billFirstName"
                  v-model="selectedOrder.buyersBillingAddress.firstName"
                  placeholder="First Name"
                />
              </div>
              <div class="form-group">
                <label for="billLastName">Last Name</label>
                <input
                  type="text"
                  id="billLastName"
                  v-model="selectedOrder.buyersBillingAddress.lastName"
                  placeholder="Last Name"
                />
              </div>
              <div class="form-group">
                <label for="billStreet">Street Address</label>
                <input
                  type="text"
                  id="billStreet"
                  v-model="selectedOrder.buyersBillingAddress.streetAddress"
                  placeholder="Street Address"
                />
              </div>
              <div class="form-group">
                <label for="billSecondary">Secondary Address</label>
                <input
                  type="text"
                  id="billSecondary"
                  v-model="selectedOrder.buyersBillingAddress.secondaryAddress"
                  placeholder="Apt, Suite, etc."
                />
              </div>
              <div class="form-group">
                <label for="billCity">City</label>
                <input
                  type="text"
                  id="billCity"
                  v-model="selectedOrder.buyersBillingAddress.city"
                  placeholder="City"
                />
              </div>
              <div class="form-group">
                <label for="billState">State</label>
                <input
                  type="text"
                  id="billState"
                  v-model="selectedOrder.buyersBillingAddress.state"
                  placeholder="State"
                />
              </div>
              <div class="form-group">
                <label for="billZIP">ZIP Code</label>
                <input
                  type="text"
                  id="billZIP"
                  v-model="selectedOrder.buyersBillingAddress.ZIPCode"
                  placeholder="ZIP Code"
                />
              </div>
              <div class="form-group">
                <label for="billZIPPlus4">ZIP+4</label>
                <input
                  type="text"
                  id="billZIPPlus4"
                  v-model="selectedOrder.buyersBillingAddress.ZIPPlus4"
                  placeholder="ZIP+4"
                />
              </div>
            </div>
          </div>

          <!-- Itemized List Tab -->
          <div v-if="activeTab === 'items'" class="itemized-list">
            <h2>Itemized List</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Variant Details</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in selectedOrder.itemizedList"
                  :key="idx"
                >
                  <td>{{ item.name }}</td>
                  <td>
                    <div v-if="item.variantDetails">
                      <div v-if="item.variantDetails.color">
                        Color: {{ item.variantDetails.color.name }}
                      </div>
                      <div v-if="item.variantDetails.size">
                        Size: {{ item.variantDetails.size }}
                      </div>
                      <!-- Additional variant details as needed -->
                    </div>
                  </td>
                  <td>{{ item.price.toFixed(2) }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ (item.price * item.quantity).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Seller Info Tab -->
          <div v-if="activeTab === 'seller'" class="seller-info">
            <h2>Seller Business Information</h2>
            <div class="grid">
              <div class="form-group">
                <label for="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  v-model="
                    selectedOrder.sellersBusinessInformation.businessName
                  "
                  placeholder="Business Name"
                />
              </div>
              <div class="form-group">
                <label for="sellerTaxID">Tax ID Number</label>
                <input
                  type="text"
                  id="sellerTaxID"
                  v-model="selectedOrder.sellersBusinessInformation.taxIDNum"
                  placeholder="Tax ID"
                />
              </div>
              <div class="form-group">
                <label>Seller Address</label>
                <div class="grid seller-address">
                  <div class="form-group">
                    <label for="sellerStreet">Street Address</label>
                    <input
                      type="text"
                      id="sellerStreet"
                      v-model="
                        selectedOrder.sellersBusinessInformation.address
                          .streetAddress
                      "
                      placeholder="Street Address"
                    />
                  </div>
                  <div class="form-group">
                    <label for="sellerCity">City</label>
                    <input
                      type="text"
                      id="sellerCity"
                      v-model="
                        selectedOrder.sellersBusinessInformation.address.city
                      "
                      placeholder="City"
                    />
                  </div>
                  <div class="form-group">
                    <label for="sellerState">State</label>
                    <input
                      type="text"
                      id="sellerState"
                      v-model="
                        selectedOrder.sellersBusinessInformation.address.state
                      "
                      placeholder="State"
                    />
                  </div>
                  <div class="form-group">
                    <label for="sellerZIP">ZIP Code</label>
                    <input
                      type="text"
                      id="sellerZIP"
                      v-model="
                        selectedOrder.sellersBusinessInformation.address.ZIPCode
                      "
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
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
        {{ selectedOrder._id ? "Update" : "Add" }} Order
      </button>
      <button
        @click="deleteOrder"
        v-if="selectedOrder._id"
        :disabled="isDeleting"
      >
        <span v-if="isDeleting" class="spinner"></span>
        Delete Order
      </button>
      <div class="action-notification" v-if="actionNotification">
        {{ actionNotification }}
      </div>
    </div>

    <!-- Modal for New Order Creation -->
    <div class="modal-overlay" v-if="showNewOrderModal">
      <div class="modal">
        <h2>New Order</h2>
        <form @submit.prevent="submitNewOrderModal">
          <div class="modal-form-group">
            <label>Invoice Number</label>
            <input type="text" v-model="newOrderForm.invoiceNumber" required />
          </div>
          <div class="modal-form-group">
            <label>Associated Email</label>
            <input
              type="email"
              v-model="newOrderForm.associatedEmail"
              required
            />
          </div>
          <div class="modal-actions">
            <button
              type="submit"
              class="modal-submit-btn"
              :disabled="isModalLoading"
            >
              <span v-if="isModalLoading" class="spinner"></span>
              Create Order
            </button>
            <button
              type="button"
              class="modal-cancel-btn"
              @click="closeNewOrderModal"
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

const actionNotification = ref("");
const hasUnsavedChanges = ref(false);
const markDirty = () => {
  hasUnsavedChanges.value = true;
};
const showActionNotification = (msg) => {
  actionNotification.value = msg;
  setTimeout(() => {
    actionNotification.value = "";
  }, 3000);
};

const isSubmitting = ref(false);
const isDeleting = ref(false);
const isModalLoading = ref(false);
const searchTerm = ref("");
const orders = ref([]);

const filteredOrders = computed(() =>
  orders.value.filter((order) =>
    order.invoiceNumber.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

// The initial order model – values align with the Mongoose Order schema
const selectedOrder = reactive({
  _id: null,
  userId: null,
  invoiceNumber: "",
  orderDate: "",
  shippedDate: "",
  expectedDeliveryDate: "",
  deliveryDate: "",
  status: "Pending",
  totalCost: 0,
  itemizedList: [],
  salesTax: 0,
  salesTaxRate: 0,
  buyersBillingAddress: {
    streetAddress: "",
    secondaryAddress: "",
    city: "",
    state: "",
    ZIPCode: "",
    ZIPPlus4: "",
    urbanization: "",
    firstName: "",
    lastName: "",
    firm: "",
    phone: "",
    email: "",
    ignoreBadAddress: false,
  },
  buyersShippingAddress: {
    streetAddress: "",
    secondaryAddress: "",
    city: "",
    state: "",
    ZIPCode: "",
    ZIPPlus4: "",
    urbanization: "",
    firstName: "",
    lastName: "",
    firm: "",
    phone: "",
    email: "",
    ignoreBadAddress: false,
  },
  sellersBusinessInformation: {
    businessName: "",
    address: {
      streetAddress: "",
      secondaryAddress: "",
      city: "",
      state: "",
      ZIPCode: "",
      ZIPPlus4: "",
      urbanization: "",
      firstName: "",
      lastName: "",
      firm: "",
      phone: "",
      email: "",
      ignoreBadAddress: false,
    },
    taxIDNum: "",
  },
  paymentMethod: "",
  trackingNumber: "",
  associatedEmail: "",
});

const tabs = [
  { id: "general", title: "General Info" },
  { id: "shipping", title: "Shipping Address" },
  { id: "billing", title: "Billing Address" },
  { id: "items", title: "Itemized List" },
  { id: "seller", title: "Seller Info" },
];

const activeTab = ref("general");

const fetchOrders = async () => {
  try {
    const data = await $fetch("/api/orders");
    orders.value = Array.isArray(data) ? data : [];
  } catch (error) {
    showActionNotification("Error fetching orders: " + error.message);
  }
};

onMounted(fetchOrders);

const selectOrder = (order) => {
  Object.assign(selectedOrder, JSON.parse(JSON.stringify(order)));
  hasUnsavedChanges.value = false;
};

const clearSelectedOrder = () => {
  Object.assign(selectedOrder, {
    _id: null,
    userId: null,
    invoiceNumber: "",
    orderDate: "",
    shippedDate: "",
    expectedDeliveryDate: "",
    deliveryDate: "",
    status: "Pending",
    totalCost: 0,
    itemizedList: [],
    salesTax: 0,
    salesTaxRate: 0,
    buyersBillingAddress: {
      streetAddress: "",
      secondaryAddress: "",
      city: "",
      state: "",
      ZIPCode: "",
      ZIPPlus4: "",
      urbanization: "",
      firstName: "",
      lastName: "",
      firm: "",
      phone: "",
      email: "",
      ignoreBadAddress: false,
    },
    buyersShippingAddress: {
      streetAddress: "",
      secondaryAddress: "",
      city: "",
      state: "",
      ZIPCode: "",
      ZIPPlus4: "",
      urbanization: "",
      firstName: "",
      lastName: "",
      firm: "",
      phone: "",
      email: "",
      ignoreBadAddress: false,
    },
    sellersBusinessInformation: {
      businessName: "",
      address: {
        streetAddress: "",
        secondaryAddress: "",
        city: "",
        state: "",
        ZIPCode: "",
        ZIPPlus4: "",
        urbanization: "",
        firstName: "",
        lastName: "",
        firm: "",
        phone: "",
        email: "",
        ignoreBadAddress: false,
      },
      taxIDNum: "",
    },
    paymentMethod: "",
    trackingNumber: "",
    associatedEmail: "",
  });
  hasUnsavedChanges.value = false;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    selectedOrder._id ? await updateOrder() : await addOrder();
    hasUnsavedChanges.value = false;
  } catch (error) {
    showActionNotification("Error: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const addOrder = async () => {
  try {
    await $fetch("/api/orders", { method: "POST", body: selectedOrder });
    showActionNotification("Order added successfully");
    await fetchOrders();
    clearSelectedOrder();
  } catch (error) {
    showActionNotification("Error adding order: " + error.message);
  }
};

const updateOrder = async () => {
  try {
    await $fetch(`/api/orders/${selectedOrder._id}`, {
      method: "PUT",
      body: selectedOrder,
    });
    showActionNotification("Order updated successfully");
    await fetchOrders();
  } catch (error) {
    showActionNotification("Error updating order: " + error.message);
  }
};

const deleteOrder = async () => {
  if (!selectedOrder._id) {
    showActionNotification("No order selected to delete");
    return;
  }
  isDeleting.value = true;
  try {
    await $fetch(`/api/orders/${selectedOrder._id}`, { method: "DELETE" });
    showActionNotification("Order deleted successfully");
    await fetchOrders();
    clearSelectedOrder();
  } catch (error) {
    showActionNotification("Error deleting order: " + error.message);
  } finally {
    isDeleting.value = false;
  }
};

const showNewOrderModal = ref(false);
const openNewOrderModal = () => {
  clearSelectedOrder();
  newOrderForm.invoiceNumber = "";
  newOrderForm.associatedEmail = "";
  showNewOrderModal.value = true;
};

const closeNewOrderModal = () => {
  showNewOrderModal.value = false;
};

const submitNewOrderModal = async () => {
  isModalLoading.value = true;
  selectedOrder._id = null;
  selectedOrder.invoiceNumber = newOrderForm.invoiceNumber;
  selectedOrder.associatedEmail = newOrderForm.associatedEmail;
  showNewOrderModal.value = false;
  activeTab.value = "general";
  isModalLoading.value = false;
};

const newOrderForm = reactive({
  invoiceNumber: "",
  associatedEmail: "",
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
.search-filters input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.order-list {
  list-style: none;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 15px;
  padding: 0;
}
.order-list li {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background 0.2s ease;
}
.order-list li:hover,
.order-list li.active {
  background-color: #f0f0f0;
}
.new-order-btn {
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
.new-order-btn:hover {
  background: #1d4ed8;
}

/* Editor Styling */
.editor {
  flex: 1;
  background: #fff;
  padding: 20px;
  border: 1px solid #e5e7eb;
}
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
.tab-content {
}
.row {
  display: flex;
  gap: 20px;
}
.column {
  flex: 1;
}
.general-info .form-group {
  margin-bottom: 15px;
}
.general-info .form-group label {
  display: block;
  margin-bottom: 5px;
  color: #4b5563;
  font-weight: bold;
}
.general-info .form-group input,
.general-info .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Grid Layout for Addresses */
.grid {
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
.form-group {
  display: flex;
  flex-direction: column;
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

/* Table for Itemized List */
.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
.items-table th,
.items-table td {
  padding: 10px;
  border: 1px solid #e5e7eb;
  text-align: left;
}

/* Seller Address */
.seller-address {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
.fixed-actions .action-notification {
  background: #2563eb;
  color: #fff;
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 4px;
}
.fixed-actions .unsaved {
  background: #fbbf24;
  color: #1f2937;
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

/* Responsive Design */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  .sidebar,
  .editor {
    width: 100%;
  }
  .row {
    flex-direction: column;
  }
}
</style>
