<script setup lang="ts">
const { t } = useI18n()

/** Список доступных ролей */
const roles = await useApi().admin.adminPanelGetRoles({
  headers: useAuth().generateHeaders(),
})

/** Выбранные роли */
const selectedRoles = defineModel<Set<number>>({
  required: true,
})

/**
 * Функция для выбора всех ролей.
 *
 * Если все роли из списка выбраны, очищаем выбранные роли.
 * Иначе добавляем все роли в список.
 */
function selectAll() {
  // Если все роли выбраны
  if (isAllSelected.value) {
    // Очищаем выбранные роли
    roles.data.data?.success?.forEach((role) =>
      selectedRoles.value.delete(role.id!)
    )
  } else {
    // Иначе добавляем все роли в список
    roles.data.data?.success?.forEach((role) =>
      selectedRoles.value.add(role.id!)
    )
  }
}

/** Выбраны ли все роли */
const isAllSelected = computed(() => {
  return roles.data.data?.success?.every((role) =>
    selectedRoles.value.has(role.id!)
  )
})
</script>

<template>
  <HeadlessDisclosure
    as="div"
    class="flex flex-col gap-y-3 rounded-md border border-neutral-200 bg-white p-4"
    default-open
  >
    <HeadlessDisclosureButton class="flex w-full items-center justify-between">
      <span class="font-medium text-neutral-600">
        {{ t("admin.employees.filters.roles") }}
      </span>
      <Icon
        class="fill-neutral-400 ui-open:rotate-180"
        name="SvgoChevronDown"
        size="20"
      />
    </HeadlessDisclosureButton>
    <HeadlessDisclosurePanel class="flex flex-col gap-y-2.5">
      <div class="flex gap-x-2" data-test-id="selectAll" @click="selectAll">
        <input :checked="isAllSelected" type="checkbox" />
        <span>{{ t("system.all") }}</span>
      </div>
      <div
        v-for="role in roles.data.data?.success"
        :key="role.id"
        class="flex gap-x-2"
      >
        <input
          :id="`role-${role.id}`"
          v-model="selectedRoles"
          data-test-id="selectedRoles"
          type="checkbox"
          :value="role.id"
        />
        <label :for="`role-${role.id}`">{{ role.name }}</label>
      </div>
    </HeadlessDisclosurePanel>
  </HeadlessDisclosure>
</template>
