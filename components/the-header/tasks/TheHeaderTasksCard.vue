<script setup lang="ts">
import type { TasksTaskAttributeStatus, TasksTaskDefaultObject } from "@/Api"

const props = defineProps<{
  /** Задача */
  task: TasksTaskDefaultObject
}>()

const emit = defineEmits<{
  /** Обновить задачи */
  updateTasks: []
}>()

const { t } = useI18n()

/** Стиль статуса */
interface StatusStyle {
  /** Классы */
  classes: string
  /** Иконка */
  icon: string
}

/** Стили статусов */
const statusStyles = {
  done: {
    classes: "text-neutral fill-neutral",
    icon: "SvgoCheck",
  },
  failed: {
    classes: "text-error",
    icon: "SvgoAlertCircle",
  },
} as const satisfies Partial<
  Record<NonNullable<TasksTaskAttributeStatus["status"]>, StatusStyle>
>

/**
 * Функция для скачивания файла.
 */
async function downloadFile() {
  /** Скаченный файл */
  const file = await useApi().files.filesDownloadOne(
    props.task.file_id!.toString(),
    {
      headers: useAuth().generateHeaders(),
    }
  )

  /** Хедер `Content-Disposition` */
  const contentDisposition = file.headers.get("content-disposition")
  /** Имя файла */
  const fileName = contentDisposition
    ?.substring(contentDisposition.indexOf("=") + 1)
    .replaceAll('"', "")

  /** Ссылка на файл */
  const url = URL.createObjectURL(await file.blob())
  /** Элемент `<a />` */
  const a = document.createElement("a")
  a.href = url
  a.download = fileName ?? ""

  // Кликаем по ссылке
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Функция для удаления задачи.
 */
async function deleteTask() {
  await useApi().tasks.tasksDeleteOne(props.task.id!, {
    headers: useAuth().generateHeaders(),
  })

  // Обновляем список задач
  emit("updateTasks")
}
</script>

<template>
  <div class="group flex items-center justify-between p-3 hover:bg-neutral-50">
    <div class="flex flex-col gap-y-1">
      <h6>{{ t(`asyncActions.reports.${task.type}`) }}</h6>
      <div
        v-if="task.status === 'done' || task.status === 'failed'"
        class="flex items-center gap-x-1.5"
        :class="statusStyles[task.status].classes"
      >
        <Icon
          :class="statusStyles[task.status].classes"
          :name="statusStyles[task.status].icon"
          size="16"
        />
        <p>{{ t(`asyncActions.statuses.${task.status}`) }}</p>
        <button
          v-if="task.status === 'done'"
          class="text-primary hover:text-primary-600"
          data-test-id="downloadFile"
          @click="downloadFile"
        >
          {{ t("system.download") }}
        </button>
      </div>
      <p v-else class="text-neutral">{{ t("asyncActions.statuses.new") }}</p>
    </div>
    <Icon
      class="!hidden cursor-pointer fill-neutral-400 hover:fill-neutral group-hover:!inline-block"
      data-test-id="deleteTask"
      name="SvgoXClose"
      size="16"
      @click="deleteTask"
    />
  </div>
</template>
