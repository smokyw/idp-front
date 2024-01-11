<script setup lang="ts">
import type {
  HttpResponse,
  IdpGetIdpDetailsSuccessResponse,
  IdpIdpDetailsBriefView,
  IdpIdpDetailsView,
  TargetsCollectionSort,
  TargetsCollectionSuccessResponse,
  TargetsFiltersStatusGroup,
} from "@/Api"
import type { Option } from "@/types/Utils"

const { t } = useI18n()

// Выбранный ИПР

/** Выбранный год для целей */
const selectedIdp = ref<IdpIdpDetailsBriefView>()

/**
 * Функция для получения информации о текущем ИПР.
 *
 * @returns текущий ИПР.
 */
async function getIdp() {
  return await useApi().idp.idpGetIdpDetails(
    selectedIdp.value?.id ?? 0,
    {},
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/** Текущий ИПР */
const idp = ref<HttpResponse<IdpGetIdpDetailsSuccessResponse>>()

// ФИЛЬТРАЦИЯ ПО СТАТУСУ

/** Выбранный статус */
const selectedStatus = ref<TargetsFiltersStatusGroup["status_group"]>("active")

// СОРТИРОВКА

/** Опция сортировки */
interface SortOption extends Option {
  /** Направление сортировки */
  direction?: TargetsCollectionSort["direction"]
  id: TargetsCollectionSort["attribute"]
}

/** Опции для сортировки */
const sortOptions: SortOption[] = [
  {
    id: "priority",
    title: t("ipr.targets.sortOptions.priority"),
  },
  {
    direction: "asc",
    id: "deadline",
    title: t("ipr.targets.sortOptions.deadline"),
  },
  {
    direction: "desc",
    id: "created_at",
    title: t("ipr.targets.sortOptions.created_at-asc"),
  },
  {
    direction: "asc",
    id: "created_at",
    title: t("ipr.targets.sortOptions.created_at-desc"),
  },
]

/** Выбранная опция сортировки */
const selectedSortOption = ref(sortOptions[0])

// СПИСОК ЦЕЛЕЙ

/**
 * Функция для получения целей от API
 *
 * @returns Список целей
 */
async function getTargets() {
  return useApi().targets.targetsGetCollection(
    {
      filter: {
        idp_id: selectedIdp.value?.id ?? 0,
        status_group: selectedStatus.value,
      },
      sort: {
        attribute: selectedSortOption.value.id,
        direction: selectedSortOption.value.direction,
      },
    },
    {},
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/** Список целей */
const targets = ref<HttpResponse<TargetsCollectionSuccessResponse>>()

whenever(
  () => selectedIdp.value,
  async () => {
    targets.value = await getTargets()
    idp.value = await getIdp()
  }
)

watch(
  () => [
    selectedStatus.value,
    selectedSortOption.value,
    useRoute().path,
    selectedIdp.value,
  ],
  async (newValue, oldValue) => {
    if (oldValue[3] && newValue[2] === "/") {
      targets.value = await getTargets()
    }
  }
)

watch(
  () => [selectedIdp.value, useRoute().path],
  async (newValue, oldValue) => {
    if (oldValue[0] && newValue[1] === "/") {
      idp.value = await getIdp()
    }
  }
)

const approvalButtonIcons = {
  approval: "SvgoClock",
  approved: "SvgoCheckCircle",
  cancelled: "SvgoInfoCircle",
  not_approved: "SvgoInfoCircle",
} as const satisfies Record<
  NonNullable<IdpIdpDetailsView["last_attempt_status"]>,
  string
>

/** Открыт ли поп-ап повторного согласования цели */
const isPopupOpened = ref(false)
</script>

<template>
  <div class="flex items-center justify-between">
    <div
      class="flex w-full flex-col justify-between gap-x-2 gap-y-4 lg:w-max lg:flex-row lg:items-center lg:justify-start"
    >
      <h1 class="page-title flex gap-x-1.5">
        <span class="w-max">{{ t("ipr.title") }}</span>
        <TargetsYearPicker v-model="selectedIdp" data-test-id="selectedIdp" />
      </h1>
      <LazyNuxtLinkLocale
        v-if="idp && targets?.data.data?.success?.length"
        class="button sm"
        :class="[
          idp?.data.data?.success?.last_attempt_status === null
            ? 'outlined !border-secondary !text-secondary hover:!bg-secondary-200'
            : 'secondary',
        ]"
        :to="`/approval/${selectedIdp?.id}`"
      >
        <LazyIcon
          v-if="idp?.data.data?.success?.last_attempt_status"
          class="fill-neutral-400"
          :name="
            approvalButtonIcons[idp?.data.data?.success?.last_attempt_status]
          "
          size="18"
        />
        <span>
          {{
            t(
              `ipr.approval.startApprovalButton.${idp?.data.data?.success?.last_attempt_status}`,
              {
                approved:
                  idp?.data.data?.success
                    ?.last_attempt_count_of_approved_stages,
                all: idp?.data.data?.success?.last_attempt_count_of_stages,
              }
            )
          }}
        </span>
      </LazyNuxtLinkLocale>
    </div>
    <template
      v-if="
        useUserStore().checkRight('app.targets.create_target') &&
        selectedStatus === 'active' &&
        targets?.data.data?.success?.length
      "
    >
      <LazyNuxtLinkLocale
        v-if="idp?.data.data?.success?.last_attempt_status !== 'approved'"
        class="button primary sm hidden lg:flex"
        :to="{
          path: '/targets/new',
          query: {
            idpId: selectedIdp?.id,
          },
        }"
      >
        <LazyIcon class="fill-white" name="SvgoPlusCircleOutline" />
        <span>{{ t("ipr.targets.new.add") }}</span>
      </LazyNuxtLinkLocale>
      <button
        v-else
        class="button primary sm hidden lg:flex"
        data-test-id="isPopupOpened"
        @click="isPopupOpened = true"
      >
        <LazyIcon class="fill-white" name="SvgoPlusCircleOutline" />
        <span>{{ t("ipr.targets.new.add") }}</span>
      </button>
    </template>
  </div>
  <template v-if="selectedIdp">
    <div class="flex items-center justify-between">
      <TargetsStatuses
        v-model="selectedStatus"
        data-test-id="selectedStatus"
        :idp-id="selectedIdp.id!"
      />
      <LazyVSelect
        v-if="targets?.data.data?.success?.length"
        v-model="selectedSortOption"
        button-style="squared"
        data-test-id="selectedSortOption"
        icon="SvgoSortLines"
        is-title-custom
        open-to-left
        :options="sortOptions"
      />
    </div>
    <LazyNuxtLinkLocale
      v-if="
        useUserStore().checkRight('app.targets.create_target') &&
        selectedStatus === 'active' &&
        targets?.data.data?.success?.length
      "
      class="button primary sm w-full lg:hidden"
      :to="{
        path: '/targets/new',
        query: {
          idpId: selectedIdp?.id,
        },
      }"
    >
      <Icon class="fill-white" name="SvgoPlusCircleOutline" />
      <span>{{ t("ipr.targets.new.add") }}</span>
    </LazyNuxtLinkLocale>
    <div
      v-if="targets?.data.data?.success?.length"
      class="flex flex-col gap-y-2 pb-16"
    >
      <LazyTargetsCard
        v-for="target in targets?.data.data.success"
        :key="target.id"
        :idp-id="selectedIdp.id!"
        :target="target"
      />
    </div>
    <LazyTargetsEmptyState
      v-else
      :idp-id="selectedIdp.id!"
      :targets-status="selectedStatus"
    />
    <LazyNuxtPage v-if="idp" :idp="idp?.data.data?.success" />
  </template>
  <LazyTargetsNoPlan
    v-else
    :description="t('ipr.targets.noPlan.description')"
    show-background
    :title="t('ipr.targets.noPlan.title')"
  />
  <LazyVPopup
    v-if="isPopupOpened"
    is-small
    :title="t('ipr.approval.reapprove.title')"
    @click-outside="isPopupOpened = false"
  >
    <p class="text-md text-neutral">
      {{ t("ipr.approval.reapprove.description") }}
    </p>
    <template #footerButtons>
      <button
        class="button md outlined"
        data-test-id="isPopupOpened"
        @click="isPopupOpened = false"
      >
        {{ t("system.cancel") }}
      </button>
      <LazyNuxtLinkLocale
        class="button md primary"
        data-test-id="isPopupOpened"
        :to="{
          path: '/targets/new',
          query: {
            idpId: selectedIdp?.id,
          },
        }"
        @click="isPopupOpened = false"
      >
        {{ t("system.continue") }}
      </LazyNuxtLinkLocale>
    </template>
  </LazyVPopup>
</template>
