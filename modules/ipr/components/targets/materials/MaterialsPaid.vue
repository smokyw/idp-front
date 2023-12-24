<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex items-center gap-x-1">
    <LazyIcon name="SvgoCoinsStacked" size="14" />
    <span class="text-xs text-neutral-600">
      {{ t("ipr.targets.materials.paid") }}
    </span>
  </div>
</template>
