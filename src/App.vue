<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from './store'
import XMPPService from './services/xmpp.service'
const store = useStore()

function getLastMessageFromJid(jid: string) {
  // @ts-expect-error jävla pajas. find är ett property men inte findLast
  return store.messages.findLast((message: Message) => {
    return message.from.jid === jid || message.to.jid === jid
  })
}

onMounted(() => {
  XMPPService.connect()
})
</script>

<template>
  <!-- Side navigation -->
  <div class="h-full border-r border-gray-200 w-72 fixed z-10 top-0 left-0 bg-gray-100 p-2">
    <div class="text-xs mb-2 text-gray-500">
      Dina chatter
    </div>
    <div v-if="store.roster.length > 0">
      <div
        v-for="jid in store.roster" :key="jid" class="p-2 rounded-md flex mb-2 cursor-pointer"
        :class="$route.params.jid === jid ? 'bg-white shadow-sm' : ''"
        @click="$router.push(`/conversations/${jid}`)"
      >
        <img class="self-center h-8 w-8 rounded-full mr-2 dark:border-2 dark:border-ehtdark-50" :src="`https://avatar.tobi.sh/${jid.split('@')[0]}`" alt="Profile pic">
        <div class="min-w-0">
          <div class="capitalize text-sm">
            {{ jid.split('@')[0] }}
          </div>
          <div class="text-xs text-gray-700 whitespace-nowrap overflow-ellipsis overflow-hidden">
            {{ getLastMessageFromJid(jid)?.body ?? "-" }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Page content -->
  <main class="ml-72 px-3">
    <router-view />
  </main>
</template>
