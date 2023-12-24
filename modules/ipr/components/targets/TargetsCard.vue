<script setup lang="ts">
import type { TargetsTargetBase } from "@/Api"

defineProps<{
  /** `ID` сотрудника */
  employeeId?: number
  /** Год цели */
  idpId: number
  /** Карточка не кликабельная */
  notClickable?: boolean
  /** Цель */
  target: TargetsTargetBase
}>()

const NuxtLinkLocale = resolveComponent("NuxtLinkLocale")
</script>

<template>
  <component
    :is="notClickable ? 'div' : NuxtLinkLocale"
    class="flex flex-col gap-y-3 p-4"
    :class="{
      'cursor-pointer rounded-2xl bg-white shadow-base hover:shadow-lg':
        !notClickable,
    }"
    :to="{
      path:
        ((employeeId && '/employees/' + employeeId) ?? '') +
        '/targets/' +
        target.id,
      query: {
        idpId,
      },
    }"
  >
    <h2 class="text-lg font-medium text-neutral-900">{{ target.name }}</h2>
    <div class="flex gap-x-3">
      <TargetsBadge :badge="target.status ?? 'not_started'" type="status" />
      <TargetsBadge :badge="target.priority" type="priority" />
      <TargetsBadgeDate
        :badge="target.deadline"
        :created-at="
          target.created_at ?? useDateConverter().formatDate(new Date())
        "
      />
    </div>
  </component>
</template>
