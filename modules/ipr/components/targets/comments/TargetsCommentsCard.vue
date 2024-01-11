<script setup lang="ts">
import type { CommentsComment } from "@/Api"

const props = defineProps<{
  /** Комментарии */
  comment: CommentsComment
}>()

const { t } = useI18n()

const { displayDate, parseDate } = useDateConverter()

/** Текущая дата новости */
const cardDate = parseDate(toRefs(props).comment.value.created_at ?? "")
</script>

<template>
  <div class="flex gap-x-3">
    <img class="h-8 w-8 shrink-0 rounded-lg bg-neutral" />
    <div class="flex flex-col gap-y-2">
      <div class="flex flex-col gap-y-0.5">
        <h4 class="text-sm font-medium">
          <span v-if="useUserStore().user?.id === comment.author?.id">
            {{ t("ipr.targets.comments.you") }}
          </span>
          <span v-else>
            {{
              `${useUserDisplay(comment.author).getFullName()}, ${
                comment.author?.role?.name
              }`
            }}
          </span>
        </h4>
        <p class="text-xs text-neutral-400">
          {{ displayDate(cardDate) }}
        </p>
      </div>
      <p>{{ comment.text }}</p>
    </div>
  </div>
</template>
