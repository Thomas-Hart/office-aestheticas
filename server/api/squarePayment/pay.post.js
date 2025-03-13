import { randomUUID } from 'crypto';
import { Client, ApiError } from 'square';

const config = useRuntimeConfig();
// Configure the Square client
const client = new Client({
  accessToken: config.private.SQUARE_ACCESS_TOKEN,
  environment: 'production',
});

const paymentsApi = client.paymentsApi;

// BigInt serialization for JSON responses
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default defineEventHandler(async (event) => {
  console.log("=== Entering pay.post Event Handler ===");

  try {
    // Parse the request body
    const { locationId, sourceId, cartItems, userLocation } = await readBody(event);
    if (!locationId || !sourceId || !Array.isArray(cartItems) || !userLocation) {
      throw new Error("Invalid request body: Missing required fields.");
    }

    // console.log("Received Request Body:", { locationId, sourceId, cartItems, userLocation });

    // Initialize total cost
    let totalCost = await getCartTotal(cartItems);

    console.log(`Total cost before tax: ${totalCost}`);

    // Fetch sales tax and add it to the total cost
    const salesTax = await fetchSalesTax(totalCost, userLocation);
    console.log(`Sales Tax fetched: ${salesTax}`);

    totalCost += salesTax;
    console.log(`Total cost after adding sales tax: ${totalCost}`);

    // Convert total cost to smallest currency unit (cents) and round
    const amountInCents = Math.round(totalCost * 100);
    console.log(`Total cost in smallest currency unit (cents): ${amountInCents}`);

    // Prepare the payment payload with custom statement description identifier
    const paymentPayload = {
      locationId,
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: amountInCents,
        currency: 'USD',
      },
      statementDescriptionIdentifier: 'Office Aestheticas', // Custom statement description identifier
    };
    console.log("Payment Payload:", paymentPayload);

    // Create the payment
    const { result } = await paymentsApi.createPayment(paymentPayload);
    console.log("Payment API Result:", result);

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Error calling Square API:", {
        message: error.message,
        statusCode: error.statusCode,
        errors: error.errors,
      });
    } else {
      console.error("Unexpected Error:", error);
    }

    throw createError({ statusCode: 500, message: 'Payment processing error', cause: error });
  }
});

// Helper function to fetch the price of an item
async function getCartTotal(cartItems) {
  // console.log(`Fetching price for item ID: ${itemId}`);
  try {
    let total = await $fetch("/api/cart/total", {
      method: "POST",
      body: { cartItems: cartItems },
    });
    console.log("total: ", total);
    return parseFloat(total);
  } catch (error) {
    console.error("Error fetching cart total:", error);
  }
}

// Helper function to fetch sales tax
async function fetchSalesTax(totalCost, userLocation) {
  // console.log("Fetching Sales Tax with:", { totalCost, userLocation });

  try {
    const response = await $fetch(`/api/tax/salesTax`, {
      method: 'POST',
      body: {
        totalCost,
        userLocation,
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching sales tax:", error.message);
    throw error;
  }
}
