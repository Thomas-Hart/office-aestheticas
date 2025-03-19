import { readBody } from '#imports'
import Review from '~/server/models/Review.js';
import Item from '~/server/models/Item.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

async function updateItemRating(itemId) {
  console.log("Updating item: " + itemId);
  // Get all reviews for the given item
  const reviews = await Review.find({ itemId });
  const reviewCount = reviews.length;
  console.log("Reviews: " + reviewCount);
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  console.log("Total Rating: " + totalRating);
  const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
  console.log("Average Rating: " + averageRating);
  await Item.findByIdAndUpdate(itemId, { reviewCount, ratings: averageRating });
}

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const body = await readBody(event); // Now using readBody instead of useBody
    // Create and save a new review document
    const review = new Review(body);
    const savedReview = await review.save();
    // Update the associated item's rating metrics
    await updateItemRating(savedReview.itemId);
    await disconnectDB();
    return savedReview;
  } catch (error) {
    console.error('Error creating review:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message });
  }
});
