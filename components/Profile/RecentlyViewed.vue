<template>
  <div class="recentlyViewedItems-items">
    <h2>Recently Viewed Items</h2>
    <p class="displaying">Displaying {{ items.length }} item(s)</p>

    <!-- Show grid if items exist -->
    <div v-if="items.length > 0" class="grid-wrapper">
      <p class="recentlyViewedItems-message">
        {{ "Jump back into your recently viewed items!" }}
      </p>
      <div class="recentlyViewedItems-grid">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="recentlyViewedItems-item"
        >
          <div class="image-container" @click="goToItem(item.item)">
            <img :src="`/ItemPics/${item.image}`" :alt="item.name" />
            <div class="overlay">
              <p class="item-name">{{ item.name }}</p>
            </div>
          </div>
          <button
            class="delete-button"
            @click.stop="deleteItem(item.item)"
            aria-label="Remove item"
          >
            ✖
          </button>
        </div>
      </div>
    </div>

    <!-- Show message and graphic when no items are in the recentlyViewedItems -->
    <div v-else class="empty-recentlyViewedItems">
      <img
        src="/Logos/OAName.svg"
        alt="Empty RecentlyViewedItems"
        class="empty-graphic"
      />
      <p class="empty-message">You haven't viewed any items yet...</p>
    </div>
  </div>
</template>
  
  <script setup>
const userStore = useUserStore();
const router = useRouter();

// Access recentlyViewedItems items from the user store
const items = computed(() => userStore.user.recentlyViewedItems);

// console.log("User: " + JSON.stringify(userStore.user));
// console.log("Items: " + JSON.stringify(items));

// Navigate to item page
const goToItem = (id) => {
  router.push(`/item/${id}`);
};

// Delete an item from the recentlyViewedItems and update the database
const deleteItem = async (id) => {
  // Remove the item from the user store's recentlyViewedItems
  userStore.user.recentlyViewedItems =
    userStore.user.recentlyViewedItems.filter((item) => item.item !== id);

  // Update the user in the database
  try {
    const response = await $fetch(`/api/users/${userStore.user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: userStore.user,
    });

    userStore.setUser(response);
  } catch (error) {
    console.error(
      "Failed to update recentlyViewedItems in the database:",
      error
    );
  }
};
</script>
  
  <style scoped>
.recentlyViewedItems-items {
  font-family: Arial, sans-serif;
  padding: 2rem;
  width: 100%;
}

h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
}

p.displaying {
  color: white;
  font-weight: lighter;
}

.grid-wrapper {
  background-color: #f9f9f9;
  padding: 2rem 3rem;
  margin-top: 1rem;
}

.recentlyViewedItems-message {
  color: #28a745;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: lighter;
}

.recentlyViewedItems-grid {
  padding-bottom: 0.75rem;
  border-bottom: 0.25rem solid #d9d9d9;
  padding-top: 0.75rem;
  border-top: 0.25rem solid #d9d9d9;
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
}

.recentlyViewedItems-item {
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background: white;
  cursor: pointer;
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.recentlyViewedItems-item:hover {
  transform: scale(0.95);
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.recentlyViewedItems-item:hover .image-container img {
  transform: scale(0.95);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recentlyViewedItems-item:hover .overlay {
  opacity: 1;
}

.item-name {
  color: white;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
}

/* Delete Button */
.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.3s ease, background 0.3s ease;
}

.delete-button:hover {
  transform: scale(1.2);
  background: darkred;
}

/* Empty recentlyViewedItems styles */
.empty-recentlyViewedItems {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 2rem;
}

.empty-graphic {
  width: 150px;
  height: auto;
  margin-bottom: 1rem;
}

.empty-message {
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .recentlyViewedItems-items {
    padding: 4rem 1rem;
  }

  .empty-graphic {
    width: 120px;
  }

  .empty-message {
    font-size: 1.2rem;
  }
}
</style>
  