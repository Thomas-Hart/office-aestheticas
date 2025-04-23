<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">✖</button>
      <section class="section">
        <div class="gallery">
          <div class="main-image">
            <img
              :src="getImagePath(computedGalleryImage)"
              alt="Product Image"
            />
            <div class="thumbnails-overlay">
              <button
                v-if="canScrollUp"
                class="scroll-arrow up"
                @click="scrollUp"
              >
                &uarr;
              </button>
              <div class="thumbnails-container" ref="thumbnailContainer">
                <img
                  v-for="(img, index) in propsItem.moreImages || []"
                  :key="index"
                  :src="getImagePath(img)"
                  @mouseover="hoverImage(img)"
                  @mouseleave="resetImage"
                  :class="{ active: computedGalleryImage === img }"
                  class="thumbnail"
                />
              </div>
              <button
                v-if="canScrollDown"
                class="scroll-arrow down"
                @click="scrollDown"
              >
                &darr;
              </button>
            </div>
          </div>
        </div>

        <div class="checkout-divider"></div>

        <section class="right-section">
          <div class="basic-info">
            <h1 class="product-name">{{ propsItem.name }}</h1>
            <div class="ratings-row">
              <div class="stars-container">
                <SubcomponentsStarRating :rating="propsItem.ratings || 0" />
              </div>
              <span v-if="propsItem.reviewCount" class="rating-number">
                {{ propsItem.ratings.toFixed(1) }}
              </span>
              <span v-if="propsItem.reviewCount" class="rating-number">
                ({{ propsItem.reviewCount }} Reviews)
              </span>
              <span v-else>No Reviews</span>
            </div>
            <div class="pricing">
              <h2 class="new">${{ selectedVariant.price.toFixed(2) }}</h2>
              <h2 v-if="selectedVariant.oldPrice" class="old">
                ${{ selectedVariant.oldPrice.toFixed(2) }}
              </h2>
            </div>
          </div>

          <p v-if="savingsText" class="savings-text">{{ savingsText }}</p>

          <div v-if="availableAttributes.length" class="variant-selector">
            <div
              v-for="attr in availableAttributes"
              :key="attr"
              class="attribute-section"
            >
              <div class="attribute-label">
                <h2 class="attribute-name">{{ capitalize(attr) }}:</h2>
                <h2 class="current-attribute">
                  {{
                    attr === "color"
                      ? selectedAttributes.color?.name
                      : selectedAttributes[attr]
                  }}
                </h2>
              </div>
              <div
                :class="
                  attr === 'color'
                    ? 'color-attribute-options'
                    : 'attribute-options'
                "
              >
                <div
                  v-for="opt in getOptions(attr)"
                  :key="optionKey(attr, opt)"
                  :class="[
                    attr === 'color' ? 'color-circle' : 'attribute-option',
                    {
                      selected: isSelected(attr, opt),
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
                      <h3 v-else-if="!opt.isAvailable">
                        See Available Options
                      </h3>
                      <h3 v-else class="in-stock">In Stock</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="item-quantity">
            <button @click="handleDecreaseQuantity">−</button>
            <span>{{ itemInCart?.quantity || 0 }}</span>
            <button @click="handleIncreaseQuantity">+</button>
          </div>

          <div v-if="isOutOfStock" class="notify-wrapper">
            <input v-model="email" type="email" placeholder="Your email" />
            <button class="notify-button" @click="handleNotifyMe">
              Notify Me
            </button>
          </div>
          <button v-else class="add-to-cart-button" @click="handleAddToCart">
            Add To Cart
          </button>
        </section>
      </section>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  isOutOfStock: { type: Boolean, default: false },
});
const emit = defineEmits(["closeModal"]);

const propsItem = props.item;

const itemStore = useItemStore();
const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.user);

const localItem = ref({ ...propsItem });
const selectedVariant = ref(
  localItem.value.variants?.length ? localItem.value.variants[0] : {}
);
if (localItem.value.variants?.length) {
  const def = localItem.value.variants[0];
  if (def.image?.trim()) localItem.value.image = def.image;
  localItem.value.price = def.price;
  selectedVariant.value = def;
}

const computedGalleryImage = computed(() => {
  if (selectedVariant.value.image?.trim()) return selectedVariant.value.image;
  if (localItem.value.image?.trim()) return localItem.value.image;
  return "default.webp";
});
const galleryActiveImage = ref(computedGalleryImage.value);
watch(computedGalleryImage, (v) => (galleryActiveImage.value = v));
const getImagePath = (img) => `/ItemPics/${img}`;

