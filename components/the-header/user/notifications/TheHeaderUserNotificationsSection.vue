<script setup lang="ts">
import type {
  NotificationsConfigAttributeAvailableModes,
  NotificationsSectionsEmployees,
  NotificationsSectionsSelf,
} from "@/Api"

const { t, te } = useI18n()

/** Подписи колонок */
const labels = [
  "title",
  "immediately",
  "daily",
  "never",
] as const satisfies Array<
  | NonNullable<
      NotificationsConfigAttributeAvailableModes["available_modes"]
    >[number]
  | "title"
>

/** Секция  */
const section = defineModel<
  NotificationsSectionsSelf | NotificationsSectionsEmployees
>({ required: true })

/**
 * Выставить все параметры по умолчанию.
 */
function setSectionDefault() {
  section.value.config?.forEach(
    (line) => (line.selected_mode = line.default_mode)
  )
}

/** Является ли секция дефолтной */
const isDefault = computed(() => {
  return section.value.config?.every(
    (line) => line.selected_mode === line.default_mode
  )
})
</script>

<template>
  <h6 class="text-neutral">
    {{ t(`settings.notifications.sections.${section.section}`) }}
  </h6>
  <div
    class="flex flex-col divide-y divide-neutral-100 rounded-2xl border border-neutral-100"
  >
    <div
      class="grid h-[3.25rem] grid-cols-[1fr_4.5rem_10.375rem_6.75rem] content-center"
    >
      <p v-for="label in labels" :key="label" class="px-4 text-neutral-400">
        {{ t(`settings.notifications.labels.${label}`) }}
      </p>
    </div>
    <div
      v-for="line in section.config"
      :key="line.type"
      class="grid min-h-[3.25rem] grid-cols-[1fr_4.5rem_10.375rem_6.75rem] content-center items-center"
    >
      <div class="flex flex-col justify-center px-4 py-2">
        <p class="font-medium">
          {{ t(`settings.notifications.types.${line.type}.title`) }}
        </p>
        <p
          v-if="te(`settings.notifications.types.${line.type}.description`)"
          class="text-sm text-neutral-400"
        >
          {{ t(`settings.notifications.types.${line.type}.description`) }}
        </p>
      </div>
      <div v-for="mode in labels.slice(1)" :key="mode">
        <input
          v-if="
            line.available_modes?.includes(
              mode as NonNullable<
                NotificationsConfigAttributeAvailableModes['available_modes']
              >[number]
            )
          "
          :checked="line.selected_mode === mode"
          class="mx-auto"
          data-test-id="line"
          type="checkbox"
          @click="
            line.selected_mode = mode as NonNullable<
              NotificationsConfigAttributeAvailableModes['available_modes']
            >[number]
          "
        />
      </div>
    </div>
  </div>
  <button
    class="button lg outlined ml-auto"
    data-test-id="setSectionDefault"
    :disabled="isDefault"
    @click="setSectionDefault"
  >
    {{ t("system.default") }}
  </button>
</template>
