<template>
  <div class="modal">
    <div class="modal-content">
      <button @click="closeModal" class="close-button">✖</button>
      <!-- Use the inline component layout inside the modal -->
      <section class="section">
        <!-- Image Gallery -->
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
                  v-for="(img, index) in item.moreImages"
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

        <!-- Right Section with Basic Info, Variant Selector, and Cart Controls -->
        <section class="right-section">
          <div>
            <!-- Basic Info -->
            <div class="basic-info">
              <h1 class="product-name">{{ item.name }}</h1>
              <div class="ratings-row">
                <div class="stars-container">
                  <SubcomponentsStarRating :rating="item.ratings || 0" />
                </div>
                <span v-if="item && item.reviewCount" class="rating-number">
                  {{ item.ratings }}
                </span>
                <span v-if="item && item.reviewCount" class="rating-number">
                  ({{ (item.reviewCount || 0).toFixed(0) }} Reviews)
                </span>
                <span v-else>No Reviews</span>
              </div>
              <div v-if="item.variants && item.variants.length" class="pricing">
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
              v-if="
                selectedVariant &&
                selectedVariant.savingsAmount &&
                selectedVariant.savingsPercentage &&
                selectedVariant.savingsAmount > 0 &&
                !isOutOfStock
              "
              class="savings-text"
            >
              SALE: {{ selectedVariant.savingsPercentage }} OFF! (You save ${{
                selectedVariant.savingsAmount.toFixed(2)
              }})
            </p>
            <p
              v-else-if="
                item.savingsAmount && item.savingsPercentage && !isOutOfStock
              "
              class="savings-text"
            >
              SALE: {{ item.savingsPercentage }} OFF! (You save ${{
                (item.savingsAmount || 0).toFixed(2)
              }})
            </p>

            <div class="checkout-divider"></div>

            <!-- Variant Selector -->
            <div
              v-if="item.variants && item.variants.length"
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
                    :style="{ color: '#' + selectedAttributes[attribute].hex }"
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
                      attribute !== 'color'
                        ? 'attribute-option'
                        : 'color-circle',
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
                        <h3 v-else-if="!option.isAvailable">
                          See Available Options
                        </h3>
                        <h3 v-else class="in-stock">In Stock</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quantity & Add-To-Cart Section -->
          <div>
            <div class="item-quantity">
              <button @click="handleDecreaseQuantity">-</button>
              <p v-if="itemInCart">{{ itemInCart.quantity }}</p>
              <p v-else>0</p>
              <button @click="handleIncreaseQuantity">+</button>
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
                <button @click="handleNotifyMe" class="notify-button">
                  Notify Me
                </button>
              </div>
            </div>
            <button v-else @click="handleAddToCart" class="add-to-cart-button">
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
                v-if="selectedVariant && selectedVariant.price"
                class="new-price"
              >
                ${{ selectedVariant.price.toFixed(2) }}
              </span>
              <span v-else class="new-price">
                ${{ item.price.toFixed(2) }}
              </span>
              | Add to Cart
            </button>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, required: true },
});
const emit = defineEmits(["closeModal"]);
const itemStore = useItemStore();
const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.user);

// --- Modal Variables & Functions ---
const email = ref("");
const selectedVariant = ref(
  props.item.variants && props.item.variants.length
    ? props.item.variants[0]
    : null
);
const isOutOfStock = computed(() => {
  return selectedVariant.value && selectedVariant.value.stock === 0;
});
function handleNotifyMe() {
  if (email.value && isOutOfStock.value) {
    alert(
      `You will be notified when this item is back in stock at ${email.value}.`
    );
    email.value = "";
  }
}

