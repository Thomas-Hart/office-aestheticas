export default defineEventHandler(async (event) => {
  const { totalCost, userLocation } = await readBody(event);

  // Attempt to parse the total cost
  const total = parseFloat(totalCost);
  if (isNaN(total)) {
    console.warn("Invalid or missing totalCost in request body:", totalCost);
    // Return 0 tax if the totalCost is invalid.
    return 0;
  }
  
  let tax = 0;

  // Only proceed if the userLocation object is valid.
  if (fullUserLocation(userLocation)) {
    // Check if a TaxJar API key is available in the environment.
    if (process.env.TAXJAR_API_KEY) {
      // Build the payload according to TaxJar's API requirements.
      const payload = {
        from_country: "US",
        from_zip: "84097", // Change to your origin ZIP code.
        from_state: "UT",  // Change to your origin state.
        to_country: "US",
        to_zip: userLocation.postal_code,
        to_state: userLocation.state,
        amount: total,
        shipping: 0 // Adjust if you need to account for shipping.
      };

      try {
        // Call TaxJar's tax calculation endpoint.
        const response = await $fetch('https://api.taxjar.com/v2/taxes', {
          method: 'POST',
          headers: {
            'Authorization': `Token token=${process.env.TAXJAR_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        // TaxJar returns a response object containing tax details.
        // For example, we assume the field "tax" contains "amount_to_collect".
        if (response && response.tax && typeof response.tax.amount_to_collect === 'number') {
          tax = response.tax.amount_to_collect;
        } else {
          console.warn("Unexpected response from TaxJar:", response);
          // Fallback to the mock calculation.
          tax = total * 0.05;
        }
      } catch (error) {
        console.error("Error calling TaxJar API:", error);
        // In case of an error, fall back to the mock calculation.
        tax = total * 0.05;
      }
    } else {
      // Fallback: use a simple 5% tax calculation if no TaxJar API key is provided.
      tax = total * 0.05;
    }
  }

  return tax;
});

/**
 * Validates that the userLocation object has the required fields.
 * Adjusted to work with shipping address data from PayPal.
 */
function fullUserLocation(userLocation) {
  if (!userLocation) {
    return false;
  }
  
  // Ensure required address fields are present and non-empty.
  if (!userLocation.city || !userLocation.state || !userLocation.postal_code) {
    return false;
  }
  
  return true;
}
