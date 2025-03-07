// server/api/klaviyo-events.js
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const runtimeConfig = useRuntimeConfig();
    const privateApiKey = runtimeConfig.private.TEST_KLAVIYO_PRIVATE_KEY;
  
    try {
      // Handle klaviyoWrapper (track and identify)
      if (body.method === 'track') {
        // Server-side Track API (POST /api/events)
        await fetch('https://a.klaviyo.com/api/events', {
          method: 'POST',
          headers: {
            'Authorization': `Klaviyo-API-Key ${privateApiKey}`,
            'Content-Type': 'application/json',
            'revision': '2024-10-15', // Latest revision
          },
          body: JSON.stringify({
            data: {
              type: 'event',
              attributes: {
                profile: { email: body.email },
                metric: { name: body.eventName },
                properties: body.properties,
                unique_id: body.eventId,
                time: new Date().toISOString(),
              },
            },
          }),
        }).catch(err => console.error('Klaviyo Server Track Error:', err));
      } else if (body.method === 'identify') {
        // Server-side Create Profile API (POST /api/profiles)
        await fetch('https://a.klaviyo.com/api/profiles', {
          method: 'POST',
          headers: {
            'Authorization': `Klaviyo-API-Key ${privateApiKey}`,
            'Content-Type': 'application/json',
            'revision': '2024-10-15',
          },
          body: JSON.stringify({
            data: {
              type: 'profile',
              attributes: {
                email: body.email,
                ...body.properties,
              },
            },
          }),
        }).catch(err => console.error('Klaviyo Server Identify Error:', err));
      }
  
      // Handle klaviyoClientApi (subscribe, trackEvent, updateProfile)
      if (body.endpoint) {
        if (body.endpoint === '/client/subscriptions') {
          // Server-side Subscribe Profiles API (POST /api/subscriptions)
          const { list_id, email, phone_number, custom_source } = body.body.data.attributes;
          await fetch('https://a.klaviyo.com/api/subscriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Klaviyo-API-Key ${privateApiKey}`,
              'Content-Type': 'application/json',
              'revision': '2024-10-15',
            },
            body: JSON.stringify({
              data: {
                type: 'subscription',
                attributes: {
                  list_id,
                  email,
                  phone_number,
                  custom_source,
                },
              },
            }),
          }).catch(err => console.error('Klaviyo Server Subscribe Error:', err));
        } else if (body.endpoint === '/client/events') {
          // Server-side Create Event API (POST /api/events)
          const { profile, metric, properties, time, value } = body.body.data.attributes;
          await fetch('https://a.klaviyo.com/api/events', {
            method: 'POST',
            headers: {
              'Authorization': `Klaviyo-API-Key ${privateApiKey}`,
              'Content-Type': 'application/json',
              'revision': '2024-10-15',
            },
            body: JSON.stringify({
              data: {
                type: 'event',
                attributes: {
                  profile,
                  metric,
                  properties,
                  time,
                  value,
                },
              },
            }),
          }).catch(err => console.error('Klaviyo Server Track Event Error:', err));
        } else if (body.endpoint === '/client/profiles') {
          // Server-side Create Profile API (POST /api/profiles)
          const attributes = body.body.data.attributes;
          await fetch('https://a.klaviyo.com/api/profiles', {
            method: 'POST',
            headers: {
              'Authorization': `Klaviyo-API-Key ${privateApiKey}`,
              'Content-Type': 'application/json',
              'revision': '2024-10-15',
            },
            body: JSON.stringify({
              data: {
                type: 'profile',
                attributes,
              },
            }),
          }).catch(err => console.error('Klaviyo Server Update Profile Error:', err));
        }
      }
  
      return { success: true };
    } catch (error) {
      console.error('Klaviyo Server API Error:', error);
      throw createError({ statusCode: 500, message: 'Server Error' });
    }
  });