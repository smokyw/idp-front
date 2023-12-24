<script setup lang="ts">
import type { IdpIdpDetailsView } from "@/Api"

defineProps<{
  /** ИПР */
  idp: IdpIdpDetailsView
}>()

/** `ID` плана развития */
const idpId = Number(useRoute("index-approval-id___ru").params.id)
</script>

<template>
  <div>
    <Approval :idp-id="idpId" :parent-idp="idp" return-to-home-page />
  </div>
</template>
