<template>
  <div class="wrapper">
    <!-- Main Section: Image, Basic Info, Variants, Quantity & Cart -->
    <section class="section">
      <!-- Inline Image Gallery -->
      <div class="gallery">
        <div class="main-image">
          <img :src="getImagePath(computedGalleryImage)" alt="Product Image" />
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
            <p class="product-description">
              {{ item.description }}
            </p>
          </div>

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

                <h2 v-if="attribute == 'color'" class="current-attribute">
                  {{ selectedAttributes[attribute] }}
                </h2>

                <h2 v-else class="current-attribute">
                  {{ selectedAttributes[attribute] }}
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
                    :style="{
                      backgroundColor:
                        '#' +
                        (option && option.hex ? option.hex : 'transparent'),
                    }"
                    class="color"
                  ></div>
                  <div v-else class="option">
                    <div class="option-text">{{ option }}</div>
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

        <!-- Savings Message -->
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

        <!-- Quantity & Add-To-Cart -->
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
            | Add To Cart
          </button>
        </div>
      </section>
    </section>

    <!-- Inline Frequently Bought Together -->
    <div
      v-if="
        item.frequentlyBoughtTogether &&
        item.frequentlyBoughtTogether.length > 0
      "
    >
      <div class="frequently-bought-wrapper">
        <h2>Frequently Bought Together</h2>
        <div
          v-if="frequentlyBoughtItems.length > 0"
          class="frequently-bought-list"
        >
          <div
            v-for="fbItem in frequentlyBoughtItems"
            :key="fbItem._id"
            class="frequently-bought-item"
            @click="goToItem(fbItem._id)"
          >
            <div class="image-wrapper">
              <img
                :src="getFBImagePath(fbItem.image)"
                alt="Product Image"
                class="item-image"
              />
            </div>
            <div class="item-info">
              <!-- <p class="item-name">{{ fbItem.name }}</p> -->
              <p class="item-price">${{ fbItem.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Loading items...</p>
        </div>
      </div>
    </div>

    <!-- Reviews & FAQ Sections -->
    <section class="tabs-section">
      <ReviewForm
        :item="item.value || {}"
        :tagDescriptions="tagDescriptions"
        :isItemOwner="isItemOwner"
        :existingReview="existingReview"
        :isPro="isPro"
      />
    </section>
    <section class="reviews-section">
      <ReviewReviewsSection
        :item="item.value || {}"
        :tagDescriptions="tagDescriptions"
        :isItemOwner="isItemOwner"
        :reviews="reviews.value || []"
        :isPro="isPro"
      />
    </section>

    <div class="divider point-bot"></div>

    <!-- FAQ Section -->
    <section class="FAQ">
      <WebSectionsFAQ />
    </section>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const itemStore = useItemStore();
const userStore = useUserStore();

// Fetch the item (SSR will have data before render)
const { data: item, error: itemError } = await useFetch(
  `/api/items/${route.params.id}`
);

// Fetch reviews for this item
const { data: reviewsData, error: reviewsError } = await useFetch(
  `/api/reviews?itemId=${item.value ? item.value._id : ""}`
);
const reviews = ref(reviewsData.value || []);

// SSR fetch for Frequently Bought Together items
const frequentlyBoughtItems = ref([]);
if (
  item.value &&
  item.value.frequentlyBoughtTogether &&
  item.value.frequentlyBoughtTogether.length > 0
) {
  frequentlyBoughtItems.value = await Promise.all(
    item.value.frequentlyBoughtTogether.map((fbId) =>
      $fetch(`/api/items/${fbId}`)
    )
  );
}

// User flags and review info
const isItemOwner = ref(false);
const isPro = ref(false);
const isLoggedIn = computed(() => !!userStore.token);
const tagDescriptions = ref([]);
const existingReview = computed(() => {
  if (isLoggedIn.value && reviews.value) {
    const found = reviews.value.find(
      (review) => review.reviewer?._id === userStore.user?._id
    );
    return found || null;
  }
  return null;
});

// Setup selected variant, price, and image defaults
const selectedVariant = ref(
  item.value && item.value.variants && item.value.variants.length
    ? item.value.variants[0]
    : null
);
const email = ref("");
if (item.value && item.value.variants && item.value.variants.length > 0) {
  const defaultVariant = item.value.variants[0];
  if (defaultVariant.image && defaultVariant.image.trim() !== "") {
    item.value.image = defaultVariant.image;
  }
  item.value.price = defaultVariant.price;
  selectedVariant.value = defaultVariant;
}
function updateSelectedVariant(variant) {
  selectedVariant.value = variant;
  if (variant) {
    if (variant.image && variant.image.trim() !== "") {
      item.value.image = variant.image;
    }
    item.value.price = variant.price;
  }
}

// Combined computedGalleryImage with default fallback
const computedGalleryImage = computed(() => {
  if (
    selectedVariant.value &&
    selectedVariant.value.image &&
    selectedVariant.value.image.trim() !== ""
  ) {
    return selectedVariant.value.image;
  } else if (item.value && item.value.image && item.value.image.trim() !== "") {
    return item.value.image;
  }
  return "default.webp";
});

// Gallery active image using computedGalleryImage
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
onMounted(() => {
  if (thumbnailContainer.value) {
    scrollPosition.value = thumbnailContainer.value.scrollTop;
  }
});

// Inline Basic Info Logic (Stars)
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
  if (!item.value) return [];
  const rating = item.value.ratings || 0;
  return getStarImages(rating);
});

