import Review from '~/server/models/Review';
import Item from '~/server/models/Item'; // Assuming this is your item/product model
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event); // Extract the request body
    const reviewId = event.context.params.id; // Get the review ID from the URL parameters

    // Build an update object with only the allowed fields
    const updateFields = {};
    if (typeof body.rating !== 'undefined') {
      updateFields.rating = body.rating;
    }
    if (typeof body.comment !== 'undefined') {
      updateFields.comment = body.comment;
    }
    if (typeof body.tags !== 'undefined') {
      updateFields.tags = body.tags;
    }
    // You can add any other allowed fields here

    // Use findByIdAndUpdate with runValidators and return the new document
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedReview) {
      throw createError({ statusCode: 404, message: 'Review not found' });
    }

    // Optionally update the associated item's rating and review count
    if (updatedReview.itemId) {
      const reviews = await Review.find({ itemId: updatedReview.itemId });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = (totalRating / reviews.length).toFixed(1);
      await Item.findByIdAndUpdate(updatedReview.itemId, {
        ratings: parseFloat(averageRating),
        reviewCount: reviews.length,
      });
    }

    await disconnectDB(); // Disconnect from DB
    return updatedReview; // Return the updated review
  } catch (error) {
    console.error('Error in PUT /api/reviews/:id:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message || 'Server Error' });
  }
});
