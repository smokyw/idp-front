<script setup lang="ts">
import type { AuthPasswordRequirementRegexp } from "@/Api"

defineProps<{
  /** Пароль */
  password: string
  /** Требования к паролю */
  requirements: AuthPasswordRequirementRegexp[]
}>()
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div
      v-for="requirement in requirements"
      :key="requirement.regexp"
      class="flex gap-x-1.5"
    >
      <SvgoCheckCircle
        v-if="useRegExpTest(password, requirement.regexp)"
        class="h-4 w-4 shrink-0"
      />
      <div
        v-else
        class="h-4 w-4 shrink-0 rounded-full border border-neutral-300"
      />
      <span class="text-sm">{{ requirement.hint }}</span>
    </div>
  </div>
</template>
