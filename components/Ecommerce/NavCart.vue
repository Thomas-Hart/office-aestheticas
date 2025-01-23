<template>
  <div v-if="activeCart.length > 0" class="overlay">
    <div class="cart-wrapper">
      <div class="cart-header">
        <div class="cart-count">
          <h1>Cart</h1>
          <div class="num-circle">{{ activeCart.length }}</div>
        </div>
        <button class="close-button" @click="$emit('close-cart')">
          &times;
        </button>
      </div>

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
          <p class="item-quantity">{{ item.quantity }}</p>
          <button
            class="remove-button"
            @click="removeCartItem(item._id, item.variantId)"
          >
            Remove
          </button>
        </div>
      </div>

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
        <button class="view-cart">View Cart</button>
        <button class="checkout">
          <img src="/Graphics/CartCheckout/security.svg" alt="" />Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "~/stores/userStore";
import { useItemStore } from "~/stores/itemStore";

const userStore = useUserStore();
const itemStore = useItemStore();

const isLoggedIn = computed(() => !!userStore.user);

// Determine the active cart to display based on login status
const activeCart = computed(() => {
  return isLoggedIn.value ? userStore.cart : itemStore.cart;
});

// Function to resolve the item's image path
const resolvedItemImg = (img) => `/ItemPics/${img}`;

// Function to remove an item from the cart
const removeCartItem = (itemId, variantId) => {
  if (isLoggedIn.value) {
    userStore.removeFromCart(itemId, variantId);
  } else {
    itemStore.removeFromCart(itemId, variantId);
  }
};

// Function to calculate the total price
const calculateTotal = () => {
  return activeCart.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};
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
  /* Fixed width for desktops, but allows responsiveness on smaller screens */
  width: 40%;
  max-width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 2rem;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  /* Font and Spacing Consistency */
  font-family: "Montserrat", sans-serif;
  line-height: 1.4;
}

/* Cart Header */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* ~50px height, so spacing around works well */
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.cart-header h1 {
  font-size: 1.3rem; /* more prominent title */
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
  /* align-items: center; */
  margin-bottom: 1rem; /* space between items */
}

/* Item Image */
.item-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-right: 1rem;
}

/* Item Details */
.item-details {
  width: 60%; /* roughly 60% to accommodate image and actions */
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
  color: #888; /* gray for de-emphasis */
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.item-price .current-price {
  color: #3f654c; /* green for emphasis */
  font-weight: light;
  font-family: "Lora";
}

.item-color {
  font-size: 0.9rem;
  color: #555;
}

/* Actions (Quantity + Remove) */
.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* align to the right side */
  justify-content: space-between;
}

.item-quantity {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.remove-button {
  font-size: 0.9rem;
  color: #636363; /* red for deletion emphasis */
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

/* Cart Total Section */
.cart-total {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem; /* slightly larger for emphasis */
  font-weight: bold;
  border-top: 1px solid black;
  padding-top: 1rem;
  margin-top: auto; /* pushes this section to the bottom if content is short */
  margin-bottom: 1rem;
}

.total-text span {
  color: #636363;
  font-weight: lighter;
  font-size: 0.9rem;
}

/* Cart Actions */
.cart-actions {
  display: flex;
  gap: 1rem; /* space between the two buttons */
  justify-content: space-between;
}

/* View Cart Button */
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
  background: #43a047; /* slight darkening on hover */
}

/* Checkout Button */
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
  background: #333; /* slight darkening on hover */
}

.checkout img {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 1024px) {
  .cart-wrapper {
    /* Fixed width for desktops, but allows responsiveness on smaller screens */
    width: 50%;
  }
  .item-image {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 768px) {
  .cart-wrapper {
    /* Fixed width for desktops, but allows responsiveness on smaller screens */
    width: 100%;
  }
  .item-image {
    width: 180px;
    height: 180px;
    object-fit: cover;
    margin-right: 1rem;
  }
}
</style>

  