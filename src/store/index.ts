import { defineStore } from 'pinia'

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

interface RootState {
  messages: Message[]
  roster: string[]
  jid: string
  connected: boolean
}

export const useStore = defineStore('main', {
  state: () => {
    return {
      messages: [],
      roster: [],
      jid: 'adam@chat.a-nord.se',
      connected: false,
    } as RootState
  },
  getters: {
    getMessagesFromJid: (state) => {
      return (jid: string) => state.messages.filter((message) => {
        return message.from?.jid === jid || message.to?.jid === jid
      })
    },
    getLastMessageFromJid: (state) => {
      // @ts-expect-error pajas. find är ett property men inte findLast
      return (jid: string) => state.messages.findLast((message: Message) => {
        return message.from?.jid === jid || message.to?.jid === jid
      })
    },
  },
})
