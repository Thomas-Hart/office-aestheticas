<template>
  <div class="carousel-item" v-if="!loading">
    <!-- Image wrapper with hover effect and click event -->
    <div class="img-wrapper" @click="goToItem(item._id)">
      <!-- Wishlist Icon -->
      <img
        :src="
          isInWishlist
            ? '/Graphics/WishButtonActive.svg'
            : '/Graphics/WishButton.svg'
        "
        alt="Add to Wishlist"
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
        alt="Check mark"
      />
    </div>

    <div class="info-section">
      <!-- Price and savings row -->
      <div class="price-row">
        <p class="new-price">${{ item.price.toFixed(2) }}</p>
        <div v-if="item.oldPrice" class="old-price-container">
          <p class="old-price">${{ item.oldPrice.toFixed(2) }}</p>
          <p class="savings">
            Save ${{ item.savingsAmount.toFixed(2) }} ({{
              item.savingsPercentage
            }})
          </p>
        </div>
      </div>

      <!-- Rating Row -->
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
        <span class="rating-number">({{ item.reviewCount.toFixed(0) }})</span>
      </div>

      <!-- Item information -->
      <div class="item-info">
        <p class="item-title">
          <strong>{{ item.name }}</strong>
        </p>
        <p>{{ item.preview }}</p>
      </div>

      <!-- Add to Cart Button or Variants Selector -->
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

    <!-- Import the VariantModal and render it conditionally -->
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
  const loggedIn = !!userStore.user;
  return loggedIn;
});

// Check if item is in user's wishlist
const isInWishlist = computed(() => {
  if (!userStore.user?.wishlist) {
    return false;
  }
  const inWishlist = userStore.user.wishlist.some(
    (w) => w.item === props.item._id
  );
  return inWishlist;
});

async function handleWishlistClick() {
  console.log("HERE");
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
    try {
      const updatedWishlist = await removeFromWishlistOnServer(props.item._id);
      if (updatedWishlist) {
        userStore.user.wishlist = updatedWishlist;
      } else {
        console.error("No updated wishlist returned from server remove.");
      }
    } catch (error) {
      console.error("Failed to remove item from wishlist on server:", error);
    }
  } else {
    try {
      const updatedWishlist = await addToWishlistOnServer(wishlistItem);
      if (updatedWishlist) {
        userStore.user.wishlist = updatedWishlist;
      } else {
        console.error("No updated wishlist returned from server add.");
      }
    } catch (error) {
      console.error("Failed to add item to wishlist on server:", error);
    }
  }
}

async function addToWishlistOnServer(wishlistItem) {
  try {
    const updatedWishlist = await $fetch(
      `/api/users/wishlist/add/${userStore.user._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: { wishlistItem },
      }
    );

    return updatedWishlist;
  } catch (error) {
    console.error("Error in addToWishlistOnServer:", error);
    return null;
  }
}

async function removeFromWishlistOnServer(itemId) {
  try {
    const updatedWishlist = await $fetch(
      `/api/users/wishlist/remove/${userStore.user._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: { itemId },
      }
    );

    return updatedWishlist;
  } catch (error) {
    console.error("Error in removeFromWishlistOnServer:", error);
    return null;
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
.carousel-item {
  transition: border 0.3s;
  /* width: 25%; */
  padding-bottom: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  color: black;
  max-width: 350px;
  height: 100%;
  border: 1px solid black;
}

.img-wrapper {
  position: relative;
  cursor: pointer;
  background: white;
}

.wishlist-icon {
  position: absolute;
  top: 0rem;
  left: 0rem;
  width: 4rem;
  height: 4rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
}

.wishlist-icon:hover {
  transform: scale(1.1);
}

.product-image {
  width: 100%;
  max-height: 20rem;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  transition: transform 0.3s ease;
  transform: scale(0.85);
}

.product-image:hover {
  transform: scale(0.9);
}

@keyframes pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.checkmark {
  position: absolute;
  top: 0rem;
  left: 0rem;
  right: 0rem;
  bottom: 0rem;
  justify-self: center;
  padding: 5rem;
  animation: pop 0.3s ease;
  width: auto;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-info {
  text-align: left;
}

.item-title {
  font-size: 1.2rem;
}

.price-row {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}

.new-price {
  font-size: 2rem;
  line-height: 2rem;
  color: black;
  font-weight: bold;
}

.old-price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.old-price {
  text-decoration: line-through;
  color: #0a0a0a;
  font-size: 1.2rem;
  line-height: 1rem;
  margin: 0;
}

.savings {
  color: #00bf63;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
}

.ratings-row {
  display: flex;
  align-items: center;
}

.stars-container {
  display: flex;
  justify-content: space-between; /* Ensure even spacing between stars */
  height: 20px;
  max-width: 115px; /* Set the desired max width for the container */
  width: 100%; /* Allow the container to be responsive */
}

.star-icon {
  width: 20px; /* Set an explicit width for each star */
  height: 20px; /* Match the height of the container */
  object-fit: contain; /* Ensure the star image scales properly within its bounds */
  /* margin: 0 2px; Add some spacing between the stars */
}

.rating-number {
  font-size: 1rem;
  margin-left: 8px;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .carousel-item {
    /* width: 33.33%; */
  }

  .new-price {
    font-size: 2rem;
  }
}

@media (max-width: 992px) {
  .carousel-item {
    /* width: 50%; */
  }

  .new-price {
    font-size: 1.5rem;
  }

  .old-price {
    font-size: 1rem;
  }

  .savings {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .carousel-item {
    /* width: 50%; */
  }

  .new-price {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .carousel-item {
    width: 100%;
    justify-self: center;
  }

  .new-price {
    font-size: 1.2rem;
  }

  .price-row {
    justify-content: space-between;
  }

  .old-price,
  .savings {
    font-size: 1rem;
  }
}
</style>
