<script setup lang="ts">
import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"

const { localeProperties, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <HeadlessMenu v-slot="{ open }" as="div" class="relative">
    <HeadlessMenuButton
      class="button outlined sm outline-none"
      :class="{ 'bg-white': open }"
    >
      <TheLocaleSwitchItem
        :icon="localeProperties.iso?.split('-')[1].toLowerCase()"
        :locale="localeProperties.code"
      />
    </HeadlessMenuButton>
    <HeadlessMenuItems
      class="absolute bottom-full mb-2 rounded-lg bg-white shadow-lg outline-none"
    >
      <HeadlessMenuItem
        v-for="localeCode in locales as LocaleObject[]"
        :key="localeCode.iso"
        v-slot="{ active }"
      >
        <NuxtLink
          class="flex items-center gap-x-3 px-3 py-2"
          :class="{ 'bg-neutral-100': active }"
          :to="switchLocalePath(localeCode.code)"
        >
          <TheLocaleSwitchItem
            :icon="localeCode.code"
            is-circle
            :locale="localeCode.name"
          />
        </NuxtLink>
      </HeadlessMenuItem>
    </HeadlessMenuItems>
  </HeadlessMenu>
</template>
