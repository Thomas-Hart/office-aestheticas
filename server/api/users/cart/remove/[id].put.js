import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  console.log("[removeFromCart] - Connecting to database...");
  await connectDB();

  try {
    const { itemId, variantId } = await readBody(event);

    const userId = event.context.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          cart: {
            _id: itemId,
            ...(variantId ? { variantId } : {}), // Only include variantId if provided
          },
        },
      },
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      console.error("[removeFromCart] - User not found for ID:", userId);
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    console.log("[removeFromCart] - Item removed successfully.");
    return updatedUser.cart; // Return the updated cart
  } catch (error) {
    console.error("[removeFromCart] - Error occurred:", error);
    throw error;
  } finally {
    console.log("[removeFromCart] - Disconnecting from database...");
    await disconnectDB();
  }
});
