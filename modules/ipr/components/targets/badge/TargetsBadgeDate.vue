<script setup lang="ts">
import type { TargetsTargetBase } from "@/Api"

const props = defineProps<{
  /** Ярлык цели */
  badge: TargetsTargetBase["deadline"] | null
  /** Дата создания цели */
  createdAt: TargetsTargetBase["created_at"]
  /** Является ли размер данного блока увеличенным */
  isIncreasedSize?: boolean
}>()

const { locale, t } = useI18n()

/** Дата */
const badgeDate = computed(() => {
  return useDateConverter().parseDate(props.badge ?? "")
})

/** Форматированная дата */
const formattedDate = computed(() => {
  return badgeDate.value.toLocaleDateString(locale.value, {
    day: "numeric",
    month: "long",
  })
})

/** Прошло ли 75% времени до дедлайна */
const isDeadlineNear = computed(() => {
  /** Текущая дата */
  const now = new Date()

  /** Остаток времени до дедлайна */
  const timeToDeadline = badgeDate.value.getTime() - now.getTime()

  /** Время, прошедшее с момента создания цели */
  const timeFromCreation =
    now.getTime() - new Date(props.createdAt as unknown as Date).getTime()

  return timeToDeadline < timeFromCreation / 4
})

/** Просрочена ли цель */
const isDeadlinePassed = computed(() => {
  /** Текущая дата */
  const now = new Date()

  /** Остаток времени до дедлайна */
  const timeToDeadline = badgeDate.value.getTime() - now.getTime()

  return timeToDeadline < 0
})
</script>

<template>
  <div
    class="flex items-center"
    :class="[isIncreasedSize ? 'gap-x-2' : 'gap-x-1.5']"
  >
    <Icon
      :class="[
        isDeadlineNear || isDeadlinePassed
          ? {
              'fill-warning': isDeadlineNear,
              '!fill-error': isDeadlinePassed,
            }
          : 'fill-neutral',
      ]"
      name="SvgoAlarmClockOutline"
      :size="isIncreasedSize ? '16' : '14'"
    />
    <p
      v-if="isDeadlinePassed"
      class="text-error"
      :class="{ 'text-xs': !isIncreasedSize }"
    >
      {{ t("ipr.targets.outdated") }}
    </p>
    <time
      v-else
      :class="{
        'text-xs text-neutral-600': !isIncreasedSize,
        '!text-warning': isDeadlineNear,
      }"
    >
      {{
        t("ipr.targets.till", {
          date: formattedDate,
        })
      }}
    </time>
  </div>
</template>
