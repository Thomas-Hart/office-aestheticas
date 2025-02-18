import { defineStore } from 'pinia';

export const useItemStore = defineStore('itemStore', () => {
  const allItems = ref([]);
  const cart = ref([]);
  const orderDetails = ref(null);
  const USPSAccessToken = ref();
  const USPSAccessTokenExpiration = ref();
  const loading = ref(false);
  const error = ref(null);

  const lastFetchTime = ref(0);
  // const CACHE_DURATION = 1000 * 60 * 2; 
  const CACHE_DURATION = 0; 

  const setItems = (newItems) => {
    allItems.value = newItems;
    lastFetchTime.value = Date.now();
    // Run cart validation after setting new items
    validateCartItems();
  };

  const addToCart = (item, selectedVariant = null) => {
    // In addToCart (user store example)
const cartItem = selectedVariant
? {
    _id: item._id,
    name: item.name,
    price: selectedVariant.price || item.price,
    originalPrice: selectedVariant.oldPrice || item.oldPrice, // NEW
    image: selectedVariant.image || item.image,
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
    originalPrice: item.oldPrice, // NEW for consistency
    image: item.image,
    quantity: 1,
  };


    // console.log("cartItem: " + JSON.stringify(cartItem));

    const existingItem = cart.value.find(i =>
      i._id === cartItem._id && (selectedVariant ? i.variantId === cartItem.variantId : true)
    );

    if (existingItem) {
      // console.log("Was existing item");
      existingItem.quantity++;
    } else {
      // console.log("Was no existing item");
      cart.value.push(cartItem);
    }
  };

  const validateCartItems = () => {
    cart.value = cart.value.map(cartItem => {
      const correspondingItem = allItems.value.find(item => item._id === cartItem._id);
      if (!correspondingItem) {
        // If the item no longer exists, skip validation for this item
        console.warn(`Item with ID ${cartItem._id} is no longer available.`);
        return cartItem;
      }
  
      let validatedItem;
      
      // If a variant was selected, update the cart item with the new variant data
      // In itemStore.validateCartItems for a variant item
if (cartItem.variantId) {
  const selectedVariant = correspondingItem.variants.find(
    variant => variant._id === cartItem.variantId
  );
  if (selectedVariant) {
    validatedItem = {
      _id: correspondingItem._id,
      name: correspondingItem.name,
      price: selectedVariant.price,
      originalPrice: selectedVariant.oldPrice || correspondingItem.oldPrice, // NEW
      image: selectedVariant.image,
      variantId: selectedVariant._id,
      color: selectedVariant.color?.name || '',
      size: selectedVariant.size,
      material: selectedVariant.material,
      style: selectedVariant.style,
      capacity: selectedVariant.capacity,
      flavor: selectedVariant.flavor,
      scent: selectedVariant.scent,
      power: selectedVariant.power,
      length: selectedVariant.length,
      region: selectedVariant.region,
      quantity: cartItem.quantity,
    };
  } else {
    console.warn(
      `Variant with ID ${cartItem.variantId} is no longer available for item ${cartItem.name}`
    );
    return cartItem;
  }
} else {
  // For non-variant items, include originalPrice as well
  validatedItem = {
    _id: correspondingItem._id,
    name: correspondingItem.name,
    price: correspondingItem.price,
    originalPrice: correspondingItem.oldPrice, // NEW
    image: correspondingItem.image,
    quantity: cartItem.quantity,
  };
}

  
      return validatedItem;
    });
  };
  

  const isItemInCart = (itemId, variantId = null) => {
    return cart.value.some(item =>
      item._id === itemId && (variantId ? item.variantId === variantId : true)
    );
  };

  const isCartEmpty = () => {
    return cart.value.length === 0;
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

  const getItemById = (id) => {
    return allItems.value.find(item => item._id === id);
  };

  const getCartItemCount = () => {
    return cart.value.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const setOrderDetails = (details) => {
    orderDetails.value = details;
  };

  const clearCart = () => {
    cart.value = [];
    orderDetails.value = null;
  };

  return {
    cart,
    orderDetails,
    loading,
    error,
    lastFetchTime,
    CACHE_DURATION,
    allItems,
    setItems,
    addToCart,
    clearCart,
    setOrderDetails,
    isItemInCart,
    isCartEmpty,
    removeFromCart,
    updateQuantity,
    getItemById,
    getCartItemCount,
    getCartSubtotal,
    validateCartItems, // Expose the validation function
  };
}, {
  persist: {
    key: 'item-store-key-OA',
    storage: typeof localStorage !== 'undefined' ? localStorage : null,
    paths: ['cart', 'orderDetails', 'USPSAccessToken', 'USPSAccessTokenExpiration'], // Specify which states should be persisted
  },
});
