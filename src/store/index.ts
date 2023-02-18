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
})
