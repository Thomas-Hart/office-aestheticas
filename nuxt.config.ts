// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: true,
  routeRules: {
    // Homepage pre-rendered at build time
    '/': { ssr: true },
    '/orderConfirmation': { ssr: true },
    '/profile': { ssr: true },
    '/terms': { prerender: true },
    '/privacy': { prerender: true },
    '/refund' : { prerender: true },
    // Blog posts page generated on demand, revalidates in background, cached on CDN for 1 hour (3600 seconds)
    '/blog': { ssr: true },
    // Blog post page generated on demand once until next deployment, cached on CDN
    '/blog/**': { ssr: true },
    // Portfolio Item page generated on demand once until next deployment, cached on CDN
    '/item/**': { ssr: true },
    '/affiliate/**': { ssr: true },
    '/bundle/**': { ssr: true },
    '/review/**': { ssr: true },
    '/order/**': { ssr: true },
  },
  devtools: { enabled: true },

  nitro: {
    compressPublicAssets: true, // This enables compression for public assets
    // middleware: ['~/server/middleware/compression.js'], // Add custom middleware for compression
  },

  app: {
    pageTransition: {
      name: 'fade', // Use 'fade' as the transition name or choose your own
      mode: 'out-in' // Ensure the new page fades in only after the old page fades out
    }
  },

  css: ['~/css/Transitions/Fade.css'],

  modules: [
    '@nuxtjs/google-fonts', "@nuxt/image", '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', 'nuxt-vue3-google-signin'
  ],

  googleFonts: {
    families: {
      // Specify each family and the variations you want to load
      'Source+Sans+Pro': [400, 600, 700], // Loads only the specified weights
      'Montserrat': [400, 700], // Loads only the specified weights
      'Poppins': [400, 700], // Loads only the specified weights
      'Lora': [400, 700], // Add Lora with the specified weights
      'Inter': [400]
    },    
    display: 'swap', // Ensures text remains visible during webfont load
    preconnect: true // Enables DNS-prefetching for Google Fonts domains
  },

  ignore: process.env.NODE_ENV === 'production' 
    ? [
        'pages/blog/editBlogs.vue', 
        'pages/serviceItem/editServiceItems.vue'
      ] 
    : [],

    googleSignIn: {
      clientId: process.env.GOOGLE_CLIENT_ID,
    },

  runtimeConfig: {    
    // Public keys that are exposed to the client
    
    private: {
      // Database
      DB_URI: process.env.DB_URI,

      // USPS
      USPS_CLIENT_SECRET: process.env.USPS_CLIENT_SECRET,

      // Google Sign In
      JWT_SECRET: process.env.JWT_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_LOGIN_URI: process.env.GOOGLE_LOGIN_URI,
      GOOGLE_LOGIN_URI_TEST: process.env.GOOGLE_LOGIN_URI_TEST,

      // AWS
      NUXT_AWS_ACCESS_KEY: process.env.NUXT_AWS_ACCESS_KEY,
      NUXT_AWS_SECRET_KEY: process.env.NUXT_AWS_SECRET_KEY,
      NUXT_AWS_REGION: process.env.NUXT_AWS_REGION,
      NUXT_S3_BUCKET: process.env.NUXT_S3_BUCKET,

      // Amazon Pay
      AMAZON_PAY_CLIENT_SECRET: process.env.AMAZON_PAY_CLIENT_SECRET,
      AMAZON_PAY_PRIVATE_KEY_PATH: process.env.AMAZON_PAY_PRIVATE_KEY_PATH,

      // Klaviyo
      TEST_KLAVIYO_PRIVATE_KEY: process.env.TEST_KLAVIYO_PRIAVTE_KEY,
      META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN,

      // Square Payment
      SQUARE_SANDBOX_ACCESS_TOKEN: process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
      SQUARE_ACCESS_TOKEN: process.env.SQUARE_ACCESS_TOKEN,
    },
    
    public: {
      // USPS
      USPS_USER_ID: process.env.USPS_USER_ID,
      USPS_CLIENT_ID: process.env.USPS_CLIENT_ID,

      // Amazon Pay
      AMAZON_PAY_CHECKOUT_RETURN_URL: process.env.AMAZON_PAY_CHECKOUT_RETURN_URL,
      AMAZON_PAY_SELLER_ID: process.env.AMAZON_PAY_SELLER_ID,    // Also Merchant ID
      AMAZON_PAY_PUBLIC_KEY_ID: process.env.AMAZON_PAY_PUBLIC_KEY_ID,
      AMAZON_PAY_CLIENT_ID: process.env.AMAZON_PAY_CLIENT_ID, // Also Store ID

      // Klaviyo
      TEST_KLAVIYO_PUBLIC_KEY: process.env.TEST_KLAVIYO_PUBLIC_KEY,
      TEST_KLAVIYO_WAITLIST_ID: process.env.TEST_KLAVIYO_WAITLIST_ID,
      TEST_KLAVIYO_OA_USERS_ID: process.env.TEST_KLAVIYO_OA_USERS_ID,
      KLAVIYO_PUBLIC_KEY: process.env.KLAVIYO_PUBLIC_KEY,
      KLAVIYO_WAITLIST_ID: process.env.KLAVIYO_WAITLIST_ID,

      // Meta Pixel
      META_PIXEL_ID: process.env.META_PIXEL_ID,

      // Square Payment
      SQUARE_LOCATION_ID: process.env.SQUARE_LOCATION_ID,
      TEST_SQUARE_APP_ID: process.env.TEST_SQUARE_APP_ID,
      SQUARE_APP_ID: process.env.SQUARE_APP_ID,
    }
  },

  compatibilityDate: '2024-12-09',
})