const thumbnailContainer = ref(null);
const scrollPosition = ref(0);
function hoverImage(img) {
  galleryActiveImage.value = img;
}
function resetImage() {
  galleryActiveImage.value = computedGalleryImage.value;
}
function scrollUp() {
  thumbnailContainer.value.scrollBy({ top: -60, behavior: "smooth" });
  scrollPosition.value -= 60;
}
function scrollDown() {
  thumbnailContainer.value.scrollBy({ top: 60, behavior: "smooth" });
  scrollPosition.value += 60;
}
const canScrollUp = computed(() => scrollPosition.value > 0);
const canScrollDown = computed(
  () =>
    thumbnailContainer.value &&
    scrollPosition.value <
      thumbnailContainer.value.scrollHeight -
        thumbnailContainer.value.clientHeight
);

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
const availableAttributes = computed(() =>
  selectableAttributes.filter((a) =>
    localItem.value.variants.some((v) => v[a] != null)
  )
);
const selectedAttributes = ref({});
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function getOptions(attribute) {
  const opts = Array.from(
    new Set(
      localItem.value.variants
        .map((v) => v[attribute])
        .filter((o) => o != null)
        .map((o) => JSON.stringify(o))
    )
  ).map((s) => JSON.parse(s));
  return opts
    .map((value) => {
      const isAvailable =
        availableAttributes.value[0] === attribute ||
        checkAvailability(attribute, value);
      const isOutOfStock = isAvailable && checkStock(attribute, value);
      return { value, isAvailable, isOutOfStock };
    })
    .sort((a, b) =>
      a.isAvailable !== b.isAvailable
        ? a.isAvailable
          ? -1
          : 1
        : a.isOutOfStock !== b.isOutOfStock
        ? a.isOutOfStock
          ? 1
          : -1
        : 0
    );
}

function checkStock(attribute, option) {
  const idx = availableAttributes.value.indexOf(attribute);
  return localItem.value.variants.every((variant) => {
    let matching = true;
    for (let i = 0; i <= idx; i++) {
      const attr = availableAttributes.value[i];
      const sel = selectedAttributes.value[attr];
      const varVal = attr === "color" ? variant[attr]?.name : variant[attr];
      const cmp =
        attr === attribute
          ? attr === "color"
            ? option.name
            : option
          : attr === "color"
          ? sel?.name
          : sel;
      if (varVal !== cmp) {
        matching = false;
        break;
      }
    }
    return matching ? variant.stock === 0 : true;
  });
}

function checkAvailability(attribute, option) {
  const idx = availableAttributes.value.indexOf(attribute);
  if (idx === 0) return true;
  return localItem.value.variants.some((variant) => {
    const curMatch =
      attribute === "color"
        ? variant[attribute]?.name === option.name
        : variant[attribute] === option;
    if (!curMatch) return false;
    return availableAttributes.value.slice(0, idx).every((prev) => {
      const sel = selectedAttributes.value[prev];
      return prev === "color"
        ? sel?.name === variant[prev]?.name
        : sel === variant[prev];
    });
  });
}

function isSelected(attribute, opt) {
  return attribute === "color"
    ? selectedAttributes.value.color?.name === opt.value.name
    : selectedAttributes.value[attribute] === opt.value;
}

function selectOption(attribute, opt) {
  if (!opt.isAvailable) {
    const found = localItem.value.variants.find((v) =>
      attribute === "color"
        ? v[attribute]?.name === opt.value.name
        : v[attribute] === opt.value
    );
    if (found) {
      availableAttributes.value.forEach(
        (a) => (selectedAttributes.value[a] = found[a])
      );
    }
  } else {
    selectedAttributes.value[attribute] = opt.value;
  }
  const idx = availableAttributes.value.indexOf(attribute);
  availableAttributes.value.slice(idx + 1).forEach((attr) => {
    const next = getOptions(attr).find((o) => o.isAvailable);
    selectedAttributes.value[attr] = next ? next.value : null;
  });
  const match = localItem.value.variants.find((v) =>
    availableAttributes.value.every((attr) => {
      const sel = selectedAttributes.value[attr];
      return attr === "color" ? v[attr]?.name === sel?.name : v[attr] === sel;
    })
  );
  selectedVariant.value = match || localItem.value.variants[0];
  galleryActiveImage.value =
    selectedVariant.value.image || localItem.value.image;
}

function optionKey(attribute, opt) {
  return attribute === "color" ? opt.value.name : opt.value;
}

onMounted(() => {
  if (localItem.value.variants.length) {
    const def = localItem.value.variants[0];
    Object.keys(def).forEach((attr) => {
      if (availableAttributes.value.includes(attr))
        selectedAttributes.value[attr] = def[attr];
    });
    selectedVariant.value = def;
    galleryActiveImage.value = def.image || localItem.value.image;
  }
});

const itemInCart = computed(() => {
  const list = isLoggedIn.value ? userStore.user.cart : itemStore.cart;
  return list.find(
    (ci) =>
      ci._id === localItem.value._id &&
      ci.variantId === selectedVariant.value._id
  );
});

