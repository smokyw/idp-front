<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="relative flex items-center">
    <Icon class="absolute left-3" name="SvgoSearch" size="16" />
    <input
      class="h-9 w-[29rem] rounded-md bg-neutral-100 pl-9"
      :placeholder="t('admin.search')"
      type="search"
    />
  </div>
</template>
