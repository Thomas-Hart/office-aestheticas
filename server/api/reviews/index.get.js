import Review from '~/server/models/Review.js';
import User from '~/server/models/User.js';
import Item from '~/server/models/Item'; // Assuming this is your item/product model
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  try {
    await connectDB(); // Ensure DB connection
    const query = getQuery(event);
    const itemId = query.itemId;
    const userId = query.user;

    const randomUser = await User.findOne({}); // To ensure User model is registered

    let reviews;

    // If both userId and itemId are provided, fetch the user's review for that item
    if (userId && itemId) {
      reviews = await Review.findOne({
        itemId: itemId,
        reviewer: userId,
      })
        .populate('reviewer', 'name')
        .populate({ path: 'itemId', model: Item, select: 'name' });
    }
    // If only itemId is provided, fetch all reviews for that item
    else if (itemId) {
      reviews = await Review.find({
        itemId: itemId,
      })
        .populate('reviewer', 'name')
        .populate({ path: 'itemId', model: Item, select: 'name' });
    }
    // If only userId is provided, fetch all reviews written by that user
    else if (userId) {
      reviews = await Review.find({ reviewer: userId })
        .populate('reviewer', 'name')
        .populate({ path: 'itemId', model: Item, select: 'name' });
    }
    // If no query parameters are provided, return all reviews
    else {
      reviews = await Review.find({})
        .populate('reviewer', 'name')
        .populate({ path: 'itemId', model: Item, select: 'name' });
    }

    await disconnectDB(); // Disconnect from DB after fetching data
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message });
  }
});
