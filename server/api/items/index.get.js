import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const body = getQuery(event);
  const _id = body._id;

  try {
      if (_id) {
          const item = await Item.findById(_id);
          await disconnectDB(); // Disconnect from DB for static file generation to close after build success
          return item;
      } else {
          const allItems = await Item.find({});
          await disconnectDB();
        //   console.log("allItems: " + allItems);
          return allItems;
      }
  } catch (error) {
      console.error(error);
      throw createError({ statusCode: 500, message: 'Server Error' });
  }
});

