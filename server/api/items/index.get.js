import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  // console.log("[API] index.get.js: Received request for all items");
  await connectDB();
  try {
    const items = await Item.find({});
    // console.log("[API] index.get.js: Fetched items:", items);
    await disconnectDB();
    return items;
  } catch (error) {
    console.error("[API] index.get.js: Error fetching items:", error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
