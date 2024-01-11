<script setup lang="ts">
import type { Email } from "@/emails/emails"
import type { Config } from "tailwindcss"

const tailwindConfig = {
  content: [
    `**/components/**/*.{vue,js}`,
    `**/composables/**/*.{js,ts}`,
    `**/layouts/**/*.vue`,
    `**/pages/**/*.vue`,
    `**/plugins/**/*.{js,ts}`,
    `**/store/**/*.{js,ts}`,
    `app.{js,ts,vue}`,
    `App.{js,ts,vue}`,
  ],
  theme: {
    boxShadow: {
      base: "0px 4px 8px 0px rgba(0, 0, 0, 0.02)",
      lg: "0px 10px 30px 0px rgba(0, 0, 0, 0.08)",
    },
    colors: {
      black: "#000000",
      error: {
        100: "#FEF0F0",
        200: "#FCE1E1",
        300: "#FBCACA",
        400: "#F58A8A",
        50: "#FEF6F6",
        600: "#C43737",
        700: "#A32E2E",
        800: "#782222",
        900: "#4C1515",
        DEFAULT: "#EE4343",
      },
      neutral: {
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#CFD4DB",
        400: "#9BA3AF",
        50: "#F9FAFB",
        600: "#4A5462",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
        DEFAULT: "#6A717F",
      },
      primary: {
        100: "#EDF9F9",
        200: "#D6F1F1",
        300: "#B8E7E6",
        400: "#61C9C7",
        50: "#F2FBFB",
        600: "#00908E",
        700: "#007270",
        800: "#005453",
        900: "#003635",
        DEFAULT: "#00A8A5",
      },
      secondary: {
        100: "#FEF7EB",
        200: "#FDF0D8",
        300: "#FCE4BA",
        400: "#F9C367",
        50: "#FFFAF3",
        600: "#C98208",
        700: "#A76C07",
        800: "#7B5005",
        900: "#4E3303",
        DEFAULT: "#F49E0A",
      },
      success: {
        100: "#EDFAF2",
        200: "#DBF6E5",
        300: "#C1EED2",
        400: "#75DA9B",
        50: "#F4FCF7",
        600: "#1BA14C",
        700: "#16853F",
        800: "#11622F",
        900: "#0B3F1E",
        DEFAULT: "#21C45D",
      },
      tertiary: {
        100: "#F4FAFE",
        200: "#E5F4FD",
        300: "#D2EBFB",
        400: "#9BD4F6",
        50: "#F7FCFE",
        600: "#4E98C6",
        700: "#417EA5",
        800: "#305D79",
        900: "#1E3B4D",
        DEFAULT: "#5EB9F1",
      },
      transparent: "transparent",
      warning: {
        100: "#FEF7EB",
        200: "#FDF0D8",
        300: "#FCE4BA",
        400: "#F9C367",
        50: "#FFFAF3",
        600: "#C98208",
        700: "#A76C07",
        800: "#7B5005",
        900: "#4E3303",
        DEFAULT: "#F49E0A",
      },
      white: "#FFFFFF",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    fontSize: {
      "display-lg": ["1.75rem", "120%"],
      "display-md": ["1.5rem", "120%"],
      "display-sm": ["1.25rem", "120%"],
      "display-xs": ["1.125rem", "120%"],
      lg: ["1rem", "120%"],
      md: ["0.875rem", "120%"],
      sm: ["0.8125rem", "120%"],
      xs: ["0.75rem", "120%"],
    },
    fontWeight: {
      medium: "500",
      regular: "400",
      semibold: "600",
    },
  },
} satisfies Config

defineProps<Email>()
</script>

<template>
  <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
  <ETailwind :config="tailwindConfig">
    <EHtml class="bg-neutral-100 font-sans" lang="ru">
      <EHead>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossorigin="true"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </EHead>
      <EBody>
        <EContainer class="py-10">
          <EImg
            class="ml-6 object-contain"
            height="48"
            src="https://api.ipr-stand.e-queo.xyz/images/reset_password_email_logo_240_48_ru.png"
            width="240"
          />
          <div class="mt-6 rounded-3xl bg-white p-8">
            <EHeading
              class="m-0 text-display-md font-semibold text-neutral-900"
            >
              {{ title }}
            </EHeading>
            <EText
              v-for="line in description"
              :key="line"
              class="text-lg text-neutral"
            >
              {{ line }}
            </EText>
            <EButton
              class="mt-2 rounded-xl bg-primary px-6 py-4 font-medium text-white"
            >
              {{ button }}
            </EButton>
            <EHr class="mt-8" />
            <EText class="text-lg text-neutral">
              По любым вопросам звоните в службу поддержки по телефону
              <ELink class="text-primary" href="tel:88002348430">
                8&nbsp;800&nbsp;234-84-30
              </ELink>
              с 9 до 20 по московскому времени, или напишите на
              <ELink class="text-primary" href="mailto:support@e-queo.com">
                support@e-queo.com
              </ELink>
            </EText>
            <EText class="mb-0 mt-2 text-sm text-neutral">
              Это письмо сформировано автоматически, отвечать на него не нужно
            </EText>
            <EText class="mt-1 text-sm text-neutral">
              ООО Эквио, 2018. Все права защищены
            </EText>
          </div>
        </EContainer>
      </EBody>
    </EHtml>
  </ETailwind>
</template>
