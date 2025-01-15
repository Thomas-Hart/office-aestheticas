export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const response = await $fetch('https://api-cat.usps.com/oauth2/v3/token', {
      method: 'POST',
      body: {
        client_id: process.env.TEST_CLIENT_ID,
        client_secret: process.env.TEST_CLIENT_SECRET,
        scope: "addresses subscriptions payments pickup tracking labels locations prices",
        grant_type: 'client_credentials',
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Error retrieving token',
    });
  }
});
