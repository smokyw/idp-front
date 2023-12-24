<script setup lang="ts">
defineProps<{
  /** Хлебные крошки */
  breadcrumbs: Array<string | undefined>
  /** Сделать ли курсор `pointer` */
  cursorPointer?: boolean
}>()

const emit = defineEmits<{
  selectBreadcrumb: [title: string]
}>()
</script>

<template>
  <div class="flex w-max items-center gap-x-1">
    <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      <p
        class="w-max rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs text-neutral"
        :class="{ 'cursor-pointer': cursorPointer }"
        data-test-id="emit"
        @click="emit('selectBreadcrumb', breadcrumb!)"
      >
        {{ breadcrumb }}
      </p>
      <LazyIcon
        v-if="index !== breadcrumbs?.length - 1"
        class="-rotate-90 fill-neutral"
        name="SvgoChevronDown"
        size="12"
      />
    </template>
  </div>
</template>
