<script setup lang="ts">
import type { IdpIdpDetailsBriefView, IdpIdpDetailsView } from "@/Api"
import type { Option } from "@/types/Utils"

const props = defineProps<{
  /** `ID` сотрудника */
  employeeId: number
  /** Информация об ИПР */
  idp: IdpIdpDetailsView | undefined
}>()

const emit = defineEmits<{
  deleteIdp: []
  updateIdp: []
}>()

definePageMeta({
  middleware: "employees",
})

const { t } = useI18n()
const localePath = useLocalePath()

const route = useRoute("employees-id___ru")

/**
 * Данная переменная определяет, находится ли пользователь на правильной ссылке.
 *
 * Она нужна из-за бага, который возникает следующим путем:
 *
 * 1. Открыть профиль пользователя 1 со списка сотрудников
 * 2. Открыть профиль пользователя 2 со списка сотрудников (у пользователя есть цели)
 * 3. Создать цель
 *
 * При переходах между страницами, все предыдущие страницы остаются в памяти.
 * Когда создается цель, каждая из таких страниц пытается выполнить все свои скрипты.
 *
 * Значение в `useRoute` остается неизменным для таких страниц, а `useRouter` показывает настоящую ссылку.
 * Переменная сравнивает, на какой странице действительно находится пользователь, и выполняет скрипты только этой страницы.
 */
const isRouteRight = computed(() => {
  return route.params.id === useRouter().currentRoute.value.params.id
})

/** `ID` ИПР */
const idpId = route.query.idpId

/** Количество целей */
const targetsCount = ref(0)
provide("targetsCount", targetsCount)

/** Выбранный год для целей */
const selectedIdp =
  inject<Ref<IdpIdpDetailsBriefView | undefined>>("selectedIdp")

/** Годы, доступные пользователю */
const idps = ref(isRouteRight.value ? await getIdps() : undefined)

/**
 * Функция для получения списка ИПР.
 *
 * @returns список ИПР, доступных пользователю.
 */
