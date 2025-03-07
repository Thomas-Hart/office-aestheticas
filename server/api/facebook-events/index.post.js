export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const runtimeConfig = useRuntimeConfig();
  
    // Forward to Pixel (client-side simulation or direct call if needed)
    if (process.client) {
      const fbq = window.fbq || (() => {});
      fbq('track', body.eventName, body.data);
    }
  
    // Send to Conversions API
    await fetch(`https://graph.facebook.com/v18.0/${runtimeConfig.public.META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: body.eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_id: body.eventId || Date.now().toString(),
          user_data: { em: body.email }, // Hash in production
          custom_data: body.customData || {},
        }],
        access_token: runtimeConfig.private.META_ACCESS_TOKEN,
      }),
    }).catch(err => console.error('Conversions API Error:', err));
  
    return { success: true };
  });