// --- Quantity & Cart Logic Using Store Methods ---
const itemInCart = computed(() => {
  if (!isLoggedIn.value) {
    return itemStore.cart.find(
      (cartItem) =>
        cartItem._id === props.item?._id &&
        cartItem.variantId === selectedVariant.value?._id
    );
  } else {
    return userStore.user.cart.find(
      (cartItem) =>
        cartItem._id === props.item?._id &&
        cartItem.variantId === selectedVariant.value?._id
    );
  }
});
function handleIncreaseQuantity() {
  if (selectedVariant.value) {
    if (itemInCart.value) {
      if (!isLoggedIn.value) {
        itemStore.updateQuantity({
          itemId: props.item._id,
          variantId: selectedVariant.value._id,
          quantity: itemInCart.value.quantity + 1,
        });
      } else {
        userStore.updateQuantity({
          itemId: props.item._id,
          variantId: selectedVariant.value._id,
          quantity: itemInCart.value.quantity + 1,
        });
      }
    } else {
      handleAddToCart();
    }
  } else {
    if (itemInCart.value) {
      if (!isLoggedIn.value) {
        itemStore.updateQuantity({
          itemId: props.item._id,
          quantity: itemInCart.value.quantity + 1,
        });
      } else {
        userStore.updateQuantity({
          itemId: props.item._id,
          quantity: itemInCart.value.quantity + 1,
        });
      }
    } else {
      handleAddToCart();
    }
  }
}
function handleDecreaseQuantity() {
  if (selectedVariant.value) {
    if (itemInCart.value && itemInCart.value.quantity > 1) {
      if (!isLoggedIn.value) {
        itemStore.updateQuantity({
          itemId: props.item._id,
          variantId: selectedVariant.value._id,
          quantity: itemInCart.value.quantity - 1,
        });
      } else {
        userStore.updateQuantity({
          itemId: props.item._id,
          variantId: selectedVariant.value._id,
          quantity: itemInCart.value.quantity - 1,
        });
      }
    } else if (itemInCart.value && itemInCart.value.quantity === 1) {
      removeFromCart(props.item._id, selectedVariant.value._id);
    }
  } else {
    if (itemInCart.value && itemInCart.value.quantity > 1) {
      if (!isLoggedIn.value) {
        itemStore.updateQuantity({
          itemId: props.item._id,
          quantity: itemInCart.value.quantity - 1,
        });
      } else {
        userStore.updateQuantity({
          itemId: props.item._id,
          quantity: itemInCart.value.quantity - 1,
        });
      }
    } else if (itemInCart.value && itemInCart.value.quantity === 1) {
      removeFromCart(props.item._id);
    }
  }
}
function removeFromCart(itemId, variantId) {
  if (!isLoggedIn.value) {
    itemStore.removeFromCart(itemId, variantId);
  } else {
    userStore.removeFromCart(itemId, variantId);
  }
}
function handleAddToCart() {
  if (!isLoggedIn.value) {
    itemStore.addToCart(props.item, selectedVariant.value);
  } else {
    userStore.addToCart(props.item, selectedVariant.value);
  }
}
function closeModal() {
  emit("closeModal");
}

// --- Image Gallery Section ---
const galleryImage = computed(() => {
  return selectedVariant.value && selectedVariant.value.image
    ? selectedVariant.value.image
    : props.item.image;
});
const galleryActiveImage = ref(galleryImage.value);
watch(galleryImage, (newVal) => {
  galleryActiveImage.value = newVal;
});
const getImagePath = (img) => `/ItemPics/${img}`;
const thumbnailContainer = ref(null);
const scrollPosition = ref(0);
function hoverImage(img) {
  galleryActiveImage.value = img;
}
function resetImage() {
  galleryActiveImage.value = galleryImage.value;
}
function scrollUp() {
  if (thumbnailContainer.value) {
    thumbnailContainer.value.scrollBy({
      top: -60,
      behavior: "smooth",
    });
    scrollPosition.value -= 60;
  }
}
function scrollDown() {
  if (thumbnailContainer.value) {
    thumbnailContainer.value.scrollBy({
      top: 60,
      behavior: "smooth",
    });
    scrollPosition.value += 60;
  }
}
const canScrollUp = computed(() => scrollPosition.value > 0);
const canScrollDown = computed(() => {
  if (thumbnailContainer.value) {
    return (
      scrollPosition.value <
      thumbnailContainer.value.scrollHeight -
        thumbnailContainer.value.clientHeight
    );
  }
  return false;
});
onMounted(() => {
  if (thumbnailContainer.value) {
    scrollPosition.value = thumbnailContainer.value.scrollTop;
  }
});

