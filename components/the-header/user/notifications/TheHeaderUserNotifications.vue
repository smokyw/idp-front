<script setup lang="ts">
import { deepEqual } from "fast-equals"
import { klona } from "klona/json"

const emit = defineEmits<{
  /** Закрыть поп-ап */
  close: []
}>()

const { t } = useI18n()

/** Настройки уведомлений */
const notifications = ref(
  (
    await useApi().notifications.notificationsGetConfig({
      headers: useAuth().generateHeaders(),
    })
  ).data.data?.success
)

/** Текущие настройки уведомлений, полученный от API */
const currentNotifications = klona(notifications.value)

/** Одинаковы ли выбранные настройки уведомлений и текущие */
const isNotificationsCurrent = computed(() => {
  return deepEqual(notifications.value, currentNotifications)
})

/**
 * Обновить настройки уведомлений.
 */
async function updateNotifications() {
  /** Измененные уведомления */
  const changedNotifications = notifications.value
    ?.flatMap(
      (section) =>
        section.config?.map((config) => {
          const currentConfig = currentNotifications
            ?.find(
              (currentSection) => currentSection.section === section.section
            )
            ?.config?.find(
              (currentConfig) => currentConfig.type === config.type
            )

          return currentConfig?.selected_mode !== config.selected_mode
            ? {
                selected_mode: config.selected_mode,
                type: config.type,
              }
            : null
        })
    )
    .filter(Boolean)

  // Отправляем запрос на изменение настроек уведомлений
  await useApi().notifications.notificationsSaveConfig(
    {
      // @ts-expect-error - ошибка из-за возможного undefined
      config: changedNotifications,
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )

  // Закрываем окно настройки уведомлений
  emit("close")
}
</script>

<template>
  <VPopup
    :title="t('settings.notifications.title')"
    window-classes="!w-full !max-w-[50rem]"
    @click-outside="emit('close')"
  >
    <div class="flex flex-col gap-y-6">
      <!-- eslint-disable-next-line test-id/data-test-id -->
      <LazyTheHeaderUserNotificationsSection
        v-for="(section, index) in notifications"
        :key="section.section"
        v-model="notifications![index]"
      />
    </div>
    <template #footerButtons>
      <button
        class="button lg outlined"
        data-test-id="emit"
        @click="emit('close')"
      >
        {{ t("system.cancel") }}
      </button>
      <button
        class="button lg primary"
        data-test-id="updateNotifications"
        :disabled="isNotificationsCurrent"
        @click="updateNotifications"
      >
        {{ t("system.save") }}
      </button>
    </template>
  </VPopup>
</template>
