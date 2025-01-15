<template>
  <div class="sidebar">
    <h2>Select Order</h2>
    <div class="input-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by invoice number or user ID"
        class="search-bar"
      />
    </div>
    <ul class="order-list">
      <li
        v-for="order in filteredOrders"
        :key="order._id"
        :class="{ active: order._id === selectedOrderId }"
        @click="selectOrder(order._id)"
      >
        <div v-html="highlightMatch(order.invoiceNumber)"></div>
        <div class="order-user-id" v-html="highlightMatch(order.userId)"></div>
      </li>
    </ul>
  </div>
</template>
  
  <script setup>
import { ref, computed } from "vue";

const props = defineProps({ orders: Array });
const emit = defineEmits(["orderSelected"]);
const selectedOrderId = ref("");
const searchQuery = ref("");

// Sort and filter orders based on the search query
const filteredOrders = computed(() => {
  return [...props.orders]
    .filter((order) => {
      const searchLower = searchQuery.value.toLowerCase();
      return (
        order.invoiceNumber.toLowerCase().includes(searchLower) ||
        (order.userId && order.userId.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber));
});

// Highlight matching text in the invoice number or user ID
function highlightMatch(text) {
  if (!searchQuery.value) return text;
  const regex = new RegExp(`(${searchQuery.value})`, "gi");
  return text.replace(regex, "<span class='highlight'>$1</span>");
}

function selectOrder(orderId) {
  selectedOrderId.value = orderId;
  emit("orderSelected", orderId);
}
</script>
  
  <style scoped>
.sidebar {
  width: 300px;
  background: #f4f5f7;
  border-right: 1px solid #ddd;
}

h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 1rem 0 1rem 18px;
}

.input-wrapper {
  padding: 0 10px;
}

.search-bar {
  width: 100%;
  padding: 8px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.order-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(173, 216, 230, 0.15); /* Light transparent blue */
}

.order-list li {
  padding: 10px 18px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #ddd;
}

.order-list li:hover,
.order-list li.active {
  background: rgba(74, 144, 226, 0.3); /* Active blue */
}

.order-user-id {
  color: #444;
  font-weight: lighter;
}

.highlight {
  background-color: yellow;
  font-weight: bold;
}

@media (max-width: 1160px) {
  .sidebar {
    width: 100%;
    border-right: none;
  }
}
</style>
  