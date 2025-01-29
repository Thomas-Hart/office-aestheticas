import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB();

  try {
    const { items: localItems } = await readBody(event);

    if (!localItems || !Array.isArray(localItems)) {
      throw createError({
        statusCode: 400,
        message: "Invalid data: 'items' must be an array.",
      });
    }

    const userId = event.context.params.id;

    // 1) Fetch the existing user cart
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    // 2) Merge logic
    const newCart = [...userDoc.cart];
    localItems.forEach((localItem) => {
      const itemIdString = String(localItem._id);
      const variantIdString = localItem.variantId ? String(localItem.variantId) : null;

      const existingItem = newCart.find((cartItem) => {
        const cartItemId = String(cartItem._id);
        const cartVariantId = cartItem.variantId ? String(cartItem.variantId) : null;
        return cartItemId === itemIdString && cartVariantId === variantIdString;
      });

      if (existingItem) {
        existingItem.quantity += localItem.quantity;
      } else {
        newCart.push(localItem);
      }
    });

    // 3) Update the database cart using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cart: newCart },
      { new: true } // Return the updated user document
    );

    return updatedUser.cart;
  } catch (error) {
    console.error("[addToCart] - Error occurred:", error);
    throw error;
  } finally {
    await disconnectDB();
  }
});
