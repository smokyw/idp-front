<script setup lang="ts">
import type { HeaderUserButton } from "./TheHeaderUser.vue"

defineProps<{
  /** Кнопка меню пользователя */
  button: HeaderUserButton
}>()

const { t } = useI18n()
</script>

<template>
  <HeadlessMenuItem
    as="button"
    class="flex gap-x-3 px-3 py-3"
    data-test-id="button"
    @click="button.action"
  >
    <LazyIcon class="fill-neutral-400" :name="button.icon" size="16" />
    <span>{{ t(button.title) }}</span>
  </HeadlessMenuItem>
</template>
