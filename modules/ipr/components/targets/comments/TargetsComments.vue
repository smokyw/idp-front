<script setup lang="ts">
import type { CommentsComment } from "@/Api"

const props = defineProps<{
  /** Комментарии */
  comments: CommentsComment[] | undefined
  /** `ID цели` */
  id: number
}>()

const emit = defineEmits<{
  /** Комментарий создан */
  commentCreated: []
}>()

const { t } = useI18n()

/** Комментарий */
const newComment = ref("")

/**
 * Функция для создания нового комментария.
 */
async function sendComment() {
  await useApi().targets.targetsLeaveCommentOnTarget(
    toRefs(props).id.value,
    {
      text: newComment.value,
    },
    {
      headers: useAuth().generateHeaders(),
    }
  )

  emit("commentCreated")

  newComment.value = ""
}
</script>

<template>
  <div class="flex flex-col gap-y-5">
    <form class="flex gap-x-3" @submit.prevent="sendComment">
      <VInput
        id="new-comment"
        v-model="newComment"
        class="w-full"
        data-test-id="newComment"
        :placeholder="t('ipr.targets.comments.placeholder')"
      />
      <button type="submit">
        <Icon
          :class="[
            newComment.length
              ? 'fill-neutral hover:fill-neutral-400'
              : 'cursor-default fill-neutral-300',
          ]"
          name="SvgoSend"
        />
      </button>
    </form>
    <div class="flex flex-col gap-y-6">
      <LazyTargetsCommentsCard
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>
  </div>
</template>
