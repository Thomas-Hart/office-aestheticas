// Importing necessary utilities and models
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import User from '~/server/models/User.js'; // Make sure your User model path is correct

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    await connectDB(); // Ensure the database connection is established

    try {
        // Reading the request body
        const { email, password } = await readBody(event);

        // Finding the user by email
        const user = await User.findOne({ email });

        // If no user is found, or the password does not match
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw createError({ statusCode: 401, message: 'Invalid credentials' });
        }

        // Creating a JWT for the user
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Returning the token to the client
        return { token, user: user };

    } catch (error) {
        console.error('Error in POST /api/login:', error);
        if (error.statusCode === 401) {
            throw createError({ statusCode: 401, message: 'Invalid credentials' });
        }
        throw createError({ statusCode: 500, message: 'An unexpected error occurred. Please try again later.' });
    } finally {
        // Ensure the database connection is closed after handling the request
        await disconnectDB();
    }
});
