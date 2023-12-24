<script setup lang="ts">
import type { IdpApproverAttributeStatus } from "@/Api"

defineProps<{
  /** Комментарий */
  comment?: string | undefined
  /** Дата оставления комментария */
  date?: Date
  /** Первые буквы */
  firstLetters?: string
  /** Является ли этап согласующего текущим */
  isCurrent?: boolean
  /** Фамилия и имя согласующего */
  name: string
  /** Показывать ли аватар */
  showAvatar?: boolean
  /** Статус согласующего */
  status?: IdpApproverAttributeStatus["status"]
}>()

const { t } = useI18n()

const icons = {
  approved: "SvgoCheck",
  none: "SvgoHourglass",
  not_approved: "SvgoFlipBackward",
} as const satisfies Record<
  NonNullable<IdpApproverAttributeStatus["status"]>,
  string
>
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="flex items-center gap-x-3">
      <div
        v-if="showAvatar"
        class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-xs font-semibold text-neutral"
        :class="[
          isCurrent && {
            'bg-primary': status === 'none',
          },
          {
            'bg-warning': status === 'not_approved',
            'bg-success': status === 'approved',
          },
        ]"
      >
        <LazyIcon
          v-if="isCurrent || (status && status !== 'none')"
          class="fill-white"
          :name="icons[status!]"
          size="16"
        />
        <span v-else>{{ firstLetters }}</span>
      </div>
      <div class="flex flex-col gap-y-px">
        <h4 class="text-sm font-medium">{{ name }}</h4>
        <p
          v-if="isCurrent || !showAvatar || status !== 'none'"
          class="text-xs text-neutral-400"
        >
          <span v-if="status === 'none'">
            {{ t("ipr.approval.awaitingApproval") }}
          </span>
          <span v-else-if="date">
            {{ useDateConverter().displayDate(date) }}
          </span>
        </p>
      </div>
    </div>
    <p
      v-if="comment"
      class="break-words rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm"
    >
      {{ comment }}
    </p>
  </div>
</template>
