<script setup lang="ts"></script>

<template>
  <header
    class="flex min-h-[3.5rem] items-center justify-between sm:min-h-[4.25rem]"
  >
    <NuxtLinkLocale class="ml-2.5" to="/">
      <SvgoLogo class="h-5" />
    </NuxtLinkLocale>
    <div class="flex items-center gap-x-3">
      <TheHeaderTasks />
      <TheHeaderUser />
    </div>
  </header>
</template>
