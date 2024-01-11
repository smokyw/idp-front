<script setup lang="ts">
interface Option {
  id?: number
  name?: string
}

const props = defineProps<{
  /** `ID` блока с инпутом */
  id: string
  /** Подпись блока */
  label?: string
  /** Список опций */
  options: Option[]
  /** Является ли поле обязательным */
  required?: boolean
}>()

/** Выбранное значение */
const modelValue = defineModel<number>({ required: true })

/** Выбранная опция */
const selectedOption = computed(() => {
  return props.options.find((option) => option.id === modelValue.value)
})
</script>

<template>
  <VField :id="id" :label="label" :required="required">
    <HeadlessListbox
      v-model="modelValue"
      as="div"
      class="relative"
      data-test-id="modelValue"
    >
      <HeadlessListboxButton
        class="flex w-full items-center justify-between rounded-md border border-neutral-200 px-3 py-2 outline-none hover:bg-neutral-200"
      >
        <span>{{ selectedOption?.name }}</span>
        <Icon class="fill-neutral" name="SvgoChevronDown" size="20" />
      </HeadlessListboxButton>
      <HeadlessListboxOptions
        class="absolute z-20 mt-2 min-w-[16rem] rounded-lg border border-neutral-100 bg-white py-2 outline-none"
      >
        <HeadlessListboxOption
          v-for="(option, index) in options"
          :key="index"
          v-slot="{ selected, active }"
          :value="option.id"
        >
          <div
            class="cursor-pointer border-l-2 border-white/0 px-4 py-2 text-sm font-regular"
            :class="{ '!border-primary bg-neutral-50': selected || active }"
          >
            {{ option.name }}
          </div>
        </HeadlessListboxOption>
      </HeadlessListboxOptions>
    </HeadlessListbox>
  </VField>
</template>
