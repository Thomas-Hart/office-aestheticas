import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import User from '~/server/models/User.js'; // Ensure your User model path is correct

export default defineEventHandler(async (event) => {
    await connectDB(); // Connect to the database

    try {
        const body = await readBody(event);
        // console.log("Request Body:", body);  // Log request body for debugging
        const { email, password, name } = body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createError({ statusCode: 409, message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            email,
            password,
            name
        });
        console.log("User to Save:", user);  // Log user data for debugging

        await user.save(); // Save the user, password will be hashed automatically by the model

        await disconnectDB(); // Disconnect from the database

        return { message: 'User created successfully' };
    } catch (error) {
        console.error('Error in POST /api/auth/createUser:', error);
        await disconnectDB();

        if (error.statusCode === 409) {
            throw createError({ statusCode: 409, message: 'User already exists' });
        }

        throw createError({ statusCode: 500, message: 'An unexpected error occurred. Please try again later.' });
    }
});