function handleIncreaseQuantity() {
  if (itemInCart.value) {
    const qty = itemInCart.value.quantity + 1;
    if (isLoggedIn.value) {
      userStore.updateQuantity({
        itemId: localItem.value._id,
        variantId: selectedVariant.value._id,
        quantity: qty,
      });
    } else {
      itemStore.updateQuantity({
        itemId: localItem.value._id,
        variantId: selectedVariant.value._id,
        quantity: qty,
      });
    }
  } else {
    handleAddToCart();
  }
}

function handleDecreaseQuantity() {
  if (itemInCart.value?.quantity > 1) {
    const qty = itemInCart.value.quantity - 1;
    if (isLoggedIn.value) {
      userStore.updateQuantity({
        itemId: localItem.value._id,
        variantId: selectedVariant.value._id,
        quantity: qty,
      });
    } else {
      itemStore.updateQuantity({
        itemId: localItem.value._id,
        variantId: selectedVariant.value._id,
        quantity: qty,
      });
    }
  } else if (itemInCart.value?.quantity === 1) {
    removeFromCart(localItem.value._id, selectedVariant.value._id);
  }
}

function handleAddToCart() {
  if (isLoggedIn.value) {
    userStore.addToCart(localItem.value, selectedVariant.value);
  } else {
    itemStore.addToCart(localItem.value, selectedVariant.value);
  }
}

function removeFromCart(itemId, variantId) {
  if (isLoggedIn.value) {
    userStore.removeFromCart(itemId, variantId);
  } else {
    itemStore.removeFromCart(itemId, variantId);
  }
}

const email = ref("");
function handleNotifyMe() {
  if (email.value && props.isOutOfStock) {
    alert(
      `You will be notified when this item is back in stock at ${email.value}.`
    );
    email.value = "";
  }
}

const savingsText = computed(() => {
  if (selectedVariant.value.savingsAmount > 0 && !props.isOutOfStock) {
    return `${
      selectedVariant.value.savingsPercentage
    } Sale: Save $${selectedVariant.value.savingsAmount.toFixed(2)}`;
  }
  if (propsItem.savingsAmount && !props.isOutOfStock) {
    return `SALE: ${
      propsItem.savingsPercentage
    } OFF! You save $${propsItem.savingsAmount.toFixed(2)}`;
  }
  return "";
});

function closeModal() {
  emit("closeModal");
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  width: 90%;
  max-width: 1300px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border-radius: 8px;
  padding: 1rem;
}
.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.section {
  display: flex;
  gap: 2rem;
}
.checkout-divider {
  width: 1px;
  background-color: #ddd;
  align-self: stretch;
}
.right-section {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.gallery {
  flex: 1;
  position: relative;
}
.main-image img {
  width: 100%;
  object-fit: cover;
  transition: all 0.2s ease-out;
}
.thumbnails-overlay {
  position: absolute;
  top: 10px;
  left: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: calc(100% - 20px);
  width: 80px;
}
.thumbnails-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 15px;
  width: 90px;
  max-height: 60vh;
}
.thumbnail {
  width: 60px;
  height: 60px;
  cursor: pointer;
  object-fit: cover;
  border: 2px solid #000;
  background: white;
  transition: border-color 0.3s ease;
}
.thumbnail.active,
.thumbnail:hover {
  border-color: #3f654c;
}
.scroll-arrow {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}
.scroll-arrow.up {
  margin-bottom: 0.5rem;
}
.scroll-arrow.down {
  margin-top: 0.5rem;
}
.basic-info {
  margin-bottom: 1rem;
}
.product-name {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.ratings-row {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.pricing .new {
  font-size: 2rem;
  font-weight: bold;
}
.pricing .old {
  margin-left: 1rem;
  color: gray;
  text-decoration: line-through;
}
.savings-text {
  background: #e9f2ef;
  padding: 1rem;
  font-weight: bold;
  border-radius: 8px;
}
.variant-selector {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}
.attribute-section {
  margin-bottom: 1rem;
}
.attribute-label {
  display: flex;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}
.attribute-options,
.color-attribute-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.attribute-option {
  padding: 0.5rem;
  border: 2px solid transparent;
  cursor: pointer;
  border-radius: 6px;
  background: white;
  transition: border-color 0.3s ease;
}
.attribute-option.selected {
  border-color: #007185;
  background: #e7f5f7;
}
.color-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.3s ease;
}
.color-circle.selected {
  border-color: black;
}
.option-text {
  font-weight: bold;
  border-bottom: 1px solid #333;
  padding-bottom: 2px;
}
.availability-container {
  font-size: 0.75rem;
}
.item-quantity {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.item-quantity button {
  font-size: 1.25rem;
  padding: 0.25rem 0.5rem;
}
.notify-wrapper {
  margin-top: 1rem;
}
.input-wrapper input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.notify-button,
.add-to-cart-button {
  margin-top: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.notify-button {
  background: #3f654c;
  color: white;
}
.add-to-cart-button {
  background: #333;
  color: white;
  font-weight: bold;
}

@media (max-width: 768px) {
  .section {
    flex-direction: column;
    gap: 1rem;
  }
  .checkout-divider {
    display: none;
  }
}
</style>
