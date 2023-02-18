<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import ChatBubble from '../components/ChatBubble.vue'
import { useStore } from '../store'
import XMPPService from '../services/xmpp.service'

interface Message {
  body: string
  delay: Date
  from?: {
    jid: string
    resource: string
    fullJid: string
  }
  id: string
  to?: {
    jid: string
    resource: string
    fullJid: string
  }
}

const store = useStore()
const { getMessagesFromJid, getLastMessageFromJid } = storeToRefs(store)
const route = useRoute()
const messages = ref<Message[]>([])
const chatBody = ref('')

function sendChat() {
  XMPPService.sendChat(chatBody.value, route.params.jid as string)
  chatBody.value = ''
}

watch([store.messages, route], () => {
  if (store.messages.length === 0) {
    return
  }
  messages.value = getMessagesFromJid.value(route.params.jid as string)
})

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
    <div v-if="messages.length > 0" class="w-full min-h-screen flex flex-col justify-end">
      <ChatBubble v-for="message in messages" :key="message.id" :outgoing="message.from?.jid === store.jid" :sender="message.from?.jid.split('@')[0] || message.to?.jid.split('@')[0]" :time="message.delay">
        {{ message.body }}
      </ChatBubble>
      <form class="py-2 flex items-center" @submit.prevent>
        <textarea v-model="chatBody" class="w-full rounded-md resize-none" name="hehe" rows="1" placeholder="Type a new message" />
        <Icon class="h-5 w-5 ml-2 text-gray-900 cursor-pointer" icon="ph:paper-plane-right-fill" @click="sendChat" />
      </form>
    </div>
  </main>
</template>
