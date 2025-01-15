import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const userId = event.context.params.id;

  try {
    await User.findByIdAndDelete(userId);
    await disconnectDB(); // Disconnect from DB after deleting data
    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
