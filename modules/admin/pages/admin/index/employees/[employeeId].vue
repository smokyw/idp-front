<script setup lang="ts">
/** `ID` пользователя */
const userId = useRoute().params.employeeId

/** Пользователь */
const user = await useApi().admin.adminPanelGetUserDetails(userId, {
  headers: useAuth().generateHeaders(),
})
</script>

<template>
  <AdminEmployeesPage :parent-user="user.data.data?.success" />
</template>
