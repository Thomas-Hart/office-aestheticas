import Affiliate from '~/server/models/Affiliate.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    
  try {
    const body = await readBody(event);
    // console.log("body: " + JSON.stringify(body));
    const affiliate = new Affiliate(body);
    await affiliate.save();
    await disconnectDB();
    return affiliate;
  } catch (error) {
    console.error('Error in POST /api/affiliates:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
