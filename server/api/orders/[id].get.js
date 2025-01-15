import Order from '~/server/models/Order.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB();


  try {
    const { id } = event.context.params; // Extract user ID from the request parameters

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required',
      });
    }

    // Retrieve orders associated with the user ID
    const orders = await Order.find({ userId: id });

    if (orders) {
      return orders;
    }
  } catch (error) {
    console.error('Error in GET /api/orders/[id]:', error);
    throw createError({
      statusCode: 500,
      message: 'Server Error',
    });
  } finally {
    await disconnectDB();
  }
});
