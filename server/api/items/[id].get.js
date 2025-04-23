import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  // console.log("[API] [id].get.js: Received request for item with id:", id);
  await connectDB();
  try {
    const item = await Item.findById(id);
    // console.log("[API] [id].get.js: Fetched item:", item.name);
    await disconnectDB();
    if (!item) {
      console.warn("[API] [id].get.js: No item found for id:", id);
      throw createError({ statusCode: 404, message: 'Item not found' });
    }
    return item;
  } catch (error) {
    console.error("[API] [id].get.js: Error fetching item:", error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
