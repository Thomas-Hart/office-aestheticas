import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    console.log("[addToWishlist] - Connecting to database...");
    await connectDB();

    try {
        const { wishlistItem } = await readBody(event);
        console.log("[addToWishlist] - Received wishlist item:", wishlistItem);

        const userId = event.context.params.id;
        console.log("[addToWishlist] - User ID:", userId);
 
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: { wishlist: wishlistItem },
            },
            { new: true }
        );

        if (!updatedUser) {
            console.error("[addToWishlist] - User not found for ID:", userId);
            throw createError({
                statusCode: 404,
                message: "User not found",
            });
        }

        console.log("[addToWishlist] - Wishlist updated successfully:", updatedUser.wishlist);
        return updatedUser.wishlist;
    } catch (error) {
        console.error("[addToWishlist] - Error occurred:", error);
        throw error;
    } finally {
        console.log("[addToWishlist] - Disconnecting from database...");
        await disconnectDB();
    }
});