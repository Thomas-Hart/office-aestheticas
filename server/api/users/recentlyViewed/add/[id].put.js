import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB();

    console.log("HELLO");

    const { recentlyViewedItem } = await readBody(event);
    console.log("recentlyViewed: " + JSON.stringify(recentlyViewedItem));
    const userId = event.context.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                // Remove the item if it exists
                $pull: { recentlyViewedItems: { item: recentlyViewedItem.item } },
            },
            { new: true } // Return the updated user document after $pull
        );

        if (!updatedUser) {
            console.error(`[recentlyViewed] - User not found for ID: ${userId}`);
            throw createError({
                statusCode: 404,
                message: "User not found",
            });
        }

        // Add the item to the front
        const finalUpdatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: { recentlyViewedItems: { $each: [recentlyViewedItem], $position: 0 } },
            },
            { new: true } // Return the updated user document after $push
        );

        await disconnectDB();

        console.log("recentlyViewedItems updated successfully:", finalUpdatedUser.recentlyViewedItems);
        return finalUpdatedUser.recentlyViewedItems;
    } catch (error) {
        console.error("[recentlyViewed] - Error occurred:", error);
        await disconnectDB();
        throw error;
    }
});
