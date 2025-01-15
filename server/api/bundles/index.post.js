import Bundle from '~/server/models/Bundle.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event);
    const bundle = new Bundle(body);
    // console.log("Body: " + JSON.stringify(body));
    await bundle.save();
    // console.log("Bundle: " + bundle);
    await disconnectDB();
    return bundle;
  } catch (error) {
    console.error('Error in POST /api/bundles:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
