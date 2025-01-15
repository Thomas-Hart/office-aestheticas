import Order from '~/server/models/Order.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
  try {
    // const { params } = readBody(event);
    const orderId = event.context.params.id;

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      throw createError({ statusCode: 404, message: 'Order not found' });
    }

    // Returning the deleted order could be informative; adjust based on your preference
    await disconnectDB();
    return { message: 'Order successfully deleted', order };
  } catch (error) {
    console.error('Error in DELETE /api/orders/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
