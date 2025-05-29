<template>
  <div
    class="product-card"
    v-if="!loading"
    @pointerdown.capture="handlePointerDown"
    @click.capture="swallowClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    ref="hoverTarget"
  >
    <div class="image-container">
      <!-- Product Image -->
      <img
        :src="'/ItemPics/' + item.image"
        alt="Product Image"
        class="product-image"
      />

      <!-- Sale Ribbon -->
      <img
        v-if="item.oldPrice"
        src="/Graphics/Items/sale.svg"
        alt="Sale"
        class="sale-ribbon"
      />

      <!-- Dark Overlay (Appears on Hover) -->
      <transition name="fade">
        <div v-if="showOverlay" class="overlay">
          <!-- Wishlist Icon -->
          <img
            src="/Graphics/Items/whiteHeart.svg"
            alt="Wishlist"
            class="wishlist-icon"
            @click.stop="trackAndHandleWishlistClick"
          />
          <div class="overlay-content">
            <!-- TITLE (word-by-word, letter-by-letter) -->
            <h3 class="overlay-title">
              {{ item.name }}
            </h3>

            <p class="overlay-description">
              {{ item.description }}
            </p>

            <!-- Star Rating (REPLACED) -->
            <div class="overlay-rating">
              <SubcomponentsStarRating :rating="item.ratings || 0" />
            </div>

            <!-- Buttons -->
            <div class="overlay-buttons-container">
              <button
                v-if="item.variants && item.variants.length > 0"
                @click.stop="trackAndShowVariantModal"
                class="overlay-add-button"
              >
                See Options
              </button>
              <button
                v-else
                @click.stop="trackAndAddToCart"
                class="overlay-add-button"
              >
                Add To Cart
              </button>
              <button
                @click.stop="trackViewContent"
                class="overlay-view-button"
              >
                View Item
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Checkmark (if added to cart) -->
      <img
        :src="resolvedCheckImg()"
        class="checkmark"
        v-if="isAddedToCart"
        alt="Checkmark"
      />
    </div>

    <!-- Product Info Below -->
    <div class="info-section">
      <p class="product-title">{{ item.name }}</p>
      <div class="price-container">
        <p v-if="item.oldPrice" class="old-price">
          ${{ item.oldPrice.toFixed(2) }}
        </p>
        <p class="new-price">${{ item.price.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Variant Modal -->
    <teleport to="body">
      <EcommerceListingsVariantModal
        v-if="showVariantModal"
        :item="item"
        @closeModal="closeVariantModal"
        class="modal-overlay"
      />
    </teleport>
  </div>
</template>

<script setup>
// FIRST, GET WISHLIST BUTTON WORKING ALONG WITH SOME ANIMATION
// SECOND, FIND OUT HOW TO MAKE THE THUMB TAP OPEN THE ITEM OVERLAY INSTEAD OF HOVER WHEN THAT'S RELEVANT
const props = defineProps({ item: Object });
const emit = defineEmits(["openLoginModal"]);

const isAddedToCart = ref(false);
const showVariantModal = ref(false);

const itemStore = useItemStore();
const userStore = useUserStore();
const router = useRouter();
const loading = ref(true);

const { $fbq } = useNuxtApp();
const { $klaviyo } = useNuxtApp();

const showOverlay = ref(false);
const openedByTap = ref(false);
const swallowNextClick = ref(false);
const hoverTarget = ref(null);

// Check if user is logged in
const isLoggedIn = computed(() => !!userStore.user);

function handleMouseEnter() {
  if (!showOverlay.value) showOverlay.value = true;
}

function handleMouseLeave() {
  // only hide if it wasn’t tap-opened
  if (!openedByTap.value) showOverlay.value = false;
}

function handlePointerDown(event) {
  if (event.pointerType !== "touch") return;

  if (!showOverlay.value) {
    showOverlay.value = true;
    openedByTap.value = true;
    swallowNextClick.value = true;

    // listen for any next tap anywhere
    document.addEventListener("pointerdown", handleClickOutside, {
      capture: true,
    });
  }
}

function swallowClick(event) {
  if (swallowNextClick.value) {
    event.stopImmediatePropagation();
    event.preventDefault();
    swallowNextClick.value = false;
  }
}

function handleClickOutside(event) {
  if (
    showOverlay.value &&
    hoverTarget.value &&
    !hoverTarget.value.contains(event.target)
  ) {
    showOverlay.value = false;
    openedByTap.value = false;
    swallowNextClick.value = false;
    document.removeEventListener("pointerdown", handleClickOutside, {
      capture: true,
    });
  }
}

onMounted(() => {
  loading.value = false;
});

// clean up on unmount just in case
onUnmounted(() => {
  document.removeEventListener("pointerdown", handleClickOutside, {
    capture: true,
  });
});

/** Word-based splitting so lines break only between words */
const titleWords = computed(() => {
  if (!props.item.name) return [];
  return props.item.name.split(" ");
});
const descriptionWords = computed(() => {
  const desc = props.item.description || "No description available";
  return desc.split(" ");
});

function resolvedCheckImg() {
  return "/CheckMark.svg";
}

function addToCart(item) {
  if (isLoggedIn.value) {
    userStore.addToCart(item);
  } else {
    itemStore.addToCart(item);
  }
  isAddedToCart.value = true;
}

const isInWishlist = computed(() => {
  if (!userStore.user?.wishlist) return false;
  return userStore.user.wishlist.some((w) => w.item === props.item._id);
});

async function handleWishlistClick() {
  if (!isLoggedIn.value) {
    emit("openLoginModal");
    return;
  }
  const wishlistItem = {
    item: props.item._id,
    name: props.item.name,
    image: props.item.image,
  };
  if (isInWishlist.value) {
    await removeFromWishlistOnServer(props.item._id);
  } else {
    await addToWishlistOnServer(wishlistItem);
  }
}

async function addToWishlistOnServer(wishlistItem) {
  try {
    const updatedWishlist = await $fetch(
      `/api/users/wishlist/add/${userStore.user._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { wishlistItem },
      }
    );
    userStore.user.wishlist = updatedWishlist || [];
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
}

async function removeFromWishlistOnServer(itemId) {
  try {
    const updatedWishlist = await $fetch(
      `/api/users/wishlist/remove/${userStore.user._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { itemId },
      }
    );
    userStore.user.wishlist = updatedWishlist || [];
  } catch (error) {
    console.error("Error removing from wishlist:", error);
  }
}

function goToItem(itemId) {
  router.push(`/item/${itemId}`);
}

function closeVariantModal() {
  showVariantModal.value = false;
}

/** Tracking Functions */
function trackViewContent() {
  const viewContentData = {
    content_type: "product",
    content_id: props.item._id,
    content_name: props.item.name || "Untitled Product",
    content_category: props.item.category || "Uncategorized",
    price: props.item.price || 0,
    currency: "USD",
  };

  // Track with Klaviyo
  $klaviyo("track", "ViewContent", viewContentData);

  // Track with Meta Pixel
  $fbq("track", "ViewContent", viewContentData);

  // Navigate to product page
  goToItem(props.item._id);
}

function trackAndHandleWishlistClick() {
  trackNavigation("WishlistClick", isInWishlist.value ? "Removed" : "Added");
  handleWishlistClick();
}

function trackAndShowVariantModal() {
  trackNavigation("ViewedVariants", props.item.name);
  goToItem(props.item._id);
  // showVariantModal.value = true;
}

function trackAndAddToCart() {
  trackNavigation("AddedToCart", {
    itemId: props.item._id,
    name: props.item.name,
    price: props.item.price,
  });
  addToCart(props.item);
}

/** Track navigation or interaction events with Meta Pixel and Klaviyo, including login status and user data. */
function trackNavigation(actionType, action = null) {
  let eventName, properties;

  if (actionType === "WishlistClick") {
    eventName = "WishlistClick";
    properties = {
      action: action,
      itemId: props.item._id,
      name: props.item.name || "Untitled Product",
      timestamp: new Date().toISOString(),
    };
  } else if (actionType === "ViewedVariants") {
    eventName = "ViewedVariants";
    properties = {
      itemName: action || "Unnamed Product",
      timestamp: new Date().toISOString(),
    };
  } else if (actionType === "AddedToCart") {
    eventName = "AddedToCart";
    properties = {
      itemId: action.itemId,
      name: action.name || "Untitled Product",
      price: action.price || 0,
      timestamp: new Date().toISOString(),
    };
  }

  const enhancedProperties = isLoggedIn.value
    ? {
        ...properties,
        isLoggedIn: true,
        userId: userStore.user._id,
        email: userStore.user.email,
        cartSize: userStore.user.cart.length,
        wishlistSize: userStore.user.wishlist.length,
        recentlyViewedCount: userStore.user.recentlyViewedItems.length,
        location: `${userStore.user.contact.city}, ${userStore.user.contact.state}`,
      }
    : {
        ...properties,
        isLoggedIn: false,
      };

  // Track with Meta Pixel
  $fbq("trackCustom", eventName, enhancedProperties);

  // Track with Klaviyo
  $klaviyo("track", eventName, enhancedProperties);
}
</script>

<style scoped>
.product-card {
  position: relative;
  width: 100%;
  background-color: #fff;
  border-radius: 0;
  font-family: "Source Sans Pro", monospace;
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

/* Image Container */
.image-container {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.product-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.sale-ribbon {
  position: absolute;
  top: 0;
  left: 0;
  width: 175px;
  height: 175px;
  z-index: 2;
}
.wishlist-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  z-index: 4;
  transition: transform 0.2s ease;
}
.wishlist-icon:hover {
  transform: scale(1.2);
}

/* Overlay */
.overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Overlay Content with uniform padding, left-align, Lora font */
.overlay-content {
  width: 100%;
  font-family: "Lora", serif;
  text-align: left;
  color: #f1f1f1;
  padding: 1rem;
  box-sizing: border-box;
}
.noninteractive {
  pointer-events: none;
}
.overlay-title {
  margin-bottom: 0.25rem;
}

/* Star Rating */
.overlay-rating {
  display: flex;
  width: 50%;
  gap: 4px;
  margin: 0.5rem 0 1rem 0;
}
.star-icon {
  width: 16px;
  height: 16px;
}

/* Buttons (no border-radius) */
.overlay-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.overlay-buttons-container button {
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
.overlay-add-button {
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 8px 12px;
  background-color: #3f654c;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.overlay-view-button {
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 8px 12px;
  background-color: white;
  color: #000;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.overlay-add-button:hover {
  background-color: #2f4a39;
}

.overlay-view-button:hover {
  background-color: #ddd;
}

/* Checkmark if added to cart */
.checkmark {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
}

/* Info Section below image */
.info-section {
  padding: 10px;
  text-align: center;
}
.product-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}
.price-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.old-price {
  font-size: 1.1rem;
  text-decoration: line-through;
  color: #667;
}
.new-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #3f654c;
}

/* 
 * WORD-based approach to preserve normal spaces & line breaks:
 *  .word { display: inline-block; white-space: nowrap; }
 * Then each letter is revealed in a short animation.
 */
.word {
  display: inline-block;
  white-space: nowrap; /* keep the entire word intact, no mid-word breaks */
}

/* Each letter is hidden by default */
.letter {
  display: inline-block;
  opacity: 1;
}

/* 
 * Quick reveal: each word’s letters animate within ~0.15s
 * If a word has N letters, the last letter’s delay is ~ (N-1)*(0.15/N)
 */
.image-container:hover .title-letter {
  animation: letterFade 0.15s forwards;
  animation-delay: calc(var(--char-index) * (0.15 / var(--char-count)));
}
.image-container:hover .desc-letter {
  animation: letterFade 0.15s forwards;
  animation-delay: calc(var(--char-index) * (0.15 / var(--char-count)));
}

@keyframes letterFade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.overlay-description {
  display: -webkit-box; /* Use flex-like box for clamping */
  -webkit-line-clamp: 2; /* Change this to how many lines you want */
  -webkit-box-orient: vertical;
  overflow: hidden; /* Clip overflow */
  text-overflow: ellipsis; /* Show "..." */
  margin-bottom: 0rem;
  font-size: 0.8rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  /* .overlay-content {
    padding: 0.65rem;
  }

  .overlay-title {
    margin: 0;
  }

  .overlay-rating {
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .overlay-button {
    padding: 5px 8px;
  } */
}
</style>
