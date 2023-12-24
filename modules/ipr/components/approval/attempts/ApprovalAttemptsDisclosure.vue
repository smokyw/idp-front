<script setup lang="ts">
import type { IdpApprovalAttempt, IdpRoute } from "@/Api"

const props = defineProps<{
  /** Попытка согласования */
  attempt?: IdpApprovalAttempt
  /** Маршрут по умолчанию */
  defaultRoute: IdpRoute
  /** `ID` плана развития */
  idpId: number
  /** Порядковый номер попытки */
  index: number
  /** Открыт ли по умолчанию */
  isDefaultOpened?: boolean
}>()

const emit = defineEmits<{
  /** Закрыть окно */
  close: []
}>()

const { t } = useI18n()

/** Область скролла поп-апа */
const popupScroll = inject<Ref<HTMLElement | null>>("popupScroll")

/** Панель попытки */
const disclosurePanel = ref<HTMLElement | null>()
const { height } = useElementSize(disclosurePanel)

/**
 * Функция для скролла к низу поп-апа
 */
function scrollToBottom() {
  if (props.isDefaultOpened) {
    popupScroll!.value!.scrollTo({
      top: (disclosurePanel.value?.offsetTop ?? 0) - 129, // 77px (высота шапки) + 57px (высота DisclosureButton) - 1px (граница)
    })
  }
}

// Следим за высотой попытки
watch(height, () => {
  // Скроллим к низу
  scrollToBottom()
})
</script>

<template>
  <HeadlessDisclosure as="div" :default-open="isDefaultOpened">
    <HeadlessDisclosureButton
      class="flex w-full items-center gap-x-2 px-6 py-4 hover:bg-neutral-50"
    >
      <Icon
        class="fill-neutral-900 ui-not-open:-rotate-90"
        name="SvgoChevronDown"
        size="20"
      />
      <span class="text-lg font-medium">
        {{ t("ipr.approval.attempt", { index }) }}
      </span>
    </HeadlessDisclosureButton>
    <div ref="disclosurePanel">
      <HeadlessDisclosurePanel
        class="text-gray-500 px-6 py-3"
        :unmount="!isDefaultOpened"
      >
        <LazyApprovalAttemptsCard
          :attempt="attempt"
          :default-route="defaultRoute"
          :idp-id="idpId"
          @close-window="emit('close')"
        />
      </HeadlessDisclosurePanel>
    </div>
  </HeadlessDisclosure>
</template>
