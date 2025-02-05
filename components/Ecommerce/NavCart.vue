<template>
  <div v-if="activeCart.length > 0" class="overlay">
    <!-- Checkout panel (absolutely positioned inside the overlay, behind the cart) -->
    <div class="checkout-panel" :class="{ visible: showCheckout }">
      <div class="checkout-header">
        <h2>Checkout</h2>
        <button class="close-checkout" @click="closeCheckout">&times;</button>
      </div>
      <!-- Render the checkout panel that shows all payment methods -->
      <EcommerceCheckoutPanel
        :totalAmount="totalPrice"
        @orderCompleted="handleOrderCompleted"
        @close="closeCheckout"
      />
    </div>

    <!-- Original Cart (unchanged styling) -->
    <div class="cart-wrapper">
      <div class="cart-header">
        <div class="cart-count">
          <h1>Cart</h1>
          <div class="num-circle">{{ totalItemCount }}</div>
        </div>
        <button class="close-button" @click="$emit('close-cart')">
          &times;
        </button>
      </div>

      <!-- Scrollable cart items -->
      <div class="cart-items">
        <div
          v-for="(item, index) in activeCart"
          :key="item._id + (item.variantId || '')"
          class="cart-item"
        >
          <NuxtImg
            :src="resolvedItemImg(item.image)"
            alt="item image"
            class="item-image"
          />
          <div class="item-details">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-price">
              <span v-if="item.originalPrice" class="original-price">
                ${{ item.originalPrice.toFixed(2) }}
              </span>
              <span class="current-price"> ${{ item.price.toFixed(2) }} </span>
            </p>
            <p class="item-color">{{ item.color }}</p>
          </div>
          <div class="item-actions">
            <input
              class="item-quantity-input"
              type="number"
              min="1"
              :value="item.quantity"
              @change="(e) => updateItemQuantity(item, e.target.value)"
            />
            <button
              class="remove-button"
              @click="removeCartItem(item._id, item.variantId)"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Cart total and actions -->
      <div class="cart-bottom">
        <div class="cart-total">
          <div class="total-text">
            <p>Total</p>
            <span class="total-price">
              Taxes and shipping calculated at checkout
            </span>
          </div>
          <p>${{ totalPrice.toFixed(2) }}</p>
        </div>

        <div class="cart-actions">
          <button class="view-cart" @click="setTab('Featured')">
            Keep Shopping
          </button>
          <button class="checkout" @click="openCheckout">
            <img src="/Graphics/CartCheckout/security.svg" alt="" />Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore();
const itemStore = useItemStore();
const router = useRouter();
const route = useRoute();

const emit = defineEmits(["close-cart"]);
const isLoggedIn = computed(() => !!userStore.user);

// Use the user cart if logged in, otherwise use the local store cart
const activeCart = computed(() => {
  return isLoggedIn.value ? userStore.user.cart : itemStore.cart;
});

const totalItemCount = computed(() => {
  return activeCart.value.reduce((total, item) => total + item.quantity, 0);
});

// This reactive variable will hold the total amount from the API call.
const totalPrice = ref(0);

// Fetch the total price from the API based on whether the user is logged in
async function fetchCartTotal() {
  try {
    let total;
    if (isLoggedIn.value) {
      total = await $fetch("/api/cart/total", {
        method: "POST",
        body: { cartItems: userStore.user.cart },
      });
    } else {
      total = await $fetch("/api/cart/total", {
        method: "POST",
        body: { cartItems: itemStore.cart },
      });
    }
    totalPrice.value = parseFloat(total);
  } catch (error) {
    console.error("Error fetching cart total:", error);
  }
}

// Call the API on mount and also whenever the activeCart changes
onMounted(fetchCartTotal);
watch(activeCart, fetchCartTotal, { deep: true });

// Utility function to resolve image path for an item
const resolvedItemImg = (img) => `/ItemPics/${img}`;

// Remove an item from the cart
const removeCartItem = (itemId, variantId) => {
  if (isLoggedIn.value) {
    userStore.removeFromCart(itemId, variantId);
  } else {
    itemStore.removeFromCart(itemId, variantId);
  }
};

// Update the total price API call when item quantity changes
function updateItemQuantity(item, newValue) {
  const newQuantity = parseInt(newValue, 10);
  if (isNaN(newQuantity) || newQuantity < 1) {
    removeCartItem(item._id, item.variantId);
    return;
  }
  if (isLoggedIn.value) {
    userStore.updateQuantity({
      itemId: item._id,
      variantId: item.variantId || null,
      quantity: newQuantity,
    });
  } else {
    itemStore.updateQuantity({
      itemId: item._id,
      variantId: item.variantId || null,
      quantity: newQuantity,
    });
  }
  // Re-fetch total after updating quantity
  fetchCartTotal();
}

// Controls the checkout panel visibility
const showCheckout = ref(false);
function openCheckout() {
  showCheckout.value = true;
}
function closeCheckout() {
  showCheckout.value = false;
}

function setTab(tab) {
  emit("close-cart");
  router.push({ query: { ...route.query, tab } });
}

