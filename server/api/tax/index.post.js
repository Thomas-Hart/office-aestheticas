import Order from '~/server/models/Order.js';
import Item from '~/server/models/Item.js'; // Import the Item model
import { connectDB } from '~/server/utils/dbConnect';
import { disconnectDB } from '~/server/utils/dbDisconnect';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  await connectDB();
  try {
    const body = await readBody(event);

    // Fetch all items from the database
    const allItems = await Item.find({}).lean();

    // Initialize total cost
    let totalCost = 0;

    // Process itemizedList to enrich it with detailed item and variant information
    const enrichedItemizedList = body.itemizedList.map((cartItem) => {
      const item = allItems.find((i) => i._id.toString() === cartItem.itemId);
      if (!item) throw new Error(`Item with ID ${cartItem.itemId} not found`);

      const variant =
        item.variants.find((v) => v._id.toString() === cartItem.variantId) || {};

      // Calculate cost for the current cart item
      const price = variant.price || item.price; // Use variant price if available, otherwise item price
      const cost = price * cartItem.quantity;
      totalCost += cost;

      return {
        itemId: item._id,
        variantId: variant._id || null,
        name: item.name,
        variantDetails: {
          color: variant.color,
          size: variant.size,
          material: variant.material,
          style: variant.style,
          ...variant.dimensions,
        },
        image: variant.image || item.image,
        price,
        quantity: cartItem.quantity,
      };
    });

    // Fetch sales tax from the salesTax API
    const salesTax = await $fetch(`/api/tax/salesTax`, {
      method: 'POST',
      body: {
        totalCost,
        userLocation: body.buyersShippingAddress,
      },
    });

    totalCost += salesTax;

    // Update body with enriched data and calculated values
    body.itemizedList = enrichedItemizedList;
    body.totalCost = totalCost;
    body.invoiceNumber = `INV-${uuidv4()}`;
    body.salesTax = salesTax;
    body.salesTaxRate = salesTax / (totalCost - salesTax);
    body.sellersBusinessInformation.taxIDNum = process.env.TAX_ID_NUM;

    // Create and save the order
    const order = new Order(body);

    console.log("Order: " + JSON.stringify(order));
    await order.save();

    await disconnectDB();
    return order;
  } catch (error) {
    console.error('Error in POST /api/tax:', error);
    await disconnectDB();
    throw createError({ statusCode: 500, message: 'Server Error' });
  }
});
