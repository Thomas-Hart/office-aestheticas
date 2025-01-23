<template>
  <div v-if="store.cart.length > 0" class="overlay">
    <div class="cart-wrapper">
      <div class="cart-header">
        <div class="cart-count">
          <h1>Cart</h1>
          <div class="num-circle">{{ store.cart.length }}</div>
        </div>
        <button class="close-button" @click="$emit('close-cart')">
          &times;
        </button>
      </div>

      <div
        v-for="(item, index) in store.cart"
        :key="item._id"
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
        <p>Total</p>
        <p>${{ calculateTotal().toFixed(2) }}</p>
      </div>

      <div class="cart-actions">
        <button class="view-cart">View Cart</button>
        <button class="checkout">Checkout</button>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
const store = useItemStore();

const resolvedItemImg = (img) => `/ItemPics/${img}`;

const removeCartItem = (itemId, variantId) => {
  store.removeFromCart(itemId, variantId);
};

const calculateTotal = () => {
  return store.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};
</script>
  
  <style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  padding: 1rem;
}

.cart-wrapper {
  max-width: 40%;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 1.5rem;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.cart-count {
  display: flex;
  align-items: center;
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

.cart-header h1 {
  font-size: 1.2rem;
  margin: 0;
}

.cart-header .close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  font-size: 1rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
}

.item-price {
  margin: 0;
}

.item-price .original-price {
  text-decoration: line-through;
  color: #888;
  margin-right: 0.5rem;
}

.item-price .current-price {
  color: #4caf50;
  font-weight: bold;
}

.item-color {
  font-size: 0.9rem;
  color: #555;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.item-quantity {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.remove-button {
  background: none;
  border: none;
  color: #f00;
  font-size: 0.9rem;
  cursor: pointer;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  font-size: 1.2rem;
  font-weight: bold;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.view-cart {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.checkout {
  background: #000;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
</style>
  