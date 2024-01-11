<script setup lang="ts">
const props = defineProps<{
  /** `ID цели` */
  id: number
}>()

const emit = defineEmits<{
  /** Комментарий создан */
  commentCreated: []
}>()

/** Комментарии */
const comments = ref()

/**
 * Сделать запрос на комментарии.
 */
async function getComments() {
  comments.value = await useApi().targets.targetsGetTargetComments(
    toRefs(props).id.value,
    {
      headers: useAuth().generateHeaders(),
    }
  )
}

/** Функция для обновления списка комментариев */
async function updateComments() {
  // Обновляем список комментариев
  await getComments()

  // Отправляем эмит в родительский компонент
  emit("commentCreated")
}

await getComments()
</script>

<template>
  <HeadlessTabPanel as="div">
    <TargetsComments
      :id="id"
      :comments="comments.data.data?.success"
      @comment-created="updateComments"
    />
  </HeadlessTabPanel>
</template>
