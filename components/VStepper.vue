<script setup lang="ts">
import type { IdpApprovalStage } from "@/Api"

/** Состояния этапа */
type State = NonNullable<IdpApprovalStage["status"] | "cancelled">

/** Стили этапа */
interface Style {
  /** Классы этапа */
  classes: string
  /** Иконка этапа */
  icon?: string
}

defineProps<{
  /** Является ли номер последним */
  isLast?: boolean
  /** Состояние этапа */
  state?: State
  /** Номер шага */
  step: string | number
}>()

/** Стили этапа */
const styles = {
  approved: {
    classes: "border-success-200 bg-success",
    icon: "SvgoCheck",
  },
  cancelled: {
    classes: "border-neutral-200 bg-neutral-300",
    icon: "SvgoXClose",
  },
  none: {
    classes: "border-neutral-200 bg-neutral-50 text-neutral-600",
  },
  not_approved: {
    classes: "border-warning-200 bg-warning",
    icon: "SvgoInfo",
  },
} as const satisfies Record<State, Style>
</script>

<template>
  <div class="flex flex-col items-center gap-y-1">
    <div
      class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-sm font-semibold shadow-base"
      :class="[
        state
          ? styles[state].classes
          : 'border-neutral-200 bg-neutral-50 text-neutral-600',
      ]"
    >
      <LazyIcon
        v-if="state && state !== 'none'"
        class="fill-white"
        :name="styles[state].icon"
        size="14"
      />
      <span v-else>{{ step }}</span>
    </div>
    <div v-if="!isLast" class="w-px grow bg-neutral-200" />
  </div>
</template>
