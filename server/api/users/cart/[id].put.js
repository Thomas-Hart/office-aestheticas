import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    console.log("[mergeCart] - Connecting to database...");
    await connectDB();

    try {
        const { cart: localCart } = await readBody(event);

        if (!localCart || !Array.isArray(localCart)) {
            throw createError({
                statusCode: 400,
                message: "Invalid cart data provided. It must be an array.",
            });
        }

        const userId = event.context.params.id;

        const user = await User.findById(userId);

        if (!user) {
            console.error("[mergeCart] - User not found for ID:", userId);
            throw createError({
                statusCode: 404,
                message: "User not found",
            });
        }

        // Merge local cart with user's existing cart
        const mergedCart = [...user.cart];

        localCart.forEach((localItem) => {
            const existingItem = mergedCart.find(
                (cartItem) =>
                    cartItem._id === localItem._id &&
                    cartItem.variantId === localItem.variantId
            );

            if (existingItem) {
                // If the item already exists, update the quantity
                existingItem.quantity += localItem.quantity;
            } else {
                // If the item doesn't exist, add it to the cart
                mergedCart.push(localItem);
            }
        });

        // Update user's cart in the database
        user.cart = mergedCart;
        await user.save();

        console.log("[mergeCart] - Cart merged successfully.");
        return user.cart;
    } catch (error) {
        console.error("[mergeCart] - Error occurred:", error);
        throw error;
    } finally {
        console.log("[mergeCart] - Disconnecting from database...");
        await disconnectDB();
    }
});
