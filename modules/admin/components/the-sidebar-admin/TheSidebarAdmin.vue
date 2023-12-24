<script setup lang="ts"></script>

<template>
  <aside
    class="sticky left-0 top-0 flex h-screen w-14 shrink-0 flex-col items-center bg-white shadow-lg"
  >
    <div class="flex h-14 items-center">
      <Icon class="cursor-pointer fill-neutral" name="SvgoMenu" size="20" />
    </div>
    <div class="p-2">
      <TheSidebarAdminNavigation />
    </div>
  </aside>
</template>
