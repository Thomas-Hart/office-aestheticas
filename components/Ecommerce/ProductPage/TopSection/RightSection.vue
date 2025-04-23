<template>
  <div class="right-section">
    <div class="basic-info">
      <h1 class="product-name">{{ item.name }}</h1>
      <div class="ratings-row">
        <div class="stars-container">
          <SubcomponentsStarRating :rating="item.ratings || 0" />
        </div>
        <span v-if="item.reviewCount" class="rating-number">
          {{ item.ratings.toFixed(1) }}
        </span>
        <span v-if="item.reviewCount" class="rating-number">
          ({{ item.reviewCount.toFixed(0) }} Reviews)
        </span>
        <span v-else>No Reviews</span>
      </div>

      <div v-if="item.variants?.length" class="pricing">
        <h2 class="new">${{ selectedVariant.price }}</h2>
        <h2 v-if="selectedVariant.oldPrice" class="old">
          ${{ selectedVariant.oldPrice }}
        </h2>
      </div>
      <div v-else class="pricing">
        <h2 class="new">${{ item.price }}</h2>
        <h2 v-if="item.oldPrice" class="old">${{ item.oldPrice }}</h2>
      </div>
    </div>

    <p
      v-if="selectedVariant.savingsAmount > 0 && !isOutOfStock"
      class="savings-text"
    >
      {{ selectedVariant.savingsPercentage }} Sale: Save ${{
        selectedVariant.savingsAmount.toFixed(2)
      }}
    </p>
    <p v-else-if="item.savingsAmount && !isOutOfStock" class="savings-text">
      SALE: {{ item.savingsPercentage }} OFF! (You save ${{
        item.savingsAmount.toFixed(2)
      }})
    </p>

    <div v-if="item.variants?.length" class="variant-selector">
      <div
        v-for="attr in availableAttributes"
        :key="attr"
        class="attribute-section"
      >
        <div class="attribute-label">
          <h2 class="attribute-name">{{ capitalize(attr) }}:</h2>
          <h2 v-if="attr !== 'color'" class="current-attribute">
            {{ selectedAttributes[attr] }}
          </h2>
          <h2 v-else class="current-attribute">
            {{ selectedAttributes.color?.name }}
          </h2>
        </div>
        <div
          :class="
            attr === 'color' ? 'color-attribute-options' : 'attribute-options'
          "
        >
          <div
            v-for="opt in getOptions(attr)"
            :key="optionKey(attr, opt)"
            :class="[
              attr === 'color' ? 'color-circle' : 'attribute-option',
              {
                selected: isSelected(attr, opt.value),
                unavailable: !opt.isAvailable,
                'out-of-stock': opt.isOutOfStock,
              },
            ]"
            @click="selectOption(attr, opt)"
          >
            <div
              v-if="attr === 'color'"
              :style="{ backgroundColor: '#' + opt.value.hex }"
              class="color"
            ></div>
            <div v-else class="option">
              <div class="option-text">{{ opt.value }}</div>
              <div class="availability-container">
                <h3 v-if="opt.isOutOfStock">Out Of Stock</h3>
                <h3 v-else-if="!opt.isAvailable">See Available Options</h3>
                <h3 v-else class="in-stock">In Stock</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="item-quantity">
      <button @click="decreaseQty">-</button>
      <span>{{ itemInCart?.quantity || 0 }}</span>
      <button @click="increaseQty">+</button>
    </div>

    <div v-if="isOutOfStock" class="notify-wrapper">
      <input v-model="email" placeholder="Enter your email" />
      <button @click="notifyMe">Notify Me</button>
    </div>
    <button v-else @click="addToCart" class="add-to-cart-button">
      Add To Cart
    </button>

    <div v-if="isMobile" class="payment-methods">
      <h3>Payment methods</h3>
      <div class="payment-icons">
        <img src="placeholder1.png" alt="" />
        <img src="placeholder2.png" alt="" />
        <img src="placeholder3.png" alt="" />
        <img src="placeholder4.png" alt="" />
      </div>
      <p>Your payment info is processed securely & includes tax.</p>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
  isOutOfStock: { type: Boolean, default: false },
});

