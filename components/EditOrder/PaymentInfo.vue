<template>
  <div class="section">
    <div class="section-header" @click="toggleCollapse" @mousedown.prevent>
      <h2>Payment Information</h2>
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
        <!-- Payment Method -->
        <div class="input-group">
          <label>Payment Method</label>
          <select v-model="paymentMethod" @change="onPaymentChange">
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <!-- Card Type -->
        <div class="input-group" v-if="paymentMethod === 'Credit Card'">
          <label>Card Type</label>
          <input
            type="text"
            v-model="paymentDetails.cardType"
            @input="updatePaymentDetails('cardType', $event.target.value)"
            placeholder="Card Type"
          />
        </div>

        <!-- Last 4 Digits -->
        <div class="input-group" v-if="paymentMethod === 'Credit Card'">
          <label>Last 4 Digits</label>
          <input
            type="text"
            v-model="paymentDetails.last4Digits"
            @input="updatePaymentDetails('last4Digits', $event.target.value)"
            placeholder="Last 4 Digits"
          />
        </div>

        <!-- Expiration Date -->
        <div class="input-group" v-if="paymentMethod === 'Credit Card'">
          <label>Expiration Date</label>
          <input
            type="month"
            v-model="paymentDetails.expirationDate"
            @input="updatePaymentDetails('expirationDate', $event.target.value)"
          />
        </div>

        <!-- Cardholder Name -->
        <div class="input-group" v-if="paymentMethod === 'Credit Card'">
          <label>Cardholder Name</label>
          <input
            type="text"
            v-model="paymentDetails.cardholderName"
            @input="updatePaymentDetails('cardholderName', $event.target.value)"
            placeholder="Cardholder Name"
          />
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  selectedOrder: Object,
});

const emit = defineEmits(["updateOrder"]);

const isCollapsed = ref(false);
const contentHeight = ref("0px");
const content = ref(null);

// Payment method state
const paymentMethod = ref(props.selectedOrder.paymentMethod || "Credit Card");
const paymentDetails = ref({
  cardType: props.selectedOrder.paymentDetails?.cardType || "",
  last4Digits: props.selectedOrder.paymentDetails?.last4Digits || "",
  expirationDate: props.selectedOrder.paymentDetails?.expirationDate || "",
  cardholderName: props.selectedOrder.paymentDetails?.cardholderName || "",
});

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

function onPaymentChange() {
  const updatedOrder = {
    ...props.selectedOrder,
    paymentMethod: paymentMethod.value,
    paymentDetails:
      paymentMethod.value === "Credit Card" ? paymentDetails.value : {},
  };
  emit("updateOrder", updatedOrder);
}

function updatePaymentDetails(field, value) {
  paymentDetails.value[field] = value;
  onPaymentChange(); // Automatically update the selectedOrder whenever payment details change
}
</script>
  
  <style scoped>
.section {
  background: white;
  bselectedorder-radius: 8px;
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

.input-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: calc(50% - 1rem);
}

.input-group label {
  font-size: 0.8rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.input-group input,
.input-group select {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  bselectedorder: 1px solid #ccc;
  transition: all 0.3s ease;
  width: 100%;
}

.input-group input:focus,
.input-group select:focus {
  bselectedorder-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
}

/* Responsive adjustments for smaller screens */
@media (max-width: 830px) {
  .input-group {
    width: 100%;
  }
}
</style>
  