<template>
  <div class="wrapper">
    <!-- EcommerceProduct Image and Basic Info -->
    <section class="section">
      <EcommerceProductImageGallery
        :image="item.image"
        :images="item.moreImages"
      />
      <section class="right-section">
        <div>
          <EcommerceProductBasicInfo :item="item" />
          <EcommerceProductVariants
            v-if="item.variants && item.variants.length"
            :variants="item.variants"
            @variant-selected="updateSelectedVariant"
          />
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
            item.savingsAmount.toFixed(2)
          }})
        </p>
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

    <EcommerceProductFrequentlyBoughtTogether
      class=""
      v-if="
        item.frequentlyBoughtTogether &&
        item.frequentlyBoughtTogether.length > 0
      "
      :itemIds="item.frequentlyBoughtTogether"
    />

    <!-- Policies -->
    <!-- <section class="section"> -->
    <!-- <EcommerceProductReturnPolicy
        v-if="item.returnPolicy"
        :policy="item.returnPolicy"
      /> -->
    <!-- <EcommerceProductWarrantyInfo v-if="item.warranty" :warranty="item.warranty" /> -->
    <!-- </section> -->

    <!-- Frequently Bought Together and Promotions -->
    <!-- <section class="section"> -->
    <!-- <EcommerceProductPreOrderInfo
        v-if="item.preOrder && item.preOrder.available"
        :preOrder="item.preOrder"
      /> -->
    <!-- </section> -->

    <!-- Shipping and Handling -->
    <!-- <section class="section"> -->
    <!-- <EcommerceProductShippingInfo
        v-if="item.shippingInfo"
        :shippingInfo="item.shippingInfo"
      /> -->
    <!-- <EcommerceProductLifecycleStatus
        v-if="item.lifecycleStatus !== 'Active'"
        :status="item.lifecycleStatus"
      /> -->
    <!-- </section> -->

    <!-- Media -->
    <!-- <section class="section"> -->
    <!-- <EcommerceProductVideos
        v-if="item.productVideos && item.productVideos.length"
        :videos="item.productVideos"
      /> -->
    <!-- <EcommerceProductARLinks
        v-if="item.arLinks && item.arLinks.length"
        :arLinks="item.arLinks"
      /> -->
    <!-- <EcommerceProduct3DModelLinks
        v-if="item.model3DLinks && item.model3DLinks.length"
        :modelLinks="item.model3DLinks"
      /> -->
    <!-- </section> -->

    <!-- External Links and Support -->
    <!-- <section class="section"> -->
    <!-- <EcommerceProductExternalLinks
        v-if="item.externalLinks && item.externalLinks.length"
        :links="item.externalLinks"
      /> -->
    <!-- <EcommerceProductCustomerSupport
        v-if="item.customerSupport"
        :support="item.customerSupport"
      /> -->
    <!-- </section> -->

    <section class="tabs-section">
      <ReviewForm
        :item="item"
        :tagDescriptions="tagDescriptions"
        :isItemOwner="isItemOwner"
        :existingReview="existingReview"
        :isPro="isPro"
      />
    </section>
    <section class="reviews-section">
      <ReviewReviewsSection
        :item="item"
        :tagDescriptions="tagDescriptions"
        :isItemOwner="isItemOwner"
        :reviews="reviews"
        :isPro="isPro"
      />
    </section>

    <div class="divider point-bot"></div>

    <!--prettier-ignore-->
    <section class="FAQ">
      <WebSectionsFAQ />
    </section>
  </div>
</template>

<script setup>
// Fetch the item data
const route = useRoute();
const itemStore = useItemStore();
const userStore = useUserStore();

const { data: item } = await useFetch(`/api/items?_id=${route.params.id}`);
const { data: reviews } = await useFetch(
  `/api/reviews?itemId=${item.value._id}`
);

const isItemOwner = ref(false);
const isPro = ref(false);
const isLoggedIn = computed(() => !!userStore.token);

const selectedVariant = ref(
  item.value.variants ? item.value.variants[0] : null
);
const email = ref("");

if (item.value.variants && item.value.variants.length > 0) {
  item.value.image = item.value.variants[0].image;
  item.value.price = item.value.variants[0].price;
  selectedVariant.value = item.value.variants[0]; // Ensure selectedVariant is set initially
}

