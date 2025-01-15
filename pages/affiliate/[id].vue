<template>
  <div class="wrapper">
    <h1>Affiliate Details</h1>

    <div class="content" v-if="affiliate">
      <!-- Affiliate Information -->
      <div class="affiliate-info">
        <h2>{{ affiliate.name }}</h2>
        <p><strong>Email:</strong> {{ affiliate.email }}</p>
        <p>
          <strong>Website:</strong>
          <a :href="affiliate.website">{{ affiliate.website }}</a>
        </p>
        <p>
          <strong>Commission Percentage:</strong>
          {{ affiliate.commissionPercentage }}%
        </p>
        <p><strong>Status:</strong> {{ affiliate.status }}</p>
        <p>
          <strong>Date Joined:</strong>
          {{ new Date(affiliate.dateJoined).toLocaleDateString() }}
        </p>
        <p>
          <strong>Sales Generated:</strong> ${{
            affiliate.salesGenerated.toFixed(2)
          }}
        </p>
        <p>
          <strong>Payout Balance:</strong> ${{
            affiliate.payoutBalance.toFixed(2)
          }}
        </p>
        <p><strong>Notes:</strong></p>
        <p class="notes">{{ affiliate.notes }}</p>
      </div>
    </div>

    <div v-else>
      <p>Loading affiliate details...</p>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const affiliate = ref(null);

onMounted(async () => {
  const route = useRoute();
  await fetchAffiliateDetails(route.params.id);
});

async function fetchAffiliateDetails(id) {
  try {
    const response = await fetch(`/api/affiliates/${id}`);
    if (response.ok) {
      affiliate.value = await response.json();
    } else {
      console.error("Failed to fetch affiliate details");
    }
  } catch (error) {
    console.error("Error fetching affiliate details:", error);
  }
}
</script>
  
  <style scoped>
.wrapper {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.affiliate-info {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.affiliate-info h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.affiliate-info p {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.affiliate-info a {
  color: #007bff;
  text-decoration: none;
}

.affiliate-info a:hover {
  text-decoration: underline;
}

.notes {
  white-space: pre-line;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}
</style>
  