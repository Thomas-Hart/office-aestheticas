<template>
  <div class="product-card" v-if="!loading">
    <!-- Sale Ribbon -->
    <img
      v-if="item.oldPrice"
      src="/Graphics/Items/sale.svg"
      alt="Sale"
      class="sale-ribbon"
    />

    <!-- Product Image -->
    <div class="image-container" @click="goToItem(item._id)">
      <img
        src="/Graphics/Nav/heart.svg"
        alt="Wishlist"
        class="wishlist-icon"
        @click.stop="handleWishlistClick"
      />
      <img
        :src="'/ItemPics/' + item.image"
        alt="Product Image"
        class="product-image"
      />
      <img
        :src="resolvedCheckImg()"
        class="checkmark"
        v-if="isAddedToCart"
        alt="Checkmark"
      />
    </div>

    <!-- Product Information -->
    <div class="info-section">
      <!-- Product Title -->
      <p class="product-title">{{ item.name }}</p>

      <!-- Price Section -->
      <div class="price-container">
        <p v-if="item.oldPrice" class="old-price">
          ${{ item.oldPrice.toFixed(2) }}
        </p>
        <p class="new-price">${{ item.price.toFixed(2) }}</p>
      </div>

      <!-- Rating Row -->
      <div class="ratings-row" v-if="item.ratings || item.reviewCount">
        <div class="stars-container">
          <img
            v-for="(star, index) in starImages"
            :key="index"
            :src="star"
            alt="Star"
            class="star-icon"
          />
        </div>
        <span class="rating-number">({{ item.reviewCount.toFixed(0) }})</span>
      </div>

      <!-- Add to Cart Button -->
      <div v-if="item.variants && item.variants.length > 0">
        <button
          @click="showVariantModal = true"
          class="add-to-cart-button honey-button"
        >
          See Options
        </button>
      </div>
      <div v-else>
        <button
          @click="addToCart(item)"
          class="add-to-cart-button honey-button"
        >
          Add To Cart
        </button>
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
import { ref, computed, onMounted } from "vue";
import { useItemStore, useUserStore } from "@/stores"; // Ensure these match your import paths
import { useRouter } from "vue-router";

const props = defineProps({
  item: Object,
});

const emit = defineEmits(["openLoginModal"]);

const isAddedToCart = ref(false);
const showVariantModal = ref(false);

const store = useItemStore();
const userStore = useUserStore();
const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

function resolvedCheckImg() {
  return "/CheckMark.svg";
}

function addToCart(item) {
  store.addToCart(item);
  isAddedToCart.value = true;
}

const isLoggedIn = computed(() => {
  return !!userStore.user;
});

// Check if item is in user's wishlist
const isInWishlist = computed(() => {
  if (!userStore.user?.wishlist) {
    return false;
  }
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

  // Toggle the wishlist status
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

// Helper function to get the star images
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
</script>

<style scoped>
.product-card {
  position: relative;
  width: 220px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.sale-ribbon {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
}

.image-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.wishlist-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  z-index: 3;
  transition: transform 0.2s ease;
}

.wishlist-icon:hover {
  transform: scale(1.2);
}

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
  font-size: 0.9rem;
  text-decoration: line-through;
  color: #999;
}

.new-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #3f654c;
}

.ratings-row {
  display: flex;
  align-items: center;
}

.stars-container {
  display: flex;
  gap: 2px;
}

.star-icon {
  width: 16px;
  height: 16px;
}
</style>
