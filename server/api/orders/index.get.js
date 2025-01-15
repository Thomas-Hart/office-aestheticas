import Order from '~/server/models/Order.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const body = getQuery(event);
  const _id = body._id;

  try {
      if (_id) {
          const order = await Order.findById(_id);
          await disconnectDB(); // Disconnect from DB for static file generation to close after build success
          return order;
      } else {
          const allOrders = await Order.find({});
          await disconnectDB();
          return allOrders;
      }
  } catch (error) {
      console.error(error);
      throw createError({ statusCode: 500, message: 'Server Error' });
  }
});

