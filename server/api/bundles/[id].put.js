import Bundle from '~/server/models/Bundle.js'; 
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    // console.log("Updating Bundle...");
    try {
        const body = await readBody(event);
        const bundleId = event.context.params.id;

        const bundle = await Bundle.findById(bundleId);
        if (!bundle) {
            throw createError({ statusCode: 404, message: 'Bundle not found' });
        }

        Object.assign(bundle, body);
        await bundle.save();
        await disconnectDB();
        return bundle;
    } catch (error) {
        console.error('Error in PUT /api/bundles/:id:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
