import { getDoc } from 'firebase/firestore'

// https://nuxt.com/docs/api/configuration/nuxt-config
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


});

