import Ticket from '~/server/models/Ticket.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    // Extract the user ID from the route params
    const { id } = event.context.params;

    // Find all tickets associated with the user ID
    const tickets = await Ticket.find({ userId: id });

    // If no tickets are found, throw a 404 error
    if (!tickets || tickets.length === 0) {
      return [];
    }

    await disconnectDB(); // Disconnect from DB after fetching data
    return tickets;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