// Handle order completion coming from the payment components
async function handleOrderCompleted(orderData) {
  console.log("Order Completed:", JSON.stringify(orderData));
  try {
    // Call the backend order service (e.g., /api/tax) to process and save the order.
    // This endpoint should enrich and record the order (calculating taxes, assigning an invoice number, etc.).
    const savedOrder = await $fetch("/api/tax", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: orderData,
    });

    console.log("Order saved:", savedOrder);

    // Clear the cart depending on the login status.
    if (isLoggedIn.value) {
      userStore.clearCart();
    } else {
      itemStore.clearCart();
    }

    // Send a confirmation email using the saved order details.
    await sendConfirmationEmail(savedOrder);

    // Navigate to the order confirmation page.
    router.push({ path: `/order/${savedOrder._id}` });
  } catch (error) {
    console.error("Error finalizing order:", error);
    // Fallback: Create an incomplete order record.
    const partialOrder = {
      orderId: orderData.orderId,
      paymentMethod: orderData.paymentMethod,
      orderDate: new Date().toISOString(),
      totalCost: orderData.totalCost,
      buyersShippingAddress: orderData.buyersShippingAddress,
      associatedEmail: orderData.associatedEmail,
      rawOrder: orderData.rawOrder,
      orderStatus: "incomplete",
      // Optionally, include a failure reason or error message.
      errorMessage: error.message || "Unknown error during order finalization.",
    };
    // Save this partial order via a dedicated API endpoint, e.g., /api/orders/fallback.
    const fallbackOrder = await $fetch("/api/orders/fallback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: partialOrder,
    });
    console.log("Fallback order created:", fallbackOrder);
    // Optionally, notify admin/support for manual intervention.
  } finally {
    closeCheckout();
  }
}

async function sendConfirmationEmail(order) {
  try {
    const response = await fetch(
      "https://jf32m0961a.execute-api.us-east-2.amazonaws.com/first/send-custom-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: order.associatedEmail,
          orderId: order._id, // Order ID or any unique identifier.
          invoiceNumber: order.invoiceNumber, // Useful for the customer.
          from: "support@aestheticas.com",
          message: "Thank you for choosing Office Aestheticas.",
          company: "Office Aestheticas",
        }),
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.log("Error in sendFailureEmail()");
  }
}

async function sendFailureEmail(order) {
  try {
    const response = await fetch(
      "https://jf32m0961a.execute-api.us-east-2.amazonaws.com/first/send-custom-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userEmail.value,
          from: "support@aestheticas.com",
          message:
            "There was a problem processing your order. Please try again. If this continues, please contact us through the contact page on our website.",
          company: "Office Aestheticas",
        }),
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.log("Error in sendFailureEmail()");
  }
}
</script>

<style scoped>
/* ---------- Overlay ---------- */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  padding: 1rem; /* ensures space between the content and the edge */
}

/* ---------- Original Cart Styles (unchanged) ---------- */
.cart-wrapper {
  width: 40%;
  max-width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 2rem;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "Montserrat", sans-serif;
  line-height: 1.4;
  position: relative;
  z-index: 2; /* higher than checkout-panel */
}

.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #bbb transparent;
  padding-right: 0.5rem;
}

.cart-items::-webkit-scrollbar {
  width: 8px;
}
.cart-items::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 4px;
}
.cart-items::-webkit-scrollbar-thumb:hover {
  background-color: #999;
}
.cart-items::-webkit-scrollbar-track {
  background-color: transparent;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.cart-header h1 {
  font-size: 1.3rem;
  margin: 0;
  font-weight: bold;
}
.cart-count {
  display: flex;
  align-items: center;
  font-weight: bold;
}
.num-circle {
  margin-left: 0.5rem;
  width: 1.5em;
  height: 1.5rem;
  background: black;
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cart-header .close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.cart-item {
  width: 100%;
  padding-bottom: 1rem;
  display: flex;
  margin-bottom: 1rem;
}
.item-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-right: 1rem;
}
.item-details {
  width: 60%;
}
.item-name {
  font-size: 1.1rem;
  font-weight: bold;
}
.item-price {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}
.item-price .original-price {
  text-decoration: line-through;
  color: #888;
  margin-right: 0.5rem;
  font-size: 1.1rem;
}
.item-price .current-price {
  color: #3f654c;
  font-weight: light;
  font-family: "Lora";
}
.item-color {
  font-size: 0.9rem;
  color: #555;
}
.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}
.item-quantity-input {
  width: 60px;
  padding: 0.3rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 0.5rem;
}
.remove-button {
  font-size: 0.9rem;
  color: #636363;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

.cart-bottom {
  border-top: 1px solid black;
  padding-top: 1rem;
}
.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.total-text span {
  color: #636363;
  font-weight: lighter;
  font-size: 0.9rem;
}
.cart-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.view-cart {
  background: #3f654c;
  color: #fff;
  border: none;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.2s ease-in-out;
  width: 48%;
}
.view-cart:hover {
  background: #2e5e2f;
}
.checkout {
  background: #000;
  color: #fff;
  border: none;
  padding: 1rem 1.5rem;
  width: 48%;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
.checkout:hover {
  background: #333;
}
.checkout img {
  width: 1.5rem;
  height: 1.5rem;
}

/* ---------- Checkout Panel Styles ---------- */
.checkout-panel {
  position: absolute;
  top: 1rem;
  right: 1rem;
  bottom: 1rem;
  width: 30%;
  background-color: #fff;
  padding: 2rem;
  border-right: 1px solid #ddd;
  z-index: 1;
  transform: translateX(0);
  transition: transform 0.3s ease;
}
.checkout-panel.visible {
  transform: translateX(-133%);
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 0rem;
}
.close-checkout {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}
</style>
