import { readBody, getQuery } from '#imports'
import Review from '~/server/models/Review.js';
import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

async function updateItemRating(itemId) {
  // Get all reviews for the given item
  const reviews = await Review.find({ itemId });
  const reviewCount = reviews.length;
  // Calculate total rating and average rating
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
  // Update the item document with the new metrics
  await Item.findByIdAndUpdate(itemId, { reviewCount, ratings: averageRating });
}

export default defineEventHandler(async (event) => {
  try {
    await connectDB(); // Ensure DB connection
    const query = getQuery(event);
    const itemId = query.itemId;
    if (!itemId) {
      throw createError({ statusCode: 400, message: 'Missing itemId query parameter.' });
    }
    // Parse the incoming array of review objects (which don't include itemId)
    const body = await readBody(event);
    // Attach the selected itemId to each review
    const reviewsWithItemId = body.map(review => ({ ...review, itemId }));

    // Insert the reviews in bulk
    const insertedReviews = await Review.insertMany(reviewsWithItemId);

    // Update the correlated item's rating metrics
    await updateItemRating(itemId);

    await disconnectDB(); // Disconnect after operations are complete
    return { message: 'Bulk upload successful', reviews: insertedReviews };
  } catch (error) {
    console.error('Error during bulk review upload:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message });
  }
});
