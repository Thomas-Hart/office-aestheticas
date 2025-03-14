import Review from '~/server/models/Review.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  try {
    await connectDB(); // Ensure DB connection
    const reviews = await Review.find({});
    await disconnectDB(); // Disconnect after fetching data
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message });
  }
});
