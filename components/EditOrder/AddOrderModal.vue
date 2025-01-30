<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>Add New Order</h3>

      <!-- User ID -->
      <label for="userId">User ID</label>
      <input
        v-model="newOrder.userId"
        id="userId"
        type="text"
        placeholder="User ID"
      />

      <!-- Invoice Number -->
      <label for="invoiceNumber">Invoice Number</label>
      <input
        v-model="newOrder.invoiceNumber"
        id="invoiceNumber"
        type="text"
        placeholder="Invoice Number"
      />

      <!-- Order Date -->
      <label for="orderDate">Order Date</label>
      <input
        v-model="newOrder.orderDate"
        id="orderDate"
        type="date"
        placeholder="Order Date"
      />

      <!-- Status -->
      <label for="status">Status</label>
      <select v-model="newOrder.status" id="status">
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <!-- Total Cost -->
      <label for="totalCost">Total Cost</label>
      <input
        v-model.number="newOrder.totalCost"
        id="totalCost"
        type="number"
        placeholder="Total Cost"
        min="0"
        step="0.01"
      />

      <div class="modal-buttons">
        <button class="modal-cancel-button" @click="closeModal">Cancel</button>
        <button class="modal-add-button" @click="confirmAddOrder">
          Add Order
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(["close", "add-order"]);

const newOrder = ref({
  userId: "",
  invoiceNumber: "",
  orderDate: "",
  status: "Pending",
  totalCost: 0,
});

// Close the modal
function closeModal() {
  emit("close");
  resetNewOrderFields();
}

// Reset new order fields
function resetNewOrderFields() {
  newOrder.value = {
    userId: "",
    invoiceNumber: "",
    orderDate: "",
    status: "Pending",
    totalCost: 0,
  };
}

// Confirm and add the new order
function confirmAddOrder() {
  if (!newOrder.value.userId || !newOrder.value.invoiceNumber) {
    alert("User ID and Invoice Number are required.");
    return;
  }

  emit("add-order", { ...newOrder.value });
  closeModal();
}
</script>
  
  <style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 0 1rem;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: #333;
}

.modal-content label {
  display: block;
  font-weight: bold;
  margin: 1rem 0 0.5rem;
  text-align: left;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.modal-add-button {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-cancel-button {
  background-color: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-add-button:hover {
  background-color: #0056b3;
}

.modal-cancel-button:hover {
  background-color: #5a6268;
}
</style>
  