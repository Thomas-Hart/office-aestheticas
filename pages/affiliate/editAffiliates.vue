<template>
  <div class="wrapper">
    <h1>Edit Affiliate</h1>

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
      <!-- Select Affiliate Section -->
      <div class="section">
        <h2>Select Affiliate</h2>
        <select
          v-model="selectedAffiliateId"
          @change="onAffiliateSelected"
          class="dropdown-button"
        >
          <option disabled value="">Please select one</option>
          <option
            v-for="affiliate in sortedAffiliates"
            :key="affiliate._id"
            :value="affiliate._id"
          >
            {{ affiliate.name }}
          </option>
        </select>
      </div>

      <!-- General Information Section -->
      <div class="section">
        <h2>General Information</h2>
        <div class="input-wrapper">
          <input
            type="text"
            :value="selectedAffiliate.name"
            @input="onGeneralInputChange('name', $event.target.value)"
            placeholder=" "
            required
          />
          <label>Name</label>
        </div>
        <div class="input-wrapper">
          <input
            type="email"
            :value="selectedAffiliate.email"
            @input="onGeneralInputChange('email', $event.target.value)"
            placeholder=" "
            required
          />
          <label>Email</label>
        </div>
        <div class="input-wrapper">
          <input
            type="text"
            :value="selectedAffiliate.phone"
            @input="onGeneralInputChange('phone', $event.target.value)"
            placeholder=" "
          />
          <label>Phone</label>
        </div>
        <div class="input-wrapper">
          <input
            type="text"
            :value="selectedAffiliate.website"
            @input="onGeneralInputChange('website', $event.target.value)"
            placeholder=" "
          />
          <label>Website</label>
        </div>
        <div class="input-wrapper">
          <input
            type="number"
            :value="selectedAffiliate.commissionPercentage"
            @input="
              onGeneralInputChange('commissionPercentage', $event.target.value)
            "
            placeholder=" "
            min="0"
            max="100"
            required
          />
          <label>Commission Percentage (%)</label>
        </div>
        <div class="input-wrapper">
          <input
            type="text"
            :value="selectedAffiliate.uniqueCode"
            @input="onGeneralInputChange('uniqueCode', $event.target.value)"
            placeholder=" "
          />
          <label>Tracking Code</label>
        </div>
      </div>

      <!-- Address Information Section -->
      <div class="section">
        <h2>Address Information</h2>
        <div class="input-wrapper">
          <input
            type="text"
            :value="localAddress.street"
            @input="onAddressInputChange('street', $event.target.value)"
            placeholder=" "
          />
          <label>Street Address</label>
        </div>
        <div class="input-wrapper">
          <input
            type="text"
            :value="localAddress.city"
            @input="onAddressInputChange('city', $event.target.value)"
            placeholder=" "
          />
          <label>City</label>
        </div>
        <div class="input-wrapper">
          <input
            type="text"
            :value="localAddress.state"
            @input="onAddressInputChange('state', $event.target.value)"
            placeholder=" "
          />
          <label>State</label>
        </div>
        <div class="input-wrapper">
          <input
            type="text"
            :value="localAddress.postalCode"
            @input="onAddressInputChange('postalCode', $event.target.value)"
            placeholder=" "
          />
          <label>Postal Code</label>
        </div>
        <div class="input-wrapper">
          <input
            type="text"
            :value="localAddress.country"
            @input="onAddressInputChange('country', $event.target.value)"
            placeholder=" "
          />
          <label>Country</label>
        </div>
      </div>

      <!-- Orders Section (matches Mongoose model: orderId, amount, date) -->
      <div class="section">
        <h2>Orders</h2>
        <div v-if="localOrders.length > 0">
          <div
            v-for="(order, index) in localOrders"
            :key="index"
            class="order-wrapper"
          >
            <h3>Order {{ index + 1 }}</h3>
            <div class="input-wrapper">
              <input
                type="text"
                :value="order.orderId"
                @input="onOrderChange(index, 'orderId', $event.target.value)"
                placeholder=" "
              />
              <label>Order ID</label>
            </div>
            <div class="input-wrapper">
              <input
                type="number"
                :value="order.amount"
                @input="onOrderChange(index, 'amount', $event.target.value)"
                placeholder=" "
              />
              <label>Amount</label>
            </div>
            <div class="input-wrapper">
              <input
                type="date"
                :value="order.date"
                @input="onOrderChange(index, 'date', $event.target.value)"
                placeholder=" "
              />
              <label>Date</label>
            </div>
            <button @click="removeOrder(index)" class="remove-button">
              Remove Order
            </button>
          </div>
        </div>
        <button @click="addOrder" class="action-button">Add Order</button>
      </div>

      <!-- Action Buttons Section -->
      <div class="section action-buttons">
        <h2>Available Actions</h2>
        <button @click="addAffiliate" class="action-button">
          Add Affiliate
        </button>
        <button @click="updateAffiliate" class="action-button">
          Update Affiliate
        </button>
        <button @click="deleteAffiliate" class="action-button">
          Delete Affiliate
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

// Parent state and default affiliate structure
const affiliates = ref([]);
const selectedAffiliate = ref({
  name: "",
  email: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  website: "",
  commissionPercentage: 0,
  totalEarnings: 0,
  affiliateSince: "",
  uniqueCode: "",
  orders: [],
  customMetadata: {},
});

const notificationMessage = ref("");
const notificationType = ref("info");

