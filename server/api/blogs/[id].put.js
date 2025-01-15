import Blog from '~/server/models/Blog.js'; 
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event); // Read request body
        const blogId = event.context.params.id;

        // Check if body exists before destructuring
        const increment = body.increment;
        const newComments = body.newComments;

        let updatedBlog;

        if (increment) {
            // console.log("Was increment");
            updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $inc: { views: 1 }, // Increment the views field by 1
                },
                {
                    new: true, // Return the updated document
                    runValidators: true, // Ensure validation rules are applied
                }
            );
        } else if (newComments) {
            // console.log("Was comments");
            updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    comments: newComments,
                },
                {
                    new: true, // Return the updated document
                    runValidators: true, // Ensure validation rules are applied
                }
            );
        } else if (body) {
            // console.log("Was body");
            updatedBlog = await Blog.findByIdAndUpdate(blogId, body, {
                new: true, // Return the updated document
                runValidators: true, // Ensure validation is run
            });
        }

        await disconnectDB();
        return updatedBlog;
    } catch (error) {
        console.error('Error in PUT /api/blogs/:id:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
