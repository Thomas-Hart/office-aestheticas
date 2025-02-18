import mongoose from 'mongoose';
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

    // Fetch the user document
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    // Copy the current cart array
    const newCart = [...userDoc.cart];

    localItems.forEach((localItem) => {
      // Convert _id and variantId to ObjectId instances
      const itemId = new mongoose.Types.ObjectId(localItem._id);
      const variantId = localItem.variantId
        ? new mongoose.Types.ObjectId(localItem.variantId)
        : null;
      
      // Convert the color to a string (e.g., the color name)
      const colorString =
        localItem.color && typeof localItem.color === "object"
          ? localItem.color.name
          : localItem.color;

      // Find if an item with the same _id and variantId exists in the cart
      const existingItem = newCart.find((cartItem) => {
        const cartItemId = String(cartItem._id);
        const cartVariantId = cartItem.variantId ? String(cartItem.variantId) : null;
        return (
          cartItemId === String(itemId) &&
          cartVariantId === (variantId ? String(variantId) : null)
        );
      });

      if (existingItem) {
        // Increase the quantity if it exists
        existingItem.quantity += localItem.quantity;
      } else {
        // Push a new cart item with the proper ObjectId types and color as a string
        newCart.push({
          _id: itemId,
          name: localItem.name,
          price: localItem.price,
          oldPrice: localItem.oldPrice,
          image: localItem.image,
          variantId: variantId,
          color: colorString,
          size: localItem.size,
          material: localItem.material,
          style: localItem.style,
          capacity: localItem.capacity,
          flavor: localItem.flavor,
          scent: localItem.scent,
          power: localItem.power,
          length: localItem.length,
          region: localItem.region,
          quantity: localItem.quantity,
        });
      }
    });

    // Update the user's cart on the document instance and save
    userDoc.cart = newCart;
    await userDoc.save();

    return userDoc.cart;
  } catch (error) {
    console.error("[addToCart] - Error occurred:", error);
    throw error;
  } finally {
    await disconnectDB();
  }
});
