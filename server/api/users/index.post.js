import User from '~/server/models/User.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    // Get request body
    const body = await readBody(event);

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      throw createError({ statusCode: 400, message: 'Missing required fields: name, email, or password' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw createError({ statusCode: 400, message: 'User with this email already exists' });
    }

    // Create new user
    const newUser = new User({
      name: body.name,
      email: body.email,
      password: body.password, // Password will be hashed in the pre-save hook
      profilePicture: body.profilePicture || '',
      bio: body.bio || '',
      shippingAddresses: body.shippingAddresses || [],
      cart: body.cart || [],
      wishlist: body.wishlist || [],
      recentlyViewedItems: body.recentlyViewedItems || [],
      paymentMethods: body.paymentMethods || [],
      accountSettings: {
        emailPreferences: body.accountSettings?.emailPreferences || true,
        notifications: body.accountSettings?.notifications || true,
      },
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    await disconnectDB(); // Disconnect after operation
    return {
      statusCode: 201,
      message: 'User created successfully',
      user: savedUser,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