// Inline Variant Selector Logic
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
  return attributes.filter(
    (attribute) =>
      item.value &&
      item.value.variants &&
      item.value.variants.some((variant) => variant[attribute])
  );
});
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const getOptions = (attribute) => {
  const options =
    item.value && item.value.variants
      ? item.value.variants
          .map((variant) => variant[attribute])
          .filter((option) => option !== undefined && option !== null)
      : [];
  // For color, ensure each option is an object { name, hex }
  const normalizedOptions =
    attribute === "color"
      ? options.map((opt) =>
          typeof opt === "string" ? { name: opt, hex: "" } : opt
        )
      : options;
  const uniqueOptions = Array.from(
    new Set(normalizedOptions.map((option) => JSON.stringify(option)))
  ).map((str) => JSON.parse(str));
  return uniqueOptions
    .map((option) => {
      const isAvailable =
        availableAttributes.value[0] === attribute ||
        checkAvailability(attribute, option);
      let isOutOfStock = false;
      if (isAvailable) {
        isOutOfStock = checkStock(attribute, option);
      }
      return { value: option, isAvailable, isOutOfStock };
    })
    .sort((a, b) => {
      if (a.isAvailable && !b.isAvailable) return -1;
      if (!a.isAvailable && b.isAvailable) return 1;
      if (a.isAvailable && b.isAvailable) return a.isOutOfStock ? 1 : -1;
      return 0;
    });
};

