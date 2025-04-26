<template>
  <div class="right-section">
    <div class="basic-info">
      <h1 class="product-name">{{ localItem.name }}</h1>
      <div class="ratings-row">
        <div class="stars-container">
          <SubcomponentsStarRating :rating="localItem.ratings || 0" />
        </div>
        <span v-if="localItem.reviewCount" class="rating-number">
          {{ localItem.ratings.toFixed(1) }}
        </span>
        <span v-if="localItem.reviewCount" class="rating-number">
          ({{ localItem.reviewCount.toFixed(0) }} Reviews)
        </span>
        <span v-else>No Reviews</span>
      </div>

      <div
        v-if="localItem.variants && localItem.variants.length"
        class="pricing"
      >
        <h2 class="new">${{ selectedVariant.price }}</h2>
        <h2 v-if="selectedVariant.oldPrice" class="old">
          ${{ selectedVariant.oldPrice }}
        </h2>
      </div>
      <div v-else class="pricing">
        <h2 class="new">${{ localItem.price }}</h2>
        <h2 v-if="localItem.oldPrice" class="old">${{ localItem.oldPrice }}</h2>
      </div>
    </div>

    <p
      v-if="
        selectedVariant &&
        selectedVariant.savingsAmount &&
        selectedVariant.savingsPercentage &&
        selectedVariant.savingsAmount > 0 &&
        !isOutOfStock
      "
      class="savings-text"
    >
      {{ selectedVariant.savingsPercentage }} Sale: Save ${{
        selectedVariant.savingsAmount.toFixed(2)
      }}
    </p>
    <p
      v-else-if="
        localItem.savingsAmount && localItem.savingsPercentage && !isOutOfStock
      "
      class="savings-text"
    >
      SALE: {{ localItem.savingsPercentage }} OFF! (You save ${{
        localItem.savingsAmount.toFixed(2)
      }})
    </p>

    <div
      v-if="localItem.variants && localItem.variants.length"
      class="variant-selector"
    >
      <div
        v-for="attribute in availableAttributes"
        :key="attribute"
        class="attribute-section"
      >
        <div class="attribute-label">
          <h2 class="attribute-name">{{ capitalize(attribute) }}:</h2>
          <h2 v-if="attribute !== 'color'" class="current-attribute">
            {{ selectedAttributes[attribute] }}
          </h2>
          <h2
            v-else-if="
              attribute === 'color' &&
              selectedAttributes[attribute] &&
              selectedAttributes[attribute].name
            "
            class="current-attribute"
          >
            {{ selectedAttributes[attribute].name }}
          </h2>
        </div>
        <div
          :class="
            attribute !== 'color'
              ? 'attribute-options'
              : 'color-attribute-options'
          "
        >
          <div
            v-for="option in getOptions(attribute)"
            :key="optionKey(attribute, option)"
            :class="[
              attribute !== 'color' ? 'attribute-option' : 'color-circle',
              {
                selected: isSelected(attribute, option.value),
                unavailable: !option.isAvailable,
                'out-of-stock': option.isOutOfStock,
              },
            ]"
            @click="selectOption(attribute, option)"
          >
            <div
              v-if="attribute === 'color'"
              :style="{ backgroundColor: '#' + option.value.hex }"
              class="color"
            ></div>
            <div v-else class="option">
              <div class="option-text">{{ option.value }}</div>
              <div class="availability-container">
                <h3 v-if="option.isOutOfStock">Out Of Stock</h3>
                <h3 v-else-if="!option.isAvailable">See Available Options</h3>
                <h3 v-else class="in-stock">In Stock</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="item-quantity">
      <button @click="handleDecreaseQuantity">-</button>
      <span>{{ itemInCart?.quantity || 0 }}</span>
      <button @click="handleIncreaseQuantity">+</button>
    </div>

    <div v-if="isOutOfStock" class="notify-wrapper">
      <p>
        This item is currently out of stock. Enter your email to be notified
        when it becomes available:
      </p>
      <div class="input-wrapper">
        <input type="email" v-model="email" placeholder="Enter your email" />
        <button @click="handleNotifyMe" class="notify-button">Notify Me</button>
      </div>
    </div>

    <button v-else @click="handleAddToCart" class="add-to-cart-button">
      Add To Cart
    </button>

    <div v-if="isMobile" class="payment-methods">
      <h3>Payment methods</h3>
      <div class="payment-icons">
        <!--
        <img src="placeholder1.png" alt="Method 1" />
        <img src="placeholder2.png" alt="Method 2" />
        <img src="placeholder3.png" alt="Method 3" />
        <img src="placeholder4.png" alt="Method 4" />
        -->
      </div>
      <p>Your payment info is processed securely & includes tax.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
  isOutOfStock: { type: Boolean, default: false },
});

// Responsive
const isMobile = ref(false);
function onResize() {
  isMobile.value = window.innerWidth <= 768;
}
onMounted(() => {
  onResize();
  window.addEventListener("resize", onResize);
});
onUnmounted(() => window.removeEventListener("resize", onResize));

// Local copy for image/price overrides
const localItem = ref({ ...props.item });

