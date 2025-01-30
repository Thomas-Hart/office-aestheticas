<template>
  <div class="section">
    <div class="section-header" @click="toggleCollapse" @mousedown.prevent>
      <h2>Orders</h2>
      <span :class="['collapse-icon', isCollapsed ? 'collapsed' : 'expanded']">
        ▼
      </span>
    </div>

    <div
      ref="content"
      :style="{ maxHeight: isCollapsed ? '0px' : contentHeight }"
      class="content"
    >
      <!-- Existing Orders -->
      <div v-if="orders.length > 0" class="order-items">
        <div
          v-for="(order, orderIndex) in orders"
          :key="orderIndex"
          class="order-item"
        >
          <!-- Order Info -->
          <div class="order-info">
            <span
              ><strong>Invoice Number:</strong> {{ order.invoiceNumber }}</span
            >
          </div>

          <!-- Order Details -->
          <div class="order-details">
            <p>
              <strong>Order Date:</strong> {{ formatDate(order.orderDate) }}
            </p>
            <p><strong>Status:</strong> {{ order.status }}</p>
            <p>
              <strong>Total Cost:</strong> ${{ order.totalCost.toFixed(2) }}
            </p>
            <p>
              <strong>Shipped Date:</strong>
              {{ formatDate(order.shippedDate) || "N/A" }}
            </p>
            <p>
              <strong>Expected Delivery Date:</strong>
              {{ formatDate(order.expectedDeliveryDate) || "N/A" }}
            </p>
            <p>
              <strong>Delivery Date:</strong>
              {{ formatDate(order.deliveryDate) || "N/A" }}
            </p>
            <p>
              <strong>Tracking Number:</strong>
              {{ order.trackingNumber || "N/A" }}
            </p>
          </div>

          <!-- Order Items -->
          <div class="order-items-list">
            <h3>Order Items</h3>
            <div
              v-for="(item, itemIndex) in order.itemizedList"
              :key="itemIndex"
              class="order-item-row"
            >
              <span><strong>Item:</strong> {{ getItemName(item.itemId) }}</span>
              <span
                ><strong>Variant Details:</strong>
                {{ formatVariantDetails(item.variantDetails) || "N/A" }}</span
              >
              <span><strong>Quantity:</strong> {{ item.quantity }}</span>
              <span><strong>Price:</strong> ${{ item.price.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Orders -->
      <p v-else>No orders available for this user.</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: Array, // List of all items to get item names
});

const isCollapsed = ref(true);
const contentHeight = ref("0px");
const content = ref(null);
const orders = ref([]);

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

onMounted(() => {
  adjustContentHeight();
});

// Utility methods
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString();
}

function getItemName(itemId) {
  const item = props.items.find((item) => item._id === itemId);
  return item ? item.name : "Unknown Item";
}

function formatVariantDetails(variantDetails) {
  if (!variantDetails) return null;

  let details = [];

  if (variantDetails.color && variantDetails.color.name) {
    details.push(`Color: ${variantDetails.color.name}`);
  }
  if (variantDetails.size) {
    details.push(`Size: ${variantDetails.size}`);
  }
  if (variantDetails.material) {
    details.push(`Material: ${variantDetails.material}`);
  }
  if (variantDetails.style) {
    details.push(`Style: ${variantDetails.style}`);
  }
  if (variantDetails.capacity) {
    details.push(`Capacity: ${variantDetails.capacity}`);
  }
  if (variantDetails.flavor) {
    details.push(`Flavor: ${variantDetails.flavor}`);
  }
  if (variantDetails.scent) {
    details.push(`Scent: ${variantDetails.scent}`);
  }
  if (variantDetails.power) {
    details.push(`Power: ${variantDetails.power}`);
  }
  if (variantDetails.length) {
    details.push(`Length: ${variantDetails.length}`);
  }
  if (variantDetails.region) {
    details.push(`Region: ${variantDetails.region}`);
  }
  // Add other variant details as needed

  return details.join(", ");
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

h2 {
  font-size: 1.4rem;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.content {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s ease;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.order-item {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  padding: 0.8rem;
  background: rgba(173, 216, 230, 0.1); /* Light blue background */
  border: 1px solid #ddd;
  border-radius: 6px;
  align-items: center;
}

.order-info {
  font-size: 1rem;
  font-weight: bold;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.order-details p {
  margin: 0.5rem 0;
}

.order-items-list {
  margin-top: 1rem;
}

.order-item-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.5rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.order-item-row span {
  font-size: 0.9rem;
}

p {
  margin-left: 1rem;
  margin-bottom: 1rem;
}

/* Responsive adjustments for screens 830px or smaller */
@media (max-width: 830px) {
  .section-header h2 {
    font-size: 1.2rem;
  }

  .order-item {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .order-info,
  .order-details {
    font-size: 0.9rem;
  }

  .order-details p {
    margin: 0.3rem 0;
  }
}
</style>