/* Responsive */
const isMobile = ref(false);
function onResize() {
  isMobile.value = window.innerWidth <= 768;
}
onMounted(() => {
  onResize();
  window.addEventListener("resize", onResize);
});
onUnmounted(() => window.removeEventListener("resize", onResize));

/* Cart + user */
const itemStore = useItemStore();
const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.user);
const itemInCart = computed(() => {
  const cart = isLoggedIn.value ? userStore.user.cart : itemStore.cart;
  return cart.find(
    (ci) =>
      ci._id === props.item._id && ci.variantId === selectedVariant.value._id
  );
});

/* Variant state */
const selectedAttributes = ref({});
const selectedVariant = ref(props.item.variants?.[0] || {});
onMounted(() => {
  const dv = props.item.variants?.[0];
  if (dv)
    props.item.variants.forEach(
      (v) =>
        (selectedAttributes.value[v.color ? "color" : "size"] =
          dv[v.color ? "color" : "size"])
    );
});

const availableAttributes = computed(() => {
  return [
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
  ].filter((a) => props.item.variants.some((v) => v[a] != null));
});

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const getOptions = (attr) => {
  const opts = props.item.variants.map((v) => v[attr]).filter((o) => o != null);
  const uniq = Array.from(new Set(opts.map((o) => JSON.stringify(o)))).map(
    (s) => JSON.parse(s)
  );
  return uniq.map((o) => {
    const available = checkAvail(attr, o);
    return {
      value: o,
      isAvailable: available,
      isOutOfStock: available && checkStock(attr, o),
    };
  });
};
function checkStock(attr, o) {
  /* same logic as before */ return false;
}
function checkAvail(attr, o) {
  /* same logic as before */ return true;
}
function isSelected(attr, o) {
  const sel = selectedAttributes.value[attr];
  return attr === "color" ? sel?.name === o.name : sel === o;
}
function optionKey(attr, opt) {
  return attr === "color" ? opt.value.name : opt.value;
}
function selectOption(attr, opt) {
  selectedAttributes.value[attr] = opt.value; /* update selectedVariant */
}

/* Quantity + cart */
function increaseQty() {
  /* existing logic */
}
function decreaseQty() {
  /* existing logic */
}
function addToCart() {
  /* existing logic */
}
function notifyMe() {
  /* existing logic */
}
</script>
  
  <style scoped>
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 2rem;
  padding: 3rem 0;
}
.basic-info {
  margin-bottom: 1rem;
}
.product-name {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}
.ratings-row {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}
.stars-container {
  width: 100px;
}
.rating-number,
.ratings-row span {
  margin-left: 8px;
}
.pricing {
  display: flex;
  align-items: flex-end;
}
.new {
  font-size: 2rem;
  font-weight: bold;
  margin-right: 1rem;
}
.old {
  text-decoration: line-through;
  color: gray;
}
.savings-text {
  background: #e9f2ef;
  padding: 1rem;
  border-radius: 8px;
}
.variant-selector {
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}
.attribute-section {
  margin-bottom: 2rem;
}
.attribute-label {
  display: flex;
  gap: 8px;
}
.attribute-options,
.color-attribute-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.attribute-option,
.color-circle {
  cursor: pointer;
}
.attribute-option {
  padding: 2px;
  border: 5px solid transparent;
  background: white;
  min-width: 7rem;
  text-align: center;
  border-radius: 10px;
}
.attribute-option.selected {
  border-color: rgb(0, 113, 133);
  background: rgb(237, 253, 255);
}
.color-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding: 3px;
}
.item-quantity {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}
.notify-wrapper {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.notify-wrapper input {
  flex: 1;
}
.add-to-cart-button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #333;
  color: white;
  width: 100%;
}
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
  