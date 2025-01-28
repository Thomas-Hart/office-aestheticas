<template>
  <div class="modal">
    <div class="modal-content">
      <button @click="closeModal" class="close-button">✖</button>
      <div class="left">
        <EcommerceProductImageGallery
          v-if="selectedVariant"
          :image="selectedVariant.image"
          :images="item.moreImages"
        />

        <EcommerceProductImageGallery
          v-else
          :image="item.image"
          :images="item.moreImages"
        />
      </div>
      <div class="right">
        <!-- <h3>Select a Variant</h3> -->
        <EcommerceProductBasicInfo :item="item" />
        <EcommerceProductVariants
          v-if="item.variants && item.variants.length"
          :variants="item.variants"
          @variant-selected="updateSelectedVariant"
        />
        <div>
          <div class="item-quantity">
            <button @click="decreaseQuantity(item)">-</button>
            <p v-if="itemInCart">{{ itemInCart.quantity }}</p>
            <p v-else>0</p>
            <button @click="increaseQuantity(item)">+</button>
          </div>
          <div v-if="isOutOfStock" class="notify-wrapper">
            <p>
              This item is currently out of stock. Enter your email to be
              notified when it becomes available:
            </p>
            <div class="input-wrapper">
              <input
                type="email"
                v-model="email"
                placeholder="Enter your email"
              />
              <button @click="notifyMe" class="notify-button">Notify Me</button>
            </div>
          </div>
          <button v-else @click="addToCart" class="add-to-cart-button">
            <span
              v-if="
                selectedVariant &&
                selectedVariant.oldPrice &&
                selectedVariant.oldPrice > selectedVariant.price
              "
              class="old-price"
            >
              ${{ selectedVariant.oldPrice.toFixed(2) }}
            </span>
            <span v-else class="old-price">
              ${{ item.oldPrice.toFixed(2) }}
            </span>
            <span
              class="new-price"
              v-if="selectedVariant && selectedVariant.price"
            >
              ${{ selectedVariant.price.toFixed(2) }}
            </span>
            <span class="new-price" v-else> ${{ item.price.toFixed(2) }} </span>
            | Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  item: Object,
});

const selectedVariant = ref(props.item.variants[0]);
const itemStore = useItemStore();
const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.user);

console.log("Image variant modal: " + JSON.stringify(props.item.image));

const emit = defineEmits(["closeModal", "variantSelected", "addToCart"]);
const email = ref("");

function updateSelectedVariant(variant) {
  selectedVariant.value = variant;
}

const isOutOfStock = computed(() => {
  return selectedVariant.value && selectedVariant.value.stock === 0;
});

function notifyMe() {
  if (email.value && isOutOfStock.value) {
    alert(
      `You will be notified when this item is back in stock at ${email.value}.`
    );
    email.value = ""; // Clear the email input after notifying
  }
}

// Computed property for checking if item is in cart
const itemInCart = computed(() => {
  return store.cart.find(
    (cartItem) =>
      cartItem._id === props.item?._id &&
      cartItem.variantId === selectedVariant.value?._id
  );
});

const increaseQuantity = () => {
  if (selectedVariant.value) {
    if (itemInCart.value) {
      store.updateQuantity({
        itemId: props.item._id,
        variantId: selectedVariant.value._id,
        quantity: itemInCart.value.quantity + 1,
      });
    } else {
      addToCart(props.item, selectedVariant.value._id);
    }
  } else {
    if (itemInCart.value) {
      store.updateQuantity({
        itemId: props.item._id,
        quantity: itemInCart.value.quantity + 1,
      });
    } else {
      addToCart(props.item);
    }
  }
};

const decreaseQuantity = () => {
  if (selectedVariant.value) {
    if (itemInCart.value && itemInCart.value.quantity > 1) {
      store.updateQuantity({
        itemId: props.item._id,
        variantId: selectedVariant.value._id,
        quantity: itemInCart.value.quantity - 1,
      });
    } else if (itemInCart.value && itemInCart.value.quantity === 1) {
      removeFromCart(props.item._id, selectedVariant.value._id);
    }
  } else {
    if (itemInCart.value && itemInCart.value.quantity > 1) {
      store.updateQuantity({
        itemId: props.item._id,
        quantity: itemInCart.value.quantity - 1,
      });
    } else if (itemInCart.value && itemInCart.value.quantity === 1) {
      removeFromCart(props.item._id);
    }
  }
};

const removeFromCart = (itemId, variantId) => {
  store.removeFromCart(itemId, variantId);
};

function addToCart() {
  if (isLoggedIn.value) {
    userStore.addToCart(props.item, selectedVariant.value);
  } else {
    itemStore.addToCart(props.item, selectedVariant.value);
  }
}

// Close the modal
function closeModal() {
  emit("closeModal");
}
</script>
  
  <style scoped>
.modal {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); /* Darker background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999 !important; /* Make sure it's above other elements */
}

.modal-content {
  background: rgba(74, 74, 74, 0.9);
  box-shadow: 0px 0px 8px black;
  padding: 2rem;
  border-radius: 8px;
  min-width: 1300px;
  width: auto;
  /* min-height: 40rem; */
  height: 40rem;
  overflow-y: auto; /* Scroll inside modal if content is too large */
  position: relative;
  display: flex;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.left {
  flex: 1;
}

.right {
  flex: 1;
}

h3 {
  margin-bottom: 1rem;
  color: white;
}

.item-quantity {
  display: flex;
  gap: 1rem;
  align-items: center;
  text-align: center;
  color: white;
  margin-top: 1rem;
}

.item-quantity button {
  font-size: 24px;
  width: 2rem;
  height: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.item-quantity button:hover {
  background: #ff8000;
}

.notify-wrapper {
  margin-top: 20px;
}

.notify-wrapper p {
  font-size: 14px;
  margin-bottom: 10px;
}

.savings-text {
  margin-top: 10px;
  color: #c1ff72; /* Green text color */
  font-weight: bold;
  font-size: 1.3rem;
}

.input-wrapper {
  display: flex;
  gap: 10px;
}

.input-wrapper input[type="email"] {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.notify-button {
  padding: 8px 16px;
  background-color: #ff8000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.notify-button:hover {
  background-color: #e67e00;
}

.add-to-cart-button {
  padding: 12px 20px;
  background-color: #ff8000; /* Button background color */
  color: black; /* Default text color */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  margin-top: 20px;
  text-align: center;
}

.add-to-cart-button:hover {
  background-color: #befa71;
  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.4);
}

.new-price {
  color: white; /* Price text color */
  font-weight: bold;
}

.old-price {
  color: black; /* Old price text color */
  text-decoration: line-through;
  margin-right: 5px;
}
</style>
  