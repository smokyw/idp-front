<script setup lang="ts">
import type { EmployeesCollectionSuccessResponse } from "@/Api"

defineProps<{
  /** Сотрудник */
  employee: NonNullable<
    NonNullable<EmployeesCollectionSuccessResponse["data"]>["success"]
  >[number]
}>()
</script>

<template>
  <div class="flex items-center gap-x-3">
    <div
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-200 text-xs font-semibold text-neutral"
      :class="{ 'opacity-50': employee.status === 'archived' }"
    >
      {{ useUserDisplay(employee).getFirstLetters() }}
    </div>
    <div class="grid w-full">
      <h4
        class="line-clamp-1 w-full text-md"
        :class="[
          employee.status === 'archived'
            ? 'text-neutral-400'
            : 'text-neutral-900',
        ]"
      >
        {{ useUserDisplay(employee).getFullName() }}
      </h4>
      <p class="text-sm text-neutral-400">-</p>
    </div>
  </div>
</template>
