import Review from '~/server/models/Review';
import Item from '~/server/models/Item'; // Assuming this is your item/product model
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event); // Extract the request body
    const reviewId = event.context.params.id; // Get the review ID from the URL parameters

    // Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review) {
      throw createError({ statusCode: 404, message: 'Review not found' });
    }

    // Update the review with new data
    Object.assign(review, body);
    await review.save();

    // Optionally, you can update the average rating of the associated item
    if (review.itemId) {
      const reviews = await Review.find({ itemId: review.itemId });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = (totalRating / reviews.length).toFixed(1);

      // Update the item's average rating and review count
      await Item.findByIdAndUpdate(review.itemId, {
        ratings: parseFloat(averageRating),
        reviewCount: reviews.length,
      });
    }

    await disconnectDB(); // Disconnect from DB
    return review; // Return the updated review
  } catch (error) {
    console.error('Error in PUT /api/reviews/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
