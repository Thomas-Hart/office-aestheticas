export default defineEventHandler(async (event) => {
  const { accessToken, pricingInfo } = await readBody(event);
  try {
    const response = await $fetch('https://api.usps.com/prices/v3/total-rates/search', {
      method: 'POST',
      body: pricingInfo,
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error getting price:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Error getting price',
    });
  }
});
