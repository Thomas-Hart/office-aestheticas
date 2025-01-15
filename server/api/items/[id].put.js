import Item from '~/server/models/Item.js'; 
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event);
        const itemId = event.context.params.id;

        const item = await Item.findById(itemId);
        if (!item) {
            throw createError({ statusCode: 404, message: 'Item not found' });
        }

        Object.assign(item, body);
        await item.save();
        await disconnectDB();
        return item;
    } catch (error) {
        console.error('Error in PUT /api/items/:id:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
