<script setup lang="ts">
import type {
  IdpIdpDetailsView,
  TargetsCountOfRelationsSuccessResponse,
} from "@/Api"
import type { Option } from "@/types/Utils"

const props = defineProps<{
  /** `ID` сотрудника */
  employeeId?: number
  /** `ID` цели */
  id: number
  /** ИПР */
  idp: IdpIdpDetailsView
  /** Год цели */
  idpId: number
}>()

const { t } = useI18n()
const localePath = useLocalePath()

/** Количество связанных объектов цели */
const targetRelations = ref<TargetsCountOfRelationsSuccessResponse>()

/**
 * Функция для получения связанных объектов цели.
 */
async function getTargetRelations() {
  targetRelations.value = (
    await useApi().targets.targetsGetCountOfRelations(
      toRefs(props).id.value,
      {
        employee_id: props.employeeId,
      },
      {
        headers: useAuth().generateHeaders(),
      }
    )
  ).data
}

await getTargetRelations()

const tabs = [
  {
    id: "general",
    title: t("ipr.targets.tabs.general"),
  },
  {
    id: "skills",
    title: t("ipr.targets.tabs.skills"),
  },
  {
    id: "materials",
    title: t("ipr.targets.tabs.materials"),
  },
  {
    id: "comments",
    title: t("ipr.targets.tabs.comments"),
  },
] as const satisfies Readonly<Option[]>

/**
 * Отфильтрованный список табов.
 *
 * Все вкладки, кроме «Навыки» показываются всегда.
 * Вкладка «Навыки» показывается только тогда, когда в ней есть хоть один материал
 */
const filteredTabs = computed(() => {
  return tabs.filter(
    (tab) =>
      tab.id !== "skills" || targetRelations.value?.data?.success?.[tab.id]
  )
})
</script>

<template>
  <VPopup
    is-full-screen
    :title="t('ipr.targets.pageTitles.title')"
    window-classes="lg:max-w-[43.75rem] !w-full"
    @click-outside="
      employeeId
        ? navigateTo(localePath(`/employees/${employeeId}`))
        : navigateTo(localePath('/'))
    "
  >
    <template v-if="!employeeId" #header-right>
      <TargetsEditActions :id="id" :idp-id="idpId" :parent-idp="idp" />
    </template>
    <HeadlessTabGroup>
      <div class="-mt-4 mb-8 w-full overflow-x-auto">
        <HeadlessTabList
          as="div"
          class="flex w-max rounded-full bg-neutral-200 p-1"
        >
          <HeadlessTab v-for="tab in filteredTabs" :key="tab.id">
            <!-- @vue-expect-error - Возникает ошибка из-за вкладки general, у которой счетчика нет. Ошибка решена, т.к. поле счетчик необязательное -->
            <VTabsCard
              :counter="targetRelations?.data?.success?.[tab.id]"
              :tab="tab"
            />
          </HeadlessTab>
        </HeadlessTabList>
      </div>
      <HeadlessTabPanels>
        <TargetsPageInfo :id="id" :employee-id="employeeId" />
        <TargetsPageSkills
          v-if="filteredTabs.includes(tabs[1])"
          :id="id"
          :employee-id="employeeId"
        />
        <TargetsPageMaterials :id="id" :employee-id="employeeId" />
        <TargetsPageComments
          :id="id"
          :employee-id="employeeId"
          @comment-created="getTargetRelations"
        />
      </HeadlessTabPanels>
    </HeadlessTabGroup>
  </VPopup>
</template>
