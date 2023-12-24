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
</script>

<template>
  <TargetsEdit :idp-id="idpId" />
</template>
