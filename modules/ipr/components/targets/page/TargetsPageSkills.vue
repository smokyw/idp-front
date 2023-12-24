<script setup lang="ts">
const props = defineProps<{
  /** `ID` сотрудника */
  employeeId?: number
  /** `ID цели` */
  id: number
}>()

/** Материалы цели */
const skills = await useApi().targets.targetsGetTargetSkills(
  toRefs(props).id.value,
  {
    employee_id: toRefs(props).employeeId?.value,
  },
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
