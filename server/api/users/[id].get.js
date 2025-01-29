import User from '~/server/models/User.js';
import Order from '~/server/models/Order.js';
import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const randomOrder = await Order.findOne({}); // To ensure Order model is registered
    const randomItem = await Item.findOne({}); // To ensure Item model is registered

    // Extract the user ID from the event context (route params)
    const { id } = event.context.params;

    // Fetch the user by ID and populate related fields
    const user = await User.findById(id)
      .populate('wishlist', 'name price image') // Populating wishlist items (only fetching certain fields)
      .populate('recentlyViewedItems', 'name price image'); // Populating recently viewed items

    // If the user is not found, throw a 404 error
    if (!user) {
      throw createError({ statusCode: 404, message: 'User not found' });
    }

    await disconnectDB(); // Disconnect from DB after fetching data
    // console.log(JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
