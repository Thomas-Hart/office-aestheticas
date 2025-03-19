import Review from '~/server/models/Review.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  try {
    // Retrieve the item id from the route params.
    const { id } = event.context.params;
    
    await connectDB(); // Establish the DB connection
    // Find reviews that match the provided itemId.
    const reviews = await Review.find({ itemId: id });
    await disconnectDB(); // Close the DB connection
    
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews for item:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message });
  }
});
