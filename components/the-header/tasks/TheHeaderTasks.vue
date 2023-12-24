<script setup lang="ts">
import type { HttpResponse, TasksCollectionSuccessResponse } from "@/Api"

defineProps<{
  /** Используется ли блок в админке */
  isAdmin?: boolean
}>()

const { t } = useI18n()

/**
 * Функция для получения списка задач.
 *
 * @returns список задач.
 */
async function getTasks() {
  return await useApi().tasks.tasksGetCollection(
    {},
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/**
 * Функция для обновления списка задач.
 */
async function updateTasks() {
  tasks.value = await getTasks()
}

/** Список задач */
const tasks = ref(await getTasks())

/**
 * Функция для удаления задачи.
 */
async function deleteTasks() {
  await useApi().tasks.tasksDeleteAll({
    headers: useAuth().generateHeaders(),
  })

  // Обновляем список задач
  await updateTasks()
}

/** Хранилище задач */
const tasksStore = useTasksStore()

watch([tasksStore.generatingTasks], async () => {
  // Если есть задачи в списке
  if (Object.keys(tasksStore.generatingTasks).length) {
    // Запускаем долгий запрос
    await tasksLongPoll()
  } else {
    // Иначе обновляем список задач
    await updateTasks()
  }
})

/**
 * Функция для долгого запроса к списку задач.
 */
async function tasksLongPoll() {
  // Ставим состояние загрузки на true
  isLoading.value = true

  /** Список задач */
  const tasks = (await useApi()
    .tasks.tasksLongPoll(
      {
        ids: Object.keys(tasksStore.generatingTasks).map((key) => Number(key)),
      },
      {
        headers: useAuth().generateHeaders(),
      }
    )
    .catch(async () => {
      await tasksLongPoll()
    })) as HttpResponse<TasksCollectionSuccessResponse>

  // Каждую готовую задачу удаляем из списка генерируемых задач
  tasks.data.data?.success?.forEach(
    (task) => delete tasksStore.generatingTasks[task.id!]
  )

  // Если есть задачи с проваленным статусом
  if (tasks.data.data?.success?.some((task) => task.status === "failed")) {
    // Выставляем статус на ошибку
    tasksState.value = "error"
  } else {
    // Иначе выставляем статус на успешно
    tasksState.value = "success"
  }

  // Ставим состояние загрузки на false
  isLoading.value = false
}

/** Состояние списка задач */
const tasksState = ref<"success" | "error" | null>(null)
/** Идет ли загрузка задач */
const isLoading = ref(false)
</script>

<template>
  <HeadlessPopover class="relative">
    <HeadlessPopoverButton
      class="button group relative rounded-lg outline-none"
      :class="[isAdmin ? 'h-9 w-9 !ring-0' : 'secondary h-10 w-10']"
      data-test-id="tasksState"
      @click="tasksState = null"
    >
      <div class="z-10 rounded-full">
        <Icon name="SvgoClockFastForward" size="20" />
      </div>
      <div
        v-if="tasksState"
        class="absolute right-1.5 top-1.5 z-20 h-2 w-2 rounded-full ring-2 ring-white group-hover:ring-neutral-200 group-active:ring-white"
        :class="{
          'bg-success': tasksState === 'success',
          'bg-error': tasksState === 'error',
        }"
      />

      <div
        v-if="isLoading"
        class="absolute animate-spin rounded-full"
        :class="[isAdmin ? 'h-full w-full' : 'h-7 w-7']"
        style="
          background: conic-gradient(
            #00a8a5 0%,
            #00a8a5 75%,
            #f3f4f6 75%,
            #f3f4f6 100%
          );
        "
      />
      <div
        v-else
        class="absolute rounded-full bg-neutral-200"
        :class="[isAdmin ? 'h-full w-full' : 'h-7 w-7']"
      />
      <div
        class="absolute rounded-full bg-white group-hover:bg-neutral-200 group-active:bg-white"
        :class="[
          isAdmin ? 'h-[2.125rem] w-[2.125rem]' : 'h-[1.625rem] w-[1.625rem]',
        ]"
      />
    </HeadlessPopoverButton>
    <HeadlessPopoverPanel
      class="absolute right-0 top-full z-30 mt-2 w-[25rem] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg"
    >
      <div class="flex flex-col divide-y divide-neutral-200">
        <div class="flex items-center justify-between px-3 py-4 font-medium">
          <h5>{{ t("asyncActions.title") }}</h5>
          <button
            class="text-primary hover:text-primary-600"
            data-test-id="deleteTasks"
            @click="deleteTasks"
          >
            {{ t("asyncActions.clearAll") }}
          </button>
        </div>
        <div
          v-if="Object.keys(tasksStore.generatingTasks).length"
          class="flex max-h-[30rem] flex-col divide-y divide-neutral-200 overflow-y-auto"
        >
          <LazyTheHeaderTasksCard
            v-for="task in tasksStore.generatingTasks"
            :key="task.id"
            :task="task"
            @update-tasks="updateTasks"
          />
        </div>
        <div
          v-if="tasks.data.data?.success?.length"
          class="flex max-h-[30rem] flex-col divide-y divide-neutral-200 overflow-y-auto"
        >
          <LazyTheHeaderTasksCard
            v-for="task in tasks.data.data?.success"
            :key="task.id"
            :task="task"
            @update-tasks="updateTasks"
          />
        </div>
        <p
          v-else-if="!Object.keys(tasksStore.generatingTasks).length"
          class="py-6 text-center text-neutral"
        >
          {{ t("asyncActions.empty") }}
        </p>
      </div>
    </HeadlessPopoverPanel>
  </HeadlessPopover>
</template>
