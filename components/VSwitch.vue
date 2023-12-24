<script setup lang="ts">
defineProps<{
  /** Подпись */
  label?: string
}>()

/** Включен ли свитч */
const isEnabled = defineModel<boolean>({
  default: false,
  required: true,
})
</script>

<template>
  <HeadlessSwitchGroup>
    <div class="flex items-center justify-between">
      <HeadlessSwitchLabel v-if="label" class="font-medium" passive>
        {{ label }}
      </HeadlessSwitchLabel>
      <HeadlessSwitch
        v-model="isEnabled"
        class="relative inline-flex h-5 w-8 items-center rounded-full bg-neutral-300 transition-colors focus:outline-none ui-checked:bg-primary"
        data-test-id="isEnabled"
      >
        <div
          class="inline-block h-4 w-4 translate-x-0.5 transform rounded-full bg-white transition-transform ui-checked:translate-x-3.5"
        />
      </HeadlessSwitch>
    </div>
  </HeadlessSwitchGroup>
</template>
