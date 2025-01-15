import Affiliate from '~/server/models/Affiliate.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection
  const body = getQuery(event);
  const _id = body._id;

  try {
      if (_id) {
          const affiliate = await Affiliate.findById(_id);
          await disconnectDB(); // Disconnect from DB for static file generation to close after build success
          return affiliate;
      } else {
          const allAffiliates = await Affiliate.find({});
          await disconnectDB();
        //   console.log("allAffiliates: " + allAffiliates);
          return allAffiliates;
      }
  } catch (error) {
      console.error(error);
      throw createError({ statusCode: 500, message: 'Server Error' });
  }
});