// Default variant init
const selectedVariant = ref(
  localItem.value.variants?.length ? localItem.value.variants[0] : {}
);
if (localItem.value.variants?.length) {
  const dv = localItem.value.variants[0];
  if (dv.image?.trim()) localItem.value.image = dv.image;
  localItem.value.price = dv.price;
  selectedVariant.value = dv;
}

// Attributes
const selectableAttributes = [
  "color",
  "size",
  "material",
  "style",
  "capacity",
  "flavor",
  "scent",
  "power",
  "length",
  "region",
];
const selectedAttributes = ref({});
const availableAttributes = computed(() =>
  selectableAttributes.filter((a) =>
    localItem.value.variants?.some((v) => v[a] != null)
  )
);

// Helpers
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function optionKey(attr, opt) {
  return attr === "color" ? opt.value.name : opt.value;
}

// Build options with availability & stock
function getOptions(attribute) {
  const all = localItem.value.variants
    .map((v) => v[attribute])
    .filter((o) => o != null);
  const unique = Array.from(new Set(all.map((o) => JSON.stringify(o)))).map(
    (s) => JSON.parse(s)
  );
  return unique
    .map((value) => {
      const isAvailable =
        availableAttributes.value[0] === attribute ||
        checkAvailability(attribute, value);
      const isOutOfStock = isAvailable && checkStock(attribute, value);
      return { value, isAvailable, isOutOfStock };
    })
    .sort((a, b) => {
      if (a.isAvailable && !b.isAvailable) return -1;
      if (!a.isAvailable && b.isAvailable) return 1;
      if (a.isAvailable && b.isAvailable) return a.isOutOfStock ? 1 : -1;
      return 0;
    });
}
function checkAvailability(attribute, option) {
  const idx = availableAttributes.value.indexOf(attribute);
  if (idx === 0) return true;
  return localItem.value.variants.some((variant) => {
    const matchThis =
      attribute === "color"
        ? variant[attribute]?.name === option.name
        : variant[attribute] === option;
    if (!matchThis) return false;
    return availableAttributes.value.slice(0, idx).every((prev) => {
      const sel = selectedAttributes.value[prev];
      return prev === "color"
        ? sel?.name === variant[prev]?.name
        : sel === variant[prev];
    });
  });
}
function checkStock(attribute, option) {
  const idx = availableAttributes.value.indexOf(attribute);
  return localItem.value.variants.every((variant) => {
    let match = true;
    for (let i = 0; i <= idx; i++) {
      const attr = availableAttributes.value[i];
      const val = i === idx ? option : selectedAttributes.value[attr];
      if (attr === "color") {
        if (variant[attr]?.name !== val.name) match = false;
      } else {
        if (variant[attr] !== val) match = false;
      }
      if (!match) break;
    }
    return match ? variant.stock === 0 : true;
  });
}
function isSelected(attribute, option) {
  const sel = selectedAttributes.value[attribute];
  return attribute === "color" ? sel?.name === option.name : sel === option;
}
function selectOption(attribute, option) {
  if (!option.isAvailable) {
    const fallback = localItem.value.variants.find((v) =>
      attribute === "color"
        ? v[attribute]?.name === option.value.name
        : v[attribute] === option.value
    );
    if (fallback) {
      availableAttributes.value.forEach((attr) => {
        selectedAttributes.value[attr] = fallback[attr];
      });
    }
  } else {
    selectedAttributes.value[attribute] = option.value;
  }
  const idx = availableAttributes.value.indexOf(attribute);
  availableAttributes.value.slice(idx + 1).forEach((attr) => {
    const next = getOptions(attr).find((o) => o.isAvailable);
    selectedAttributes.value[attr] = next ? next.value : null;
  });
  const found = localItem.value.variants.find((v) =>
    availableAttributes.value.every((attr) =>
      attr === "color"
        ? v[attr]?.name === selectedAttributes.value[attr]?.name
        : v[attr] === selectedAttributes.value[attr]
    )
  );
  selectedVariant.value = found || localItem.value.variants[0];
}

// Init selectedAttributes
onMounted(() => {
  if (localItem.value.variants?.length) {
    const dv = localItem.value.variants[0];
    availableAttributes.value.forEach((attr) => {
      selectedAttributes.value[attr] = dv[attr];
    });
  }
});

