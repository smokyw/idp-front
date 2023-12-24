<script setup lang="ts">
import { TargetsEditMaterials } from "#components"
import type {
  BaseErrorCollectionResponse,
  SkillsSkillCollectionView,
  TargetsTargetBase,
  TargetsTargetDetailView,
  TargetsTargetMaterialCollectionView,
  TargetsTargetToCreate,
  TargetsTargetToUpdate,
} from "@/Api"
import type { Option } from "@/types/Utils"

const props = defineProps<{
  /** `ID` сотрудника */
  employeeId?: number
  /** Год для создания цели */
  idpId: number
  /** Материалы */
  materials?: TargetsTargetMaterialCollectionView[]
  /** Вернуть ли цель локально. Если выбран данный параметр, то цель будет возвращена в эмите, а не отправлена на бекенд. */
  returnTargetLocally?: boolean
  /** Навыки */
  skills?: SkillsSkillCollectionView[]
  /** Цель */
  target?: TargetsTargetDetailView
  /** Год создания цели */
  year?: number
}>()

const emit = defineEmits<{
  /** Закрыть окно */
  close: []
  /** Создать цель */
  targetCreated: [TargetsTargetToCreate | TargetsTargetToUpdate]
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const alertsStore = useAlertsStore()

// Фокусируемся на первом инпуте в компоненте
useFirstInputFocus()

/** Список опций */
const priorityOptions: Option<TargetsTargetBase["priority"]>[] = [
  {
    id: "high",
    title: t("ipr.targets.priority.high"),
  },
  {
    id: "medium",
    title: t("ipr.targets.priority.medium"),
  },
  {
    id: "low",
    title: t("ipr.targets.priority.low"),
  },
]

/**
 * Выбранный крайний срок цели.
 *
 * По умолчанию - 31 декабря текущего года или крайний срок цели.
 */
const targetDeadline = ref()
/** Выбранный приоритет цели */
const targetPriority = ref<Option<TargetsTargetBase["priority"]>>(
  toRefs(props).target?.value
    ? priorityOptions.find(
        (option) => option.id === toRefs(props).target?.value?.priority
      ) ?? priorityOptions[1]
    : priorityOptions[1]
)
/** Выбранные навыки */
const targetSkills = ref(
  new Set<number>(toRefs(props).skills?.value?.map((skill) => skill.id!) ?? [])
)
/** Выбранные материалы */
const targetMaterials = ref(
  new Set<number>(
    toRefs(props).materials?.value?.map((material) => material.id!) ?? []
  )
)

/** Обоснование материалов */
const targetMaterialsReasons = ref(
  toRefs(props).materials?.value?.reduce((acc, { id, reason }) => {
    // @ts-expect-error - ошибка из-за присутствия null в типах reason
    acc[id!] = reason
    return acc
  }, {}) ?? {}
) as Ref<Record<number, string>>

/** Обоснованы ли все платные материалы */
const paidMaterialUnreasonedCounter = ref(0)

// Провайдим выбранные навыки
provide("targetSkills", targetSkills)
// Провайдим выбранные материалы
provide("targetMaterials", targetMaterials)
// Провайдим обоснования материалов
provide("targetMaterialsReasons", targetMaterialsReasons)
// Провайдим обоснованность платных материалов
provide("paidMaterialUnreasonedCounter", paidMaterialUnreasonedCounter)

/** Отправляется ли форма */
const isLoading = ref(false)

/** Данные о цели */
const targetsData = ref<TargetsTargetToCreate | TargetsTargetToUpdate>({
  description: toRefs(props).target?.value?.description,
  idp_id: toRefs(props).idpId?.value,
  name: toRefs(props).target?.value?.name,
})

/**
 * Функция для отправки созданной цели.
 */
function submitTarget() {
  // Выставляем крайний срок цели.
  targetsData.value.deadline = useDateConverter().formatDate(
    targetDeadline.value
  )
  // Выставляем приоритет цели
  targetsData.value.priority = targetPriority.value.id
  // Выставляем навыки цели
  targetsData.value.skill_ids = Array.from(targetSkills.value)
  // Выставляем материалы цели
  targetsData.value.materials = Array.from(targetMaterials.value).map(
    (materialId) => {
      return {
        id: materialId,
        reason: targetMaterialsReasons.value[materialId],
      }
    }
  )

  // Если цель должна быть возвращена локально
  if (props.returnTargetLocally) {
    // Эмитим цель
    emit("targetCreated", targetsData.value)
    return
  }

  isLoading.value = true

  if (toRefs(props).target?.value) {
    // Если цель уже существует, то обновляем её
    useApi()
      .targets.targetsUpdateTarget(
        toRefs(props).target?.value?.id ?? 0,
        targetsData.value,
        {
          headers: useAuth().generateHeaders(),
        }
      )
      .then(() => {
        // Редиректим пользователя на главную страницу
        props.employeeId
          ? navigateTo(localePath(`/employees/${props.employeeId}`))
          : navigateTo(localePath("/"))

        // Оповещаем об успешном изменении цели
        alertsStore.appendSuccess({
          code: "targetEdited.title",
        })
      })
      .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
        useAlertsStore().appendErrors(error)
      )
      .finally(() => {
        // Меняем состояние загрузки на `false`
        isLoading.value = false
      })
  } else {
    // Если цель не существует, то создаём её
    useApi()
      .targets.targetsCreateTarget(
        targetsData.value,
        {
          employee_id: props.employeeId,
        },
        {
          headers: useAuth().generateHeaders(),
        }
      )
      .then(() => {
        // Редиректим пользователя на главную страницу
        props.employeeId
          ? navigateTo(localePath(`/employees/${props.employeeId}`))
          : navigateTo(localePath("/"))

        // Оповещаем об успешном создании цели
        alertsStore.appendSuccess({
          code: "targetCreated.title",
          message: "success.targetCreated.description",
        })
      })
      .catch(({ error }: { error: BaseErrorCollectionResponse }) =>
        useAlertsStore().appendErrors(error)
      )
      .finally(() => {
        // Меняем состояние загрузки на `false`
        isLoading.value = false
      })
  }
}

