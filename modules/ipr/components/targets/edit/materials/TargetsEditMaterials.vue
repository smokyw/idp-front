<script setup lang="ts">
const { t } = useI18n()

/** Открыт ли попап выбора целей */
const isPopupOpened = ref(false)

/** Выбранные материалы */
const selectedMaterials = inject<Ref<Set<number>>>("targetMaterials")

/** Поисковой запрос */
const search = ref("")
/** Замедленный поиск */
const debouncedSearch = debouncedRef(search, 300)

/** Замедленные выбранные материалы */
const debouncedSelectedMaterials = ref<Set<number> | undefined>(
  new Set(selectedMaterials?.value)
)

/**
 * Функция для обновления выбранных навыков
 */
function updateSelectedMaterials() {
  // Обновляем значение выбранных навыков
  selectedMaterials!.value = new Set(debouncedSelectedMaterials?.value)

  // Открываем поп-ап
  isPopupOpened.value = true
}

/**
 * Функция для обновления замедленных навыков
 */
function updateDebounceSelectedMaterials() {
  // Обновляем значение замедленных навыков
  debouncedSelectedMaterials.value = new Set(selectedMaterials?.value)

  // Закрываем поп-ап
  isPopupOpened.value = false
}

/**
 * Функция для удаления материала.
 *
 * @param material - `ID` материала.
 */
function deleteMaterial(material: number) {
  // Удаляем замедленный материал
  debouncedSelectedMaterials.value?.delete(material)

  // Обновляем значение выбранных навыков
  selectedMaterials!.value = new Set(debouncedSelectedMaterials?.value)
}

defineExpose({
  updateDebounceSelectedMaterials,
})
</script>

<template>
  <div class="flex w-full flex-col gap-y-4">
    <h3 class="text-lg font-semibold">
      <span>{{ t("ipr.targets.new.materials.title") }}</span>
      <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
      <span class="text-error">*</span>
    </h3>
    <p class="text-sm text-neutral">
      {{ t("ipr.targets.materials.requiredReason") }}
    </p>
    <div
      v-if="debouncedSelectedMaterials?.size"
      class="mr-9 flex flex-col divide-y divide-neutral-100 rounded-2xl border border-neutral-100"
    >
      <TargetsEditMaterialsCard
        v-for="material in debouncedSelectedMaterials"
        :key="material"
        :material-id="material"
        @delete-material="deleteMaterial(material)"
      />
    </div>
    <button
      class="button sm outlined mb-8"
      data-test-id="updateSelectedMaterials"
      type="button"
      @click="updateSelectedMaterials"
    >
      <Icon class="fill-neutral-900" name="SvgoPlus" size="16" />
      <span>{{ t("ipr.targets.new.materials.new") }}</span>
    </button>
  </div>
  <LazyVPopup
    v-if="isPopupOpened"
    is-full-screen
    :title="t('ipr.targets.tabs.materials')"
    window-classes="lg:max-w-[60rem] !w-full"
    @click-outside="isPopupOpened = false"
  >
    <template #footerButtons>
      <button
        class="button lg outlined hidden sm:flex"
        data-test-id="selectedMaterials"
        type="button"
        @click="selectedMaterials?.clear"
      >
        {{ t("system.reset") }}
      </button>
      <button
        class="button lg primary"
        data-test-id="updateDebounceSelectedMaterials"
        :disabled="!selectedMaterials?.size"
        type="button"
        @click="updateDebounceSelectedMaterials"
      >
        <span>{{ t("system.select") }}</span>
        <span v-if="selectedMaterials?.size">
          {{ selectedMaterials?.size }}
        </span>
      </button>
    </template>
    <div
      class="min-w-max divide-y divide-neutral-100 rounded-2xl border border-neutral-100 sm:min-w-0 md:min-w-0"
    >
      <div
        class="grid min-w-max grid-cols-6 items-center divide-x divide-neutral-100 sm:min-w-0 md:min-w-0"
      >
        <div class="col-span-4 p-3">
          <VInput
            id="search"
            v-model.trim="search"
            class="max-w-[13rem]"
            data-test-id="search"
            :placeholder="t('system.search')"
          />
        </div>
        <p
          class="col-span-2 flex h-full items-center px-3 text-sm font-medium text-neutral-400"
        >
          {{ t("ipr.targets.materials.skills") }}
        </p>
      </div>
      <TargetsEditMaterialsTree :search="debouncedSearch" />
    </div>
  </LazyVPopup>
</template>
