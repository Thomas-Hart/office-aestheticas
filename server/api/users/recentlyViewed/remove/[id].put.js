import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB();

    const { itemId } = await readBody(event);
    const userId = event.context.params.id;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $pull: { wishlist: { item: itemId } },
        },
        { new: true }
    );

    await disconnectDB();

    if (!updatedUser) {
        throw createError({
            statusCode: 404,
            message: "User not found",
        });
    }

    return updatedUser.wishlist;
});