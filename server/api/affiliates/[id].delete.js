import Affiliate from '~/server/models/Affiliate.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
  try {
    const affiliateId = event.context.params.id;

    const affiliate = await Affiliate.findByIdAndDelete(affiliateId);
    if (!affiliate) {
      throw createError({ statusCode: 404, message: 'Affiliate not found' });
    }

    // Returning the deleted service affiliate could be informative; adjust based on your preference
    await disconnectDB();
    return { message: 'Service affiliate successfully deleted', affiliate };
  } catch (error) {
    console.error('Error in DELETE /api/affiliates/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
