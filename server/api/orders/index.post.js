import Order from '~/server/models/Order.js';
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';

export default defineEventHandler(async (event) => {
  await connectDB(); // Ensure DB connection

  try {
    const body = await readBody(event);
    const runtimeConfig = useRuntimeConfig();

    // Prepare order data
    body._id = null;
    const order = new Order(body);
    await order.save(); // Save to my own database

    // Extract necessary data for integrations
    const { email, total, items } = body;
    const orderId = order._id;
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

    // Send to taxCloud as well?

    // 1. Klaviyo Server-Side API - Track "Placed Order" event
    await fetch(`https://a.klaviyo.com/api/v1/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${runtimeConfig.private.KLAVIYO_PRIVATE_KEY}`, // Private key from .env
      },
      body: JSON.stringify({
        token: runtimeConfig.public.KLAVIYO_PUBLIC_KEY,
        event: 'Placed Order',
        customer_properties: { $email: email },
        properties: {
          $value: total,
          OrderId: orderId,
          Items: items.map(item => ({
            ProductName: item.name,
            SKU: item.sku,
            Quantity: item.quantity,
            ItemPrice: item.price,
          })),
        },
        time: timestamp,
      }),
    }).catch(err => console.error('Klaviyo Error:', err));

    // 2. Facebook Conversions API - Track "Purchase" event
    await fetch(`https://graph.facebook.com/v18.0/${runtimeConfig.public.META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [{
          event_name: 'Purchase',
          event_time: timestamp,
          action_source: 'website',
          event_id: orderId, // For deduplication
          user_data: {
            em: email, // Should be hashed for production, but simplified here
          },
          custom_data: {
            value: total,
            currency: 'USD',
            content_ids: items.map(item => item.sku),
            contents: items.map(item => ({
              id: item.sku,
              quantity: item.quantity,
              item_price: item.price,
            })),
          },
        }],
        access_token: runtimeConfig.private.FACEBOOK_ACCESS_TOKEN,
      }),
    }).catch(err => console.error('Facebook Conversions API Error:', err));

    // 3. ShipStation API - Create order
    // await fetch('https://ssapi.shipstation.com/orders/createorder', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Basic ${Buffer.from(`${runtimeConfig.private.SHIPSTATION_API_KEY}:${runtimeConfig.private.SHIPSTATION_API_SECRET}`).toString('base64')}`,
    //   },
    //   body: JSON.stringify({
    //     orderNumber: orderId,
    //     orderDate: new Date().toISOString(),
    //     orderStatus: 'awaiting_shipment',
    //     customerEmail: email,
    //     billTo: { name: body.customerName || email.split('@')[0] }, // Simplified billing info
    //     shipTo: body.shippingAddress || { name: body.customerName || email.split('@')[0] }, // Add shippingAddress to order schema if needed
    //     items: items.map(item => ({
    //       sku: item.sku,
    //       name: item.name,
    //       quantity: item.quantity,
    //       unitPrice: item.price,
    //     })),
    //     amountPaid: total,
    //     shippingAmount: body.shippingCost || 0, // Add shippingCost to order schema if applicable
    //   }),
    // }).catch(err => console.error('ShipStation Error:', err));

    await disconnectDB();
    return order;
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});