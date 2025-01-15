import Ticket from '~/server/models/Ticket.js';
import User from '~/server/models/User.js'; // Assuming you need this for user validation
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const body = await readBody(event);
    const { userId, userName, title, description } = body;

    // Validate the required fields for a new ticket
    if (!userId || !title || !description) {
      throw createError({ statusCode: 400, message: 'All required fields must be provided.' });
    }

      // Create a new ticket
      const newTicket = new Ticket({
        userId: userId,
        userName: userName,
        title: title,
        description: description,
        status: 'open', // New tickets default to open
        messages: [{ senderName: userName, text: description }],
        userUnread: false,
        adminUnread: true,
      });

      await newTicket.save();

    await disconnectDB(); // Disconnect from DB after success
    return newTicket;
  } catch (error) {
    console.error('Error in POST /api/tickets:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message || 'Server Error' });
  }
});
