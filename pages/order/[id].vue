<template>
  <div class="order-page-wrapper">
    <div class="content">
      <!-- Thank You Message -->
      <div class="thank-you-message">
        <h1>Thank You for Ordering with National Auto Hub!</h1>
        <p>We appreciate your business and are thrilled to serve you.</p>
      </div>

      <div class="heading">
        <h1 class="order-title">Order Details</h1>
        <p v-if="!order">Loading...</p>
      </div>

      <div v-if="order" class="order-details">
        <!-- Order Summary -->
        <div class="order-summary">
          <h2 class="bot-margin" :style="{ textDecoration: `underline` }">
            Summary
          </h2>
          <p><strong>Invoice Number:</strong> {{ order.invoiceNumber }}</p>
          <p><strong>Status:</strong> {{ order.status }}</p>
          <p>
            <strong>Order Date:</strong> {{ formattedDate(order.orderDate) }}
          </p>
          <p v-if="order.shippedDate">
            <strong>Shipped Date:</strong>
            {{ formattedDate(order.shippedDate) }}
          </p>
          <p v-if="order.expectedDeliveryDate">
            <strong>Expected Delivery Date:</strong>
            {{ formattedDate(order.expectedDeliveryDate) }}
          </p>
          <p v-if="order.deliveryDate">
            <strong>Delivery Date:</strong>
            {{ formattedDate(order.deliveryDate) }}
          </p>
          <p class="bot-margin">
            <strong>Total Cost:</strong> ${{ order.totalCost.toFixed(2) }}
          </p>
        </div>

        <!-- Itemized List -->
        <div class="order-items">
          <h2 class="bot-margin">Items Ordered</h2>
          <ul>
            <li v-for="(item, index) in order.itemizedList" :key="index">
              <img :src="`/ItemPics/${item.image}`" alt="Item Image" />
              <div>
                <p><strong>Name:</strong> {{ item.name }}</p>
                <p><strong>Quantity:</strong> {{ item.quantity }}</p>
                <p><strong>Price:</strong> ${{ item.price.toFixed(2) }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Address Information -->
        <div class="address-info">
          <h2>Shipping Address</h2>
          <p>{{ formatAddress(order.buyersShippingAddress) }}</p>
        </div>

        <!-- Tracking Information -->
        <div v-if="order.trackingNumber" class="tracking-info">
          <h2>Tracking Information</h2>
          <p><strong>Tracking Number:</strong> {{ order.trackingNumber }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

// Fetch the order details
const { data: order } = await useFetch(`/api/orders?_id=${route.params.id}`);

// Format date to a readable format
const formattedDate = (date) => new Date(date).toLocaleDateString();

// Format address into a readable string
const formatAddress = (address) => {
  const { streetAddress, city, state, ZIPCode, firstName, lastName } = address;
  return `${firstName} ${lastName}, ${streetAddress}, ${city}, ${state} ${ZIPCode}`;
};

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
/* Main Order Page Wrapper */
.order-page-wrapper {
  padding: 2rem 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Thank You Message */
.thank-you-message {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #e8f5e9;
  border: 1px solid #a5d6a7;
}

.thank-you-message h1 {
  font-size: 2rem;
  color: #388e3c;
  font-weight: bold;
}

.thank-you-message p {
  font-size: 1rem;
  color: #2e7d32;
}

/* Order Details */
.heading {
  margin-bottom: 2rem;
}

.order-title {
  font-size: 2.5rem;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.order-details {
  /* border: 1px solid #ddd; */
  padding: 1rem;
}

h2 {
  font-size: 1.5rem;
  color: #555;
  /* margin-bottom: 1rem; */
}

p {
  margin: 0;
}

.bot-margin {
  margin-bottom: 0.75rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  padding: 0.5rem;
}

li img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

li div {
  display: flex;
  flex-direction: column;
}

.address-info,
.tracking-info {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
}

strong {
  font-weight: bold;
}
</style>
