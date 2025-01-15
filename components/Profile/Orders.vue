<template>
  <div class="recent-orders">
    <h2>Recent Orders</h2>
    <p class="displaying">Displaying {{ orders?.length }} order(s)</p>

    <div
      v-for="(order, index) in orders"
      :key="order.invoiceNumber"
      class="order"
    >
      <p class="order-status-text">Order Status:</p>
      <p class="order-status">
        <strong>{{ order.status }}</strong>
      </p>
      <p class="order-dates">
        {{ formatOrderDates(order) }}
      </p>

      <div class="order-items">
        <!-- Render visible items minus one for the "more-items" indicator -->
        <div
          v-for="(item, itemIndex) in order.itemizedList.slice(
            0,
            maxVisibleCounts[index] - 1
          )"
          :key="itemIndex"
          class="item"
        >
          <img
            :src="`/ItemPics/${item.image}`"
            :alt="`Item ${itemIndex + 1}`"
          />
        </div>

        <!-- Add the "more-items" as an inline placeholder -->
        <div
          v-if="order.itemizedList.length > maxVisibleCounts[index] - 1"
          class="item more-items"
        >
          <img src="/BlogPics/BlogPic1.webp" alt="More items" />
          <span class="more-count">
            +{{ order.itemizedList.length - (maxVisibleCounts[index] - 1) }}
          </span>
        </div>
      </div>

      <div class="order-info">
        <p><strong>Order #:</strong> {{ order.invoiceNumber }}</p>
        <p><strong>Total Cost:</strong> ${{ order.totalCost.toFixed(2) }}</p>
      </div>

      <div class="order-actions">
        <button class="track-parcel">Track Parcel</button>
        <NuxtLink :to="`/order/${order._id}`" class="view-order"
          >View Order</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

// Props
const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
});

const containerWidths = ref([]);
const maxVisibleCounts = ref([]);

// Adjust maxVisibleCounts based on container width
const updateMaxVisibleCounts = () => {
  containerWidths.value.forEach((width, index) => {
    const itemWidth = 130;
    maxVisibleCounts.value[index] = Math.max(
      Math.floor(width / itemWidth),
      2 // Ensure at least 1 image + "more-items"
    );
  });
};

// Format the order date details based on status
const formatOrderDates = (order) => {
  if (order.status === "Delivered") {
    return `Delivered on ${new Date(order.deliveryDate).toLocaleDateString()}`;
  } else if (order.status === "Shipped") {
    return `Shipped on ${new Date(
      order.shippedDate
    ).toLocaleDateString()}, expected delivery: ${new Date(
      order.expectedDeliveryDate
    ).toLocaleDateString()}`;
  } else if (order.status === "Pending") {
    return `Order placed on ${new Date(order.orderDate).toLocaleDateString()}`;
  } else if (order.status === "Cancelled") {
    return `Order was cancelled`;
  }
};

onMounted(() => {
  containerWidths.value = Array(props.orders?.length).fill(0);
  maxVisibleCounts.value = Array(props.orders?.length).fill(3);

  const resizeListener = () => {
    const containers = document.querySelectorAll(".order-items");
    containerWidths.value = Array.from(containers).map(
      (container) => container.offsetWidth
    );
    updateMaxVisibleCounts();
  };

  window.addEventListener("resize", resizeListener);
  resizeListener();

  watch(containerWidths, updateMaxVisibleCounts);
  updateMaxVisibleCounts();
});
</script>

<style scoped>
.recent-orders {
  font-family: Arial, sans-serif;
  padding: 2rem 2rem;
  width: 100%;
  height: 100%;
}

h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
}

p.displaying {
  color: white;
}

p {
  color: black;
  font-weight: lighter;
}

.order-status-text {
  color: #737373;
  font-weight: bold;
}

.order {
  background: #fff;
  padding: 2rem 3rem;
  margin: 20px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.order-status {
  font-size: 1.2rem;
}

.order-dates {
  color: #28a745;
  font-size: 0.9rem;
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
  border-bottom: 0.25rem solid #d9d9d9;
}

.order-items {
  display: flex;
  gap: 10px;
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
  border-bottom: 0.25rem solid #d9d9d9;
  overflow: hidden;
}

.item {
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 1;
}

.item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.more-items {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #f9f9f9;
}

.more-items img {
  filter: brightness(0.8);
  opacity: 0.8;
}

.more-count {
  position: absolute;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  font-size: 0.8rem;
  padding: 4px 6px;
  border-radius: 50%;
}

.order-actions {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}

.track-parcel,
.view-order {
  background: #fff;
  border: 2px solid #ffa500;
  color: #000;
  padding: 10px 15px;
  /* border-radius: 4px; */
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: lighter;
}

.track-parcel:hover,
.view-order:hover {
  background: #ffa500;
  color: #fff;
}

@media (max-width: 768px) {
  .order {
    padding: 1.5rem;
  }

  .item {
    height: 100px;
    width: 100px;
  }

  .signup-heading {
    font-size: 1.5rem; /* Reduce font size */
    line-height: 1.3; /* Slightly increase line spacing */
  }

  .recent-orders {
    padding: 4rem 1rem;
  }

  .track-parcel,
  .view-order {
    background: #fff;
    border: 2px solid #ffa500;
    color: #000;
    padding: 10px 5px;
    cursor: pointer;
    font-size: 0.9rem;
  }
}
</style>
