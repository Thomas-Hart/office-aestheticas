<template>
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
</template>
  
  <script setup>
const props = defineProps({
  affiliates: Array,
});

const emit = defineEmits(["affiliateSelected"]);

const selectedAffiliateId = ref("");

const sortedAffiliates = computed(() => {
  return [...props.affiliates].sort((a, b) => a.name.localeCompare(b.name));
});

function onAffiliateSelected() {
  emit("affiliateSelected", selectedAffiliateId.value);
}
</script>
  
  <style scoped>
h2 {
  margin-bottom: 1rem;
}

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
</style>
  