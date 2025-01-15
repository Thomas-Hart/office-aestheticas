import Order from '~/server/models/Order.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event);
    body._id = null;
    const order = new Order(body);
    await order.save();
    await disconnectDB();
    return order;
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
