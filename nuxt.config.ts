import { intercom } from "./store/scripts"

export default defineNuxtConfig({
  $production: {
    app: {
      head: {
        script: [intercom],
      },
    },
  },
  appConfig: {
    nuxtIcon: {
      size: "20px",
    },
  },
  experimental: {
    typedPages: true,
  },
  extends: [
    "./modules/admin",
    "./modules/auth",
    "./modules/ipr",
    "./modules/employees",
  ],
  googleFonts: {
    display: "swap",
    families: {
      Inter: [400, 500, 600],
    },
  },
  i18n: {
    compilation: {
      strictMessage: false,
    },
    defaultLocale: "ru",
    langDir: "assets/lang/",
    lazy: true,
    locales: [
      {
        code: "ru",
        file: "ru.json",
        iso: "ru-RU",
        name: "Русский",
      },
      {
        code: "en",
        file: "en.json",
        iso: "en-GB",
        name: "English",
      },
      {
        code: "fr",
        file: "fr.json",
        iso: "fr-FR",
        name: "Français",
      },
    ],
    types: "composition",
  },
  imports: {
    dirs: ["./composables/**", "./store/**", "./utils/**"],
  },
  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "@pinia-plugin-persistedstate/nuxt",
    "@pinia/nuxt",
    "@vue-email/nuxt",
    "@vueuse/nuxt",
    "nuxt-headlessui",
    "nuxt-icon",
    "nuxt-svgo",
  ],
  postcss: {
    plugins: {
      "tailwindcss/nesting": "postcss-nesting",
    },
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  ssr: false,
  svgo: {
    defaultImport: "component",
  },
  tailwindcss: {
    viewer: false,
  },
  vue: {
    defineModel: true,
  },
})
