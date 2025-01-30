<template>
  <div class="wrapper">
    <h1>Edit Affiliate</h1>

    <div class="content">
      <!-- Select Affiliate -->
      <EcommerceEditAffiliatesSelectAffiliate
        :affiliates="affiliates"
        @affiliateSelected="selectAffiliate"
      />

      <!-- General Information -->
      <EcommerceEditAffiliatesGeneralInfo
        :selectedAffiliate="selectedAffiliate"
        @updateAffiliate="updateSelectedAffiliate($event)"
      />

      <!-- Address Information -->
      <EcommerceEditAffiliatesAddressInfo
        :selectedAffiliate="selectedAffiliate"
        @updateAffiliate="updateSelectedAffiliate($event)"
      />

      <!-- Orders -->
      <EcommerceEditAffiliatesOrders
        :selectedAffiliate="selectedAffiliate"
        @updateAffiliate="updateSelectedAffiliate($event)"
      />

      <!-- Action Buttons -->
      <EcommerceEditAffiliatesActionButtons
        :affiliate="selectedAffiliate"
        @add-affiliate="addAffiliate"
        @update-affiliate="updateAffiliate"
        @delete-affiliate="deleteAffiliate"
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
});

const notificationMessage = ref("");
const notificationType = ref("info");

onMounted(async () => {
  await getAffiliates();
});

async function getAffiliates() {
  try {
    const response = await fetch("/api/affiliates");
    if (response.ok) {
      affiliates.value = await response.json();
    } else {
      showNotification("Error fetching affiliates", "error");
    }
  } catch (error) {
    showNotification("Error fetching affiliates: " + error.message, "error");
  }
}

function selectAffiliate(affiliateId) {
  const foundAffiliate = affiliates.value.find(
    (aff) => aff._id === affiliateId
  );
  if (foundAffiliate) {
    selectedAffiliate.value = { ...foundAffiliate };
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
  };
}

async function addAffiliate() {
  try {
    await fetch("/api/affiliates", {
      method: "POST",
      body: JSON.stringify(selectedAffiliate.value),
      headers: { "Content-Type": "application/json" },
    });
    showNotification("Affiliate added successfully", "success");
    getAffiliates();
  } catch (error) {
    showNotification("Error adding affiliate: " + error.message, "error");
  }
}

async function updateAffiliate() {
  try {
    await fetch(`/api/affiliates/${selectedAffiliate.value._id}`, {
      method: "PUT",
      body: JSON.stringify(selectedAffiliate.value),
      headers: { "Content-Type": "application/json" },
    });
    showNotification("Affiliate updated successfully", "success");
    getAffiliates();
  } catch (error) {
    showNotification("Error updating affiliate: " + error.message, "error");
  }
}

async function deleteAffiliate() {
  try {
    await fetch(`/api/affiliates/${selectedAffiliate.value._id}`, {
      method: "DELETE",
    });
    showNotification("Affiliate deleted successfully", "success");
    getAffiliates();
  } catch (error) {
    showNotification("Error deleting affiliate: " + error.message, "error");
  }
}

function showNotification(message, type = "info") {
  notificationMessage.value = message;
  notificationType.value = type;
}

function updateSelectedAffiliate(updatedAffiliate) {
  selectedAffiliate.value = updatedAffiliate;
}
</script>

<style scoped>
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

.section {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
}

.action-buttons {
  text-align: center;
}
</style>
