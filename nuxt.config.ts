import { getDoc } from 'firebase/firestore'

export default defineNuxtConfig({

  compatibilityDate: "2024-10-20",

  future: {
    compatibilityVersion: 4,
  },
  pages: true,


  experimental: {
    sharedPrerenderData: false,
    compileTemplate: true,
    resetAsyncDataToUndefined: true,
    templateUtils: true,
    relativeWatchPaths: true,
    defaults: {
      useAsyncData: {
        deep: true
      }
    }
  },
  devtools: { enabled: false },
  ssr: false,
  modules: [
    '@vesp/nuxt-fontawesome',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'nuxt-vuefire',
    'nuxt-headlessui',
    '@samk-dev/nuxt-vcalendar',
    '@vite-pwa/nuxt'
  ],
  googleFonts: {
    families: {
      "Montserrat": true
    }
  },
  fontawesome: {
    component: 'font-awesome-icon', // Ensure the component name is set correctly
    icons: {
      solid: ['faBars', 'faTimes', 'faSearch', 'faShoppingCart', 'faUser', 'faHeart', 'faStar', 'faArrowRight', 'faArrowLeft', 'faArrowUp', 'faArrowDown'],
      brands: ['faFacebook', 'faTwitter', 'faInstagram', 'faYoutube', 'faPinterest', 'faLinkedin', 'faTwitch', 'faGithub', 'faGoogle'],
    },
  },
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: true,

    },
    config: {
      apiKey: "AIzaSyCMyWLcatjjRStqDqjGv316q9buh9xiyzI",
      authDomain: "preppalnuxt.firebaseapp.com",
      projectId: "preppalnuxt",
      storageBucket: "preppalnuxt.appspot.com",
      messagingSenderId: "629368922726",
      appId: "1:629368922726:web:f0e4af66a460c599a203a7"

    }
  },
  hooks: {
    'pages:extend'(pages) {
      // Add a redirect from `/` to `/welcome`
      pages.push({
        name: 'root',
        path: '/',
        redirect: '/',
      });
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    registerWebManifestInRouteRules: true,
    manifest: {
      name: 'PrepPal',
      short_name: 'PrepPal',
      description: 'One way to easily store your recipes, mealplan and create a shopping list',
      theme_color: '#f9fafb',
      background_color: '#f9fafb',
      display: 'standalone',
      icons: [
        {
          src: '/icons/android/android-launchericon-192-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/android/android-launchericon-512-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: ({ request }) =>
            request.destination === 'document' || request.destination === 'script',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'html-cache',
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            },
          },
        },
      ],
    },
  },

});