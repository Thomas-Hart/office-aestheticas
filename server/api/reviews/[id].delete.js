import Review from '~/server/models/Review.js';
import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

async function updateItemRating(itemId) {
  const reviews = await Review.find({ itemId });
  const reviewCount = reviews.length;
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
  await Item.findByIdAndUpdate(itemId, { reviewCount, ratings: averageRating });
}

export default defineEventHandler(async (event) => {
  try {
    await connectDB(); // Ensure DB connection
    const { id } = event.context.params; // Get the review _id from the route parameter

    // Find and delete the review document
    const deletedReview = await Review.findByIdAndDelete(id);

    if (deletedReview) {
      // Update the correlated item's ratings after deletion
      await updateItemRating(deletedReview.itemId);
    }

    await disconnectDB(); // Disconnect after deletion
    return { message: 'Review deleted successfully', deletedReview };
  } catch (error) {
    console.error('Error deleting review:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message });
  }
});