// Cart + quantity logic
const itemStore = useItemStore();
const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.user);
const itemInCart = computed(() => {
  const cart = isLoggedIn.value ? userStore.user.cart : itemStore.cart;
  return cart.find(
    (ci) =>
      ci._id === localItem.value._id &&
      ci.variantId === selectedVariant.value?._id
  );
});
function handleAddToCart() {
  if (!isLoggedIn.value)
    itemStore.addToCart(localItem.value, selectedVariant.value);
  else userStore.addToCart(localItem.value, selectedVariant.value);
}
function handleIncreaseQuantity() {
  if (itemInCart.value) {
    const qty = itemInCart.value.quantity + 1;
    const payload = { itemId: localItem.value._id, quantity: qty };
    if (selectedVariant.value?._id)
      payload.variantId = selectedVariant.value._id;
    if (!isLoggedIn.value) itemStore.updateQuantity(payload);
    else userStore.updateQuantity(payload);
  } else {
    handleAddToCart();
  }
}
function handleDecreaseQuantity() {
  if (!itemInCart.value) return;
  const qty = itemInCart.value.quantity - 1;
  if (qty > 0) {
    const payload = { itemId: localItem.value._id, quantity: qty };
    if (selectedVariant.value?._id)
      payload.variantId = selectedVariant.value._id;
    if (!isLoggedIn.value) itemStore.updateQuantity(payload);
    else userStore.updateQuantity(payload);
  } else {
    if (!isLoggedIn.value)
      itemStore.removeFromCart(localItem.value._id, selectedVariant.value._id);
    else
      userStore.removeFromCart(localItem.value._id, selectedVariant.value._id);
  }
}

// Out-of-stock notify
const email = ref("");
function handleNotifyMe() {
  if (email.value && props.isOutOfStock) {
    alert(`You will be notified at ${email.value} when back in stock.`);
    email.value = "";
  }
}
</script>


<style scoped>
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 2rem;
  padding: 3rem 0 1rem;
}

/* Basic Info */
.basic-info {
  margin-bottom: 1rem;
  color: black;
}
.product-name {
  font-size: 1.5rem;
  line-height: 1.3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: black;
  font-family: "Source Sans Pro", serif;
}
.ratings-row {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 0.2rem;
}
.stars-container {
  display: flex;
  height: 20px;
  width: 100px;
  align-items: flex-end;
}
.rating-number,
.ratings-row span {
  font-size: 1rem;
  margin-left: 8px;
  color: black;
}
.pricing {
  display: flex;
  align-items: flex-end;
}
.new {
  font-size: 2rem;
  font-weight: bold;
  margin-right: 1rem;
  font-family: "Poppins", serif;
}
.old {
  font-size: 1.8rem;
  color: gray;
  font-weight: lighter;
  text-decoration: line-through;
  font-family: "Poppins", serif;
}
.savings-text {
  background: #e9f2ef;
  padding: 1rem;
  font-weight: bold;
  border-radius: 8px;
  font-size: 1.5rem;
}

/* Variant Selector */
.variant-selector {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}
.attribute-section {
  margin-bottom: 2rem;
}
.attribute-label {
  display: flex;
  gap: 0.3rem;
  margin-bottom: 1.2rem;
}
.attribute-name {
  color: black;
  font-size: 1rem;
  font-weight: bold;
  font-family: "Poppins", serif;
}
.current-attribute {
  color: black;
  font-size: 1rem;
  font-weight: lighter;
  font-family: "Poppins", serif;
}
.attribute-options,
.color-attribute-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.attribute-option {
  padding: 2px;
  border: 5px solid transparent;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-width: 7rem;
  text-align: center;
  background: white;
  color: black;
  border-radius: 10px;
  overflow: hidden;
}
.attribute-option.selected {
  border-color: rgb(0, 113, 133);
  background: rgb(237, 253, 255);
}
.attribute-option:hover {
  border-color: rgb(0, 113, 133);
}
.unavailable {
  color: white;
  background-color: rgba(0, 0, 0, 0.1);
  cursor: not-allowed;
  opacity: 0.8;
  border-color: rgba(0, 0, 0, 0.1);
}
.out-of-stock {
  color: #757575;
  background-color: #e0e0e0;
  cursor: not-allowed;
  border-color: #757575;
}
.color-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding: 3px;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
.color-circle.selected {
  border: 1.5px solid black;
}
.color {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.option {
  display: flex;
  flex-direction: column;
}
.option-text {
  flex: 2;
  padding: 5px;
  font-weight: bold;
  border-bottom: 2px solid #333;
}
.availability-container {
  background: white;
  color: black;
  padding: 5px;
  font-size: 0.7rem;
  border-radius: 5px;
  flex: 1;
}
.in-stock {
  color: green;
}

/* Quantity & Cart */
.item-quantity {
  display: flex;
  gap: 1rem;
  align-items: center;
  color: black;
  margin-top: 1rem;
}
.item-quantity button {
  font-size: 24px;
  width: 2rem;
  height: 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}
.item-quantity button:hover {
  background: #aaa;
}

.notify-wrapper {
  margin-top: 20px;
}
.notify-wrapper p {
  font-size: 14px;
  margin-bottom: 10px;
}
.input-wrapper {
  display: flex;
  gap: 10px;
}
.input-wrapper input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
}
.notify-button {
  padding: 8px 16px;
  background-color: #3f654c;
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
  padding: 10px 20px;
  background-color: #333;
  color: white;
  font-weight: bold;
  font-family: "Poppins", serif;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-top: 20px;
}
.add-to-cart-button:hover {
  background-color: #555;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
}

/* Payment Methods */
.payment-methods {
  background: #f5f5f5;
  padding: 1rem;
  margin-top: auto;
}
.payment-icons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
@media (max-width: 768px) {
  .payment-methods {
    display: block;
  }
}
</style>
