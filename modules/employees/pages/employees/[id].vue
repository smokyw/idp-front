<script setup lang="ts">
import type {
  BaseObjectNotFoundErrorCollectionResponse,
  HttpResponse,
  IdpGetIdpDetailsSuccessResponse,
  IdpIdpDetailsBriefView,
} from "@/Api"

definePageMeta({
  layout: "no-sidebar",
})

const { t } = useI18n()

/** Сотрудник */
const employee = await useApi().employees.employeesGetEmployeeBriefDetails(
  Number(useRoute("employees-id___ru").params.id),
  {
    // @ts-expect-error неправильно выставляются параметры в ссылку, из-за чего приходится делать так
    "extra_attributes[]": ["position"],
  },
  {
    headers: useAuth().generateHeaders(),
  }
)

/** Выбранный год для целей */
const selectedIdp = ref<IdpIdpDetailsBriefView>()
provide("selectedIdp", selectedIdp)

/**
 * Функция для получения информации о текущем ИПР.
 *
 * @returns текущий ИПР.
 */
async function getIdp() {
  idp.value = await useApi().idp.idpGetIdpDetails(
    selectedIdp.value?.id ?? 0,
    {
      // @ts-expect-error неправильно выставляются параметры в ссылку, из-за чего приходится делать так
      "extra_attributes[]": ["count_of_targets", "price"],
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/** Текущий ИПР */
const idp =
  ref<
    HttpResponse<
      IdpGetIdpDetailsSuccessResponse,
      BaseObjectNotFoundErrorCollectionResponse
    >
  >()

watch(
  () => [selectedIdp.value, useRoute().path],
  async (newValue, oldValue) => {
    // Если есть выбранный ИПР
    if (newValue[0]) {
      // И он отличается от предыдущего
      if (newValue[0]?.id !== oldValue[0]?.id) {
        // Обновляем информацию о нем
        await getIdp()
      }
    } else {
      idp.value = undefined
    }
  }
)

/** Прогресс ИПР */
const idpProgress = computed(() => {
  return idp.value?.data.data?.success?.count_of_targets_done !== undefined &&
    idp.value?.data.data?.success?.count_of_targets
    ? Math.trunc(
        (100 * idp.value?.data.data?.success?.count_of_targets_done) /
          idp.value?.data.data?.success?.count_of_targets
      )
    : undefined
})
</script>

<template>
  <div>
    <EmployeesPageHero :employee="employee.data.data?.success" />
    <div class="lg:grid lg:grid-cols-[1fr_auto] lg:gap-x-6">
      <NuxtPage
        :employee-id="employee.data.data?.success?.id"
        :idp="idp?.data.data?.success"
        keepalive
        @delete-idp="idp = undefined"
        @update-idp="getIdp"
      />
      <div class="flex w-64 flex-col gap-y-4">
        <div class="flex flex-col gap-y-5 rounded-2xl bg-white p-4">
          <EmployeesWidget
            icon="SvgoBriefcase"
            :title="t('employees.page.position.currentPosition')"
            :value="employee.data.data?.success?.position?.name!"
          />
          <EmployeesWidget
            icon="SvgoArrowCircleUp"
            :percent="
              employee.data.data?.success?.position?.percent_of_suitability
            "
            :title="t('employees.page.position.suitability')"
            :value="
              t('employees.page.position.percent', {
                number:
                  employee.data.data?.success?.position?.percent_of_suitability,
              })
            "
          />
        </div>
        <div
          v-if="idp?.data.data?.success?.count_of_targets"
          class="flex flex-col gap-y-5 rounded-2xl bg-white p-4"
        >
          <EmployeesWidget
            icon="SvgoGraduationHat"
            :percent="idpProgress"
            :title="t('employees.page.progress')"
            :value="
              t('system.percent', {
                number: idpProgress,
              })
            "
          />
          <EmployeesWidget
            icon="SvgoCoinsStackedSolid"
            :title="t('employees.page.idpPrice')"
            :value="usePriceFormatter(idp?.data.data?.success?.price ?? 0)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
