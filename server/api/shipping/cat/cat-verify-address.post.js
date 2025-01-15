export default defineEventHandler(async (event) => {
    const { accessToken, address } = await readBody(event);
    // console.log("accessToken: ", accessToken.access_token, "address: ", address);
    // console.log("address: " + JSON.stringify(address));
    try {
      const response = await $fetch('https://api-cat.usps.com/addresses/v3/address', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
        params: address,
      });
      return response;
    } catch (error) {
      console.error('Error verifying address:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Error verifying address',
      });
    }
  });
  