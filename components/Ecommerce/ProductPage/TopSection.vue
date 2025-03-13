<template>
  <section class="section">
    <!-- Inline Image Gallery -->
    <div class="gallery">
      <div class="main-image">
        <img :src="getImagePath(computedGalleryImage)" alt="Product Image" />
        <div class="thumbnails-overlay">
          <button v-if="canScrollUp" class="scroll-arrow up" @click="scrollUp">
            &uarr;
          </button>
          <div class="thumbnails-container" ref="thumbnailContainer">
            <img
              v-for="(img, index) in item && item.moreImages
                ? item.moreImages
                : []"
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

    <section class="right-section">
      <div>
        <!-- Inline Basic Info -->
        <div class="basic-info">
          <h1 class="product-name">{{ item.name }}</h1>
          <div class="ratings-row">
            <div class="stars-container">
              <img
                v-for="(star, index) in starImages"
                :key="index"
                :src="star"
                alt="Star"
                class="star-icon"
              />
            </div>
            <span v-if="item && item.reviewCount" class="rating-number">
              ({{ (item.reviewCount || 0).toFixed(0) }})
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

        <!-- Inline Variant Selector -->
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

      <!-- Quantity & Add-To-Cart -->
      <div>
        <div class="item-quantity">
          <button @click="handleDecreaseQuantity">-</button>
          <p v-if="itemInCart">{{ itemInCart.quantity }}</p>
          <p v-else>0</p>
          <button @click="handleIncreaseQuantity">+</button>
        </div>
        <div v-if="isOutOfStock" class="notify-wrapper">
          <p>
            This item is currently out of stock. Enter your email to be notified
            when it becomes available:
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
          Add To Cart
        </button>
      </div>
    </section>
  </section>
</template>
  
  <script setup>
const props = defineProps({
  item: { type: Object, required: true },
  itemInCart: { type: Object, default: null },
  isOutOfStock: { type: Boolean, default: false },
});
const emit = defineEmits([
  "decrease-quantity",
  "increase-quantity",
  "notify-me",
  "add-to-cart",
]);

// Create a local reactive copy of the item so we can modify its image/price if needed.
const localItem = ref({ ...props.item });

// Setup selected variant, price, and image defaults
const selectedVariant = ref(
  localItem.value.variants && localItem.value.variants.length
    ? localItem.value.variants[0]
    : {}
);
const email = ref("");
if (localItem.value.variants && localItem.value.variants.length > 0) {
  const defaultVariant = localItem.value.variants[0];
  if (defaultVariant.image && defaultVariant.image.trim() !== "") {
    localItem.value.image = defaultVariant.image;
  }
  localItem.value.price = defaultVariant.price;
  selectedVariant.value = defaultVariant;
}

