<script setup lang="ts">
const { locale, t } = useI18n()

/** Открыто ли окно связи с поддержкой */
const isFeedbackOpened = ref(false)

/** Список ошибок */
const alertsStore = useAlertsStore()

/** Локализованная ссылка на баннер */
const bannerUrl = computed(() => {
  return new URL(
    `/modules/auth/assets/banner/banner-${locale.value}.png`,
    import.meta.url
  ).href
})

/** Локализованная ссылка на лого */
const logoUrl = computed(() => {
  return new URL(
    `/modules/auth/assets/logo/ipr-logo-${locale.value}.svg`,
    import.meta.url
  ).href
})
</script>

<template>
  <div class="flex h-screen gap-x-2 p-3 sm:p-4">
    <div
      class="absolute left-1/2 w-48 -translate-x-1/2 lg:left-6 lg:translate-x-0"
    >
      <img class="w-full" :src="logoUrl" />
    </div>
    <div class="relative flex grow items-center justify-center">
      <main
        class="flex w-full max-w-md flex-col gap-y-6 rounded-2xl bg-white p-6 sm:p-8"
      >
        <NuxtPage />
      </main>
      <LazyTheAlerts
        v-if="alertsStore.alerts.length"
        :alerts="alertsStore.alerts"
        class="absolute bottom-4 z-10 w-full max-w-md flex-col-reverse"
      />
    </div>
    <div
      class="absolute inset-x-0 bottom-0 top-8 z-10 shrink-0 overflow-hidden rounded-t-2xl bg-white sm:inset-y-4 sm:left-auto sm:right-4 sm:aspect-[4/7] sm:rounded-2xl lg:relative lg:inset-0 lg:h-full lg:min-w-[375px]"
      :class="[isFeedbackOpened ? 'block' : 'hidden lg:block']"
    >
      <LazyFormsFeedback
        v-if="isFeedbackOpened"
        class="z-10"
        @close-form="isFeedbackOpened = false"
      />
      <img
        class="hidden h-full w-full object-cover lg:block"
        :src="bannerUrl"
      />
    </div>
    <div
      class="absolute inset-x-3 bottom-3 flex justify-between gap-x-2.5 sm:inset-x-4 sm:bottom-4 lg:right-auto lg:justify-normal"
    >
      <TheLocaleSwitch />
      <button
        class="button outlined sm"
        data-test-id="isFeedbackOpened"
        @click="isFeedbackOpened = true"
      >
        <SvgoMessageTextSquare02Outline class="h-4 w-4" />
        <span>{{ t("auth.feedback.title") }}</span>
      </button>
    </div>
  </div>
</template>
