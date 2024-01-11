<script setup lang="ts">
const props = defineProps<{
  /** `ID цели` */
  id: number
}>()

/** Материалы цели */
const materials = await useApi().targets.targetsGetTargetMaterials(
  toRefs(props).id.value,
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
