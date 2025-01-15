import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
  try {
    const itemId = event.context.params.id;

    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      throw createError({ statusCode: 404, message: 'Item not found' });
    }

    // Returning the deleted service item could be informative; adjust based on your preference
    await disconnectDB();
    return { message: 'Service item successfully deleted', item };
  } catch (error) {
    console.error('Error in DELETE /api/items/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
