import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  console.log("[replaceCart] - Connecting to database...");
  await connectDB();

  try {
    const { cart: newCart } = await readBody(event);

    // Validate input
    if (!newCart || !Array.isArray(newCart)) {
      throw createError({
        statusCode: 400,
        message: "Invalid cart data provided. It must be an array.",
      });
    }

    const userId = event.context.params.id;

    // Replace the user's cart directly using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cart: newCart },
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      console.error("[replaceCart] - User not found for ID:", userId);
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    console.log("[replaceCart] - Cart replaced successfully.");
    return updatedUser.cart; // Return the updated cart
  } catch (error) {
    console.error("[replaceCart] - Error occurred:", error);
    throw error;
  } finally {
    console.log("[replaceCart] - Disconnecting from database...");
    await disconnectDB();
  }
});
