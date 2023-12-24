<script setup lang="ts" generic="TBadge extends 'status' | 'priority'">
import type { TargetsTargetBase } from "@/Api"

const props = defineProps<{
  /** Ярлык цели */
  badge: TargetsTargetBase[TBadge]
  /** Является ли размер данного блока увеличенным */
  isIncreasedSize?: boolean
  /** Тип ярлыка */
  type: TBadge
}>()

const { t } = useI18n()

/** Ссылка на иконку */
const statusBadgeURL = computed(
  () =>
    new URL(
      `/modules/ipr/assets/targets/badges/${props.type}/${props.badge}.svg`,
      import.meta.url
    ).href
)
</script>

<template>
  <div
    class="flex items-center"
    :class="[isIncreasedSize ? 'gap-x-2' : 'gap-x-1.5']"
  >
    <img :class="{ 'h-4 w-4': isIncreasedSize }" :src="statusBadgeURL" />
    <p :class="{ 'text-xs text-neutral-600': !isIncreasedSize }">
      {{ t(`ipr.targets.${type}.${badge}`) }}
    </p>
  </div>
</template>
