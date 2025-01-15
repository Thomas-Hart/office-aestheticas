import mongoose from 'mongoose';
import User from '~/server/models/User.js';

const messageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'in progress', 'closed'],
    default: 'open',
  },
  messages: [messageSchema],
  userUnread: {
    type: Boolean,
    default: false, // New tickets start as unread
  },
  adminUnread: {
    type: Boolean,
    default: true,
  },
  lastReadAt: {
    user: { type: Date }, // Last read time for the user
    admin: { type: Date }, // Last read time for the admin
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
