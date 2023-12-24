<script setup lang="ts">
definePageMeta({
  layout: "login",
  middleware: "password-token",
})

/** Токен сброса пароля */
const token = useRoute("login-new-password-token___ru").params.token
</script>

<template>
  <FormsNewPassword :token="token" />
</template>
