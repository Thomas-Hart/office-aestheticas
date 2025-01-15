import Order from '~/server/models/Order.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
    await connectDB(); // Ensure DB connection
    try {
        const body = await readBody(event); // Read request body
        const orderId = event.context.params.id;

        // Validate body fields against schema
        const validFields = [
            'invoiceNumber',
            'orderDate',
            'shippedDate',
            'expectedDeliveryDate',
            'deliveryDate',
            'status',
            'totalCost',
            'itemizedList',
            'salesTax',
            'salesTaxRate',
            'buyersBillingAddress',
            'buyersShippingAddress',
            'sellersBusinessInformation',
            'paymentMethod',
            'trackingNumber',
        ];

        // Filter out invalid fields
        const updateData = Object.keys(body).reduce((acc, key) => {
            if (validFields.includes(key)) {
                acc[key] = body[key];
            }
            return acc;
        }, {});

        if (Object.keys(updateData).length === 0) {
            throw createError({ statusCode: 400, message: 'No valid fields to update' });
        }

        // Update the order
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        });

        if (!updatedOrder) {
            throw createError({ statusCode: 404, message: 'Order not found' });
        }

        await disconnectDB();
        return updatedOrder;
    } catch (error) {
        console.error('Error in PUT /api/orders/:id:', error);
        await disconnectDB();
        throw createError({ statusCode: 500, message: 'Server Error' });
    }
});
