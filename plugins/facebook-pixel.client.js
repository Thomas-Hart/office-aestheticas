export default defineNuxtPlugin((nuxtApp) => {
  const { $fetch } = nuxtApp; // Access $fetch from Nuxt app context

  useHead({
    link: [
      {
        rel: 'preconnect',
        href: 'https://connect.facebook.net',
      },
    ],
  });

  // Initialize the Facebook Pixel
  const initFacebookPixel = () => {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      const pixelID = useRuntimeConfig().public.META_PIXEL_ID;
      fbq('init', pixelID);
      fbq('track', 'PageView');
    
  };

  // Load the pixel when the browser is idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initFacebookPixel());
  } else {
    setTimeout(() => initFacebookPixel(), 1000); // Fallback delay for browsers that don't support requestIdleCallback
  }

  // Provide fbq to the app with a retry fallback if it's not yet ready
  const fbqWrapper = async (...args) => {
    if (window.fbq) {
      const [method, eventName, data = {}] = args;
      if (method === 'track') {
        // Send to server endpoint using $fetch
        try {
          await fetch('/api/facebook-events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventName,
              data,
              email: data.email || null,
              customData: data.custom_data || {},
              eventId: data.eventID || Date.now().toString(),
            }),
          });
        } catch (err) {
          console.error('Server Event Error:', err);
        }
      }
      window.fbq(...args); // Still call Pixel for client-side tracking
    } else {
      setTimeout(() => fbqWrapper(...args), 500);
    }
  };

  nuxtApp.provide('fbq', fbqWrapper);
});