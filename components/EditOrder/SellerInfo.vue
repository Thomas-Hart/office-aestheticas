<template>
  <div class="section">
    <div class="section-header" @click="toggleCollapse" @mousedown.prevent>
      <h2>Seller Information</h2>
      <span :class="['collapse-icon', isCollapsed ? 'collapsed' : 'expanded']">
        ▼
      </span>
    </div>

    <div
      ref="content"
      :style="{ maxHeight: isCollapsed ? '0px' : contentHeight }"
      class="content"
    >
      <div class="input-grid">
        <!-- Business Name -->
        <div class="input-group">
          <label>Business Name</label>
          <input
            type="text"
            v-model="sellerInfo.businessName"
            @input="onSellerInfoChange('businessName', $event.target.value)"
            placeholder="Business Name"
          />
        </div>

        <!-- Tax ID Number -->
        <div class="input-group">
          <label>Tax ID Number</label>
          <input
            type="text"
            v-model="sellerInfo.taxIDNum"
            @input="onSellerInfoChange('taxIDNum', $event.target.value)"
            placeholder="Tax ID Number"
          />
        </div>
      </div>

      <!-- Seller Address -->
      <EditOrderEditAddress
        :address="sellerInfo.address"
        @updateAddress="onSellerAddressChange"
      />
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

// Initialize seller information
const sellerInfo = ref({
  businessName:
    props.selectedOrder.sellersBusinessInformation?.businessName || "",
  taxIDNum: props.selectedOrder.sellersBusinessInformation?.taxIDNum || "",
  address: props.selectedOrder.sellersBusinessInformation?.address || {
    streetAddress: "",
    city: "",
    state: "",
    ZIPCode: "",
    country: "",
  },
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

// Update seller information
function onSellerInfoChange(field, value) {
  sellerInfo.value[field] = value;
  emitUpdatedSellerInfo();
}

// Update seller address
function onSellerAddressChange(updatedAddress) {
  sellerInfo.value.address = updatedAddress;
  emitUpdatedSellerInfo();
}

// Emit updated seller information to the parent
function emitUpdatedSellerInfo() {
  const updatedOrder = {
    ...props.selectedOrder,
    sellersBusinessInformation: sellerInfo.value,
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
  