import { readBody } from '#imports'
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
    await connectDB();
    const { id } = event.context.params;
    const body = await readBody(event);

    // Only set the fields you pass in (so nested helpful will merge correctly)
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (updatedReview) {
      await updateItemRating(updatedReview.itemId);
    }

    await disconnectDB();
    return updatedReview;
  } catch (error) {
    console.error('Error updating review:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message });
  }
});