const computedGalleryImage = computed(() => {
  if (
    selectedVariant.value &&
    selectedVariant.value.image &&
    selectedVariant.value.image.trim() !== ""
  ) {
    return selectedVariant.value.image;
  } else if (
    localItem.value &&
    localItem.value.image &&
    localItem.value.image.trim() !== ""
  ) {
    return localItem.value.image;
  }
  return "default.webp";
});
const galleryActiveImage = ref(computedGalleryImage.value);
watch(computedGalleryImage, (newVal) => {
  galleryActiveImage.value = newVal;
});
const getImagePath = (img) => `/ItemPics/${img || ""}`;
const thumbnailContainer = ref(null);
const scrollPosition = ref(0);
function hoverImage(img) {
  galleryActiveImage.value = img;
}
function resetImage() {
  galleryActiveImage.value = computedGalleryImage.value;
}
function scrollUp() {
  if (thumbnailContainer.value) {
    thumbnailContainer.value.scrollBy({ top: -60, behavior: "smooth" });
    scrollPosition.value -= 60;
  }
}
function scrollDown() {
  if (thumbnailContainer.value) {
    thumbnailContainer.value.scrollBy({ top: 60, behavior: "smooth" });
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

// Star Rating Logic
function getStarImages(rating) {
  const fullStar = "/FullStar.svg";
  const halfStar = "/HalfStar.svg";
  const emptyStar = "/EmptyStar.svg";
  const starImgs = [];
  const roundedRating = Math.round(rating * 2) / 2;
  for (let i = 0; i < 5; i++) {
    if (roundedRating - i >= 1) {
      starImgs.push(fullStar);
    } else if (roundedRating - i === 0.5) {
      starImgs.push(halfStar);
    } else {
      starImgs.push(emptyStar);
    }
  }
  return starImgs;
}
const starImages = computed(() => {
  const rating = localItem.value.ratings || 0;
  return getStarImages(rating);
});

// Variant Selector Logic
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
    localItem.value.variants.some((variant) => variant[attribute])
  );
});
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const getOptions = (attribute) => {
  const options = localItem.value.variants
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
  const isOutOfStock = localItem.value.variants.every((variant) => {
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
  return localItem.value.variants.some((variant) => {
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
    const availableVariant = localItem.value.variants.find((variant) =>
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
  const variant = localItem.value.variants.find((v) =>
    Object.keys(selectedAttributes.value).every((attr) =>
      attr === "color"
        ? v[attr]?.name === selectedAttributes.value[attr]?.name
        : v[attr] === selectedAttributes.value[attr]
    )
  );
  selectedVariant.value = variant || localItem.value.variants[0];
  if (selectedVariant.value && selectedVariant.value.image) {
    galleryActiveImage.value = selectedVariant.value.image;
  } else {
    galleryActiveImage.value = localItem.value.image;
  }
}

function optionKey(attribute, option) {
  return attribute === "color" ? option.value.name : option.value;
}

onMounted(() => {
  if (localItem.value.variants && localItem.value.variants.length) {
    const defaultVariant = localItem.value.variants[0];
    Object.keys(defaultVariant).forEach((attribute) => {
      if (
        availableAttributes.value.includes(attribute) &&
        selectableAttributes.includes(attribute)
      ) {
        selectedAttributes.value[attribute] = defaultVariant[attribute];
      }
    });
    selectedVariant.value = defaultVariant;
    galleryActiveImage.value = defaultVariant.image || localItem.value.image;
  }
});

// Emit event wrappers so that the parent receives the correct payloads
function handleDecreaseQuantity() {
  emit("decrease-quantity", localItem.value);
}
function handleIncreaseQuantity() {
  emit("increase-quantity", localItem.value);
}
function handleAddToCart() {
  emit("add-to-cart", localItem.value);
}
function handleNotifyMe() {
  emit("notify-me", { item: localItem.value, email: email.value });
}
</script>
  
  <style scoped>
/* Wrapper & Layout */
.section {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  padding: 0 2rem;
}
.right-section {
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 2rem;
  padding-top: 3rem;
}

/* Image Gallery Styles */
.gallery {
  position: relative;
  background: white;
  margin-right: 2rem;
  border-right: 1px solid black;
}
.main-image {
  position: relative;
  width: 600px;
  height: 550px;
  margin-right: 2rem;
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
  font-size: 1.5rem;
  line-height: 1.3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: black;
  font-family: "Poppins", serif;
}

.pricing {
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.pricing .new {
  font-size: 2.3rem;
  font-weight: bold;
  margin-right: 1rem;
  font-family: "Poppins", serif;
}

.pricing .old {
  font-size: 1.8rem;
  color: gray;
  font-weight: lighter;
  text-decoration: line-through;
  font-family: "Poppins", serif;
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

/* Variant Selector Styles */
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
  color: black;
  font-size: 1rem;
  font-weight: bold;
  font-family: "Poppins", serif;
}
.current-attribute {
  color: black;
  font-weight: lighter;
  font-size: 1rem;
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
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding: 3px;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-content: center;
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
  color: black;
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
  text-align: center;
}
.add-to-cart-button:hover {
  background-color: #555;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
}
</style>
  