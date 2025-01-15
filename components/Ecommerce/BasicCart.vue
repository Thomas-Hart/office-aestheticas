<template>
  <div
    :class="{
      'cart-section-wrapper': !checkout,
      'cart-section-wrapper-checkout': checkout,
    }"
  >
    <!--prettier-ignore-->
    <div v-if="hydrated" :class="{ 'cart': !checkout, 'cart-checkout': checkout }">
      <h1 v-if="!checkout">Your Cart</h1>
      <h1 v-if="checkout">Order Overview</h1>
      <div v-if="!checkout" class="cart-item-labels">
        <div class="item-label name-label"><p>Item</p></div>
        <div class="item-label quantity-label"><p>Quantity</p></div>
        <div class="item-label total-label"><p>Total</p></div>
      </div>
      <div v-for="(item) in store.cart" :key="item._id" :class="{ 'cart-item': !checkout, 'cart-item-checkout': checkout }">
        <div class="item-info">
          <div :class="{ 'cart-img-wrapper': !checkout, 'cart-img-wrapper-checkout': checkout }">
            <div v-if="checkout" class="quantity-bubble">
              <p>{{ item.quantity }}</p>
            </div>
            <img :src="resolvedItemImg(item.image)" alt="item image" />
          </div>
          <div class="item-text">
            <p v-if="item.color" class="item-name"><b>{{ item.color.name }} {{ item.name }}</b></p>
            <p v-else class="item-name"><b>{{ item.name }}</b></p>
            <p v-if="!checkout && item.price" class="item-price"><b>${{ item.price.toFixed(2) }}</b></p>
            <p v-if="!checkout && item.size" class="item-price"><b>Size: {{ item.size }}</b></p>
            <p v-if="!checkout && item.material" class="item-price"><b>Material: {{ item.material }}</b></p>
            <p v-if="!checkout && item.style" class="item-price"><b>Style: {{ item.style }}</b></p>
            <p v-if="!checkout && item.capacity" class="item-price"><b>Capacity: {{ item.capacity }}</b></p>
            <p v-if="!checkout && item.flavor" class="item-price"><b>Flavor: {{ item.flavor }}</b></p>
            <p v-if="!checkout && item.scent" class="item-price"><b>Scent: {{ item.scent }}</b></p>
            <p v-if="!checkout && item.power" class="item-price"><b>Power: {{ item.power }}</b></p>
            <p v-if="!checkout && item.length" class="item-price"><b>Length: {{ item.length }}</b></p>
            <p v-if="!checkout && item.region" class="item-price"><b>Region: {{ item.region }}</b></p>
            <p>{{ item.description }}</p>
          </div>
        </div>
        <div v-if="!checkout" class="item-quantity">
          <button @click="decreaseQuantity(item)">-</button>
          <p>{{ item.quantity }}</p>
          <button @click="increaseQuantity(item)">+</button>
        </div>
        <div class="item-total">
          <p>${{ (item.price * item.quantity).toFixed(2) }}</p>
        </div>
        <div v-if="!checkout" class="remove-button" @click="removeCartItem(item._id, item.variantId)">
          <img :src="resolvedTrashImg()" alt="remove"/>
        </div>
      </div>
      <div v-if="store.isCartEmpty()" class="no-items">
        <h1>There are no items in your cart</h1>
      </div>
    </div>
    <div
      :class="{
        'totals-section': !checkout,
        'totals-section-checkout': checkout,
      }"
    >
      <EcommerceCheckoutComponentsTotals
        :checkout="checkout"
        :userLocation="userLocation"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  checkout: Boolean,
  userLocation: Object,
});

const store = useItemStore();
const hydrated = ref(false);

const resolvedItemImg = (img) => `/ItemPics/${img}`;
const resolvedTrashImg = () => "/Trash.svg";

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    store.updateQuantity({
      itemId: item._id,
      variantId: item.variantId,
      quantity: item.quantity - 1,
    });
  }
};

const increaseQuantity = (item) => {
  store.updateQuantity({
    itemId: item._id,
    variantId: item.variantId,
    quantity: item.quantity + 1,
  });
};

const removeCartItem = (itemId, variantId) => {
  store.removeFromCart(itemId, variantId);
};

onMounted(() => {
  hydrated.value = true;
  store.validateCartItems();
});
</script>


<style scoped>
.cart-section-wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
  margin: 0 auto;
  max-width: 1300px;
  padding: 6rem 2rem 0 2rem;
}

.cart-section-wrapper-checkout {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 4rem;
}

