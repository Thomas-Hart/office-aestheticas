<template>
  <div class="wrapper">
    <section class="order point-bot">
      <div class="order-confirmation">
        <h1>Thank You for Your Order!</h1>
        <p>
          Your order has been placed successfully. These are your order details:
        </p>
        <div class="order-details">
          <div class="order-summary">
            <div class="order-info">
              <h2>Order ID: {{ order.id }}</h2>
              <p><strong>Name:</strong> {{ order.customerName }}</p>
              <p><strong>Email:</strong> {{ order.customerEmail }}</p>
              <p><strong>Address:</strong> {{ order.customerAddress }}</p>
            </div>
            <div class="order-total">
              <p><strong>Total:</strong> ${{ order.total.toFixed(2) }}</p>
            </div>
          </div>
          <div class="order-items">
            <h3>Items</h3>
            <ul>
              <li v-for="item in order.items" :key="item._id">
                <img
                  :src="item.image"
                  alt="Item Thumbnail"
                  class="item-thumbnail"
                />
                <div class="item-details">
                  <span class="item-quantity">{{ item.quantity }} x</span>
                  <span class="item-name">{{ item.name }}</span>
                </div>
                <span class="item-price">${{ item.price.toFixed(2) }}</span>
              </li>
            </ul>
          </div>
        </div>
        <router-link to="/">Return to Homepage</router-link>
      </div>
    </section>
    <section class="FAQ">
      <WebSectionsFAQ />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useItemStore } from "~/stores/itemStore";

const itemStore = useItemStore();
const router = useRouter();

const order = ref({
  id: "",
  customerName: "",
  customerEmail: "",
  customerAddress: "",
  items: [],
  total: 0,
});

onMounted(() => {
  if (itemStore.orderDetails) {
    order.value = itemStore.orderDetails;

    // Clear the cart after displaying the order details
    itemStore.cart = [];
    // Clear the order details from the store if needed
    itemStore.setOrderDetails(null);
  } else {
    // If order details are missing, redirect to the homepage
    router.push("/");
  }
});

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>


<style scoped>
.wrapper {
  margin: 0 auto;
  padding: 0rem 0;
}

.order {
  /* min-height: 65rem; */
}

.order-confirmation {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0rem;
  padding: 6rem 3rem;
  color: white;
  background: url("/ProductsBG.webp") no-repeat;
  background-size: cover;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(255, 255, 255, 1);
  text-align: center;
  min-height: 50rem;
}

.order-details {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  margin-top: 2rem;
}

.order-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-info {
  flex: 2;
  text-align: left;
}

h2 {
  margin-bottom: 2rem;
}

.order-total {
  flex: 1;
  text-align: right;
  font-size: 1.5rem;
  color: #cc8400;
}

.order-items {
  margin-top: 2rem;
}

.order-items h3 {
  margin-bottom: 1rem;
  font-family: "Poppins", sans-serif;
  color: #cc8400;
}

.order-items ul {
  list-style: none;
  padding: 0;
}

.order-items li {
  display: flex;
  align-items: center;
  background: rgba(58, 58, 59, 0.9);
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
  color: white;
}

.item-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.item-quantity {
  font-weight: bold;
}

.item-name {
  margin-left: 10px;
}

.item-price {
  text-align: right;
}

.router-link,
a {
  display: inline-block;
  margin-top: 40px;
  text-decoration: none;
  color: #f7c781;
  font-weight: bold;
  transition: color 0.15s linear;
  font-size: 1.5rem;
}

.router-link:hover,
a:hover {
  color: white;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .wrapper {
    padding: 0;
  }

  .order-confirmation {
    padding: 5rem 1rem;
    min-height: 65rem;
  }

  .order-details {
    padding: 1rem;
  }

  .order-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-total {
    text-align: left;
    margin-top: 1rem;
  }

  .order-items li {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-thumbnail {
    margin-bottom: 10px;
  }
}
</style>
