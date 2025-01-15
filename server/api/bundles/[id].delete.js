import Bundle from '~/server/models/Bundle.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
  try {
    const bundleId = event.context.params.id;

    const bundle = await Bundle.findByIdAndDelete(bundleId);
    if (!bundle) {
      throw createError({ statusCode: 404, message: 'Bundle not found' });
    }

    // Returning the deleted service bundle could be informative; adjust based on your preference
    await disconnectDB();
    return { message: 'Service bundle successfully deleted', bundle };
  } catch (error) {
    console.error('Error in DELETE /api/bundles/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
