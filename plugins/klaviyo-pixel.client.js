// plugins/klaviyo-pixel.client.js
export default defineNuxtPlugin((nuxtApp) => {
  // Default no-op fallback functions (for SSR)
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

    const publicApiKey = useRuntimeConfig().public.KLAVIYO_PUBLIC_KEY;
    if (!publicApiKey) {
      console.warn('Klaviyo public API key not found in runtime config. Tracking will not function.');
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

      // Initialize Klaviyo tracking (using the _learnq object)
      if (window._learnq) {
        window._learnq.push(['init', publicApiKey]);
        window._learnq.push(['track', 'Viewed Page', { pageType: 'other' }]);
      }
    };

    // Load the pixel when the browser is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initKlaviyoPixel();
      });
    } else {
      setTimeout(() => {
        initKlaviyoPixel();
      }, 2000);
    }

    // Actual wrapper that pushes to the _learnq array
    const klaviyoWrapper = (...args) => {
      if (window._learnq) {
        window._learnq.push(args);
      } else {
        setTimeout(() => klaviyoWrapper(...args), 500); // Retry if not ready
      }
    };

    const clientApiCall = async (endpoint, body) => {
      if (!window.fetch) {
        console.error('Fetch API not supported');
        return;
      }
      try {
        const response = await fetch(`https://a.klaviyo.com${endpoint}?company_id=${publicApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            revision: '2023-02-22',
          },
          body: JSON.stringify(body),
        });
        const responseText = await response.text();
        // console.log('Response status:', response.status);
        // console.log('Response text:', responseText);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}, Text: ${responseText}`);
        }
        let data = null;
        if (responseText) {
          try {
            data = JSON.parse(responseText);
          } catch (jsonError) {
            console.warn('Response is not valid JSON:', jsonError);
            data = null;
          }
        } else if (response.status === 202) {
          // console.log('Received 202 Accepted with empty response, subscription is processing.');
        }
        // console.log(`${endpoint} successful:`, data);
        return data;
      } catch (error) {
        console.error(`Error with ${endpoint}:`, error);
        throw error;
      }
    };

    const klaviyoClientApi = {
      subscribe: (listId, email, phoneNumber, source = 'Website Form') => {
        const attributes = { list_id: listId, email, custom_source: source };
        if (phoneNumber) {
          attributes.phone_number = phoneNumber;
        }
        return clientApiCall('/client/subscriptions', {
          data: { type: 'subscription', attributes },
        });
      },
      trackEvent: (profile, metric, properties = {}, timestamp = new Date().toISOString(), value = null) =>
        clientApiCall('/client/events', {
          data: {
            type: 'event',
            attributes: {
              profile: profile || {},
              metric: { name: metric },
              properties,
              timestamp,
              value,
            },
          },
        }),
      updateProfile: (attributes) =>
        clientApiCall('/client/profiles', {
          data: { type: 'profile', attributes },
        }),
    };

    nuxtApp.provide('klaviyo', klaviyoWrapper);
    nuxtApp.provide('klaviyoClientApi', klaviyoClientApi);
  } else {
    // For SSR, provide the no-op fallback functions
    nuxtApp.provide('klaviyo', defaultKlaviyoWrapper);
    nuxtApp.provide('klaviyoClientApi', defaultKlaviyoClientApi);
  }
});
