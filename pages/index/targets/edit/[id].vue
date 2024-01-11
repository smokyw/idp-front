<script setup lang="ts">
definePageMeta({
  scrollToTop: false,
})

/**
 * Год для создания цели.
 *
 * Берется из `query`-параметра `idpId`
 */
const idpId = Number(useRoute().query.idpId)

/** `ID` цели для редактирования */
const targetsId = Number(useRoute("index-targets-edit-id___ru").params.id)

/** Цель */
const target = await useApi().targets.targetsGetTargetDetails(targetsId, {
  headers: useAuth().generateHeaders(),
})

/** Навыки */
const skills = await useApi().targets.targetsGetTargetSkills(targetsId, {
  headers: useAuth().generateHeaders(),
})

/** Материалы */
const materials = await useApi().targets.targetsGetTargetMaterials(targetsId, {
  headers: useAuth().generateHeaders(),
})
</script>

<template>
  <TargetsEdit
    :idp-id="idpId"
    :materials="materials.data.data?.success"
    :skills="skills.data.data?.success"
    :target="target.data.data?.success"
  />
</template>
