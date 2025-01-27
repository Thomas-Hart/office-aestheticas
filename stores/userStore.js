import { defineStore } from 'pinia';

export const useUserStore = defineStore(
  'userStore',
  () => {
    const token = ref(null);
    const user = ref(null);
    const error = ref(null);

    // ----------------------
    // Authentication helpers
    // ----------------------
    const setToken = (newToken) => {
      token.value = newToken;
    };

    const setUser = (newUser) => {
      user.value = newUser;
      if (newUser && newUser.cart) {
        // Load the user's cart from the server
        user.value.cart = newUser.cart;
      }
    };

    const logout = () => {
      token.value = null;
      user.value = null;
      user.value.cart = []; // Clear cart on logout
    };

    // ----------------------
    // Cart functionality
    // ----------------------

    /**
     * addToCart
     * - Increments local quantity if item exists, otherwise adds a new item.
     * - Calls "/api/users/cart/add/:id" with the item(s) so the server merges them.
     */
    const addToCart = async (item, selectedVariant = null) => {
      // Build the item object
      const cartItem = selectedVariant
        ? {
            _id: item._id,
            name: item.name,
            price: selectedVariant.price,
            image: selectedVariant.image,
            variantId: selectedVariant._id,
            color: selectedVariant.color,
            size: selectedVariant.size,
            material: selectedVariant.material,
            style: selectedVariant.style,
            capacity: selectedVariant.capacity,
            flavor: selectedVariant.flavor,
            scent: selectedVariant.scent,
            power: selectedVariant.power,
            length: selectedVariant.length,
            region: selectedVariant.region,
            quantity: 1,
          }
        : {
            _id: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
          };

      // Check if the item already exists in local cart
      const existingItem = user.value.cart.find((i) =>
        cartItem.variantId
          ? i._id === cartItem._id && i.variantId === cartItem.variantId
          : i._id === cartItem._id && !i.variantId
      );

      // Optimistic update (increment or add)
      if (existingItem) {
        existingItem.quantity++;
      } else {
        user.value.cart.push(cartItem);
      }

      // Server sync: POST items to /add endpoint
      try {
        console.log("[addToCart] Sending to API:", { items: [cartItem] });
        const response = await $fetch(
          `/api/users/cart/add/${user.value._id}`,
          {
            method: "PUT",
            body: { items: [cartItem] },
          }
        );
        console.log("[addToCart] Response from API:", response);

        // Replace local cart with the server response
        user.value.cart = response;
      } catch (err) {
        console.error("Error adding to cart:", err);
        error.value = "Failed to add item to cart. Please try again.";
        // Revert optimistic update
        if (existingItem) {
          existingItem.quantity--;
        } else {
          user.value.cart.pop();
        }
      }
    };

    /**
     * removeFromCart
     * - Optimistically remove item from local cart.
     * - Calls "/api/users/cart/remove/:id" to remove the item in the DB.
     */
    const removeFromCart = async (itemId, variantId = null) => {
      const originalCart = [...user.value.cart];
      user.value.cart = user.value.cart.filter(
        (i) => i._id !== itemId || (variantId && i.variantId !== variantId)
      );

      try {
        const response = await $fetch(
          `/api/users/cart/remove/${user.value._id}`,
          {
            method: 'PUT',
            body: { itemId, variantId },
          }
        );
        user.value.cart = response;
      } catch (err) {
        console.error('Error removing from cart:', err);
        error.value = 'Failed to remove item from cart. Please try again.';
        // Revert on failure
        user.value.cart = originalCart;
      }
    };

    /**
     * validateCartItems
     * - Updates local cart data (name/price/image) based on the latest items data
     *   if they are still valid. If item or variant is missing, logs a warning.
     */
    const validateCartItems = (allItems) => {
      user.value.cart = user.value.cart.map((cartItem) => {
        const correspondingItem = allItems.find(
          (dbItem) => dbItem._id === cartItem._id
        );

        if (!correspondingItem) {
          console.warn(`Item with ID ${cartItem._id} is no longer available.`);
          return cartItem; // Keep it but warn
        }

        // If variant, verify it's still valid
        if (cartItem.variantId) {
          const selectedVariant = correspondingItem.variants.find(
            (variant) => variant._id === cartItem.variantId
          );
          if (selectedVariant) {
            return {
              ...cartItem,
              name: correspondingItem.name,
              price: selectedVariant.price,
              image: selectedVariant.image,
            };
          } else {
            console.warn(
              `Variant with ID ${cartItem.variantId} is no longer available for item ${cartItem.name}`
            );
            return cartItem; // Keep original data if variant is missing
          }
        } else {
          // No variant, just update name/price/image from DB
          return {
            ...cartItem,
            name: correspondingItem.name,
            price: correspondingItem.price,
            image: correspondingItem.image,
          };
        }
      });
    };

    /**
     * isItemInCart
     * - Checks if a specific (itemId + optional variantId) is in the local cart
     */
    const isItemInCart = (itemId, variantId = null) => {
      return user.value.cart.some(
        (item) =>
          item._id === itemId &&
          (variantId ? item.variantId === variantId : true)
      );
    };

    /**
     * updateQuantity
     * - Sets a new final quantity for an existing item in the cart (optimistic).
     * - Calls "/api/users/cart/update/:id" with the *entire cart* to replace
     *   the user's cart. This ensures we override the quantity properly
     *   rather than incrementing further.
     */
    const updateQuantity = async ({ itemId, variantId = null, quantity }) => {
      const cartItem = user.value.cart.find(
        (i) =>
          i._id === itemId && (variantId ? i.variantId === variantId : !i.variantId)
      );

      if (!cartItem) return;

      const originalQuantity = cartItem.quantity;
      cartItem.quantity = quantity;

      try {
        // Replace the entire cart in DB with user.value.cart
        const response = await $fetch(`/api/users/cart/update/${user.value._id}`, {
          method: 'PUT',
          body: { cart: user.value.cart }, 
        });
        user.value.cart = response;
      } catch (err) {
        console.error('Error updating quantity:', err);
        error.value = 'Failed to update item quantity. Please try again.';
        // Revert on failure
        cartItem.quantity = originalQuantity;
      }
    };

    /**
     * getCartItemCount
     * - Returns total quantity of all items in the cart
     */
    const getCartItemCount = () => {
      return user.value.cart.reduce(
        (count, item) => count + item.quantity,
        0
      );
    };

    /**
     * getCartSubtotal
     * - Returns subtotal price (sum of item.price * item.quantity)
     */
    const getCartSubtotal = () => {
      return user.value.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    };

    /**
     * clearCart
     * - Clears the local cart. (Optionally could sync with server if needed.)
     */
    const clearCart = () => {
      user.value.cart = [];
    };

    // Return all references/methods
    return {
      token,
      user,
      error,
      setToken,
      setUser,
      logout,
      addToCart,
      removeFromCart,
      validateCartItems,
      isItemInCart,
      updateQuantity,
      getCartItemCount,
      getCartSubtotal,
      clearCart,
    };
  },
  {
    persist: {
      key: 'user-store-key-OA',
      storage: typeof localStorage !== 'undefined' ? localStorage : null,
      paths: ['token', 'user', 'cart'], // Persist cart in user store
    },
  }
);
