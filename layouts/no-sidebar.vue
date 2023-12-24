<script setup lang="ts">
/** Опции шаблона `no-layout` */
export interface NoSidebarLayoutOptions {
  /** Фиксированна ли высота */
  fixed: boolean
}

/** Список ошибок */
const alertsStore = useAlertsStore()

/** `Ref` страницы */
const page = ref<{
  pageRef: NoSidebarLayoutOptions
}>()
</script>

<template>
  <div
    class="mx-auto flex max-w-7xl flex-col gap-y-1 px-4 sm:gap-y-2 lg:px-6"
    :class="{
      'max-h-screen lg:h-screen lg:overflow-hidden': page?.pageRef.fixed,
    }"
  >
    <TheHeader />
    <div
      class="lg:grid lg:grid-cols-[auto_1fr] lg:gap-x-6"
      :class="{
        'lg:h-full lg:grid-rows-1 lg:overflow-hidden': page?.pageRef.fixed,
      }"
    >
      <TheSideMenu />
      <main
        :class="{
          'lg:grid lg:grid-cols-1 lg:overflow-hidden': page?.pageRef.fixed,
        }"
      >
        <NuxtPage
          ref="page"
          class="flex flex-col gap-y-4"
          :class="{ 'pb-20 lg:overflow-hidden lg:pb-4': page?.pageRef.fixed }"
          keepalive
        />
      </main>
    </div>
    <LazyTheAlerts
      v-if="alertsStore.alerts.length"
      :alerts="alertsStore.alerts"
      class="fixed bottom-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 flex-col-reverse"
    />
  </div>
</template>
