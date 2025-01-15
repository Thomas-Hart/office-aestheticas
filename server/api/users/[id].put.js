import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  await connectDB();

  const userId = event.context.params.id;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    await disconnectDB();
    throw createError({ statusCode: 400, message: 'Invalid or missing userId' });
  }

  const body = await readBody(event);

  try {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      await disconnectDB();
      throw createError({ statusCode: 404, message: 'User not found' });
    }

    // Update arrays as needed
    if (Array.isArray(body.orders)) {
      existingUser.orders = body.orders;
    }

    if (Array.isArray(body.cart)) {
      existingUser.cart = body.cart;
    }

    // console.log("body: " + JSON.stringify(body));

    // Directly assign wishlist since we standardized on 'item'
    if (Array.isArray(body.wishlist)) {
      // body.wishlist should look like: [{ item: "ItemId", name: "...", image: "..." }, ...]
      existingUser.wishlist = body.wishlist;
    }

    if (Array.isArray(body.recentlyViewedItems)) {
      existingUser.recentlyViewedItems = body.recentlyViewedItems;
    }

    if (Array.isArray(body.shippingAddresses)) {
      existingUser.shippingAddresses = body.shippingAddresses;
    }

    if (Array.isArray(body.paymentMethods)) {
      existingUser.paymentMethods = body.paymentMethods;
    }

    if (body.adminDescription !== undefined) {
      existingUser.adminDescription = body.adminDescription;
    }

    if (body.preferredName !== undefined) {
      existingUser.preferredName = body.preferredName;
    }

    if (body.dateOfBirth !== undefined) {
      existingUser.dateOfBirth = body.dateOfBirth;
    }

    if (body.contact !== undefined) {
      existingUser.contact = body.contact;
    }

    existingUser.name = body.name || existingUser.name;
    existingUser.email = body.email || existingUser.email;
    existingUser.role = body.role || existingUser.role;

    if (body.password) {
      existingUser.password = body.password;
    }

    existingUser.profilePicture = body.profilePicture || existingUser.profilePicture;
    existingUser.bio = body.bio || existingUser.bio;

    const updatedUser = await existingUser.save();
    await disconnectDB();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
