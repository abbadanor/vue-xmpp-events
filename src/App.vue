<script setup lang="ts">
import * as XMPP from 'stanza'
import { onMounted, ref } from 'vue'
import { useStore } from './store'

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

const store = useStore()
const messages = ref<Message[]>([])
let client: XMPP.Agent

function connect() {
  client = XMPP.createClient({
    jid: 'adam@chat.a-nord.se',
    password: 'password',
    transports: {
      bosh: false,
      websocket: 'wss://chat.a-nord.se/xmpp-websocket',
    },
  })

  client.on('*', (name: string, data: any) => {
    if (data) {
      if (typeof (data) === 'string') {
        console.debug(name, data)
      }
      else if (typeof (data) === 'object') {
        console.debug(name, JSON.stringify(data))
      }
    }
  })

  client.on('mam:item', async (receivedMessage) => {
    const messageItem = receivedMessage.archive?.item.message
    if (messageItem?.type !== 'chat') {
      return
    }
    store.messages.push({
      body: messageItem.body!,
      delay: receivedMessage.archive!.item.delay!.timestamp,
      from: {
        jid: messageItem.from!.split('/')[0],
        resource: messageItem.from!.split('/')[1],
        fullJid: messageItem.from!,
      },
      id: messageItem.id!,
      to: {
        jid: messageItem.to!.split('/')[0],
        resource: messageItem.to!.split('/')[1],
        fullJid: messageItem.to!,
      },
    })
  })

  client.on('session:started', async () => {
    store.connected = true
    try {
      console.log('Enabling carbons...')
      await client.enableCarbons()
    }
    catch (err) {
      console.log('Server does not support carbons')
    }

    const rosterResult = await client.getRoster()

    store.roster = rosterResult.items.map(item => item.jid)

    client.updateCaps()
    client.sendPresence({
      legacyCapabilities: client.disco.getCaps(),
    })
    await client.searchHistory('adam@chat.a-nord.se', {})
  })

  client.connect()

  return false
}

function getLastMessageFromJid(jid: string) {
  // @ts-expect-error jävla pajas. find är ett property men inte findLast
  return store.messages.findLast((message: Message) => {
    return message.from.jid === jid || message.to.jid === jid
  })
}

onMounted(() => {
  connect()
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
        <img class="self-center h-8 w-8 rounded-full mr-2 dark:border-2 dark:border-ehtdark-50" src="https://avatar.tobi.sh/hej" alt="Profile pic">
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
