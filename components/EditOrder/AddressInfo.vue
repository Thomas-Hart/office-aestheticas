<template>
  <div class="section">
    <div class="section-header" @click="toggleCollapse" @mousedown.prevent>
      <h2>Address Information</h2>
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
      <!-- Billing Address -->
      <div class="address-section">
        <h3>Billing Address</h3>
        <div class="input-grid">
          <div
            class="input-group"
            v-for="(value, field) in billingAddressFields"
            :key="field"
          >
            <label>{{ field }}</label>
            <input
              type="text"
              :value="selectedOrder.buyersBillingAddress[field]"
              @input="
                onAddressChange(
                  'buyersBillingAddress',
                  field,
                  $event.target.value
                )
              "
              :placeholder="field"
            />
          </div>
        </div>
      </div>

      <!-- Shipping Address -->
      <div class="address-section">
        <h3>Shipping Address</h3>
        <div class="input-grid">
          <div
            class="input-group"
            v-for="(value, field) in shippingAddressFields"
            :key="field"
          >
            <label>{{ field }}</label>
            <input
              type="text"
              :value="selectedOrder.buyersShippingAddress[field]"
              @input="
                onAddressChange(
                  'buyersShippingAddress',
                  field,
                  $event.target.value
                )
              "
              :placeholder="field"
            />
          </div>
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

const billingAddressFields = [
  "streetAddress",
  "secondaryAddress",
  "city",
  "state",
  "ZIPCode",
  "ZIPPlus4",
  "urbanization",
  "firstName",
  "lastName",
  "firm",
  "phone",
  "email",
];

const shippingAddressFields = [...billingAddressFields];

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

function onAddressChange(addressType, field, value) {
  const updatedAddress = {
    ...props.selectedOrder[addressType],
    [field]: value,
  };
  const updatedOrder = {
    ...props.selectedOrder,
    [addressType]: updatedAddress,
  };
  emit("updateOrder", updatedOrder);
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

.address-section {
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.2rem;
  color: #4a90e2;
  margin: 1rem 0;
}

.input-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
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

.input-group input {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  bselectedorder: 1px solid #ccc;
  transition: all 0.3s ease;
  width: 100%;
}

.input-group input:focus {
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
  