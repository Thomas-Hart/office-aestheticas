<template>
  <div class="nav-container">
    <div class="search-bar-container">
      <div class="search-bar-wrapper">
        <button @click="trackAndToggleSearchBar" class="search-icon">
          <img src="/Graphics/Nav/search.svg" alt="Search" />
        </button>
        <div class="search-bar" :class="{ expanded: showList }">
          <input
            v-if="showList"
            type="text"
            v-model="searchQuery"
            @focus="showList = true"
            @input="filterList"
            placeholder="What can we help you find today?"
            class="search-input"
          />
        </div>
      </div>
      <transition name="dropdown">
        <ul
          v-if="
            !loading &&
            searchQuery.length > 0 &&
            filteredItems.length &&
            showList
          "
          class="dropdown-list"
        >
          <li
            v-for="item in filteredItems"
            :key="item._id"
            class="dropdown-item"
            @mousedown.prevent="trackAndGoToItemPage(item._id, item)"
          >
            <img
              :src="getItemImagePath(item.image)"
              alt="Item Image"
              class="item-image"
            />
            <div class="item-info">
              <h3>
                <span
                  v-for="(part, index) in splitText(item.name)"
                  :key="index"
                  :class="{ highlight: part.match }"
                >
                  {{ part.text }}
                </span>
              </h3>
              <p class="item-price">${{ item.price.toFixed(2) }}</p>
            </div>
          </li>
        </ul>
        <div v-else-if="loading && showList" class="loading-spinner">
          <div class="spinner"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
const searchQuery = ref("");
const showList = ref(false);
const loading = ref(true);
const router = useRouter();
const store = useItemStore();

const userStore = useUserStore();

// Check if user is logged in
const isLoggedIn = computed(() => !!userStore.token);

// Inject Meta Pixel and Klaviyo with $ prefix
const { $fbq } = useNuxtApp();
const { $klaviyo } = useNuxtApp();

const { data: itemsData, error: itemsError } = await useFetch("/api/items");

onMounted(() => {
  if (itemsError.value) {
    console.error("Failed to fetch items:", itemsError.value);
  } else {
    store.setItems(itemsData.value);
  }
  loading.value = false;
});

const allItems = computed(() => store.allItems);

const filteredItems = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return allItems.value.filter((item) =>
    item.name?.toLowerCase().includes(query)
  );
});

function filterList() {
  showList.value = true;
}

function hideList() {
  setTimeout(() => {
    showList.value = false;
  }, 200);
}

function trackAndToggleSearchBar() {
  trackNavigation("SearchBar");
  toggleSearchBar();
}

function toggleSearchBar() {
  if (!showList.value) {
    showList.value = true;
  } else {
    setTimeout(() => {
      showList.value = false;
      searchQuery.value = "";
    }, 300);
  }
}

function trackAndGoToItemPage(itemId, item) {
  trackNavigation("Item", item);
  goToItemPage(itemId);
}

function goToItemPage(itemId) {
  hideList();
  router.push(`/item/${itemId}`);
}

function splitText(text) {
  const query = searchQuery.value.toLowerCase();
  if (!text || typeof text !== "string") return [{ text: "", match: false }];

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === query,
  }));
}

function getItemImagePath(fileName) {
  return "/ItemPics/" + fileName;
}

/** Track navigation or interaction events with Meta Pixel and Klaviyo, including login status and user data. */
function trackNavigation(actionType, item = null) {
  let eventName, properties;

  if (actionType === "SearchBar") {
    eventName = "ToggledSearchBar";
    properties = {
      action: "toggle",
      timestamp: new Date().toISOString(),
    };
  } else if (actionType === "Item" && item) {
    eventName = "NavigatedToItem";
    properties = {
      itemId: item._id,
      itemName: item.name,
      itemPrice: item.price,
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
.nav-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.search-bar-container {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.search-bar-wrapper {
  display: flex;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  overflow: hidden;
  height: 35px;
  width: 0;
  border-radius: 20px;
  transition: width 0.3s ease;
  justify-content: flex-start;
}

.search-bar.expanded {
  width: 350px;
  padding-left: 10px;
}

.search-input {
  border: none;
  padding: 0 10px;
  height: 100%;
  font-size: 16px;
  outline: none;
  width: 100%;
  transition: opacity 0.3s ease;
  opacity: 1;
}

.search-bar:not(.expanded) .search-input {
  opacity: 0;
}

.search-icon {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 0 10px; */
  height: 100%;
}

.search-icon img {
  height: 20px;
  width: 20px;
}

.dropdown-list {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid #ccc;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 14px;
  color: white;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 5px;
}

.item-info {
  flex: 1;
  text-align: left;
}

.item-info h3 {
  margin: 0;
  font-size: 16px;
  color: #fff;
}

.item-price {
  font-size: 14px;
  color: #ddd;
}

.highlight {
  background-color: darkcyan;
  color: white;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: white;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .search-bar.expanded {
    width: 150px;
  }

  .search-bar input {
    font-size: 12px;
  }

  .dropdown-item {
    align-items: flex-start;
  }

  .item-image {
    margin-top: 5px;
  }
}
</style>