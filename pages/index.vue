<script setup lang="ts">
definePageMeta({
  scrollToTop: false,
})

const { t } = useI18n()

useSeoMeta({
  title: t("navigation.developmentPlan"),
})
</script>

<template>
  <div>
    <Targets />
  </div>
</template>
