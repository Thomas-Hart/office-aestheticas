import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event);
        body._id = new mongoose.Types.ObjectId(); // Generate a new _id for the main item
        body.variants.forEach((variant) => {
            variant._id = new mongoose.Types.ObjectId(); // Generate a new _id for each variant
            variant.sku = null; // Reset SKU (if needed)
        });
        const item = new Item(body);
        await item.save(); // Save the new item with fresh IDs
        await disconnectDB();
        return item;
    } catch (error) {
        console.error('Error in POST /api/items:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
