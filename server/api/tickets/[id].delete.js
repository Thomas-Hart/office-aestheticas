import Ticket from '~/server/models/Ticket';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const ticketId = event.context.params.id;

    // Delete the specific ticket by ID
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    if (!ticket) {
      throw createError({ statusCode: 404, message: 'Ticket not found' });
    }

    await disconnectDB();
    return {
      message: 'Ticket successfully deleted',
    };
  } catch (error) {
    console.error('Error in DELETE /api/tickets/[id]:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
