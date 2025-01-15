import Bundle from '~/server/models/Bundle.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const body = getQuery(event);
  const _id = body._id;

  try {
      if (_id) {
          const bundle = await Bundle.findById(_id);
          await disconnectDB(); // Disconnect from DB for static file generation to close after build success
          return bundle;
      } else {
          const allBundles = await Bundle.find({});
          // console.log("allBundles: ", JSON.stringify(allBundles));
          await disconnectDB();
        //   console.log("allBundles: " + allBundles);
          return allBundles;
      }
  } catch (error) {
      console.error(error);
      throw createError({ statusCode: 500, message: 'Server Error' });
  }
});

