<script setup lang="ts">
const props = defineProps<{
  /** Навык */
  materialId: number
}>()

const material = await useApi().materials.materialsGetMaterialDetails(
  toRefs(props).materialId.value,
  {
    headers: useAuth().generateHeaders(),
  }
)

const emit = defineEmits<{
  /** Удалить выбранный навык */
  deleteMaterial: []
}>()

const { t } = useI18n()

/** Обоснования материалов */
const targetMaterialsReasons = inject<Ref<Record<number, string>>>(
  "targetMaterialsReasons"
)

/** Обоснованы ли все платные материалы */
const paidMaterialUnreasonedCounter = inject<Ref<number>>(
  "paidMaterialUnreasonedCounter"
)

/** Обоснование */
const reason = ref(
  targetMaterialsReasons?.value[toRefs(props).materialId.value] ?? ""
)

/**
 * Функция для сохранения обоснования материала.
 */
function saveReason() {
  // Если материал платный, вычитаем из счетчика
  if (
    material.data.data?.success?.is_paid &&
    !targetMaterialsReasons?.value[props.materialId]
  ) {
    paidMaterialUnreasonedCounter!.value -= 1
  }

  if (targetMaterialsReasons?.value) {
    // Сохраняем обоснование в объект
    targetMaterialsReasons.value[props.materialId] = reason.value
  }

  // Закрываем поп-ап
  isPopupOpened.value = false
}

/** Открыто ли окно обоснования материала */
const isPopupOpened = ref(false)

/** Обоснован ли материал */
const isMaterialReasoned = computed(() => {
  return !!targetMaterialsReasons?.value[props.materialId]
})

// При создании компонента, если он платный и без обоснования
if (material.data.data?.success?.is_paid && !reason.value) {
  // Добавляем его в счетчик
  paidMaterialUnreasonedCounter!.value += 1
}

onUnmounted(() => {
  // При удалении компонента, если он платный и без обоснования
  if (material.data.data?.success?.is_paid && !reason.value) {
    // Убираем его из счетчика
    paidMaterialUnreasonedCounter!.value -= 1
  }
})
</script>

<template>
  <div class="relative flex items-center lg:h-16">
    <div
      class="flex h-full w-full flex-col justify-between gap-y-2 p-3 lg:flex-row lg:items-center lg:py-0"
    >
      <div class="flex flex-col gap-y-2">
        <h3 class="text-sm">
          {{ material.data.data?.success?.name }}
        </h3>
        <LazyTargetsMaterialsPaid v-if="material.data.data?.success?.is_paid" />
      </div>
      <button
        class="button sm"
        :class="[isMaterialReasoned ? 'primary' : 'outlined']"
        data-test-id="isPopupOpened"
        type="button"
        @click="isPopupOpened = true"
      >
        {{
          t(
            isMaterialReasoned
              ? "ipr.targets.materials.reasons.reasoned"
              : "ipr.targets.materials.reasons.makeReason"
          )
        }}
      </button>
    </div>
    <button
      class="absolute left-full ml-1 h-7 w-7"
      data-test-id="emit"
      type="button"
      @click="emit('deleteMaterial')"
    >
      <Icon name="SvgoTrash" size="20" />
    </button>
  </div>
  <LazyVPopup
    v-if="isPopupOpened"
    :title="t('ipr.targets.materials.reasons.title')"
    @click-outside="isPopupOpened = false"
  >
    <template #footerButtons>
      <button
        class="button lg outlined"
        data-test-id="isPopupOpened"
        @click="isPopupOpened = false"
      >
        {{ t("system.cancel") }}
      </button>
      <button
        class="button lg primary"
        data-test-id="saveReason"
        :disabled="reason.length < 5"
        @click="saveReason"
      >
        {{ t("system.save") }}
      </button>
    </template>
    <div class="flex flex-col gap-y-4">
      <div class="flex flex-col gap-y-2 text-sm">
        <p class="font-medium">{{ t("ipr.targets.materials.title") }}</p>
        <p>{{ material.data.data?.success?.name }}</p>
      </div>
      <VTextarea
        id="reason"
        v-model="reason"
        class="sm:w-[32rem]"
        data-test-id="reason"
        :placeholder="t('ipr.targets.materials.reasons.placeholder')"
      />
    </div>
  </LazyVPopup>
</template>
