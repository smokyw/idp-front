<script setup lang="ts">
import type { IdpIdpDetailsView } from "@/Api"

defineProps<{
  /** ИПР */
  idp: IdpIdpDetailsView
}>()

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
  <TargetsPage
    :id="Number(useRoute('index-targets-id___ru').params.id)"
    :idp="idp"
    :idp-id="idpId"
  />
</template>
