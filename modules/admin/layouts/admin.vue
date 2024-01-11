<script setup lang="ts"></script>

<template>
  <div class="flex">
    <TheSidebarAdmin />
    <div class="flex w-full flex-col">
      <TheHeaderAdmin />
      <div class="h-full px-6 py-4">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<style>
input,
textarea {
  @apply rounded-md px-3;
}

.field-label {
  @apply text-lg font-medium;
}
</style>
