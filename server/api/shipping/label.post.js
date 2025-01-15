import Label from '~/server/models/Label.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event);
    body.username = "NationalAutoHub";
    const label = new Label(body);
    // console.log("label: " + label);
    await label.save();
    await disconnectDB();
    return label;
  } catch (error) {
    console.error('Error in POST /api/shipping/label.post.js:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
  