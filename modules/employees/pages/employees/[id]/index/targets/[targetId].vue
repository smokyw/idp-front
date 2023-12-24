<script setup lang="ts">
import type { IdpIdpDetailsView } from "@/Api"

definePageMeta({
  scrollToTop: false,
})

defineProps<{
  /** ИПР */
  idp: IdpIdpDetailsView
}>()

const route = useRoute("employees-id-index-targets-targetId___ru")

/**
 * Год для создания цели.
 *
 * Берется из `query`-параметра `idpId`
 */
const idpId = Number(route.query.idpId)
</script>

<template>
  <div>
    <TargetsPage
      v-if="idp && idpId"
      :id="Number(route.params.targetId)"
      :employee-id="Number(route.params.id)"
      :idp="idp"
      :idp-id="idpId"
    />
  </div>
</template>
