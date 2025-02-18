import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const { cartItems } = await readBody(event);
    if (!Array.isArray(cartItems)) {
      throw createError({
        statusCode: 400,
        message: "Invalid request body: Missing required fields.",
      });
    }

    const itemIds = cartItems.map((item) => item._id);
    if (itemIds.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No items provided in the cart.",
      });
    }

    // Fetch the items from the database. These are the main items.
    const items = await Item.find({ _id: { $in: itemIds } }).lean();
    if (!items || items.length === 0) {
      throw createError({
        statusCode: 404,
        message: "No items found for the provided IDs.",
      });
    }

    let totalCost = 0;
    for (const cartItem of cartItems) {
      const dbItem = items.find(
        (dbItem) => dbItem._id.toString() === cartItem._id
      );
      if (!dbItem) {
        throw createError({
          statusCode: 400,
          message: `Item not found: ${cartItem._id}`,
        });
      }
      
      // If a variantId is provided, look for the variant inside the item.variants array.
      if (cartItem.variantId) {
        const variant = dbItem.variants.find(
          (v) => v._id.toString() === cartItem.variantId
        );
        if (!variant) {
          throw createError({
            statusCode: 400,
            message: `Variant not found for item ${cartItem._id}: ${cartItem.variantId}`,
          });
        }
        totalCost += variant.price * cartItem.quantity;
      } else {
        totalCost += dbItem.price * cartItem.quantity;
      }
    }

    await disconnectDB();

    return totalCost.toFixed(2);
  } catch (error) {
    console.error("Error in calculate-total API:", error.message);
    await disconnectDB(); // Ensure DB disconnection on error
    throw createError({
      statusCode: 500,
      message: "Error calculating total",
      cause: error,
    });
  }
});