.cart {
  height: auto;
  width: 100%;
  padding: 20px;
  background: rgba(58, 58, 59, 0.95);
  box-shadow: 0 0 2px rgba(255, 255, 255, 1);
  color: white;
  grid-column: 1 / span 2; /* Makes the .cart element span both columns */
  /* border-radius: 10px; */
}

h1 {
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
  padding: 10px;
  width: 100%;
}
.cart-checkout {
  height: auto;
  width: 100%;
  background: rgba(58, 58, 59, 0);
  color: white;
  padding: 0;
  margin-bottom: 2rem;
}

.cart-item-labels {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 20px 0;
}

.cart-item {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 20px 0;
}

.cart-item-checkout {
  display: flex;
  gap: 1em;
  justify-content: space-between;
  padding: 10px 0;
}

.item-label {
  font-weight: bold;
}

.cart-img-wrapper {
  min-width: 120px;
  width: 120px;
  min-height: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 4px;
  object-fit: cover;
}

.cart-img-wrapper-checkout {
  height: 80px;
  min-width: 80px;
  border-radius: 4px;
  position: relative;
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.quantity-bubble {
  height: 24px;
  width: 24px;
  position: absolute;
  z-index: 4;
  top: -0.7rem;
  right: -0.7rem;
  background: black;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-info {
  flex-grow: 1;
  display: flex;
  gap: 1rem;
}

.cart-item p {
  margin: 0;
}

.item-name {
  font-size: 20px;
  color: white;
}

.item-price {
}

.item-quantity {
  display: flex;
  gap: 1rem;
  align-items: center;
  text-align: center;
}

.item-quantity button {
  font-size: 24px;
  width: 2rem;
  height: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  border: none;
}

.item-quantity button:hover {
  color: black;
  background: #f7c781;
  cursor: pointer;
  border: none;
}

.remove-button {
  height: 30px;
  width: 30px;
  padding: 5px;
  cursor: pointer;
}

.remove-button:hover {
  box-shadow: 0 0 2px white;
}

.remove-button:active {
  box-shadow: 0 0 5px white;
}

.remove-button img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

select {
  padding: 10px;
  border: none;
  width: 50%;
  border-radius: 4px;
  font-size: 1.3rem;
  background: #f0f0f0;
  appearance: none; /* Removes default browser styling */
  -webkit-appearance: none; /* Removes default browser styling for Safari */
  -moz-appearance: none; /* Removes default browser styling for Firefox */
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.646 7.646a.5.5 0 01.708 0L10 12.293l4.646-4.647a.5.5 0 01.708.708l-5 5a.5.5 0 01-.708 0l-5-5a.5.5 0 010-.708z" clip-rule="evenodd"/></svg>'); /* Adds a custom dropdown arrow */
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%; /* Positions the dropdown arrow */
  background-size: 0.65em auto, 100%; /* Sizes the dropdown arrow */
}

.totals-section {
  width: 40%;
  justify-self: end;
}

.totals-section-checkout {
  width: 100%;
}

@media (max-width: 768px) {
  /*  ------------  MOBILE  ------------   */
  .cart-section-wrapper {
    padding: 4rem 0 6rem 0;
  }

  .cart-section-wrapper-checkout {
    padding: 0.5rem;
  }

  .cart {
    border-radius: 0;
    box-shadow: none;
  }

  h1 {
    text-align: center;
  }

  .cart-checkout {
    margin-bottom: 0;
  }

  .cart-item-labels {
    grid-template-columns: repeat(3, 1fr);
  }

  .item-label {
    grid-column-start: 1;
    grid-column-end: 3;
  }

  .quantity-label {
    display: none;
  }

  .total-label {
    grid-column-start: 3;
    grid-column-end: 3;
  }

  .cart-item {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }

  .cart-item-checkout {
    display: flex;
    gap: 1em;
    justify-content: space-between;
    padding: 10px 0;
    margin-bottom: 1rem;
  }

  .cart-img-wrapper-checkout {
    height: 80px;
    width: 80px;
    border-radius: 4px;
    position: relative;
  }

  .item-info {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
    flex-direction: column;
  }

  .item-quantity {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 3;
    grid-row-end: 4;
  }

  .item-total {
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 1;
    grid-row-end: 3;
  }

  .totals-section {
    width: 100%;
  }
}

@media (max-width: 480px) {
  /* .item-quantity p {
    font-size: 24px;
  }

  .item-quantity button {
    font-size: 30px;
    width: 2rem;
    height: 2rem;
  } */
}
</style>