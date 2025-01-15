import Ticket from '~/server/models/Ticket';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  try {
    const body = await readBody(event); // Extract the request body
    const ticketId = event.context.params.id; // Get the ticket ID from the URL parameters

    const { senderName, text, isUser, status, adminUnread, userUnread } = body; // Assuming body contains `sender` and `text` fields for the new message

    if ((!senderName || !text) && !status && adminUnread == null && userUnread == null) {
      throw createError({ statusCode: 400, message: 'Sender name and text are required for a new message, or need status update, or unread update.' });
    }

    let updatedTicket;

    if (status) {
      updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          status: status,
          updatedAt: new Date(), // Update the ticket's updated timestamp
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validation rules are applied
        }
      );
    }

    if (adminUnread != null) {
      updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          adminUnread: adminUnread,
          updatedAt: new Date(), // Update the ticket's updated timestamp
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validation rules are applied
        }
      );
    }

    if (userUnread != null) {
      updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          userUnread: userUnread,
          updatedAt: new Date(), // Update the ticket's updated timestamp
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validation rules are applied
        }
      );
    }

    // Find the ticket and add the new message to the messages array
    if (isUser && senderName && text) {
      updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          $push: { messages: { senderName: senderName, text: text, timestamp: new Date() } },
          adminUnread: true,
          updatedAt: new Date(), // Update the ticket's updated timestamp
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validation rules are applied
        }
      );
    } else if (!isUser && senderName && text) {
      updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          $push: { messages: { senderName: senderName, text: text, timestamp: new Date() } },
          userUnread: true,
          updatedAt: new Date(), // Update the ticket's updated timestamp
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validation rules are applied
        }
      );
    }

    if (!updatedTicket) {
      throw createError({ statusCode: 404, message: 'Ticket not found' });
    }

    await disconnectDB(); // Disconnect from DB
    return updatedTicket; // Return the updated ticket with the new message added
  } catch (error) {
    console.error('Error in PUT /api/tickets/:id:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
