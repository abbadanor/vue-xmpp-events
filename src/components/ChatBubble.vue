<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

const props = defineProps<{
  outgoing: boolean
  sender?: string
  time: Date
}>()

dayjs.extend(relativeTime)
</script>

<template>
  <div class="bubble-grid grid gap-x-3 py-1" :class="outgoing ? 'place-items-end chat-end' : 'place-items-start chat-start'">
    <div v-if="!outgoing" class="row-span-2 self-end relative inline-flex" :class="outgoing ? 'col-start-2' : 'col-start-1'">
      <div class="block aspect-square overflow-hidden w-10 rounded-full">
        <img class="w-full h-full object-cover max-w-full block" :src="`https://avatar.tobi.sh/${sender}`">
      </div>
    </div>
    <div class="row-start-1 text-sm capitalize" :class="outgoing ? 'col-start-1' : 'col-start-2'">
      {{ outgoing ? '' : sender }}
      <time class="text-xs opacity-50">{{ dayjs(time).fromNow() }}</time>
    </div>
    <div
      class="chat-bubble relative block w-fit py-2 px-4 rounded-2xl bg-gray-900 text-gray-200 before:absolute before:bottom-0 before:h-3 before:w-3 before:bg-inherit"
      :class="outgoing ? 'before:left-full col-start-1 rounded-br-none' : 'before:-left-3 col-start-2 rounded-bl-none'"
    >
      <slot />
    </div>
    <div class="text-gray-600 chat-footer row-start-3 text-sm opacity-50" :class="outgoing ? 'col-start-1' : 'col-start-2'" />
  </div>
</template>

<style scoped>
.chat-start {
  grid-template-columns: auto 1fr;
}

.chat-end {
  grid-template-columns: 1fr auto;
}

.chat-bubble::before {
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

.chat-start .chat-bubble::before {
  mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMycgaGVpZ2h0PSczJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGZpbGw9J2JsYWNrJyBkPSdtIDAgMyBMIDMgMyBMIDMgMCBDIDMgMSAxIDMgMCAzJy8+PC9zdmc+);
}

.chat-end .chat-bubble::before {
  mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMycgaGVpZ2h0PSczJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGZpbGw9J2JsYWNrJyBkPSdtIDAgMyBMIDEgMyBMIDMgMyBDIDIgMyAwIDEgMCAwJy8+PC9zdmc+);
}

.bubble-grid:last-child .chat-footer::after {
  content: 'Delivered';
}
</style>
