<script setup lang="ts">
const props = defineProps<{
  /** Выбранные сотрудники */
  selectedEmployees: Set<number>
  /** Год ИПР */
  year: number
}>()

const emit = defineEmits<{
  /** Очистить список сотрудников */
  clearEmployees: []
  /** Обновить список сотрудников */
  updateEmployees: []
}>()

const { t } = useI18n()

const userStore = useUserStore()

/** Тип действия */
type ActionId =
  | "createIdp"
  | "approveIdp"
  | "rejectIdp"
  | "addTarget"
  | "generateReport"

/** Действие */
interface Action {
  /** Связанное право доступа */
  accessRight: boolean
  /** Иконка действия */
  icon: string
  /** `ID` действия */
  id: ActionId
}

/** Список действий */
const actions = [
  {
    accessRight: userStore.checkRight("app.idp.create_idp"),
    icon: "SvgoShare",
    id: "createIdp",
  },
  {
    accessRight: true,
    icon: "SvgoCheckCircle",
    id: "approveIdp",
  },
  {
    accessRight: true,
    icon: "SvgoInfoCircle",
    id: "rejectIdp",
  },
  {
    accessRight: userStore.checkRight("app.targets.create_target"),
    icon: "SvgoPlusSquare",
    id: "addTarget",
  },
  {
    accessRight: userStore.checkRight("app.idp.generate_reports"),
    icon: "SvgoCopy",
    id: "generateReport",
  },
] as const satisfies Readonly<Action[]>

/** Выбранное действие */
const selectedAction = ref<ActionId>()

/**
 * Функция для отправки запроса на действие.
 *
 * @param action - тип действия.
 */
async function sendActionRequest(action: ActionId) {
  /** Данные для запроса */
  const requestData = {
    employee_ids: Array.from(toRefs(props).selectedEmployees.value),
    year: props.year,
  }

  switch (action) {
    case "createIdp":
      await useApi().idp.idpMassCreateIdp(requestData, {
        headers: useAuth().generateHeaders(),
      })
      break
    case "approveIdp":
      await useApi().idp.idpApproveCollection(requestData, {
        headers: useAuth().generateHeaders(),
      })
      break
    case "rejectIdp":
      await useApi().idp.idpRejectCollection(requestData, {
        headers: useAuth().generateHeaders(),
      })
      break
    case "addTarget":
      await useApi().idp.idpMassCreateIdp(requestData, {
        headers: useAuth().generateHeaders(),
      })
      break
  }

  // Оповещаем об успешном выполнении действия
  useAlertsStore().appendSuccess({
    code: `idpCollection.${selectedAction.value}.title`,
  })

  // Сбрасываем выбранное действие
  selectedAction.value = undefined

  // Обновляем список сотрудников
  emit("updateEmployees")
}
</script>

<template>
  <div
    class="fixed bottom-20 left-1/2 flex -translate-x-1/2 gap-x-1 overflow-hidden rounded-lg border border-neutral-50 bg-white shadow-lg"
  >
    <div
      class="flex h-[3.25rem] w-[3.25rem] items-center justify-center bg-primary text-display-xs font-medium text-white"
    >
      {{ selectedEmployees.size }}
    </div>
    <div class="flex gap-x-6 py-1">
      <button
        v-for="action in actions.filter(
          (innerAction) => innerAction.accessRight
        )"
        :key="action.id"
        class="group flex flex-col items-center justify-center rounded-lg px-3 hover:bg-neutral-50"
        data-test-id="selectedAction"
        @click="selectedAction = action.id"
      >
        <Icon
          class="opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0"
          :name="action.icon"
          size="18"
        />
        <span class="font-medium text-neutral-600 group-hover:text-neutral-900">
          {{ t(`employees.actions.${action.id}.label`) }}
        </span>
      </button>
    </div>
    <button
      class="button secondary h-[3.25rem] w-[3.25rem] border-l border-neutral-50 !ring-0"
      data-test-id="emit"
      @click="emit('clearEmployees')"
    >
      <Icon class="fill-neutral-900" name="SvgoXClose" size="20" />
    </button>
  </div>
  <LazyVPopup
    v-if="
      selectedAction &&
      !['addTarget', 'generateReport'].includes(selectedAction)
    "
    is-small
    :title="t(`employees.actions.${selectedAction}.title`)"
    window-classes="!w-[26.5rem]"
    @click-outside="selectedAction = undefined"
  >
    <p class="text-neutral">
      {{
        t(`employees.actions.${selectedAction}.description`, {
          year,
          number: selectedEmployees.size,
        })
      }}
    </p>
    <template #footerButtons>
      <button
        class="button md outlined"
        data-test-id="selectedAction"
        @click="selectedAction = undefined"
      >
        {{ t("system.cancel") }}
      </button>
      <button
        class="button md primary"
        data-test-id="sendActionRequest"
        @click="sendActionRequest(selectedAction)"
      >
        {{ t(`employees.actions.${selectedAction}.button`) }}
      </button>
    </template>
  </LazyVPopup>
  <LazyEmployeesActionsTargets
    v-if="selectedAction === 'addTarget'"
    :year="year"
    @close="
      () => {
        selectedAction = undefined
        emit('updateEmployees')
      }
    "
  />
  <LazyEmployeesActionsReports
    v-if="selectedAction === 'generateReport'"
    :year="year"
    @close="
      () => {
        selectedAction = undefined
        emit('updateEmployees')
      }
    "
  />
</template>