// --- Variant Selector Logic ---
const selectedAttributes = ref({});
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
const availableAttributes = computed(() => {
  const attributes = [
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
  return attributes.filter((attribute) =>
    props.item.variants.some((variant) => variant[attribute])
  );
});
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const getOptions = (attribute) => {
  const options = props.item.variants
    .map((variant) => variant[attribute])
    .filter((option) => option !== undefined && option !== null);
  const uniqueOptions = Array.from(
    new Set(options.map((option) => JSON.stringify(option)))
  ).map((str) => JSON.parse(str));
  const optionsWithAvailability = uniqueOptions.map((option) => {
    const isAvailable =
      availableAttributes.value[0] === attribute ||
      checkAvailability(attribute, option);
    let isOutOfStock = false;
    if (isAvailable) {
      isOutOfStock = checkStock(attribute, option);
    }
    return {
      value: option,
      isAvailable,
      isOutOfStock,
    };
  });
  return optionsWithAvailability.sort((a, b) => {
    if (a.isAvailable && !b.isAvailable) return -1;
    if (!a.isAvailable && b.isAvailable) return 1;
    if (a.isAvailable && b.isAvailable) return a.isOutOfStock ? 1 : -1;
    return 0;
  });
};
const checkStock = (attribute, option) => {
  const attributeIndex = availableAttributes.value.indexOf(attribute);
  const isOutOfStock = props.item.variants.every((variant) => {
    let isMatching = true;
    for (let i = 0; i <= attributeIndex; i++) {
      const currentAttr = availableAttributes.value[i];
      const selectedValue = selectedAttributes.value[currentAttr];
      if (currentAttr === "color") {
        const optionMatches =
          currentAttr === attribute
            ? variant[currentAttr]?.name === option.name
            : variant[currentAttr]?.name === selectedValue?.name;
        isMatching = isMatching && optionMatches;
      } else {
        const optionMatches =
          currentAttr === attribute
            ? variant[currentAttr] === option
            : variant[currentAttr] === selectedValue;
        isMatching = isMatching && optionMatches;
      }
      if (!isMatching) break;
    }
    if (isMatching) {
      return variant.stock === 0;
    }
    return true;
  });
  return isOutOfStock;
};
const checkAvailability = (attribute, option) => {
  const attributeIndex = availableAttributes.value.indexOf(attribute);
  if (attributeIndex === 0) {
    return true;
  }
  return props.item.variants.some((variant) => {
    const matchesCurrentOption =
      attribute === "color"
        ? variant[attribute]?.name === option.name
        : variant[attribute] === option;
    if (!matchesCurrentOption) {
      return false;
    }
    const matchesPreviousAttributes = availableAttributes.value
      .slice(0, attributeIndex)
      .every((prevAttribute) => {
        const selectedValue = selectedAttributes.value[prevAttribute];
        if (prevAttribute === "color") {
          return selectedValue?.name === variant[prevAttribute]?.name;
        }
        return selectedValue === variant[prevAttribute];
      });
    return matchesCurrentOption && matchesPreviousAttributes;
  });
};
const isSelected = (attribute, option) =>
  attribute === "color"
    ? selectedAttributes.value[attribute]?.name === option.name
    : selectedAttributes.value[attribute] === option;
function selectOption(attribute, option) {
  if (!option.isAvailable) {
    const availableVariant = props.item.variants.find((variant) =>
      attribute === "color"
        ? variant[attribute]?.name === option.value.name
        : variant[attribute] === option.value
    );
    if (availableVariant) {
      const newSelectedAttributes = { ...selectedAttributes.value };
      Object.keys(newSelectedAttributes).forEach((key) => {
        newSelectedAttributes[key] = availableVariant[key];
      });
      selectedAttributes.value = newSelectedAttributes;
    }
  } else {
    const newSelectedAttributes = { ...selectedAttributes.value };
    newSelectedAttributes[attribute] = option.value;
    selectedAttributes.value = newSelectedAttributes;
  }
  const attributeIndex = availableAttributes.value.indexOf(attribute);
  if (attributeIndex < availableAttributes.value.length - 1) {
    availableAttributes.value
      .slice(attributeIndex + 1)
      .forEach((lowerAttribute) => {
        const options = getOptions(lowerAttribute);
        const availableOption = options.find((option) => option.isAvailable);
        const newSelectedAttributes = { ...selectedAttributes.value };
        newSelectedAttributes[lowerAttribute] = availableOption
          ? availableOption.value
          : null;
        selectedAttributes.value = newSelectedAttributes;
      });
  }
  const variant = props.item.variants.find((v) =>
    Object.keys(selectedAttributes.value).every((attribute) =>
      attribute === "color"
        ? v[attribute]?.name === selectedAttributes.value[attribute]?.name
        : v[attribute] === selectedAttributes.value[attribute]
    )
  );
  selectedVariant.value = variant || props.item.variants[0];
  if (selectedVariant.value && selectedVariant.value.image) {
    galleryActiveImage.value = selectedVariant.value.image;
  } else {
    galleryActiveImage.value = props.item.image;
  }
}
function optionKey(attribute, option) {
  return attribute === "color" ? option.value.name : option.value;
}
onMounted(() => {
  if (props.item.variants && props.item.variants.length) {
    const defaultVariant = props.item.variants[0];
    Object.keys(defaultVariant).forEach((attribute) => {
      if (
        availableAttributes.value.includes(attribute) &&
        selectableAttributes.includes(attribute)
      ) {
        selectedAttributes.value[attribute] = defaultVariant[attribute];
      }
    });
    selectedVariant.value = defaultVariant;
    galleryActiveImage.value = defaultVariant.image || props.item.image;
  }
});
</script>

<style scoped>
/* Modal Overlay & Content */
.modal {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999 !important;
}
.modal-content {
  background: white;
  padding: 2rem;
  min-width: 1300px;
  width: auto;
  overflow-y: auto;
  position: relative;
  display: flex;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Inline Layout & Styling (applied inside the modal) */
.section {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  padding: 0 2rem;
}
.checkout-divider {
  width: 1px;
  background-color: #ddd;
  align-self: stretch;
}
.right-section {
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 2rem;
  padding-top: 3rem;
  flex: 1;
}

/* Image Gallery Styles */
.gallery {
  position: relative;
  background: white;
  flex: 1;
}
.main-image {
  position: relative;
  width: 100%;
  height: auto;
  margin-top: 3rem;
}
.main-image img {
  width: 100%;
  height: 100%;
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
}
.thumbnail {
  min-width: 70px;
  min-height: 70px;
  max-width: 70px;
  max-height: 70px;
  cursor: pointer;
  object-fit: cover;
  transition: border-color 0.3s ease;
  border: 2px solid #000;
  background: white;
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

/* Basic Info Styles */
.basic-info {
  margin-bottom: 1rem;
  color: black;
}
.product-name {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: black;
}
.product-description {
  font-size: 1.3rem;
  line-height: 1.5rem;
  color: black;
}
.ratings-row {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid black;
  padding-bottom: 0.2rem;
}
.stars-container {
  display: flex;
  height: 20px;
  width: 100px;
}
.star-icon {
  width: 100%;
  margin: 0 !important;
}
.rating-number,
.ratings-row span {
  font-size: 1rem;
  margin-left: 8px;
  color: black;
}

/* Variants Styles */
.variant-selector {
  margin-top: 20px;
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
  color: #ccc;
  font-weight: lighter;
}
.current-attribute {
  color: white;
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
  position: relative;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}
.color {
  width: 110%;
  height: 110%;
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

/* Quantity & Add-To-Cart Styles */
.item-quantity {
  display: flex;
  gap: 1rem;
  align-items: center;
  text-align: center;
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
  background: #3f654c;
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
.input-wrapper input[type="email"] {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
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
  padding: 12px 20px;
  background-color: #3f654c;
  color: black;
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
  color: black;
  font-weight: bold;
}
.old-price {
  color: black;
  text-decoration: line-through;
  margin-right: 5px;
}

/* Responsive Styles */
@media (max-width: 1300px) {
  .main-image {
    width: 500px;
    height: 450px;
  }
  .thumbnails-overlay {
    width: 70px;
  }
  .thumbnail {
    min-width: 60px;
    min-height: 60px;
    max-width: 60px;
    max-height: 60px;
  }
}
@media (max-width: 1024px) {
  .main-image {
    width: 100%;
    height: auto;
    min-height: 25rem;
  }
  .thumbnails-overlay {
    width: 100px;
  }
  .product-name {
    font-size: 3rem;
  }
  .product-description {
    font-size: 1.5rem;
  }
}
@media (max-width: 768px) {
  .product-name {
    font-size: 2.5rem;
  }
  .product-description {
    font-size: 1.25rem;
  }
  .thumbnail {
    min-width: 50px;
    min-height: 50px;
    max-width: 50px;
    max-height: 50px;
  }
}
@media (max-width: 480px) {
  .product-name {
    font-size: 2rem;
  }
  .product-description {
    font-size: 1rem;
  }
  .thumbnail {
    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;
  }
}
</style>
