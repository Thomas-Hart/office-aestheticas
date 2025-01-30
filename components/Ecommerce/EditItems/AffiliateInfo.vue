<template>
  <div class="section">
    <h2>Affiliate Info</h2>
    <div
      v-for="(affiliateInfo, index) in localSelectedItem.affiliateInfo"
      :key="index"
      class="input-group"
    >
      <div class="input-wrapper">
        <select
          v-model="affiliateInfo.affiliateId"
          @change="emitUpdate"
          class="dropdown-button"
        >
          <option disabled value="">Select Affiliate</option>
          <option
            v-for="affiliate in availableAffiliates(index)"
            :key="affiliate._id"
            :value="affiliate._id"
          >
            {{ affiliate.name }}
          </option>
        </select>
        <label>Affiliate</label>
      </div>
      <div class="input-wrapper">
        <input
          type="number"
          v-model="affiliateInfo.commissionPercentage"
          placeholder=" "
          @input="emitUpdate"
        />
        <label>Commission Percentage (%)</label>
      </div>
      <button @click="removeAffiliate(index)" class="remove-button">
        Remove Affiliate
      </button>
    </div>
    <button @click="addAffiliate" class="action-button">Add Affiliate</button>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

const localSelectedItem = ref({ ...props.selectedItem });
const affiliates = ref([]); // State for storing affiliates

function fetchAffiliates() {
  fetch("/api/affiliates")
    .then((response) => response.json())
    .then((data) => {
      affiliates.value = data;
    })
    .catch((error) => {
      console.error("Error fetching affiliates:", error);
    });
}

// Filter affiliates to only show those not already selected
function availableAffiliates(currentIndex) {
  const selectedIds = localSelectedItem.value.affiliateInfo
    .map((info, index) => (index !== currentIndex ? info.affiliateId : null))
    .filter((id) => id !== null);

  return affiliates.value.filter(
    (affiliate) => !selectedIds.includes(affiliate._id)
  );
}

function emitUpdate() {
  emit("updateItem", { ...localSelectedItem.value });
}

function addAffiliate() {
  localSelectedItem.value.affiliateInfo.push({
    affiliateId: "",
    commissionPercentage: 0,
  });
  emitUpdate();
}

function removeAffiliate(index) {
  localSelectedItem.value.affiliateInfo.splice(index, 1);
  emitUpdate();
}

watch(
  () => props.selectedItem,
  (newVal) => {
    localSelectedItem.value = { ...newVal };
  },
  { deep: true }
);

onMounted(() => {
  fetchAffiliates(); // Fetch affiliates when the component is mounted
});
</script>

<style scoped>
.section {
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
}

.input-group {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.input-wrapper {
  position: relative;
  flex-grow: 1;
  margin-right: 10px;
}

.dropdown-button {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 0.5rem;
}

.dropdown-button:focus {
  border-color: #4caf50;
  outline: none;
}

.input-wrapper input[type="number"] {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-wrapper input[type="number"]:focus {
  border-color: #4caf50;
  outline: none;
}

.input-wrapper label {
  position: absolute;
  top: -10px;
  left: 10px;
  background: #fff;
  padding: 0 5px;
  color: #999;
  pointer-events: none;
  font-size: 0.85rem;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  border: none;
}

.remove-button:hover {
  background-color: #c0392b;
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
  background-color: #4caf50;
  color: white;
}
</style>
