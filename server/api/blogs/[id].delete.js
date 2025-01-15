import Blog from '~/server/models/Blog.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
  try {
    // const { params } = readBody(event);
    const blogId = event.context.params.id;

    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      throw createError({ statusCode: 404, message: 'Blog not found' });
    }

    // Returning the deleted blog could be informative; adjust based on your preference
    await disconnectDB();
    return { message: 'Blog successfully deleted', blog };
  } catch (error) {
    console.error('Error in DELETE /api/blogs/:id:', error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
