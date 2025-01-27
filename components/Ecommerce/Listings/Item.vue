<template>
  <div class="product-card" v-if="!loading">
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
      <div class="overlay">
        <!-- Wishlist Icon -->
        <img
          src="/Graphics/Items/whiteHeart.svg"
          alt="Wishlist"
          class="wishlist-icon"
          @click.stop="handleWishlistClick"
        />
        <div class="overlay-content">
          <!-- TITLE (word-by-word, letter-by-letter) -->
          <h3 class="overlay-title">
            <template v-for="(word, wIndex) in titleWords" :key="'tw' + wIndex">
              <span class="word">
                <span
                  v-for="(char, cIndex) in word"
                  :key="cIndex"
                  class="letter title-letter"
                  :style="{
                    '--char-index': cIndex,
                    '--char-count': word.length,
                  }"
                >
                  {{ char }}
                </span>
              </span>
              <!-- Visible space after each word, except the last -->
              <span v-if="wIndex < titleWords.length - 1">&nbsp;</span>
            </template>
          </h3>

          <!-- DESCRIPTION (word-by-word, letter-by-letter, clamped with ellipsis) -->
          <p class="overlay-description">
            <template
              v-for="(word, wIndex) in descriptionWords"
              :key="'dw' + wIndex"
            >
              <span class="word">
                <span
                  v-for="(char, cIndex) in word"
                  :key="cIndex"
                  class="letter desc-letter"
                  :style="{
                    '--char-index': cIndex,
                    '--char-count': word.length,
                  }"
                >
                  {{ char }}
                </span>
              </span>
              <span v-if="wIndex < descriptionWords.length - 1">&nbsp;</span>
            </template>
          </p>

          <!-- Star Rating -->
          <div class="overlay-rating" v-if="starImages && starImages.length">
            <img
              v-for="(star, i) in starImages"
              :key="i"
              :src="star"
              alt="Star"
              class="star-icon"
            />
          </div>

          <!-- Buttons -->
          <div class="overlay-buttons-container">
            <button
              v-if="item.variants && item.variants.length > 0"
              @click.stop="showVariantModal = true"
              class="overlay-button honey-button"
            >
              See Options
            </button>
            <button
              v-else
              @click.stop="addToCart(item)"
              class="overlay-button honey-button"
            >
              Add To Cart
            </button>
            <button
              @click.stop="goToItem(item._id)"
              class="overlay-button honey-button"
            >
              View Item
            </button>
          </div>
        </div>
      </div>

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
const props = defineProps({ item: Object });
const emit = defineEmits(["openLoginModal"]);

const isAddedToCart = ref(false);
const showVariantModal = ref(false);

const itemStore = useItemStore();
const userStore = useUserStore();
const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

/** Star rating logic */
function getStarImages(rating) {
  const fullStar = "/FullStar.svg";
  const halfStar = "/HalfStar.svg";
  const emptyStar = "/EmptyStar.svg";
  const starImages = [];

  const roundedRating = Math.round(rating * 2) / 2;
  for (let i = 0; i < 5; i++) {
    if (roundedRating - i >= 1) {
      starImages.push(fullStar);
    } else if (roundedRating - i === 0.5) {
      starImages.push(halfStar);
    } else {
      starImages.push(emptyStar);
    }
  }
  return starImages;
}
const starImages = computed(() => getStarImages(props.item.ratings || 0));

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
  console.log("hereeee1", JSON.stringify(item));
  if (isLoggedIn.value) {
    userStore.addToCart(item);
    console.log("hereeee2");

    console.log(userStore.user.cart); // Item does not successfully add to cart
  } else {
    itemStore.addToCart(item);
    console.log("hereeee3");

    console.log(itemStore.cart);
  }
  isAddedToCart.value = true;
}

const isLoggedIn = computed(() => !!userStore.user);
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
  // router.push(`/item/${itemId}`);
}

function closeVariantModal() {
  showVariantModal.value = false;
}
</script>

<style scoped>
.product-card {
  position: relative;
  width: 15rem;
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
  width: 15rem;
  height: 15rem;
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
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}
.image-container:hover .overlay {
  opacity: 1;
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

.overlay-title {
  margin-bottom: 0.25rem;
}

/* Star Rating */
.overlay-rating {
  display: flex;
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
.overlay-button {
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
.overlay-button:hover {
  background-color: #2f4a39;
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
  color: #999;
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
  opacity: 0;
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

/* 
 * Clamp description to 3 lines, show ellipsis if it overflows 
 */
.overlay-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0rem;
  font-size: 0.8rem;
}
</style>
