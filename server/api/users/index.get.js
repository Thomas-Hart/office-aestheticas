import User from '~/server/models/User.js';
import Order from '~/server/models/Order.js';
import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    // Fetch users and populate related fields
    const randomOrder = await Order.findOne({}); // To ensure Order model is registered
    const randomItem = await Item.findOne({}); // To ensure Item model is registered

    const users = await User.find()
      .populate({
        path: 'cart.product',
        model: 'Item', // Populating cart items with the Item model
      })
      .populate('wishlist', 'name price image') // Populating wishlist items (only fetching certain fields)
      .populate('recentlyViewedItems', 'name price image'); // Populating recently viewed items

    await disconnectDB(); // Disconnect from DB after fetching data
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
