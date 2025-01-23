import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', () => {
  const token = ref(null);
  const user = ref(null);
  const cart = ref([]);
  const error = ref(null);

  const setToken = (newToken) => {
    token.value = newToken;
  };

  const setUser = (newUser) => {
    user.value = newUser;
    if (newUser && newUser.cart) {
      cart.value = newUser.cart; // Load the user's cart from the server
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    cart.value = []; // Clear cart on logout
  };

  const addToCart = (item, selectedVariant = null) => {
    let cartItem;

    if (selectedVariant) {
      cartItem = {
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
      };
    } else {
      cartItem = {
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      };
    }

    const existingItem = cart.value.find(i =>
      i._id === cartItem._id && (selectedVariant ? i.variantId === cartItem.variantId : true)
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.value.push(cartItem);
    }
  };

  const validateCartItems = (allItems) => {
    cart.value = cart.value.map(cartItem => {
      const correspondingItem = allItems.find(item => item._id === cartItem._id);
      if (!correspondingItem) {
        console.warn(`Item with ID ${cartItem._id} is no longer available.`);
        return cartItem;
      }

      if (cartItem.variantId) {
        const selectedVariant = correspondingItem.variants.find(variant => variant._id === cartItem.variantId);
        if (selectedVariant) {
          return {
            ...cartItem,
            name: correspondingItem.name,
            price: selectedVariant.price,
            image: selectedVariant.image,
          };
        } else {
          console.warn(`Variant with ID ${cartItem.variantId} is no longer available for item ${cartItem.name}`);
        }
      } else {
        return {
          ...cartItem,
          name: correspondingItem.name,
          price: correspondingItem.price,
          image: correspondingItem.image,
        };
      }

      return cartItem;
    });
  };

  const isItemInCart = (itemId, variantId = null) => {
    return cart.value.some(item =>
      item._id === itemId && (variantId ? item.variantId === variantId : true)
    );
  };

  const removeFromCart = (itemId, variantId = null) => {
    cart.value = cart.value.filter(i =>
      i._id !== itemId || (variantId && i.variantId !== variantId)
    );
  };

  const updateQuantity = ({ itemId, variantId = null, quantity }) => {
    const item = cart.value.find(i =>
      i._id === itemId && (variantId ? i.variantId === variantId : true)
    );
    if (item) {
      item.quantity = quantity;
    }
  };

  const getCartItemCount = () => {
    return cart.value.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    cart.value = [];
  };

  return {
    token,
    user,
    cart,
    error,
    setToken,
    setUser,
    logout,
    addToCart,
    validateCartItems,
    isItemInCart,
    removeFromCart,
    updateQuantity,
    getCartItemCount,
    getCartSubtotal,
    clearCart,
  };
}, {
  persist: {
    key: 'user-store-key-OA',
    storage: typeof localStorage !== 'undefined' ? localStorage : null,
    paths: ['token', 'user', 'cart'], // Persist cart in user store
  },
});
