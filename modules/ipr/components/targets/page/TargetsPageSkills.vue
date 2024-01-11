<script setup lang="ts">
const props = defineProps<{
  /** `ID цели` */
  id: number
}>()

/** Материалы цели */
const skills = await useApi().targets.targetsGetTargetSkills(
  toRefs(props).id.value,
  {
    headers: useAuth().generateHeaders(),
  }
)
</script>

<template>
  <HeadlessTabPanel as="div">
    <TargetsSkills :skills="skills.data.data?.success" />
  </HeadlessTabPanel>
</template>
