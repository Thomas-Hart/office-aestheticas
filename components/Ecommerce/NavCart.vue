<template>
  <transition name="collapse-right">
    <div class="overlay" v-if="activeCart.length > 0">
      <!-- Nav Cart View -->
      <template v-if="!showCheckout">
        <div class="cart-wrapper">
          <div class="cart-header">
            <div class="cart-count">
              <h2>Cart</h2>
              <div class="num-circle">{{ totalItemCount }}</div>
            </div>
            <button class="close-button" @click="$emit('close-cart')">
              &times;
            </button>
          </div>

          <!-- Scrollable Cart Items -->
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
                  <span class="current-price">
                    ${{ item.price.toFixed(2) }}
                  </span>
                </p>
                <!-- Variant details if available -->
                <div v-if="item.variantId" class="variant-details">
                  <p v-if="item.color">Color: {{ item.color }}</p>
                  <p v-if="item.size">Size: {{ item.size }}</p>
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

          <!-- Cart Total and Actions -->
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
                <NuxtImg
                  src="/Graphics/CartCheckout/security.svg"
                  alt=""
                />Checkout
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Checkout Panel View -->
      <template v-else>
        <div class="checkout-panel-full">
          <div class="checkout-logo">
            <img src="/Logos/OAName.svg" alt="Office Aestheticas Logo" />
          </div>
          <div class="checkout-container">
            <!-- Left: Express Checkout Section with Logo -->
            <div class="checkout-left">
              <div class="left-wrapper">
                <h3 class="express-label">Express Checkout</h3>
                <div class="express-checkout-wrapper">
                  <div class="express-buttons-container">
                    <div class="express-button paypal">
                      <EcommerceExpressCheckoutPaypalCheckout
                        :totalAmount="totalPrice"
                        @orderCompleted="handleOrderCompleted"
                      />
                    </div>
                    <div class="express-button">
                      <EcommerceExpressCheckoutAmazonPay
                        :totalAmount="totalPrice"
                        @orderCompleted="handleOrderCompleted"
                      />
                    </div>
                    <div class="payment-divider">
                      <span>Or Pay With</span>
                    </div>
                    <h3 class="express-label">Manual Checkout</h3>

                    <EcommerceCheckoutFormCheckout />
                    <!-- Add additional payment method components as needed -->
                  </div>
                </div>
              </div>
            </div>

            <!-- Divider between checkout left and checkout right -->
            <div class="checkout-divider"></div>

            <!-- Right: Order Summary (identical styling to the cart) -->
            <div class="checkout-right">
              <div class="right-wrapper">
                <div class="order-summary">
                  <div class="summary-items">
                    <div
                      v-for="(item, index) in activeCart"
                      :key="item._id + (item.variantId || '')"
                      class="order-summary-item"
                    >
                      <div class="summary-item-count">
                        <NuxtImg
                          :src="resolvedItemImg(item.image)"
                          alt="item image"
                          class="item-image"
                        />
                        <div class="floating-num-circle">
                          {{ item.quantity }}
                        </div>
                      </div>

                      <div class="item-details">
                        <p class="item-name">{{ item.name }}</p>
                        <p class="item-price">
                          <span
                            v-if="item.originalPrice"
                            class="original-price"
                          >
                            ${{ item.originalPrice.toFixed(2) }}
                          </span>
                          <span class="subtotal-text">
                            ${{ item.price.toFixed(2) }}
                          </span>
                        </p>
                        <div v-if="item.variantId" class="variant-details">
                          <p v-if="item.color">Color: {{ item.color }}</p>
                          <p v-if="item.size">Size: {{ item.size }}</p>
                        </div>
                      </div>
                      <div class="order-summary-item-total">
                        <p class="subtotal-text">
                          ${{ item.price * item.quantity }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr class="summary-divider" />
                  <div class="summary-totals">
                    <div class="cart-subtotal">
                      <p class="subtotal-text">Subtotal</p>
                      <p class="subtotal-text">${{ subtotal.toFixed(2) }}</p>
                    </div>
                    <div class="cart-subtotal">
                      <p class="subtotal-text">Shipping</p>
                      <p class="subtotal-text">FREE</p>
                    </div>
                    <div class="cart-subtotal">
                      <p class="subtotal-text">Estimated Taxes</p>
                      <p class="subtotal-text">${{ tax.toFixed(2) }}</p>
                    </div>
                    <div class="cart-total">
                      <div class="total-text">
                        <p>Total</p>
                      </div>
                      <p>${{ totalPrice.toFixed(2) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="close-checkout" @click="closeCheckout">&times;</button>
        </div>
      </template>
    </div>
  </transition>
</template>

<script setup>
const userStore = useUserStore();
const itemStore = useItemStore();
const emit = defineEmits(["close-cart"]);
const router = useRouter();
const route = useRoute();

const isLoggedIn = computed(() => !!userStore.user);
const activeCart = computed(() =>
  isLoggedIn.value ? userStore.user.cart : itemStore.cart
);

const totalItemCount = computed(() =>
  activeCart.value.reduce((total, item) => total + item.quantity, 0)
);
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

function setTab(tab) {
  emit("close-cart");
  router.push({ query: { ...route.query, tab } });
}

// Toggle between cart view and checkout panel view
const showCheckout = ref(false);
function openCheckout() {
  console.log("Opening checkout panel");
  showCheckout.value = true;
}
function closeCheckout() {
  console.log("Closing checkout panel");
  showCheckout.value = false;
}

// Calculate the subtotal and tax for the order summary.
const subtotal = computed(() =>
  activeCart.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
);
const taxRate = 0.1; // 10%
const tax = computed(() => subtotal.value * taxRate);

// Handle order completion (console.log statements preserved)
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
</script>

<style scoped>
/* Transition: collapse effect from the right */
.collapse-right-enter-active,
.collapse-right-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: right;
}
.collapse-right-enter-from,
.collapse-right-leave-to {
  transform: scaleX(0);
  opacity: 0;
}
.collapse-right-enter-to,
.collapse-right-leave-from {
  transform: scaleX(1);
  opacity: 1;
}

/* Overlay aligned to the right */
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* Nav Cart Styles (unchanged from your original) */
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
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.cart-header h2 {
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
.floating-num-circle {
  position: absolute;
  right: 0.5rem;
  top: -0.5rem;
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
.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}
.cart-item {
  width: 100%;
  padding-bottom: 1rem;
  display: flex;
  margin-bottom: 1rem;
}
.item-image {
  width: 100px;
  height: 100px;
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
  font-weight: lighter;
  font-family: "Lora";
}
.variant-details p {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
}

.order-summary-item-total {
  /* width: 10%; */
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
  margin-bottom: 0rem;
  margin-top: 0rem;
}

.cart-subtotal {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.total-text {
}

.total-text span {
  color: #636363;
  font-weight: lighter;
  font-size: 0.9rem;
}
.subtotal-text {
  color: black;
  font-weight: lighter;
  font-size: 0.9rem;
}
.cart-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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

/* Checkout Panel Styles */
.checkout-panel-full {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.checkout-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
}

/* Remove border-right from checkout-left */
.checkout-left {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  /* overflow-y: auto; */
}

.left-wrapper {
  padding: 3rem 3rem 1rem 1rem;
  width: 100%;
  max-width: 550px;
}

/* Divider element */
.checkout-divider {
  width: 1px;
  background-color: #ddd;
  margin: 0 0rem;
  align-self: stretch;
}

/* Sticky Order Summary in checkout-right */
.checkout-right {
  position: sticky;
  top: 0;
  align-self: flex-start;
  display: flex;
  width: 100%;
  background: #f5f5f5;
  height: 100%;
}

.right-wrapper {
  padding: 3rem 1rem 1rem 3rem;
  max-width: 550px;
  width: 100%;
}

/* New Checkout Left Styles */
.checkout-logo {
  text-align: center;
  border-bottom: 1px solid #ddd;
  width: 100%;
}
.checkout-logo img {
  max-width: 200px;
}
.express-label {
  text-align: center;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  font-weight: lighter;
  color: rgba(0, 0, 0, 0.7);
}
.express-checkout-wrapper {
  margin: 0 auto;
}
.close-checkout {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

/* Order Summary Styles */
.summary-items {
  margin-bottom: 1rem;
}
.order-summary-item {
  display: flex;
  margin-bottom: 1rem;
}
.summary-item-count {
  position: relative;
}
.order-summary-item .item-details {
  width: 60%;
}
.quantity {
  font-size: 0.9rem;
  color: #555;
}
.summary-divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 1rem 0;
}

.summary-totals .total {
  margin-top: 0.5rem;
}

/* Express Checkout Buttons: list in a row with fixed width */
.express-buttons-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.express-button {
  width: 100%;
  min-height: 1rem;
}

.payment-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  text-align: center;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.7);
  position: relative;
}

.payment-divider span {
  position: absolute;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1rem;
  font-size: 0.9rem;
  font-weight: lighter;
  margin: 0 auto;
  background: white;
  width: 6rem;
}

/* Responsive Mobile Styles */
@media (max-width: 1024px) {
  .cart-wrapper {
    width: 55%;
  }

  .item-image {
    width: 125px;
    height: 125px;
  }
}

@media (max-width: 768px) {
  .overlay {
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
    padding: 0;
    width: 100%;
    height: 100%;
    margin: 0;
  }
  .cart-wrapper,
  .checkout-panel-full {
    width: 100%;
    height: 100%;
    padding: 1rem;
    box-shadow: none;
  }
  .checkout-left,
  .checkout-right {
    padding: 1rem;
  }

  .cart-actions {
    gap: 0rem;
  }
}
</style>
