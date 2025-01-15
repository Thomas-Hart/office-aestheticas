import Review from '~/server/models/Review';
import Item from '~/server/models/Item'; // Assuming this is your item/product model
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

async function updateItemRating(itemId) {
  // Find all reviews for the specific item
  const reviews = await Review.find({ itemId });

  if (reviews.length === 0) {
    // If no reviews are found, set the item's rating to 0
    await Item.findByIdAndUpdate(itemId, { ratings: 0, reviewCount: 0 });
    return;
  }

  let totalRating = 0;
  let reviewCount = 0;

  // Calculate the total rating based on the reviews
  reviews.forEach((review) => {
    if (review.updates && review.updates.length > 0) {
      // Get the latest rating update if there are any
      const latestUpdate = review.updates.reduce((latest, update) => {
        return update.date > latest.date ? update : latest;
      }, review.updates[0]);
      totalRating += latestUpdate.rating;
    } else {
      totalRating += review.rating;
    }
    reviewCount++;
  });

  // Calculate the average rating
  const averageRating = (totalRating / reviewCount).toFixed(1);

  // Update the item's rating and review count
  await Item.findByIdAndUpdate(itemId, {
    ratings: parseFloat(averageRating),
    reviewCount: reviewCount,
  });
}

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const reviewId = event.context.params.id;

    // Delete the specific review by ID
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      throw createError({ statusCode: 404, message: 'Review not found' });
    }

    // Update the rating for the specific item
    if (review.itemId) {
      await updateItemRating(review.itemId);
    }

    await disconnectDB();
    return {
      message: 'Review successfully deleted and item rating updated',
    };
  } catch (error) {
    console.error('Error in DELETE /api/reviews/[id]:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
