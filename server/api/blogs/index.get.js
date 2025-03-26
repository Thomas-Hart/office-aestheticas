import Blog from '~/server/models/Blog.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB();
  const query = getQuery(event);
  const { _id, tag, page, limit } = query;

  try {
    if (_id) {
      const blog = await Blog.findById(_id);
      await disconnectDB();
      return blog;
    } else {
      // Featured posts: select top 3 by views
      const featuredBlogs = await Blog.find({})
        .sort({ views: -1 })
        .limit(3);
      const featuredIds = featuredBlogs.map(b => b._id);

      // Regular blogs: exclude featured ones and, if a tag is provided, filter by it.
      let filter = { _id: { $nin: featuredIds } };
      if (tag) {
        filter.tags = tag;
      }

      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 5;
      const totalRegular = await Blog.countDocuments(filter);
      const regularBlogs = await Blog.find(filter)
        .sort({ date: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

      await disconnectDB();
      return {
        featured: featuredBlogs,
        regular: regularBlogs,
        totalRegular,
      };
    }
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
