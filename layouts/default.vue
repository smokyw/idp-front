<script setup lang="ts">
/** Список ошибок */
const alertsStore = useAlertsStore()
</script>

<template>
  <div class="mx-auto flex max-w-7xl flex-col gap-y-1 px-4 sm:gap-y-2 lg:px-6">
    <TheHeader />
    <div
      class="lg:grid lg:grid-cols-[auto_1fr] lg:gap-x-6 xl:grid-cols-[auto_1fr_auto]"
    >
      <TheSideMenu />
      <main>
        <NuxtPage class="flex flex-col gap-y-4" />
      </main>
      <TheSideBar />
    </div>
    <LazyTheAlerts
      v-if="alertsStore.alerts.length"
      :alerts="alertsStore.alerts"
      class="fixed bottom-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 flex-col-reverse"
    />
  </div>
</template>
