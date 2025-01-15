export default defineEventHandler(async (event) => {
    const { totalCost, userLocation } = await readBody(event);
    let tax = 0;
    // console.log(userLocation);
    if (fullUserLocation(userLocation)) {
        // tax = totalCost * 0.05;
        tax = totalCost * 0;
    }
    // console.log("tax before returning: ", tax);
    return tax;

    // try {
    //   const response = await $fetch('https://api.taxjar.com/v2/taxes', { // Use zip tax or whatever it is
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${process.env.TAXJAR_API_KEY}`,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       amount: totalCost,
    //       to_country: 'US',
    //       to_zip: location.zip,
    //       to_state: location.state,
    //       to_city: location.city,
    //       to_street: location.street,
    //     })
    //   });
    //   return response.tax.amount_to_collect;
    // } catch (error) {
    //   console.error(`Failed to calculate sales tax: ${error.message}`);
    //   throw error;
    // }
  });

function fullUserLocation(userLocation) {
    if (!userLocation) {
      return false;
    }
  
    if (userLocation.streetAddress == "") {
      return false;
    }
  
    if (userLocation.city == "") {
      return false;
    }
  
    if (userLocation.state == "") {
      return false;
    }
  
    if (userLocation.ZIPCode == "") {
      return false;
    }
  
    return true;
  }