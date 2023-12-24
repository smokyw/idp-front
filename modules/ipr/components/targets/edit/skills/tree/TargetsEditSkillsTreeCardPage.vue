<script setup lang="ts">
const props = defineProps<{
  /** `ID` навыка */
  id: number
  /** Показывать ли кнопки управления */
  showControls?: boolean
}>()

const emit = defineEmits<{
  /** Закрыть окно */
  closePopup: []
  /** Выбрать навык */
  selectSkill: []
}>()

const { t } = useI18n()

const skill = await useApi().skills.skillsGetSkillDetails(
  toRefs(props).id.value,
  {},
  {
    headers: useAuth().generateHeaders(),
  }
)

/** Родительские элементы навыка */
const skillParents = computed(() => {
  return skill.data.data?.success?.parents?.map((parent) => parent.name)
})

/** Выбранный родитель навыка */
const selectedSkillParent = ref<number>()
</script>

<template>
  <VPopup
    :title="t(`ipr.targets.skills.types.${skill.data.data?.success?.type}`)"
    window-classes="!max-w-[40rem] !w-full"
    @click-outside="emit('closePopup')"
  >
    <template v-if="showControls" #footerButtons>
      <button
        class="button lg outlined"
        data-test-id="emit"
        type="button"
        @click="emit('closePopup')"
      >
        {{ t("system.cancel") }}
      </button>
      <button
        v-if="skill.data.data?.success?.type !== 'competency_cluster'"
        class="button lg primary"
        data-test-id="emit"
        type="button"
        @click="emit('selectSkill')"
      >
        {{ t("system.select") }}
      </button>
    </template>
    <div class="flex flex-col gap-y-5">
      <div class="target-info-block">
        <h2>{{ t("ipr.targets.pageTitles.name") }}</h2>
        <p>{{ skill.data.data?.success?.name }}</p>
      </div>
      <div
        v-if="skill.data.data?.success?.type === 'skill'"
        class="target-info-block"
      >
        <h2>{{ t("ipr.targets.pageTitles.related") }}</h2>
        <div class="w-full overflow-x-auto">
          <LazyVBreadcrumbs
            :breadcrumbs="skillParents ?? []"
            cursor-pointer
            @select-breadcrumb="
              selectedSkillParent = skill.data.data.success.parents?.find(
                (parent) => parent.name === $event
              )?.id
            "
          />
        </div>
      </div>
      <div class="target-info-block">
        <h2>{{ t("ipr.targets.pageTitles.description") }}</h2>
        <p>{{ skill.data.data?.success?.description }}</p>
      </div>
      <div
        v-if="skill.data.data?.success?.type === 'skill'"
        class="target-info-block"
      >
        <h2>{{ t("ipr.targets.pageTitles.levels") }}</h2>
        <LazyTargetsLevels
          :current-level="skill.data.data?.success.current_level_indicator_id"
          :required-level="skill.data.data?.success.required_level_indicator_id"
        />
      </div>
    </div>
    <LazyTargetsEditSkillsTreeCardPage
      v-if="selectedSkillParent"
      :id="selectedSkillParent"
      @close-popup="selectedSkillParent = undefined"
    />
  </VPopup>
</template>
