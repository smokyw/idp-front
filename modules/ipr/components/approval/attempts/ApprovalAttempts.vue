<script setup lang="ts">
import type { IdpApprovalAttempt } from "@/Api"

defineProps<{
  /** Добавить ли в список новую попытку */
  addNewAttempt: boolean
  /** Список попыток согласования */
  attempts: IdpApprovalAttempt[]
  /** `ID` плана развития */
  idpId: number
  /** Возвращать ли на главную страницу при закрытии окна */
  returnToHomePage?: boolean
}>()

const emit = defineEmits<{
  /** Закрыть окно */
  close: []
}>()

const localePath = useLocalePath()

/** Маршрут по умолчанию */
const defaultRoute = await useApi().idp.idpGetDefaultRoute({
  headers: useAuth().generateHeaders(),
})
</script>

<template>
  <div
    v-if="attempts.length > 1 || addNewAttempt"
    class="-m-6 flex flex-col divide-y divide-neutral-100"
  >
    <LazyApprovalAttemptsDisclosure
      v-for="attempt in attempts"
      :key="attempt.id"
      :attempt="attempt"
      :default-route="defaultRoute.data.data?.success!"
      :idp-id="idpId"
      :index="attempt.serial_number!"
      :is-default-opened="
        attempt.serial_number === attempts.length && !addNewAttempt
      "
    />
    <LazyApprovalAttemptsDisclosure
      v-if="addNewAttempt"
      :default-route="defaultRoute.data.data?.success!"
      :idp-id="idpId"
      :index="attempts.length + 1"
      is-default-opened
      @close="emit('close')"
    />
  </div>
  <div v-else-if="attempts.length === 1">
    <LazyApprovalAttemptsCard
      :attempt="attempts[0]"
      :default-route="defaultRoute.data.data?.success!"
      :idp-id="idpId"
    />
  </div>
  <div v-else>
    <LazyApprovalAttemptsCard
      :default-route="defaultRoute.data.data?.success!"
      :idp-id="idpId"
      new-attempt
      @close-window="
        returnToHomePage ? navigateTo(localePath('/')) : emit('close')
      "
    />
  </div>
</template>
