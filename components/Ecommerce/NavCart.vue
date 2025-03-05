<template>
  <div v-if="activeCart.length > 0" class="overlay">
    <!-- Checkout panel (desktop: right‑side; mobile: bottom drawer) -->
    <div class="checkout-panel" :class="{ visible: showCheckout }">
      <div class="checkout-header">
        <h2>Checkout</h2>
        <button class="close-checkout" @click="closeCheckout">&times;</button>
      </div>
      <!-- Payment methods component -->
      <EcommerceCheckoutPanel
        :totalAmount="totalPrice"
        @orderCompleted="handleOrderCompleted"
        @close="closeCheckout"
      />
    </div>

    <!-- Original Cart (desktop: right side; mobile: top panel) -->
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
              <span class="current-price">${{ item.price.toFixed(2) }}</span>
            </p>
            <!-- Variant details if available -->
            <div v-if="item.variantId" class="variant-details">
              <p v-if="item.color">Color: {{ item.color }}</p>
              <p v-if="item.size">Size: {{ item.size }}</p>
              <!-- <p v-if="item.material">Material: {{ item.material }}</p>
              <p v-if="item.style">Style: {{ item.style }}</p>
              <p v-if="item.capacity">Capacity: {{ item.capacity }}</p>
              <p v-if="item.flavor">Flavor: {{ item.flavor }}</p>
              <p v-if="item.scent">Scent: {{ item.scent }}</p>
              <p v-if="item.power">Power: {{ item.power }}</p>
              <p v-if="item.length">Length: {{ item.length }}</p>
              <p v-if="item.region">Region: {{ item.region }}</p> -->
            </div>
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

// Use the user cart if logged in; otherwise use the local store cart.
const activeCart = computed(() => {
  return isLoggedIn.value ? userStore.user.cart : itemStore.cart;
});

const totalItemCount = computed(() => {
  return activeCart.value.reduce((total, item) => total + item.quantity, 0);
});

// This reactive variable holds the total amount from the API.
const totalPrice = ref(0);

// Fetch the total price from the API.
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

onMounted(fetchCartTotal);
watch(activeCart, fetchCartTotal, { deep: true });

const resolvedItemImg = (img) => `/ItemPics/${img}`;

const removeCartItem = (itemId, variantId) => {
  if (isLoggedIn.value) {
    userStore.removeFromCart(itemId, variantId);
  } else {
    itemStore.removeFromCart(itemId, variantId);
  }
};

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
  fetchCartTotal();
}

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

async function handleOrderCompleted(orderData) {
  console.log("Order Completed:", JSON.stringify(orderData));
  try {
    const savedOrder = await $fetch("/api/tax", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: orderData,
    });
    console.log("Order saved:", savedOrder);
    if (isLoggedIn.value) {
      userStore.clearCart();
    } else {
      itemStore.clearCart();
    }
    await sendConfirmationEmail(savedOrder);
    router.push({ path: `/order/${savedOrder._id}` });
  } catch (error) {
    console.error("Error finalizing order:", error);
    const partialOrder = {
      orderId: orderData.orderId,
      paymentMethod: orderData.paymentMethod,
      orderDate: new Date().toISOString(),
      totalCost: orderData.totalCost,
      buyersShippingAddress: orderData.buyersShippingAddress,
      associatedEmail: orderData.associatedEmail,
      rawOrder: orderData.rawOrder,
      orderStatus: "incomplete",
      errorMessage: error.message || "Unknown error during order finalization.",
    };
    const fallbackOrder = await $fetch("/api/orders/fallback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: partialOrder,
    });
    console.log("Fallback order created:", fallbackOrder);
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
          orderId: order._id,
          invoiceNumber: order.invoiceNumber,
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
/* ---------- Desktop Styles ---------- */
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
  padding: 1rem;
}

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
  z-index: 2;
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

/* ---------- Responsive Mobile Styles ---------- */
@media (max-width: 768px) {
  .overlay {
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
    padding: 0;
  }
  .checkout-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 40%;
    padding: 1rem;
    border: none;
    border-top: 1px solid #ddd;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 1100;
  }
  .checkout-panel.visible {
    transform: translateY(0);
  }
  .cart-wrapper {
    width: 100%;
    height: 60%;
    padding: 1rem;
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
    border-top: 1px solid #ddd;
  }
  .cart-header h1 {
    font-size: 1.5rem;
  }
  .cart-count .num-circle {
    width: 1.2em;
    height: 1.2em;
    font-size: 0.8rem;
  }
  .cart-items {
    overflow-y: auto;
  }
  .cart-actions button,
  .fixed-actions button {
    font-size: 1.2rem;
    padding: 1rem;
  }
  .item-image {
    width: 100px;
    height: 100px;
    margin-right: 0.5rem;
  }
}
</style>
