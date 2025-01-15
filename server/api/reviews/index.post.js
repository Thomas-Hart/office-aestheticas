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
    const { itemId, itemName, rating, comment, tags, reviewer, reviewerName, reviewId, businessRep, reply } = body;

    // Validate the required fields
    if (!itemId || !itemName || !rating || !comment || !reviewer || !reviewerName) {
      throw createError({ statusCode: 400, message: 'All required fields must be provided.' });
    }

    if (reply) {
      // If a reply is being added to an existing review
      const review = await Review.findById(reviewId);
      if (review) {
        review.businessReplies.push({ businessRep: businessRep, comment: reply });
        await review.save();
      }
    } else {
      // Check if an existing review by this user for this item exists
      let existingReview = await Review.findOne({ itemId, reviewer });

      if (existingReview) {
        // If the review exists, update it
        existingReview.updates.push({ rating, comment });
        existingReview.tags = tags;
        await existingReview.save();
      } else {
        // If no review exists, create a new one
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

      // Update the rating for the specific item
      await updateItemRating(itemId);
    }

    await disconnectDB(); // Disconnect from DB after success
    return { message: 'Review added/updated successfully' };
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message || 'Server Error' });
  }
});