/** Компонент выбранных материалов */
const targetsEditMaterials = ref<InstanceType<
  typeof TargetsEditMaterials
> | null>(null)
</script>

<template>
  <VPopup
    close-explicitly
    is-full-screen
    :title="
      target ? t('ipr.targets.pageTitles.title') : t('ipr.targets.new.title')
    "
    window-classes="lg:max-w-[43.75rem] !w-full"
    @close="
      returnTargetLocally
        ? emit('close')
        : employeeId
          ? navigateTo(localePath(`/employees/${employeeId}`))
          : navigateTo(localePath('/'))
    "
  >
    <template #footerButtons>
      <button
        class="button lg outlined"
        data-test-id="returnTargetLocally"
        @click="
          returnTargetLocally
            ? emit('close')
            : employeeId
              ? navigateTo(localePath(`/employees/${employeeId}`))
              : navigateTo(localePath('/'))
        "
      >
        {{ t("system.cancel") }}
      </button>
      <button
        class="button lg primary"
        :disabled="
          !targetMaterials.size ||
          !targetsData.name?.length ||
          !targetsData.description?.length ||
          !!paidMaterialUnreasonedCounter
        "
        form="new-target"
        type="submit"
      >
        <Icon v-if="isLoading" name="svg-spinners:270-ring" size="16" />
        <span v-else>
          {{ target ? t("system.save") : t("system.create") }}
        </span>
      </button>
    </template>
    <form
      id="new-target"
      class="flex flex-col gap-y-1.5"
      @submit.prevent="submitTarget()"
    >
      <div class="flex gap-x-4">
        <VStepper step="1" />
        <div class="mb-8 flex w-full flex-col gap-y-4 lg:pr-40">
          <h3 class="text-lg font-semibold">
            {{ t("ipr.targets.tabs.general") }}
          </h3>
          <VInput
            id="name"
            v-model="targetsData.name"
            data-test-id="targetsData.name"
            :label="t('ipr.targets.new.general.name.label')"
            :placeholder="t('ipr.targets.new.general.name.placeholder')"
          />
          <!-- @vue-expect-error - ошибка из-за присутствия null в типах description -->
          <VTextarea
            id="description"
            v-model="targetsData.description"
            data-test-id="targetsData.description"
            :label="t('ipr.targets.new.general.description.label')"
            :placeholder="t('ipr.targets.new.general.description.placeholder')"
          />
          <VField id="deadline" :label="t('ipr.targets.new.general.deadline')">
            <TargetsEditCalendar
              v-model="targetDeadline"
              data-test-id="targetDeadline"
              :deadline="target?.deadline"
              :idp-id="idpId"
              :year="year"
            />
          </VField>
          <VField id="priority" :label="t('ipr.targets.pageTitles.priority')">
            <VSelect
              v-model="targetPriority"
              button-style="outlined"
              data-test-id="targetPriority"
              icon="SvgoChevronDown"
              :options="priorityOptions"
            />
          </VField>
        </div>
      </div>
      <div class="flex gap-x-4">
        <VStepper step="2" />
        <TargetsEditSkills
          @update-materials="
            targetsEditMaterials?.updateDebounceSelectedMaterials
          "
        />
      </div>
      <div class="flex gap-x-4">
        <VStepper is-last step="3" />
        <TargetsEditMaterials ref="targetsEditMaterials" />
      </div>
    </form>
  </VPopup>
</template>
