<script setup lang="ts">
import type { HttpResponse, TargetsTargetMaterialSuccessResponse } from "@/Api"

const props = defineProps<{
  /** `ID` материала */
  id: number
  /** Показывать кнопки управления */
  showControls?: boolean
  /** `ID` цели, к которой привязан материал */
  targetId?: number
}>()

const emit = defineEmits<{
  /** Закрыть окно */
  closePopup: []
  /** Выбрать навык */
  selectMaterial: []
}>()

const { t } = useI18n()

/** Параметры функции */
const params = {
  headers: useAuth().generateHeaders(),
}

/** Материал */
const material: HttpResponse<TargetsTargetMaterialSuccessResponse> =
  await (toRefs(props).targetId?.value
    ? useApi().targets.targetsGetTargetMaterial(
        toRefs(props).targetId?.value ?? 0,
        toRefs(props).id.value,
        params
      )
    : useApi().materials.materialsGetMaterialDetails(
        toRefs(props).id.value,
        params
      ))
</script>

<template>
  <VPopup
    :title="t('ipr.targets.materials.title')"
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
        class="button lg primary"
        data-test-id="emit"
        type="button"
        @click="emit('selectMaterial')"
      >
        {{ t("system.select") }}
      </button>
    </template>
    <div class="flex flex-col gap-y-5">
      <div class="target-info-block">
        <h2>{{ t("ipr.targets.pageTitles.name") }}</h2>
        <p>{{ material.data.data?.success?.name }}</p>
      </div>
      <div
        v-if="material.data.data?.success?.skills?.length"
        class="target-info-block"
      >
        <h2>{{ t("ipr.targets.pageTitles.skills") }}</h2>
        <div
          class="flex flex-col divide-y divide-neutral-100 rounded-xl border border-neutral-100"
        >
          <div
            v-for="skill in material.data.data?.success?.skills"
            :key="skill.id"
            class="flex h-11 items-center px-3"
          >
            <p class="line-clamp-1">{{ skill.name }}</p>
          </div>
        </div>
      </div>
      <div class="target-info-block">
        <h2>{{ t("ipr.targets.pageTitles.description") }}</h2>
        <p>{{ material.data.data?.success?.description }}</p>
      </div>
      <div v-if="material.data.data?.success?.reason" class="target-info-block">
        <h2>{{ t("ipr.targets.pageTitles.reason") }}</h2>
        <p>{{ material.data.data?.success?.reason }}</p>
      </div>
    </div>
  </VPopup>
</template>
