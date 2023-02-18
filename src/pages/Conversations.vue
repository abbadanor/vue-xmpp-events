<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { useStore } from '../store'
import ChatBubble from '../components/ChatBubble.vue'

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
const store = useStore()
const messages = ref<Message[]>([])

watch([store.messages, route], () => {
  if (store.messages.length === 0) {
    return
  }
  messages.value = store.messages.filter((message) => {
    return message.from.jid === route.params.jid || message.to.jid === route.params.jid
  }).sort((a, b) => {
    return a.delay.getTime() - b.delay.getTime()
  })
})
</script>

<template>
  <div v-if="messages.length > 0" class="w-full">
    <ChatBubble v-for="message in messages" :key="message.id" :outgoing="message.from.jid === store.jid" :sender="message.from.jid.split('@')[0]" :time="message.delay">
      {{ message.body }}
    </ChatBubble>
  </div>
</template>
