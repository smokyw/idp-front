<script setup lang="ts">
import type { BaseOffsetPaginationMeta } from "@/Api"
import type { Option } from "@/types/Utils"

const props = defineProps<{
  /** Информация о пагинации */
  pagination: BaseOffsetPaginationMeta | undefined
}>()

const { t } = useI18n()

/** Информация о пагинации */
export interface PaginationModel {
  /** Текущая страница */
  currentPage: number
  /** Количество страниц */
  pageSize: number
}

const modelValue = defineModel<PaginationModel>({
  required: true,
})

const { currentPage, isFirstPage, isLastPage, next, pageCount, prev } =
  useOffsetPagination({
    page: toRefs(props).pagination.value?.current_page,
    // @ts-expect-error pageSize не принимает computed как тип, но при этом это единственный вариант сделать значение реактивным
    pageSize: computed(() => props.pagination?.per_page),
    total: computed(() => props.pagination?.total),
  })

watch(currentPage, () => {
  modelValue.value.currentPage = currentPage.value
})

/** Опции количества результатов на странице */
const pageCountOptions: Option[] = [
  {
    id: 50,
    title: t("system.showResults", {
      number: 50,
    }),
  },
  {
    id: 75,
    title: t("system.showResults", {
      number: 75,
    }),
  },
  {
    id: 100,
    title: t("system.showResults", {
      number: 100,
    }),
  },
]

/** Выбранное количество результатов на странице */
const selectedPageCount = ref<Option>(pageCountOptions[0])

watch(selectedPageCount, () => {
  modelValue.value.pageSize = selectedPageCount.value.id as number
})

/** Отфильтрованный список страниц */
const filteredPages = computed(() => {
  /** Максимальное количество отображаемых страниц */
  const maxLength = 8

  /** Количество боковых элементов */
  const sideWidth = 1

  /**
   * Функция для создания массива чисел в диапазоне.
   *
   * @param start - начало списка.
   * @param end - конец списка.
   * @returns массив чисел в диапазоне.
   */
  function range(start: number, end: number) {
    return Array.from(Array(end - start + 1), (_, i) => i + start)
  }

  // Если количество отображаемых страниц больше, чем общее количество
  if (pageCount.value <= maxLength) {
    // Выводим полный список без пропусков
    return range(1, pageCount.value)
  }

  // Если текущая страница близко к началу списка
  if (currentPage.value <= maxLength - sideWidth - 1 - sideWidth) {
    // Выводим список без пропусков слева
    return range(1, maxLength - sideWidth - 1).concat(
      0,
      range(pageCount.value - sideWidth + 1, pageCount.value)
    )
  }

  // Если текущая страница близко к концу списка
  if (currentPage.value >= pageCount.value - sideWidth - 1 - sideWidth) {
    // Выводим список без пропусков справа
    return range(1, sideWidth).concat(
      0,
      range(
        pageCount.value - sideWidth - 1 - sideWidth - sideWidth,
        pageCount.value
      )
    )
  }

  // Иначе выводим список с пропусками с двух сторон
  return range(1, sideWidth).concat(
    0,
    range(currentPage.value - sideWidth, currentPage.value + sideWidth),
    0,
    range(pageCount.value - sideWidth + 1, pageCount.value)
  )
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex gap-x-2">
      <VPaginationButton
        data-test-id="prev"
        icon="SvgoChevronLeft"
        :is-active="!isFirstPage"
        @click="prev"
      />
      <LazyVPaginationButton
        v-for="page in filteredPages"
        :key="page"
        data-test-id="page"
        :is-selected="currentPage === page"
        :title="page !== 0 ? page : '...'"
        @click="page !== 0 && (currentPage = page)"
      />
      <VPaginationButton
        data-test-id="next"
        icon="SvgoChevronRight"
        :is-active="!isLastPage"
        @click="next"
      />
    </div>
    <VSelect
      v-model="selectedPageCount"
      button-style="secondary"
      data-test-id="selectedPageCount"
      icon="SvgoChevronDown"
      open-to-left
      open-to-top
      :options="pageCountOptions"
    />
  </div>
</template>
