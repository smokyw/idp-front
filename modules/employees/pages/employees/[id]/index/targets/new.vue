<script setup lang="ts">
definePageMeta({
  scrollToTop: false,
})

const route = useRoute("employees-id-index-targets-new___ru")

/**
 * Год для создания цели.
 *
 * Берется из `query`-параметра `idpId`
 */
const idpId = Number(route.query.idpId)
</script>

<template>
  <TargetsEdit :employee-id="Number(route.params.id)" :idp-id="idpId" />
</template>
