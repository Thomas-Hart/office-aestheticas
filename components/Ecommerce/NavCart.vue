<template>
  <div v-if="activeCart.length > 0" class="overlay">
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
          <img
            :src="resolvedItemImg(item.image)"
            alt="item image"
            class="item-image"
          />
          <div class="item-details">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-price">
              <span v-if="item.originalPrice" class="original-price"
                >${{ item.originalPrice.toFixed(2) }}</span
              >
              <span class="current-price">${{ item.price.toFixed(2) }}</span>
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
            <span class="total-price"
              >Taxes and shipping calculated at checkout</span
            >
          </div>
          <p>${{ calculateTotal().toFixed(2) }}</p>
        </div>

        <div class="cart-actions">
          <button class="view-cart" @click="setTab('Featured')">
            Keep Shopping
          </button>
          <button class="checkout">
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
const isLoggedIn = computed(() => !!userStore.user);

const emit = defineEmits(["close-cart"]);

function setTab(tab) {
  emit("close-cart");
  router.push({ query: { ...route.query, tab } });
}

// Show either user cart (if logged in) or item store cart (if not)
const activeCart = computed(() => {
  return isLoggedIn.value ? userStore.user.cart : itemStore.cart;
});

const totalItemCount = computed(() => {
  return activeCart.value.reduce((total, item) => total + item.quantity, 0);
});

// Resolve the item's image path
const resolvedItemImg = (img) => `/ItemPics/${img}`;

// Remove an item from the cart
const removeCartItem = (itemId, variantId) => {
  if (isLoggedIn.value) {
    userStore.removeFromCart(itemId, variantId);
  } else {
    itemStore.removeFromCart(itemId, variantId);
  }
};

// Calculate total price
const calculateTotal = () => {
  return activeCart.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

/**
 * Update item quantity via a number input
 * - If newQuantity < 1, remove item
 * - Otherwise, update store quantity
 */
function updateItemQuantity(item, newValue) {
  const newQuantity = parseInt(newValue, 10);

  // If user enters 0 or something invalid, remove item
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
}
</script>

  
<style scoped>
/* Overall Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* dims rest of the screen */
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  padding: 1rem;
}

/* Cart Wrapper */
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
}

/* Scrollable Cart Items */
.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin; /* For modern browsers */
  scrollbar-color: #bbb transparent; /* Colors */
  padding-right: 0.5rem;
}

/* Custom Scrollbar for Webkit */
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

/* Cart Header */
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

/* Close Button */
.cart-header .close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

/* Cart Items */
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

/* Cart Bottom Section */
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

@media (max-width: 1024px) {
  .cart-wrapper {
    width: 50%;
  }
  .item-image {
    width: 150px;
    height: 150px;
  }

  .view-cart {
    padding: 1rem 1.25rem;
  }
}

@media (max-width: 768px) {
  .cart-wrapper {
    width: 100%;
    padding: 1.5rem;
  }
  .item-image {
    width: 180px;
    height: 180px;
  }
}

@media (max-width: 480px) {
  .cart-wrapper {
    padding: 1rem;
  }
  .item-image {
    width: 100px;
    height: 100px;
  }

  .total-price {
    font-size: 0.5rem;
  }

  .view-cart {
    padding: 0.75rem 1rem;
  }
}
</style>
