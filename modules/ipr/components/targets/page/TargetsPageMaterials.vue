<script setup lang="ts">
const props = defineProps<{
  /** `ID` сотрудника */
  employeeId?: number
  /** `ID цели` */
  id: number
}>()

/** Материалы цели */
const materials = await useApi().targets.targetsGetTargetMaterials(
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
    <TargetsMaterials
      :materials="materials.data.data?.success"
      :target-id="id"
    />
  </HeadlessTabPanel>
</template>
