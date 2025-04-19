// plugins/klaviyo-pixel.client.js
export default defineNuxtPlugin((nuxtApp) => {
  const defaultKlaviyoWrapper = (...args) => {
    console.warn('Klaviyo is not available during SSR.');
  };
  const defaultKlaviyoClientApi = {
    subscribe: () => Promise.resolve(),
    trackEvent: () => Promise.resolve(),
    updateProfile: () => Promise.resolve(),
  };

  if (process.client) {
    useHead({
      link: [
        { rel: 'preconnect', href: 'https://static.klaviyo.com' },
        { rel: 'preconnect', href: 'https://a.klaviyo.com' },
      ],
    });

    const publicApiKey = useRuntimeConfig().public.TEST_KLAVIYO_PUBLIC_KEY;
    console.log('Klaviyo publicApiKey:', publicApiKey);
    if (!publicApiKey) {
      console.warn('Klaviyo public API key not found in runtime config.');
      nuxtApp.provide('klaviyo', defaultKlaviyoWrapper);
      nuxtApp.provide('klaviyoClientApi', defaultKlaviyoClientApi);
      return;
    }

    const initKlaviyoPixel = () => {
      !(function (w, d, t) {
        w.Trekkie = w.Trekkie || [];
        w.jstag = w.jstag || [];
        var s = d.createElement(t),
          x = d.getElementsByTagName(t)[0];
        s.async = 1;
        s.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${publicApiKey}`;
        s.id = 'klaviyo-onsite-script';
        x.parentNode.insertBefore(s, x);
      })(window, document, 'script');

      if (window._learnq) {
        window._learnq.push(['init', publicApiKey]);
        window._learnq.push(['track', 'Viewed Page', { pageType: 'other' }]);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => initKlaviyoPixel());
    } else {
      setTimeout(() => initKlaviyoPixel(), 2000);
    }

    const klaviyoWrapper = (...args) => {
      console.log('klaviyoWrapper args:', args);
      if (window._learnq) {
        window._learnq.push(args);
        const [method, eventName, properties = {}] = args;
        if (method === 'track') {
          console.log('Sending track to server:', eventName, properties);
          $fetch('/api/klaviyo-events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              method,
              eventName,
              properties,
              email: properties.$email || null,
              eventId: properties.$event_id || Date.now().toString(),
            }),
          }).catch(err => console.error('Server Klaviyo Track Error:', err));
        } else if (method === 'identify') {
          console.log('Sending identify to server:', properties);
          $fetch('/api/klaviyo-events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              method,
              properties,
              email: properties.$email || null,
            }),
          }).catch(err => console.error('Server Klaviyo Identify Error:', err));
        }
      } else {
        setTimeout(() => klaviyoWrapper(...args), 500);
      }
    };

    const clientApiCall = async (endpoint, body) => {
      console.log(`clientApiCall`, endpoint, body);
      try {
        const response = await $fetch(`https://a.klaviyo.com${endpoint}?company_id=${publicApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            revision: '2024-10-15',
          },
          body: JSON.stringify(body),
        });
        console.log(`clientApiCall success`, endpoint, response);

        await $fetch('/api/klaviyo-client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint, body }),
        }).catch(err => console.error('Server Klaviyo Client API Error:', err));

        return response;
      } catch (error) {
        console.error(`Error with ${endpoint}:`, error);
        throw error;
      }
    };

    const klaviyoClientApi = {
      subscribe: (listId, email, phoneNumber, source = 'Website Form') => {
        console.log('subscribe() called with', { listId, email, phoneNumber, source });
        const attributes = { list_id: listId, email, custom_source: source };
        if (phoneNumber) attributes.phone_number = phoneNumber;
        return clientApiCall('/client/subscriptions', { data: { type: 'subscription', attributes } });
      },
      trackEvent: (profile, metric, properties = {}, timestamp = new Date().toISOString(), value = null) => {
        console.log('trackEvent() called with', { profile, metric, properties, timestamp, value });
        return clientApiCall('/client/events', {
          data: { type: 'event', attributes: { profile: profile || {}, metric: { name: metric }, properties, time: timestamp, value } }
        });
      },
      updateProfile: (attributes) => {
        console.log('updateProfile() called with', attributes);
        return clientApiCall('/client/profiles', { data: { type: 'profile', attributes } });
      },
    };

    nuxtApp.provide('klaviyo', klaviyoWrapper);
    nuxtApp.provide('klaviyoClientApi', klaviyoClientApi);
  } else {
    nuxtApp.provide('klaviyo', defaultKlaviyoWrapper);
    nuxtApp.provide('klaviyoClientApi', defaultKlaviyoClientApi);
  }
});