async function getIdps() {
  return await useApi().idp.idpGetCollection(
    {
      employee_id: toRefs(props).employeeId?.value,
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/** Год выбранного ИПР */
const selectedIdpYear = ref<Option<number>>()

// При изменении выбранного года
watch(selectedIdpYear, () => {
  if (isRouteRight.value) {
    // Изменяем параметр в ссылке
    navigateTo(
      localePath({
        path: `/employees/${props.employeeId}`,
        query: {
          year: selectedIdpYear.value?.id,
        },
      })
    )

    // Обновляем выбранный ИПР
    selectedIdp!.value = idps.value?.data.data?.success?.find(
      (idp) => idp.year === selectedIdpYear.value?.id
    )
  }
})

/**
 * Функция для создания ИПР
 */
async function createIdp() {
  await useApi().idp.idpCreateIdp(
    {
      year: selectedIdpYear.value?.id,
    },
    { employee_id: props.employeeId },
    {
      headers: useAuth().generateHeaders(),
    }
  )

  // Обновляем список ИПР сотрудника
  idps.value = await getIdps()

  // Изменяем ключ выбора года для его перерисовки
  yearPickerKey.value += 1

  // Закрываем поп-ап подтверждения
  isCreateIdpPopupOpened.value = false

  // Оповещаем об успешном создании ИПР
  useAlertsStore().appendSuccess({
    code: "idpCreated.title",
  })
}

/** Открыт ли поп-ап создания ИПР */
const isCreateIdpPopupOpened = ref(false)

/**
 * Функция для удаления ИПР
 */
async function deleteIdp() {
  await useApi().idp.idpDeleteIdp(selectedIdp?.value?.id ?? 0, {
    headers: useAuth().generateHeaders(),
  })

  // Обновляем список ИПР сотрудника
  idps.value = await getIdps()

  // Очищаем выбранный ИПР
  selectedIdp!.value = undefined

  // Изменяем ключ выбора года для его перерисовки
  yearPickerKey.value += 1

  // Закрываем поп-ап подтверждения
  isDeleteIdpPopupOpened.value = false

  // Очищаем полученный ИПР
  emit("deleteIdp")
}

/** Открыт ли поп-ап удаления ИПР */
const isDeleteIdpPopupOpened = ref(false)

/**
 * Ключ выбора года.
 *
 * Нужен для перерисовки компонента при создании нового ИПР.
 */
const yearPickerKey = ref(0)

const canCreateIdp = useUserStore().checkRight("app.idp.create_idp")
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="flex flex-col divide-y divide-neutral-100 rounded-2xl bg-white">
      <div class="flex flex-wrap items-center gap-y-2 p-4">
        <h2
          class="flex h-[2.125rem] items-center gap-x-1 text-display-xs font-semibold"
        >
          <span class="w-max">{{ t("ipr.title") }}</span>
          <EmployeesFiltersYears
            v-model="selectedIdpYear"
            data-test-id="selectedIdpYear"
            :desired-year="Number(route.query.year)"
            is-button-style-disabled
            :year-picker-key="yearPickerKey"
          />
        </h2>
        <EmployeesPageStatus
          v-if="idp"
          :key="idp.id"
          :idp="idp"
          @delete-idp="isDeleteIdpPopupOpened = true"
          @update-idp="emit('updateIdp')"
        />
      </div>
      <TargetsNoPlan
        v-if="!selectedIdp"
        :button="
          canCreateIdp
            ? t('employees.page.noIdp.new', { year: selectedIdpYear?.id })
            : undefined
        "
        :description="
          t(
            `employees.page.noIdp.${
              canCreateIdp ? 'description' : 'noRightDescription'
            }`
          )
        "
        :title="
          t(`employees.page.noIdp.${canCreateIdp ? 'title' : 'noRightTitle'}`)
        "
        @button-clicked="isCreateIdpPopupOpened = true"
      />
    </div>
    <LazyEmployeesPageTargets
      v-if="selectedIdp"
      :employee-id="employeeId"
      :idp="idp"
      :selected-idp="selectedIdp"
    />
    <!--
      v-if тут используется из-за того, что при переходе на главную страницу на секунду появляется страница цели.
      Подробнее можно прочитать в IPR-363.
      При данном решении вложенная страница отсутствует до прямого перехода на нее, соответственно не может появиться.
    -->
    <LazyNuxtPage v-if="useRoute().path.split('/').length === 5" :idp="idp" />
    <LazyVPopup
      v-if="isCreateIdpPopupOpened"
      is-small
      :title="t('employees.page.newIdp.title')"
    >
      <p class="max-w-sm text-neutral">
        {{
          t("employees.page.newIdp.description", { year: selectedIdpYear?.id })
        }}
      </p>
      <template #footerButtons>
        <button
          class="button md outlined"
          data-test-id="isCreateIdpPopupOpened"
          @click="isCreateIdpPopupOpened = false"
        >
          {{ t("system.cancel") }}
        </button>
        <button
          class="button md primary"
          data-test-id="createIdp"
          @click="createIdp"
        >
          {{ t("system.open") }}
        </button>
      </template>
    </LazyVPopup>
    <LazyVPopup
      v-if="isDeleteIdpPopupOpened"
      is-small
      :title="
        t('employees.page.deleteIdp.title', {
          year: selectedIdp?.year,
        })
      "
      :window-classes="targetsCount ? '' : '!w-[27.5rem]'"
    >
      <p v-if="targetsCount" class="text-neutral">
        {{ t("employees.page.deleteIdp.description") }}
      </p>
      <template #footerButtons>
        <button
          class="button md outlined !text-error"
          data-test-id="deleteIdp"
          @click="deleteIdp"
        >
          {{ t("ipr.targets.delete.yes") }}
        </button>
        <button
          class="button md primary"
          data-test-id="isDeleteIdpPopupOpened"
          @click="isDeleteIdpPopupOpened = false"
        >
          {{ t("ipr.targets.delete.no") }}
        </button>
      </template>
    </LazyVPopup>
  </div>
</template>
