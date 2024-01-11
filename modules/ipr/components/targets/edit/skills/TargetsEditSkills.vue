<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  updateMaterials: []
}>()

/** Открыт ли попап выбора целей */
const isPopupOpened = ref(false)

/** Выбранные навыки */
const selectedSkills = inject<Ref<Set<number>>>("targetSkills")
/** Выбранные материалы */
const selectedMaterials = inject<Ref<Set<number>>>("targetMaterials")

/** Поисковой запрос */
const search = ref("")
/** Замедленный поиск */
const debouncedSearch = debouncedRef(search, 300)

/** Замедленные выбранные навыки */
const debouncedSelectedSkills = ref<Set<number> | undefined>(
  new Set(selectedSkills?.value)
)

/**
 * Функция для обновления выбранных навыков
 */
function updateSelectedSkills() {
  // Обновляем значение выбранных навыков
  selectedSkills!.value = new Set(debouncedSelectedSkills?.value)

  // Открываем поп-ап
  isPopupOpened.value = true
}

/**
 * Функция для обновления замедленных навыков
 */
async function updateDebounceSelectedSkills() {
  /** Связанные материалы */
  const linkedMaterials = await useApi().materials.materialsGetBySkills(
    {
      skill_ids: Array.from(selectedSkills!.value),
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )

  // Добавляем связанные материалы
  linkedMaterials.data.data?.success?.forEach(
    (material) => selectedMaterials?.value.add(material.id!)
  )

  // Отправляем эмит об изменении материалов
  emit("updateMaterials")

  // Обновляем значение замедленных навыков
  debouncedSelectedSkills.value = new Set(selectedSkills?.value)

  // Закрываем поп-ап
  isPopupOpened.value = false
}
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <h3 class="text-lg font-semibold">
      {{ t("ipr.targets.new.skills.title") }}
    </h3>
    <div v-if="debouncedSelectedSkills?.size" class="flex flex-col gap-y-2">
      <div class="mr-9 grid grid-cols-8 items-center">
        <p class="col-span-6 text-xs text-neutral">
          {{ t("ipr.targets.pageTitles.name") }}
        </p>
        <p class="hidden text-xs text-neutral lg:block">
          {{ t("ipr.targets.skills.currentLevel") }}
        </p>
        <p class="hidden text-xs text-neutral lg:block">
          {{ t("ipr.targets.skills.requiredLevel") }}
        </p>
      </div>
      <div
        class="mr-9 divide-y divide-neutral-100 rounded-2xl border border-neutral-100"
      >
        <LazyTargetsEditSkillsCard
          v-for="skill in debouncedSelectedSkills"
          :key="skill"
          :skill-id="skill"
          @delete-skill="
            () => {
              selectedSkills?.delete(skill)
              updateDebounceSelectedSkills()
            }
          "
        />
      </div>
    </div>
    <button
      class="button sm outlined mb-8"
      data-test-id="updateSelectedSkills"
      type="button"
      @click="updateSelectedSkills"
    >
      <Icon class="fill-neutral-900" name="SvgoPlus" size="16" />
      <span>{{ t("ipr.targets.new.skills.new") }}</span>
    </button>
    <LazyVPopup
      v-if="isPopupOpened"
      is-full-screen
      :title="t('ipr.targets.tabs.skills')"
      window-classes="lg:max-w-[60rem] !w-full"
      @click-outside="isPopupOpened = false"
    >
      <template #footerButtons>
        <button
          class="button lg outlined hidden sm:flex"
          data-test-id="selectedSkills"
          type="button"
          @click="selectedSkills?.clear"
        >
          {{ t("system.reset") }}
        </button>
        <button
          class="button lg primary"
          data-test-id="updateDebounceSelectedSkills"
          :disabled="!selectedSkills?.size"
          type="button"
          @click="updateDebounceSelectedSkills"
        >
          <span>{{ t("system.select") }}</span>
          <span v-if="selectedSkills?.size">
            {{ selectedSkills?.size }}
          </span>
        </button>
      </template>
      <div
        class="min-w-max divide-y divide-neutral-100 rounded-2xl border border-neutral-100 sm:min-w-0"
      >
        <div
          class="grid min-w-max grid-cols-6 items-center divide-x divide-neutral-100 sm:min-w-0"
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
            class="flex h-full items-center px-3 text-sm font-medium text-neutral-400"
          >
            {{ t("ipr.targets.skills.currentLevel") }}
          </p>
          <p
            class="flex h-full items-center px-3 text-sm font-medium text-neutral-400"
          >
            {{ t("ipr.targets.skills.requiredLevel") }}
          </p>
        </div>
        <TargetsEditSkillsTree :search="debouncedSearch" />
      </div>
    </LazyVPopup>
  </div>
</template>