function updateSelectedVariant(variant) {
  // console.log("variant: " + JSON.stringify(variant));
  selectedVariant.value = variant;
  item.value.image = variant.image;
  item.value.price = variant.price;
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

const existingReview = computed(() => {
  if (isLoggedIn.value.value && reviews.value) {
    return (
      reviews.value.find(
        (review) => review.reviewer._id === userStore.user._id
      ) || null
    );
  }
  return null;
});

// Computed property for checking if item is in cart
const itemInCart = computed(() => {
  return itemStore.cart.find(
    (cartItem) =>
      cartItem._id === item.value?._id &&
      cartItem.variantId === selectedVariant.value?._id
  );
});

const increaseQuantity = () => {
  if (selectedVariant.value) {
    if (itemInCart.value) {
      itemStore.updateQuantity({
        itemId: item.value._id,
        variantId: selectedVariant.value._id,
        quantity: itemInCart.value.quantity + 1,
      });
    } else {
      addToCart(item.value, selectedVariant.value._id);
    }
  } else {
    if (itemInCart.value) {
      itemStore.updateQuantity({
        itemId: item.value._id,
        quantity: itemInCart.value.quantity + 1,
      });
    } else {
      addToCart(item.value);
    }
  }
};

const decreaseQuantity = () => {
  if (selectedVariant.value) {
    if (itemInCart.value && itemInCart.value.quantity > 1) {
      itemStore.updateQuantity({
        itemId: item.value._id,
        variantId: selectedVariant.value._id,
        quantity: itemInCart.value.quantity - 1,
      });
    } else if (itemInCart.value && itemInCart.value.quantity === 1) {
      removeFromCart(item.value._id, selectedVariant.value._id);
    }
  } else {
    if (itemInCart.value && itemInCart.value.quantity > 1) {
      itemStore.updateQuantity({
        itemId: item.value._id,
        quantity: itemInCart.value.quantity - 1,
      });
    } else if (itemInCart.value && itemInCart.value.quantity === 1) {
      removeFromCart(item.value._id);
    }
  }
};

const removeFromCart = (itemId, variantId) => {
  itemStore.removeFromCart(itemId, variantId);
};

onMounted(addToRecentlyViewedItems);

async function addToRecentlyViewedItems() {
  // console.log("Item: " + JSON.stringify(item));

  const recentlyViewedItem = {
    item: item.value._id,
    name: item.value.name,
    image: item.value.image,
  };

  // console.log("recentlyViewedItem: " + JSON.stringify(recentlyViewedItem));

  if (userStore.user) {
    try {
      const userResponse = await $fetch(
        `/api/users/recentlyViewed/add/${userStore.user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: { recentlyViewedItem },
        }
      );
      userStore.setUser(userResponse);
    } catch (error) {
      console.log("error......");
      console.error("Error adding user to recently viewed items:", error);
    }
  }
}

function addToCart() {
  if (isLoggedIn.value) {
    userStore.addToCart(props.item, selectedVariant.value);
  } else {
    itemStore.addToCart(props.item, selectedVariant.value);
  }
}

// SEO Metadata
useSeoMeta({
  title: item.value.metaTitle || "",
  description: item.value.metaDescription || item.value.preview,
  image: item.value.image,
});

// Structured Data
const structuredData = computed(() => {
  // Fallback to item data if no variants are selected or available
  const hasVariants = item.value.variants && item.value.variants.length > 0;
  const variant = hasVariants ? selectedVariant.value : null;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: item.value.name,
    description: item.value.description || item.value.preview,
    image: variant ? variant.image : item.value.image, // Use variant image if available
    sku: variant?.sku || item.value.sku || null, // Use variant SKU if available
    brand: {
      "@type": "Brand",
      name: "National Auto Hub",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: variant ? variant.price : item.value.price, // Use variant price if available
      priceValidUntil: "2024-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        variant && variant.stock > 0
          ? "https://schema.org/InStock"
          : item.value.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock", // Handle stock for both variant and item
      seller: {
        "@type": "Organization",
        name: "National Auto Hub",
      },
    },
  };
});

// Inject structured data into the head
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
  /* background-color: #545454; */
  background: white;
  border-top: 2px solid white;
}

.section {
  max-width: 1300px;
  margin: 2rem auto;
  display: flex;
  gap: 3rem;
  padding: 0 2rem;
}

.right-section {
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
}

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
  text-align: center;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
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

.savings-text {
  margin-top: 10px;
  color: green; /* Green text color */
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
  background-color: #3f654c; /* Button background color */
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

.tabs-section {
  text-align: left;
  max-width: 1400px;
  padding: 2rem;
  margin: 0 auto;
  margin-top: 40px;
}

@media (max-width: 768px) {
}

@media (max-width: 480px) {
}

.divider {
  width: 100%;
  height: 10rem;
}

.FAQ {
  background: white;
}

/* Responsive Styles */

/* Tablets */
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

/* Mobile Large */
@media (max-width: 768px) {
  .section {
    gap: 1rem;
    padding: 0 1.5rem;
  }

  .tabs-section {
    padding: 1rem 1.5rem;
  }

  .right-section {
    /* padding: 1rem; */
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

/* Mobile Small */
@media (max-width: 480px) {
  .wrapper {
    /* padding: 1rem; */
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
