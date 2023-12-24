<script setup lang="ts">
defineProps<{
  /**
   * Закрывать ли окно только при нажатии на кнопку закрытия.
   * При таком варианте не будет учитываться клик вне окна, а при нажатии на кнопку будет возвращен эмит `close`.
   */
  closeExplicitly?: boolean
  /** Является ли поп-ап полноэкранным */
  isFullScreen?: boolean
  /** Является ли поп-ап маленьким */
  isSmall?: boolean
  /** Заголовок поп-апа */
  title?: string
  /** Классы для добавления к окну */
  windowClasses?: string
}>()

const emit = defineEmits<{
  /** Нажатие вне поп-апа */
  clickOutside: []
  /** Нажатие на крестик */
  close: []
}>()

/** Слоты компонента */
const slots = useSlots()

/** Контент поп-апа */
const popupContent = ref()

/** Область скролла поп-апа */
const popupScroll = ref<HTMLElement | null>(null)
provide("popupScroll", popupScroll)

onClickOutside(popupContent, () => {
  emit("clickOutside")
})
</script>

<template>
  <div
    class="fixed inset-x-0 inset-y-0 z-50 flex justify-center bg-neutral-900/25 lg:inset-y-0 lg:z-50 lg:items-center"
    :class="[isFullScreen ? 'items-end' : 'items-center']"
  >
    <div
      ref="popupContent"
      class="relative flex max-h-full flex-col bg-white lg:mx-2 lg:w-auto lg:max-w-3xl lg:rounded-2xl"
      :class="[
        isFullScreen
          ? 'h-full w-full rounded-t-2xl'
          : 'max-w-[calc(100vw-1rem)] rounded-2xl',
        windowClasses,
      ]"
    >
      <div
        v-if="title || slots['header-left'] || slots['header-right']"
        class="flex items-center justify-between p-4 !pb-3 sm:p-6"
        :class="{ 'border-b border-neutral-100': !isSmall }"
      >
        <div class="flex items-center gap-x-2">
          <h2 class="text-lg font-semibold lg:text-display-sm">{{ title }}</h2>
          <slot name="header-left" />
        </div>
        <div class="flex items-center gap-x-2">
          <slot name="header-right" />
          <button
            v-if="!isSmall"
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-white hover:bg-neutral-50"
            data-test-id="closeExplicitly"
            @click="closeExplicitly ? emit('close') : emit('clickOutside')"
          >
            <LazyIcon class="fill-neutral-900" name="SvgoXClose" size="20" />
          </button>
        </div>
      </div>
      <div
        ref="popupScroll"
        class="h-full overflow-y-auto"
        :class="[isSmall ? 'px-4 sm:px-6' : 'p-4 sm:p-6']"
      >
        <slot />
      </div>
      <div
        v-if="slots.footer || slots.footerButtons"
        class="flex flex-col gap-y-6 px-4 py-6 lg:px-6"
        :class="{ 'border-t border-neutral-100': !isSmall }"
      >
        <slot v-if="slots.footer" name="footer" />
        <div
          v-if="slots.footerButtons"
          class="flex items-center justify-end gap-x-2"
        >
          <slot name="footerButtons" />
        </div>
      </div>
    </div>
  </div>
</template>
