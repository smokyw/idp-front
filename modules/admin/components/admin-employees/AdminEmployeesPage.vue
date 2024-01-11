<script setup lang="ts">
import type {
  AdminPanelUsersCreateUserRequest,
  AdminPanelUsersGetUserDetailsSuccessResponse,
} from "~/Api"

const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps<{
  /** Пользователь из родительского компонента */
  parentUser?: NonNullable<
    AdminPanelUsersGetUserDetailsSuccessResponse["data"]
  >["success"]
}>()

/** Вкладки */
const tabs = ["account", "role", "employee"] as const

/** Список доступных ролей */
const roles = await useApi().admin.adminPanelGetRoles({
  headers: useAuth().generateHeaders(),
})

/** Пользователь */
const user = ref<AdminPanelUsersCreateUserRequest>({
  email: "",
  employee: {
    email: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "",
  },
  first_name: "",
  last_name: "",
  login: "",
  // @ts-expect-error - пароль можно не передавать, если пользователь уже существует
  password: undefined,
  role_id: toRefs(props).parentUser.value?.role?.id ?? 0,
  ...toRefs(props).parentUser.value,
})

/** Заполнены ли все обязательные поля */
const isRequiredFieldsFilled = computed(() => {
  return (
    user.value.email &&
    user.value.first_name &&
    user.value.last_name &&
    user.value.login &&
    (user.value.password || props.parentUser) &&
    user.value.role_id
  )
})

/**
 *
 */
async function createUser() {
  await useApi().admin.adminPanelCreateUser(user.value, {
    headers: useAuth().generateHeaders(),
  })

  navigateTo(localePath("/admin"))
}

/**
 *
 */
async function updateUser() {
  await useApi().admin.adminPanelUpdateUserDetails(
    toRefs(props).parentUser.value!.id!,
    user.value,
    {
      headers: useAuth().generateHeaders(),
    }
  )

  navigateTo(localePath("/admin"))
}

const { copy } = useClipboard()
</script>

<template>
  <div class="fixed inset-0 z-50 bg-neutral-900/25">
    <div
      class="absolute inset-y-2 right-0 flex flex-col rounded-l-xl bg-white px-8 py-6"
    >
      <h1 class="border-b border-neutral-200 pb-4 text-display-sm">
        {{
          parentUser
            ? useUserDisplay(parentUser).getFullName()
            : t("admin.employees.employeesPage.add")
        }}
      </h1>
      <div class="mt-3 flex grow flex-col gap-y-4">
        <div v-if="parentUser" class="flex items-center justify-between">
          <div class="flex flex-col text-xs text-neutral">
            <p>
              {{
                t("system.created", {
                  date: useDateConverter()
                    .parseDate(parentUser.created_at!)
                    .toLocaleDateString(),
                })
              }}
            </p>
            <p>
              {{
                t("system.updated", {
                  date: useDateConverter()
                    .parseDate(parentUser.updated_at!)
                    .toLocaleDateString(),
                })
              }}
            </p>
          </div>
          <div
            class="flex cursor-pointer gap-x-2 rounded-full border border-neutral-200 px-3 py-1 text-neutral"
            data-test-id="copy"
            @click="copy(parentUser.employee?.id?.toString() ?? '')"
          >
            <span>
              {{
                t("admin.employees.employeesPage.id", {
                  id: parentUser.employee?.id,
                })
              }}
            </span>
            <Icon name="SvgoCopyOutline" size="16" />
          </div>
        </div>
        <HeadlessTabGroup as="div" class="flex flex-col gap-y-4 py-3">
          <HeadlessTabList class="flex gap-x-4 border-b border-neutral-200">
            <HeadlessTab
              v-for="tab in tabs"
              :key="tab"
              class="border-b-[.1875rem] border-transparent px-1 pb-[.4375rem] pt-2.5 outline-none ui-selected:border-primary ui-not-selected:text-neutral"
            >
              {{ t(`admin.employees.employeesPage.tabs.${tab}`) }}
            </HeadlessTab>
          </HeadlessTabList>
          <HeadlessTabPanels>
            <HeadlessTabPanel class="flex flex-col gap-y-6">
              <VInput
                id="login"
                v-model="user.login"
                data-test-id="user.login"
                :label="t('system.login')"
              />
              <VPassword
                v-model="user.password"
                data-test-id="user.password"
                :label="t('system.password')"
                show-generate
              />
              <VInput
                id="firstName"
                v-model="user.first_name"
                data-test-id="user.first_name"
                :label="t('system.firstName')"
              />
              <VInput
                id="lastName"
                v-model="user.last_name"
                data-test-id="user.last_name"
                :label="t('system.lastName')"
              />
              <VInput
                id="email"
                v-model="user.email"
                data-test-id="user.email"
                :label="t('system.email')"
                type="email"
              />
            </HeadlessTabPanel>
            <HeadlessTabPanel>
              <VAdminSelect
                id="role"
                v-model="user.role_id"
                data-test-id="user.role_id"
                :label="t('admin.employees.columns.role')"
                :options="roles.data.data?.success!"
                required
              />
            </HeadlessTabPanel>
            <HeadlessTabPanel class="flex flex-col gap-y-6">
              <VInput
                id="firstName"
                v-model="user.employee!.first_name"
                data-test-id="undefined.first_name"
                :label="t('system.firstName')"
                :required="false"
              />
              <VInput
                id="lastName"
                v-model="user.employee!.last_name"
                data-test-id="undefined.last_name"
                :label="t('system.lastName')"
                :required="false"
              />
              <VInput
                id="fatherName"
                v-model="user.employee!.middle_name"
                data-test-id="undefined.middle_name"
                :label="t('system.fatherName')"
                :required="false"
              />
              <VInput
                id="email"
                v-model="user.employee!.email"
                data-test-id="undefined.email"
                :label="t('system.email')"
                :required="false"
                type="email"
              />
              <VPhone
                v-model="user.employee!.phone"
                data-test-id="undefined.phone"
                :label="t('system.phone')"
                :required="false"
              />
            </HeadlessTabPanel>
          </HeadlessTabPanels>
        </HeadlessTabGroup>
      </div>
      <div class="flex gap-x-2 border-t border-neutral-200 pt-4">
        <button
          class="button sm primary"
          data-test-id="createUser"
          :disabled="!isRequiredFieldsFilled"
          @click="parentUser ? updateUser() : createUser()"
        >
          {{ t(parentUser ? "system.save" : "system.add") }}
        </button>
        <NuxtLinkLocale class="button sm outlined" to="/admin">
          {{ t("system.cancel") }}
        </NuxtLinkLocale>
      </div>
    </div>
  </div>
</template>
