<script setup lang="ts">
const props = defineProps<{
  /** Навык */
  skillId: number
}>()

const skill = await useApi().skills.skillsGetSkillDetails(
  toRefs(props).skillId.value,
  {},
  {
    headers: useAuth().generateHeaders(),
  }
)

const emit = defineEmits<{
  /** Удалить выбранный навык */
  deleteSkill: []
}>()

/** Родительские элементы навыка */
const skillParents = computed(() => {
  return skill.data.data?.success?.parents?.map((parent) => parent.name)
})

/** `ref` заголовка навыка */
const skillTitle = ref<HTMLElement>()

/** Показаны ли родительские элементы */
const isParentsShown = useElementHover(skillTitle)
</script>

<template>
  <div
    class="relative grid grid-cols-1 items-center gap-y-2 p-3 lg:h-16 lg:grid-cols-8 lg:p-0"
  >
    <h3
      ref="skillTitle"
      class="relative col-span-6 text-sm decoration-neutral underline-offset-4 hover:underline lg:px-3"
    >
      <span>{{ skill.data.data?.success?.name }}</span>
      <div
        v-if="isParentsShown"
        class="absolute bottom-1/2 right-0 rounded-xl bg-white p-3 shadow-lg"
      >
        <LazyVBreadcrumbs :breadcrumbs="skillParents ?? []" />
      </div>
    </h3>
    <div class="flex gap-x-1 lg:col-span-2 lg:grid lg:grid-cols-2">
      <TargetsLevelsCard
        :current-level="skill.data.data?.success?.current_level_indicator_id"
        :required-level="skill.data.data?.success?.required_level_indicator_id"
      />
      <TargetsLevelsCard
        :required-level="skill.data.data?.success?.required_level_indicator_id"
      />
    </div>
    <button
      class="absolute left-full ml-1 h-7 w-7"
      data-test-id="emit"
      type="button"
      @click="emit('deleteSkill')"
    >
      <Icon name="SvgoTrash" size="20" />
    </button>
  </div>
</template>
