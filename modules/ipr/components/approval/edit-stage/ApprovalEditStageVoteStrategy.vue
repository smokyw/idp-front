<script setup lang="ts">
import type { IdpRouteStageAttributeVoteStrategy } from "@/Api"

defineProps<{
  /** Отключен ли выбор */
  disabled?: boolean
}>()

const { t } = useI18n()

const options = {
  first: t("ipr.approval.voteStrategy.first"),
  unanimous: t("ipr.approval.voteStrategy.unanimous"),
} as const satisfies Record<
  NonNullable<IdpRouteStageAttributeVoteStrategy["vote_strategy"]>,
  string
>

/** Выбранное значение */
const modelValue = defineModel<
  IdpRouteStageAttributeVoteStrategy["vote_strategy"]
>({ default: "first", required: true })
</script>

<template>
  <HeadlessListbox
    v-model="modelValue"
    as="div"
    class="relative"
    data-test-id="modelValue"
    :disabled="disabled"
  >
    <HeadlessListboxButton
      class="flex w-72 items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-2.5 outline-none hover:bg-neutral-200 ui-disabled:border-neutral-50 ui-disabled:bg-neutral-50 ui-disabled:text-neutral-400"
    >
      <span class="text-sm">{{ options[modelValue!] }}</span>
      <Icon class="fill-neutral-400" name="SvgoChevronDown" size="16" />
    </HeadlessListboxButton>
    <HeadlessListboxOptions
      class="absolute z-10 mt-2 min-w-[16rem] rounded-lg border border-neutral-100 bg-white py-2 outline-none"
    >
      <HeadlessListboxOption
        v-for="(option, key) in options"
        :key="key"
        v-slot="{ selected, active }"
        :value="key"
      >
        <div
          class="cursor-pointer border-l-2 border-white/0 px-4 py-2 text-sm font-regular"
          :class="{ '!border-primary bg-neutral-50': selected || active }"
        >
          {{ option }}
        </div>
      </HeadlessListboxOption>
    </HeadlessListboxOptions>
  </HeadlessListbox>
</template>
