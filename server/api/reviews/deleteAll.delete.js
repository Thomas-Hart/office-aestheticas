import Review from '~/server/models/Review';
import Item from '~/server/models/Item'; // Assuming this is your item/product model
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

// Function to reset ratings and review counts for all items
async function resetAllItemRatings() {
  const items = await Item.find({});
  for (const item of items) {
    await Item.findByIdAndUpdate(item._id, { ratings: 0, reviewCount: 0 });
  }
}

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    // Delete all reviews
    await Review.deleteMany({});

    // Reset ratings and review counts for all items
    await resetAllItemRatings();

    await disconnectDB();
    return {
      message: 'All reviews successfully deleted and ratings reset for all items',
    };
  } catch (error) {
    console.error('Error in DELETE /api/reviews/deleteAll:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
