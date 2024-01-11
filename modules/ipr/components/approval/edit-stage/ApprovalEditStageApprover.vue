<script setup lang="ts">
import type { IdpRouteUser } from "@/Api"

const props = defineProps<{
  /** Дополнительные согласующие */
  additionalApprovers?: IdpRouteUser[]
  /** `ID` всех согласующих */
  approverIds: string[]
  /** Отключен ли выбор */
  disabled?: boolean
  /** Согласующие из родительского компонента */
  parentApprovers: IdpRouteUser[]
  /** `ID` этапа */
  stageId: number
}>()

const { t } = useI18n()

/** `ID` плана развития */
const idpId = Number(useRoute("index-approval-id___ru").params.id)

/** Поиск согласующего */
const search = ref("")
/** Замедленный поиск согласующего */
const debouncedSearch = useDebounce(search, 300)

/** `ID` последнего элемента в списке */
const lastElementId = ref<string>()

/**
 * Функция для получения согласующих.
 *
 * @returns список согласующих.
 */
async function getApprovers() {
  return await useApi().idp.idpSearchForApprovers(
    idpId,
    {
      filter: {
        query: debouncedSearch.value,
        stage_id: toRefs(props).stageId.value,
      },
      pagination: {
        after: lastElementId.value!,
      },
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/** Список согласующих */
const approvers = ref(
  toRefs(props).parentApprovers.value ??
    (await getApprovers()).data.data?.success
)

// Добавляем согласующих в список
approvers.value.push(...(toRefs(props).additionalApprovers.value ?? []))

/** Отфильтрованные согласующие */
const filteredApprovers = computed(() => {
  return approvers.value?.filter(
    (approver) =>
      !props.approverIds.includes(approver.id!) ||
      approver.id === selectedApprover.value?.id
  )
})

watch(
  () => debouncedSearch.value,
  async () => {
    // Выставляем список согласующих
    approvers.value = (await getApprovers()).data.data!.success!

    // Показываем элемент загрузки
    showLoading.value = true
  }
)

/** Выбранный участник */
const modelValue = defineModel<string>({ required: true })

/** Выбранный согласующий */
const selectedApprover = computedWithControl(modelValue, () => {
  return approvers.value?.find((approver) => approver.id === modelValue.value)
})

/** Компонент загрузки */
const loadingSpinner = ref<HTMLElement | null>()
/** Показывать ли загрузку */
const showLoading = ref(true)
/** Виден ли спиннер загрузки */
const isLoadingVisible = useElementVisibility(loadingSpinner)

watch(isLoadingVisible, async (newValue) => {
  if (newValue) {
    // Выставляем `ID` последнего согласующего
    lastElementId.value = approvers.value?.at(-1)?.id

    /** Новые согласующие */
    const newApprovers = await getApprovers()

    // Если новые согласующие есть
    if (newApprovers.data.data?.success?.length) {
      // Добавляем их в список
      approvers.value?.push(...newApprovers.data.data.success)
    } else {
      // Иначе убираем элемент загрузки
      showLoading.value = false
    }
  } else {
    // Выставляем `ID` последнего согласующего в `undefined`
    lastElementId.value = undefined
  }
})

/** Инпут поиска */
const searchInput = ref()
</script>

<template>
  <HeadlessCombobox
    v-slot="{ open }"
    v-model="modelValue"
    as="div"
    class="relative w-full"
    data-test-id="modelValue"
    :disabled="disabled"
  >
    <HeadlessComboboxButton
      class="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-2.5 outline-none hover:bg-neutral-200 ui-disabled:border-neutral-50 ui-disabled:bg-neutral-50 ui-disabled:text-neutral-400 sm:w-[26rem]"
      :class="{ 'border-primary ring-4 ring-primary/10': open }"
    >
      <span>
        {{
          selectedApprover
            ? useUserDisplay(selectedApprover).getFullName()
            : t("system.notSelected")
        }}
      </span>
      <Icon class="fill-neutral-400" name="SvgoChevronDown" size="16" />
    </HeadlessComboboxButton>
    <HeadlessComboboxOptions
      class="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-neutral-100 bg-white pb-2 shadow-lg outline-none"
    >
      <div class="relative flex items-center">
        <HeadlessComboboxInput
          ref="searchInput"
          class="rounded-none !border-transparent !border-b-neutral-200 !ring-0"
          data-test-id="search"
          :display-value="() => ''"
          :placeholder="t('system.search')"
          @change="search = $event.target.value"
        />
        <Icon
          class="absolute right-3 cursor-pointer fill-neutral-400"
          data-test-id="searchInput"
          name="SvgoXClose"
          size="16"
          @click="
            () => {
              searchInput.el.value = ''
              search = ''
            }
          "
        />
      </div>
      <div class="flex max-h-52 flex-col overflow-y-auto">
        <template v-if="filteredApprovers?.length">
          <HeadlessComboboxOption
            v-for="approver in filteredApprovers"
            :key="approver.id"
            class="cursor-pointer border-l-2 border-white/0 px-4 py-2 text-sm font-regular ui-selected:border-primary ui-selected:bg-neutral-50 ui-active:border-primary ui-active:bg-neutral-50"
            :value="approver.id"
          >
            {{ useUserDisplay(approver).getFullName() }}
          </HeadlessComboboxOption>
        </template>
        <p v-else class="px-4 pb-2 pt-3 text-center">
          {{ t("system.emptySearch") }}
        </p>
        <div
          v-show="showLoading"
          ref="loadingSpinner"
          class="flex justify-center text-neutral-300"
        >
          <LazyIcon name="svg-spinners:270-ring" size="16" />
        </div>
      </div>
    </HeadlessComboboxOptions>
  </HeadlessCombobox>
</template>
