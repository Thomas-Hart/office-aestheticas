<template>
  <div class="section">
    <div class="section-header" @click="toggleCollapse" @mousedown.prevent>
      <h2>General Information</h2>
      <span :class="['collapse-icon', isCollapsed ? 'collapsed' : 'expanded']">
        ▼
      </span>
    </div>

    <div
      ref="content"
      :style="{ maxHeight: isCollapsed ? '0px' : contentHeight }"
      class="content"
      v-if="selectedOrder"
    >
      <div class="input-grid">
        <!-- Invoice Number -->
        <div class="input-group">
          <label>Invoice Number</label>
          <input
            type="text"
            :value="selectedOrder.invoiceNumber"
            @input="onInputChange('invoiceNumber', $event.target.value)"
            placeholder="Invoice Number"
          />
        </div>

        <!-- Order Date -->
        <div class="input-group">
          <label>Order Date</label>
          <input
            type="date"
            :value="formatDate(selectedOrder.orderDate)"
            @input="onInputChange('orderDate', $event.target.value)"
            placeholder="Order Date"
          />
        </div>

        <!-- Shipped Date -->
        <div class="input-group">
          <label>Shipped Date</label>
          <input
            type="date"
            :value="formatDate(selectedOrder.shippedDate)"
            @input="onInputChange('shippedDate', $event.target.value)"
            placeholder="Shipped Date"
          />
        </div>

        <!-- Expected Delivery Date -->
        <div class="input-group">
          <label>Expected Delivery Date</label>
          <input
            type="date"
            :value="formatDate(selectedOrder.expectedDeliveryDate)"
            @input="onInputChange('expectedDeliveryDate', $event.target.value)"
            placeholder="Expected Delivery Date"
          />
        </div>

        <!-- Delivery Date -->
        <div class="input-group">
          <label>Delivery Date</label>
          <input
            type="date"
            :value="formatDate(selectedOrder.deliveryDate)"
            @input="onInputChange('deliveryDate', $event.target.value)"
            placeholder="Delivery Date"
          />
        </div>

        <!-- Status -->
        <div class="input-group">
          <label>Status</label>
          <select
            :value="selectedOrder.status"
            @change="onInputChange('status', $event.target.value)"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Total Cost -->
        <div class="input-group">
          <label>Total Cost</label>
          <input
            type="number"
            step="0.01"
            min="0"
            :value="selectedOrder.totalCost"
            @input="onInputChange('totalCost', $event.target.value)"
            placeholder="Total Cost"
          />
        </div>

        <!-- Payment Method -->
        <div class="input-group">
          <label>Payment Method</label>
          <input
            type="text"
            :value="selectedOrder.paymentMethod"
            @input="onInputChange('paymentMethod', $event.target.value)"
            placeholder="Payment Method"
          />
        </div>

        <!-- Tracking Number -->
        <div class="input-group">
          <label>Tracking Number</label>
          <input
            type="text"
            :value="selectedOrder.trackingNumber"
            @input="onInputChange('trackingNumber', $event.target.value)"
            placeholder="Tracking Number"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

const props = defineProps({
  selectedOrder: Object,
});

const emit = defineEmits(["updateOrder"]);

const isCollapsed = ref(true);
const contentHeight = ref("0px");
const content = ref(null);

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  adjustContentHeight();
}

function adjustContentHeight() {
  nextTick(() => {
    contentHeight.value = isCollapsed.value
      ? "0px"
      : `${content.value.scrollHeight}px`;
  });
}

function onInputChange(field, value) {
  const updatedOrder = { ...props.selectedOrder, [field]: value };
  emit("updateOrder", updatedOrder);
}

function formatDate(date) {
  return date ? new Date(date).toISOString().substring(0, 10) : "";
}
</script>

<style scoped>
.section {
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  user-select: none;
  outline: none;
}

.section-header h2,
.section-header .collapse-icon {
  user-select: none;
  outline: none;
}

.collapse-icon {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.collapsed {
  transform: rotate(-90deg);
}

.content {
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-group label {
  font-size: 0.8rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.input-group input[type="text"],
.input-group input[type="number"],
.input-group input[type="date"],
.input-group select {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  transition: all 0.3s ease;
  width: 100%;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
}

@media (max-width: 830px) {
  .section-header h2 {
    font-size: 1.2rem;
  }

  .input-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
