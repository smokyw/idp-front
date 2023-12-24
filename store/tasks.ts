import type { TasksTaskDefaultObject } from "@/Api"
import { acceptHMRUpdate, defineStore } from "pinia"

export const useTasksStore = defineStore("tasks", () => {
  /** Генерируемые задачи */
  const generatingTasks = ref<Record<number, TasksTaskDefaultObject>>({})

  return { generatingTasks }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTasksStore, import.meta.hot))
}
