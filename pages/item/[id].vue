<template>
  <div class="wrapper">
    <!-- Top Section: Image, Basic Info, Variants, Quantity & Cart -->
    <EcommerceProductPageTopSection
      :item="item"
      :item-in-cart="itemInCart"
      :is-out-of-stock="isOutOfStock"
      @decrease-quantity="decreaseQuantity"
      @increase-quantity="increaseQuantity"
      @notify-me="notifyMe"
      @add-to-cart="addToCart"
    />

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
const { data: item, error: itemError } = await useFetch(
  `/api/items/${useRoute().params.id}`
);
const { data: reviewsData, error: reviewsError } = await useFetch(
  `/api/reviews?itemId=${item.value ? item.value._id : ""}`
);
const reviews = ref(reviewsData.value || []);
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

const isItemOwner = ref(false);
const isPro = ref(false);
const isLoggedIn = computed(() => !!useUserStore().token);
const tagDescriptions = ref([]);
const existingReview = computed(() => {
  if (isLoggedIn.value && reviews.value) {
    const found = reviews.value.find(
      (review) => review.reviewer?._id === useUserStore().user?._id
    );
    return found || null;
  }
  return null;
});

// Setup default variant and image (for SEO/structured data purposes)
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
const getImagePath = (img) => `/ItemPics/${img || ""}`;

// Dummy placeholders for functions that are now handled in the top section
function hoverImage(img) {}
function resetImage() {}
function scrollUp() {}
function scrollDown() {}
const canScrollUp = computed(() => false);
const canScrollDown = computed(() => false);

function getStarImages(rating) {
  const fullStar = "/Graphics/FullStar.svg";
  const halfStar = "/Graphics/HalfStar.svg";
  const emptyStar = "/Graphics/EmptyStar.svg";
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

function decreaseQuantity(itemParam) {
  console.log("Decrease quantity for", itemParam);
}
function increaseQuantity(itemParam) {
  console.log("Increase quantity for", itemParam);
}
function addToCart(itemParam) {
  console.log("Add to cart", itemParam);
}
function notifyMe(payload) {
  console.log("Notify me for", payload);
}
function goToItem(itemId) {
  useRouter().push(`/item/${itemId}`);
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
.wrapper {
  font-family: "Roboto", sans-serif;
  background: white;
}
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
.item-price {
  font-size: 1.2rem;
  color: #ff6200;
  font-weight: bold;
}
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
.FAQ {
  background: white;
}
</style>
