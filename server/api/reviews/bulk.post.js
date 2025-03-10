import Review from '~/server/models/Review.js';
import Item from '~/server/models/Item.js'; // Assuming this is your item/product model
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

// Function to update the rating and review count for an item
async function updateItemRating(itemId) {
  const reviews = await Review.find({ itemId });

  if (reviews.length === 0) {
    await Item.findByIdAndUpdate(itemId, { ratings: 0, reviewCount: 0 });
    return;
  }

  let totalRating = 0;
  let reviewCount = 0;

  // Calculate total rating
  reviews.forEach((review) => {
    if (review.updates && review.updates.length > 0) {
      const latestUpdate = review.updates.reduce((latest, update) => {
        return update.date > latest.date ? update : latest;
      }, review.updates[0]);
      totalRating += latestUpdate.rating;
    } else {
      totalRating += review.rating;
    }
    reviewCount++;
  });

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
    const body = await readBody(event);
    const reviewsArray = body.reviews;

    // Validate that an array of reviews was provided
    if (!reviewsArray || !Array.isArray(reviewsArray) || reviewsArray.length === 0) {
      throw createError({ statusCode: 400, message: 'No reviews provided.' });
    }

    // Set to track which itemIds have been updated
    const updatedItemIds = new Set();

    // Process each review in the array
    for (const reviewData of reviewsArray) {
      const { itemId, itemName, rating, comment, tags, reviewer, reviewerName } = reviewData;

      // Validate required fields for each review
      if (!itemId || !itemName || !rating || !comment || !reviewer || !reviewerName) {
        throw createError({
          statusCode: 400,
          message: 'Missing required fields in one of the reviews.',
        });
      }

      // Check if an existing review by this user for this item exists
      let existingReview = await Review.findOne({ itemId, reviewer });
      if (existingReview) {
        existingReview.updates.push({ rating, comment });
        existingReview.tags = tags;
        await existingReview.save();
      } else {
        // Create a new review if none exists
        const newReview = new Review({
          itemId,
          itemName,
          reviewer,
          reviewerName,
          rating,
          comment,
          tags,
        });
        await newReview.save();
      }
      
      // Mark this itemId as updated
      updatedItemIds.add(itemId);
    }

    // Update the rating and review count for all affected items
    for (const id of updatedItemIds) {
      await updateItemRating(id);
    }

    await disconnectDB(); // Disconnect from DB after processing
    return { message: 'Bulk reviews added/updated successfully' };
  } catch (error) {
    console.error('Error in POST /api/reviews/bulk:', error);
    await disconnectDB();
    throw createError({
      statusCode: 500,
      message: error.message || 'Server Error',
    });
  }
});