// ----- Notification Controls -----
function showNotification(message, type = "error") {
  notificationMessage.value = message;
  notificationType.value = type;
}

function closeNotification() {
  notificationMessage.value = "";
}

// ----- Select Affiliate Logic -----
const selectedAffiliateId = ref("");
const sortedAffiliates = computed(() => {
  return [...affiliates.value].sort((a, b) => a.name.localeCompare(b.name));
});

function onAffiliateSelected() {
  const affiliateId = selectedAffiliateId.value;
  const foundAffiliate = affiliates.value.find(
    (aff) => aff._id === affiliateId
  );
  if (foundAffiliate) {
    selectedAffiliate.value = { ...foundAffiliate };
    // Sync address and orders for the inline sections:
    localAddress.value = { ...foundAffiliate.address };
    localOrders.value = [...foundAffiliate.orders];
  } else {
    resetForm();
  }
}

function resetForm() {
  selectedAffiliate.value = {
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    website: "",
    commissionPercentage: 0,
    totalEarnings: 0,
    affiliateSince: "",
    uniqueCode: "",
    orders: [],
    customMetadata: {},
  };
  localAddress.value = { ...selectedAffiliate.value.address };
  localOrders.value = [...selectedAffiliate.value.orders];
}

// ----- Fetch Affiliates & Lifecycle -----
async function getAffiliates() {
  try {
    const response = await fetch("/api/affiliates");
    if (response.ok) {
      affiliates.value = await response.json();
    } else {
      showNotification("Error fetching affiliates");
    }
  } catch (error) {
    showNotification("Error fetching affiliates: " + error.message);
  }
}

onMounted(async () => {
  await getAffiliates();
});

// ----- General Information Logic -----
function onGeneralInputChange(field, value) {
  if (field === "commissionPercentage") {
    value = validatePercentage(value);
  }
  selectedAffiliate.value = { ...selectedAffiliate.value, [field]: value };
}

function validatePercentage(value) {
  let percentage = parseFloat(value);
  if (isNaN(percentage) || percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;
  return percentage;
}

// ----- Address Information Logic -----
const localAddress = ref({ ...selectedAffiliate.value.address });

function onAddressInputChange(field, value) {
  localAddress.value[field] = value;
  selectedAffiliate.value.address = { ...localAddress.value };
}

// ----- Orders Logic (updated to match model) -----
const localOrders = ref([...selectedAffiliate.value.orders]);

watch(
  () => selectedAffiliate.value.orders,
  (newVal) => {
    localOrders.value = [...newVal];
  }
);

function addOrder() {
  localOrders.value.push({
    orderId: "",
    amount: 0,
    date: "",
  });
  selectedAffiliate.value.orders = [...localOrders.value];
}

function removeOrder(index) {
  localOrders.value.splice(index, 1);
  selectedAffiliate.value.orders = [...localOrders.value];
}

function onOrderChange(index, field, value) {
  localOrders.value[index][field] = value;
  selectedAffiliate.value.orders = [...localOrders.value];
}

// ----- Client-Side Validation -----
function validateAffiliate() {
  if (!selectedAffiliate.value.name) return "Name is required";
  if (!selectedAffiliate.value.email) return "Email is required";
  const cp = selectedAffiliate.value.commissionPercentage;
  if (cp === "" || cp === null || isNaN(cp) || cp < 0 || cp > 100)
    return "Commission Percentage must be between 0 and 100";
  return "";
}

// ----- Action Buttons Logic -----
async function addAffiliate() {
  const errorMsg = validateAffiliate();
  if (errorMsg) {
    showNotification(errorMsg);
    return;
  }
  try {
    const response = await fetch("/api/affiliates", {
      method: "POST",
      body: JSON.stringify(selectedAffiliate.value),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      showNotification("Affiliate added successfully", "success");
      await getAffiliates();
    } else {
      const data = await response.json();
      showNotification(
        "Error adding affiliate: " + (data.message || "Unknown error")
      );
    }
  } catch (error) {
    showNotification("Error adding affiliate: " + error.message);
  }
}

async function updateAffiliate() {
  const errorMsg = validateAffiliate();
  if (errorMsg) {
    showNotification(errorMsg);
    return;
  }
  try {
    const response = await fetch(
      `/api/affiliates/${selectedAffiliate.value._id}`,
      {
        method: "PUT",
        body: JSON.stringify(selectedAffiliate.value),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      showNotification("Affiliate updated successfully", "success");
      await getAffiliates();
    } else {
      const data = await response.json();
      showNotification(
        "Error updating affiliate: " + (data.message || "Unknown error")
      );
    }
  } catch (error) {
    showNotification("Error updating affiliate: " + error.message);
  }
}

async function deleteAffiliate() {
  try {
    const response = await fetch(
      `/api/affiliates/${selectedAffiliate.value._id}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      showNotification("Affiliate deleted successfully", "success");
      await getAffiliates();
    } else {
      const data = await response.json();
      showNotification(
        "Error deleting affiliate: " + (data.message || "Unknown error")
      );
    }
  } catch (error) {
    showNotification("Error deleting affiliate: " + error.message);
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

/* Notification Popup Styling */
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

/* Section Styling (used throughout) */
.section {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
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
.input-wrapper input[type="email"],
.input-wrapper input[type="date"],
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

/* Orders Section Styling */
.order-wrapper {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
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

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
