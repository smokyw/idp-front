<script setup lang="ts"></script>

<template>
  <header
    class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-200 bg-white pl-1 pr-6"
  >
    <SvgoLogoAdmin class="w-36" />
    <TheHeaderAdminSearch />
    <div class="flex items-center gap-x-4">
      <TheHeaderTasks is-admin />
      <TheHeaderUser is-admin />
    </div>
  </header>
</template>
