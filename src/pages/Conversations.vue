<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useStore } from '../store'
import ChatBubble from '../components/ChatBubble.vue'
import XMPPService from '../services/xmpp.service'

const store = useStore()

interface Message {
  body: string
  delay: Date
  from: {
    jid: string
    resource: string
    fullJid: string
  }
  id: string
  to: {
    jid: string
    resource: string
    fullJid: string
  }
}

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
  messages.value = store.messages.filter((message) => {
    return message.from.jid === route.params.jid || message.to.jid === route.params.jid
  })
})
</script>

<template>
  <div v-if="messages.length > 0" class="w-full min-h-screen flex flex-col justify-end">
    <ChatBubble v-for="message in messages" :key="message.id" :outgoing="message.from.jid === store.jid" :sender="message.from.jid.split('@')[0] || message.to.jid.split('@')[0]" :time="message.delay">
      {{ message.body }}
    </ChatBubble>
    <form class="py-2 flex items-center" @submit.prevent>
      <textarea v-model="chatBody" class="w-full rounded-md resize-none" name="hehe" rows="1" placeholder="Type a new message" />
      <Icon class="h-5 w-5 ml-2 text-gray-900 cursor-pointer" icon="ph:paper-plane-right-fill" @click="sendChat" />
    </form>
  </div>
</template>