// Guarded checkAvailability for "color" options
const checkAvailability = (attribute, option) => {
  if (attribute === "color" && (!option || !option.name)) {
    console.log(
      "DEBUG: checkAvailability - invalid option for color:",
      JSON.stringify(option)
    );
    return false;
  }
  const attributeIndex = availableAttributes.value.indexOf(attribute);
  if (attributeIndex === 0) return true;
  return item.value && item.value.variants
    ? item.value.variants.some((variant) => {
        const matchesCurrentOption =
          attribute === "color"
            ? variant[attribute]?.name === option.name
            : variant[attribute] === option;
        if (!matchesCurrentOption) return false;
        const matchesPreviousAttributes = availableAttributes.value
          .slice(0, attributeIndex)
          .every((prevAttribute) => {
            const selectedValue = selectedAttributes.value[prevAttribute];
            if (prevAttribute === "color") {
              return selectedValue
                ? selectedValue.name === variant[prevAttribute]?.name
                : false;
            }
            return selectedValue === variant[prevAttribute];
          });
        return matchesCurrentOption && matchesPreviousAttributes;
      })
    : false;
};
// Guarded checkStock for "color" options
const checkStock = (attribute, option) => {
  if (attribute === "color" && (!option || !option.name)) {
    console.log(
      "DEBUG: checkStock - invalid option for color:",
      JSON.stringify(option)
    );
    return false;
  }
  const attributeIndex = availableAttributes.value.indexOf(attribute);
  const isOut =
    item.value && item.value.variants
      ? item.value.variants.every((variant) => {
          let isMatching = true;
          for (let i = 0; i <= attributeIndex; i++) {
            const currentAttr = availableAttributes.value[i];
            const selectedValue = selectedAttributes.value[currentAttr];
            if (currentAttr === "color") {
              const optionMatches =
                currentAttr === attribute
                  ? variant[currentAttr]?.name === option.name
                  : variant[currentAttr]?.name ===
                    (selectedValue ? selectedValue.name : undefined);
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
        })
      : true;
  return isOut;
};
const isSelected = (attribute, optionValue) => {
  if (attribute === "color") {
    if (!optionValue || typeof optionValue !== "object") {
      console.log(
        `DEBUG: isSelected for "color" received invalid optionValue: ${JSON.stringify(
          optionValue
        )}`
      );
      return false;
    }
    if (
      !selectedAttributes.value[attribute] ||
      !selectedAttributes.value[attribute].name
    ) {
      console.log(
        `DEBUG: isSelected for "color" has invalid selectedAttributes: ${JSON.stringify(
          selectedAttributes.value[attribute]
        )}`
      );
      return false;
    }
    return selectedAttributes.value[attribute].name === optionValue.name;
  }
  return selectedAttributes.value[attribute] === optionValue;
};
function selectOption(attribute, option) {
  console.log(
    `DEBUG: selectOption called with attribute: ${attribute}, option: ${JSON.stringify(
      option
    )}`
  );
  // For unavailable options, try to set attributes from an available variant
  if (!option.isAvailable) {
    const availableVariant =
      item.value && item.value.variants
        ? item.value.variants.find((variant) =>
            attribute === "color"
              ? typeof variant[attribute] === "string"
                ? variant[attribute] === option.value
                : variant[attribute]?.name === option.value?.name
              : variant[attribute] === option.value
          )
        : null;
    console.log(
      `DEBUG: availableVariant found: ${JSON.stringify(availableVariant)}`
    );
    if (availableVariant) {
      const newSelectedAttributes = { ...selectedAttributes.value };
      Object.keys(newSelectedAttributes).forEach((key) => {
        newSelectedAttributes[key] = availableVariant[key];
      });
      selectedAttributes.value = newSelectedAttributes;
    }
  } else {
    // Normalize color: if attribute is color and option.value is a string, convert it
    const normalizedValue =
      attribute === "color" && typeof option.value === "string"
        ? { name: option.value, hex: "" }
        : option.value;
    selectedAttributes.value = {
      ...selectedAttributes.value,
      [attribute]: normalizedValue,
    };
  }
  console.log(
    `DEBUG: updated selectedAttributes: ${JSON.stringify(
      selectedAttributes.value
    )}`
  );
  const attributeIndex = availableAttributes.value.indexOf(attribute);
  if (attributeIndex < availableAttributes.value.length - 1) {
    availableAttributes.value
      .slice(attributeIndex + 1)
      .forEach((lowerAttribute) => {
        const options = getOptions(lowerAttribute);
        const availableOption = options.find((opt) => opt.isAvailable);
        selectedAttributes.value = {
          ...selectedAttributes.value,
          [lowerAttribute]: availableOption ? availableOption.value : null,
        };
        console.log(
          `DEBUG: updated selectedAttributes for lower attribute ${lowerAttribute}: ${JSON.stringify(
            selectedAttributes.value
          )}`
        );
      });
  }
  const variant =
    item.value && item.value.variants
      ? item.value.variants.find((v) =>
          Object.keys(selectedAttributes.value).every((attr) =>
            attr === "color"
              ? typeof v[attr] === "string"
                ? v[attr] === selectedAttributes.value[attr]
                : v[attr]?.name === selectedAttributes.value[attr]?.name
              : v[attr] === selectedAttributes.value[attr]
          )
        )
      : null;
  selectedVariant.value =
    variant ||
    (item.value && item.value.variants ? item.value.variants[0] : null);
  console.log(
    `DEBUG: selectedVariant: ${JSON.stringify(selectedVariant.value)}`
  );
  galleryActiveImage.value = computedGalleryImage.value;
}

function optionKey(attribute, option) {
  if (attribute === "color") {
    if (!option.value) {
      console.log(
        `DEBUG: optionKey for "color": option.value is undefined: ${JSON.stringify(
          option
        )}`
      );
      return "";
    }
    if (!option.value.name) {
      console.log(
        `DEBUG: optionKey for "color": option.value.name is undefined: ${JSON.stringify(
          option.value
        )}`
      );
    }
    return option.value.name || "";
  }
  return option.value;
}

// Recently Viewed & SEO (keep this onMounted)
onMounted(addToRecentlyViewedItems);
async function addToRecentlyViewedItems() {
  const recentlyViewedItem = {
    item: item.value ? item.value._id : null,
    name: item.value ? item.value.name : "",
    image: item.value ? item.value.image : "",
  };
  if (userStore.user) {
    try {
      const userResponse = await $fetch(
        `/api/users/recentlyViewed/add/${userStore.user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: { recentlyViewedItem },
        }
      );
      userStore.setUser(userResponse);
    } catch (error) {
      console.error("[Component] Error adding item to recently viewed:", error);
    }
  }
}
function goToItem(itemId) {
  router.push(`/item/${itemId}`);
}
function getFBImagePath(imagePath) {
  return "/" + (imagePath || "");
}
useSeoMeta({
  title: item.value ? item.value.metaTitle : "",
  description: item.value
    ? item.value.metaDescription || item.value.preview || ""
    : "",
  image: item.value ? item.value.image : "",
});
const structuredData = computed(() => {
  const hasVariants =
    item.value && item.value.variants && item.value.variants.length > 0;
  const variant = hasVariants ? selectedVariant.value : null;
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: item.value ? item.value.name : "",
    description: item.value
      ? item.value.description || item.value.preview || ""
      : "",
    image:
      variant && variant.image
        ? variant.image
        : item.value && item.value.image
        ? item.value.image
        : "",
    sku:
      variant && variant.sku
        ? variant.sku
        : item.value && item.value.sku
        ? item.value.sku
        : null,
    brand: { "@type": "Brand", name: "National Auto Hub" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price:
        variant && variant.price
          ? variant.price
          : item.value && item.value.price
          ? item.value.price
          : 0,
      priceValidUntil: "2024-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        variant && variant.stock > 0
          ? "https://schema.org/InStock"
          : item.value && item.value.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "National Auto Hub" },
    },
  };
});
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.value),
    },
  ],
});
const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
/* Wrapper & Layout */
.wrapper {
  font-family: "Roboto", sans-serif;
  background: white;
  /* margin-top: 5rem; */
}
.section {
  max-width: 1300px;
  margin: 0rem auto;
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
  /* border: 1px solid black; */
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
  font-family: "Montserrat", serif;
}

.product-description {
  font-size: 1.3rem;
  line-height: 1.5rem;
  color: black;
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
  color: white;
  font-weight: bold;
}
.old-price {
  color: black;
  text-decoration: line-through;
  margin-right: 5px;
}

/* Frequently Bought Together Styles */
.frequently-bought-wrapper {
  padding: 1rem 5rem;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.3),
    rgba(255, 255, 255, 0.3),
    rgba(0, 0, 0, 0.3)
  );
  animation: gradientMove 10s ease infinite;
  background-size: 400% 400%;
  width: 100%;
}
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.frequently-bought-list {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  width: 100%;
  margin: 0 auto;
}
.frequently-bought-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  min-width: 15%;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.frequently-bought-item:hover {
  transform: translateY(-5px);
  background-color: rgba(255, 255, 255, 0.2);
}
.image-wrapper {
  width: 100%;
  height: 120px;
}
.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
}
.item-name {
  font-size: 1rem;
  color: #fff;
  font-weight: bold;
  text-align: center;
}
.item-price {
  font-size: 1.2rem;
  color: #ff6200;
  font-weight: bold;
}

/* Tabs & Divider */
.tabs-section {
  text-align: left;
  max-width: 1400px;
  padding: 2rem;
  margin: 0 auto;
  margin-top: 40px;
}
.divider {
  width: 100%;
  height: 10rem;
}

/* FAQ Section */
.FAQ {
  background: white;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .section {
    flex-direction: column;
    gap: 1.5rem;
  }
  .right-section {
    width: 100%;
  }
  .add-to-cart-button {
    font-size: 1.2rem;
  }
}
@media (max-width: 768px) {
  .section {
    gap: 1rem;
    padding: 0 1.5rem;
  }
  .tabs-section {
    padding: 1rem 1.5rem;
  }
  .add-to-cart-button {
    font-size: 1.1rem;
  }
  .item-quantity button {
    font-size: 20px;
    width: 1.8rem;
    height: 1.8rem;
  }
}
@media (max-width: 480px) {
  .wrapper {
    /* optional padding adjustments */
  }
  .tabs-section {
    padding: 0.5rem 1rem;
  }
  .section {
    gap: 0.5rem;
    padding: 0 1rem;
  }
  .add-to-cart-button {
    font-size: 1rem;
  }
  .item-quantity button {
    font-size: 18px;
    width: 1.6rem;
    height: 1.6rem;
  }
  .savings-text {
    font-size: 1rem;
  }
}
</style>
