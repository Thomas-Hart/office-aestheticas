import Ticket from '~/server/models/Ticket.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  try {
    await connectDB(); // Ensure DB connection

    // Fetch all tickets and populate user and messages sender info
    const tickets = await Ticket.find({});

    await disconnectDB(); // Disconnect from DB after fetching data
    return tickets;
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: error.message });
  }
});
