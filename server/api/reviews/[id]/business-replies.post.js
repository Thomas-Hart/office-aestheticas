import Review from '~/server/models/Review';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB();
  try {
    const reviewId = event.context.params.id; // review ID from URL
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.businessRep || !body.comment) {
      throw createError({
        statusCode: 400,
        message: 'Business reply must include businessRep and comment',
      });
    }

    // Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review) {
      throw createError({ statusCode: 404, message: 'Review not found' });
    }

    // Create new reply object (date will default if your schema has default: Date.now)
    const newReply = {
      businessRep: body.businessRep,
      comment: body.comment,
      date: new Date(),
    };

    // Add the new reply to the businessReplies array
    review.businessReplies.push(newReply);

    // Save the updated review document
    await review.save();

    await disconnectDB();
    return { message: 'Business reply added successfully', review };
  } catch (error) {
    console.error('Error in POST /api/reviews/:id/business-replies:', error);
    await disconnectDB();
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Server Error',
    });
  }
});
