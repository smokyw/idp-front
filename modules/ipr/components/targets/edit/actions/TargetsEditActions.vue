<script setup lang="ts">
import type { IdpIdpDetailsView } from "@/Api"

const props = defineProps<{
  /** `ID` сотрудника */
  employeeId?: number
  /** `ID` цели */
  id: number
  /** Год цели */
  idpId: number
  /** ИПР */
  parentIdp: IdpIdpDetailsView
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const NuxtLinkLocale = resolveComponent("NuxtLinkLocale")

const userStore = useUserStore()

const idp =
  props.parentIdp ??
  (await useApi().idp.idpGetIdpDetails(
    toRefs(props).idpId.value,
    {},
    {
      headers: useAuth().generateHeaders(),
    }
  ))

/**
 * Функция для удаления цели
 */
async function deleteTarget() {
  await useApi()
    .targets.targetsDeleteTarget(toRefs(props).id.value, {
      headers: useAuth().generateHeaders(),
    })
    .then(() => {
      // Редиректим на главную страницу
      navigateTo(localePath("/"))

      // Оповещаем об успешном создании цели
      useAlertsStore().appendSuccess({
        code: "targetDeleted.title",
      })
    })
}

/** Открыт ли поп-ап подтверждения удаления цели */
const isDeletePopupOpened = ref(false)
</script>

<template>
  <HeadlessMenu as="div" class="relative">
    <HeadlessMenuButton
      class="h-10 w-10 rounded-lg outline-none hover:bg-neutral-50 ui-open:bg-neutral-50"
    >
      <Icon class="fill-neutral" name="Svgo3DotsHorizontal" size="20" />
    </HeadlessMenuButton>
    <HeadlessMenuItems
      class="absolute right-0 mt-1 flex w-max flex-col divide-y divide-neutral-100 overflow-hidden rounded-lg bg-white shadow-lg outline-none lg:left-0"
    >
      <HeadlessMenuItem
        v-if="userStore.checkRight('app.targets.update_own_target')"
        :as="NuxtLinkLocale"
        class="px-4 py-2.5 text-left font-regular text-neutral-900 ui-active:bg-neutral-50"
        :to="{
          path: `/targets/edit/${id}`,
          query: {
            idpId: idp.id,
          },
        }"
      >
        {{ t("system.edit") }}
      </HeadlessMenuItem>
      <HeadlessMenuItem
        v-if="userStore.checkRight('app.targets.delete_own_target')"
        as="button"
        class="px-4 py-2.5 text-left ui-active:bg-neutral-50"
        data-test-id="isDeletePopupOpened"
        @click="isDeletePopupOpened = true"
      >
        {{ t("system.delete") }}
      </HeadlessMenuItem>
    </HeadlessMenuItems>
  </HeadlessMenu>
  <LazyVPopup
    v-if="isDeletePopupOpened"
    is-small
    :title="t('ipr.targets.delete.title')"
    @click-outside="isDeletePopupOpened = false"
  >
    <p class="max-w-sm text-neutral">
      {{
        t(
          idp.last_attempt_status === "approved"
            ? "ipr.targets.delete.descriptionApproved"
            : "ipr.targets.delete.description"
        )
      }}
    </p>
    <template #footerButtons>
      <button
        class="button md outlined !text-error"
        data-test-id="deleteTarget"
        @click="deleteTarget"
      >
        {{ t("ipr.targets.delete.yes") }}
      </button>
      <button
        class="button md primary"
        data-test-id="isDeletePopupOpened"
        @click="isDeletePopupOpened = false"
      >
        {{ t("ipr.targets.delete.no") }}
      </button>
    </template>
  </LazyVPopup>
</template>
