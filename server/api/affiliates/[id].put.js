import Affiliate from '~/server/models/Affiliate.js'; 
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event);
        const affiliateId = event.context.params.id;

        const affiliate = await Affiliate.findById(affiliateId);
        if (!affiliate) {
            throw createError({ statusCode: 404, message: 'Affiliate not found' });
        }

        Object.assign(affiliate, body);
        await affiliate.save();
        await disconnectDB();
        return affiliate;
    } catch (error) {
        console.error('Error in PUT /api/affiliates/:id:', error);
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
