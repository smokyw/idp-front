<script setup lang="ts">
defineProps<{
  /** Используется ли компонент в админке */
  isAdmin?: boolean
}>()

const { logOut } = useAuth()

const userStore = useUserStore()
const userDisplay = useUserDisplay(userStore.user)

/** Открыто ли меню уведомлений */
const isNotificationsOpened = ref(false)

/** Кнопка меню пользователя */
export interface HeaderUserButton {
  action: VoidFunction
  /** Иконка кнопки */
  icon: string
  /** Заголовок кнопки */
  title: string
}

/** Список кнопок меню пользователя */
const buttons = [
  {
    action: () => (isNotificationsOpened.value = true),
    icon: "SvgoBell",
    title: "settings.notifications.title",
  },
  {
    action: logOut,
    icon: "SvgoLogOut",
    title: "auth.signOut",
  },
] as const satisfies HeaderUserButton[]
</script>

<template>
  <HeadlessMenu v-slot="{ open }" as="div" class="relative">
    <HeadlessMenuButton
      class="flex shrink-0 cursor-pointer items-center gap-x-1.5 rounded-xl text-xs font-semibold outline-none"
      :class="{
        'sm:bg-white sm:py-1 sm:pl-3 sm:pr-1.5 sm:shadow-base': !isAdmin,
      }"
    >
      <!-- Имя пользователя -->
      <p v-if="!isAdmin">{{ userDisplay.getFullName() }}</p>
      <!-- Аватарка пользователя -->
      <div
        class="flex items-center justify-center rounded-full sm:rounded-lg"
        :class="[
          isAdmin ? 'h-9 w-9 sm:rounded-full' : 'h-8 w-8',
          isAdmin
            ? 'border border-neutral-200 bg-neutral-100 text-neutral-600'
            : 'bg-primary text-white',
        ]"
      >
        {{ userDisplay.getFirstLetters() }}
      </div>
    </HeadlessMenuButton>
    <HeadlessMenuItems
      class="absolute right-0 top-0 z-50 w-64 flex-col overflow-hidden rounded-xl bg-white shadow-base outline-none"
    >
      <HeadlessMenuItem
        as="button"
        class="absolute right-2 top-2 h-7 w-7 rounded-lg bg-black/20"
      >
        <Icon class="fill-white" name="SvgoXClose" />
      </HeadlessMenuItem>
      <img class="h-[6.875rem]" src="@/assets/shapes/user.png" />
      <div
        class="flex flex-col gap-y-4 divide-y divide-neutral-100 px-2 pb-1.5"
      >
        <div class="-mt-8 flex flex-col gap-y-4 px-3">
          <!-- Аватарка пользователя -->
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-display-sm font-semibold text-white outline outline-[.375rem] outline-white sm:outline-8"
          >
            {{ userDisplay.getFirstLetters() }}
          </div>
          <!-- Имя пользователя -->
          <div class="flex flex-col gap-y-1">
            <p class="text-lg font-semibold">
              {{ userDisplay.getFullName() }}
            </p>
            <p class="text-xs text-neutral-400">
              {{ userStore.user?.email }}
            </p>
          </div>
        </div>
        <div class="flex flex-col divide-y divide-neutral-100">
          <TheHeaderUserButton
            v-for="(button, index) in buttons"
            :key="index"
            :button="button"
          />
        </div>
      </div>
    </HeadlessMenuItems>
    <div v-if="open" class="fixed inset-0 z-40 bg-neutral-900/25 xl:hidden" />
  </HeadlessMenu>
  <LazyTheHeaderUserNotifications
    v-if="isNotificationsOpened"
    @close="isNotificationsOpened = false"
  />
</template>
