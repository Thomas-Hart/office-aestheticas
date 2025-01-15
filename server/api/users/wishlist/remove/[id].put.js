import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    console.log("[removeFromWishlist] - Connecting to database...");
    await connectDB();

    try {
        const { itemId } = await readBody(event);
        console.log("[removeFromWishlist] - Received item ID to remove:", itemId);

        const userId = event.context.params.id;
        console.log("[removeFromWishlist] - User ID:", userId);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: { wishlist: { item: itemId } },
            },
            { new: true }
        );

        if (!updatedUser) {
            console.error("[removeFromWishlist] - User not found for ID:", userId);
            throw createError({
                statusCode: 404,
                message: "User not found",
            });
        }

        console.log("[removeFromWishlist] - Wishlist updated successfully:", updatedUser.wishlist);
        return updatedUser.wishlist;
    } catch (error) {
        console.error("[removeFromWishlist] - Error occurred:", error);
        throw error;
    } finally {
        console.log("[removeFromWishlist] - Disconnecting from database...");
        await disconnectDB();
    }
});