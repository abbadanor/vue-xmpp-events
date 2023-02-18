import * as XMPP from 'stanza'
import { useStore } from '../store'

interface XMPPServiceI {
  client: XMPP.Agent | null
  store: ReturnType<typeof useStore> | null
  connect(): void
  sendChat(body: string, to: string): void
}

const XMPPService: XMPPServiceI = {

  client: null,
  store: null,

  connect() {
    console.log('connected!')
    this.store = useStore()
    this.client = XMPP.createClient({
      jid: 'adam@chat.a-nord.se',
      password: 'password',
      transports: {
        bosh: false,
        websocket: 'wss://chat.a-nord.se/xmpp-websocket',
      },
    })

    this.client.on('*', (name: string, data: any) => {
      if (data) {
        if (typeof (data) === 'string') {
          console.debug(name, data)
        }
        else if (typeof (data) === 'object') {
          console.debug(name, JSON.stringify(data))
        }
      }
    })

    this.client.on('mam:item', async (receivedMessage) => {
      const messageItem = receivedMessage.archive?.item.message
      if (messageItem?.type !== 'chat') {
        return
      }
      this.store!.messages.push({
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

    this.client.on('session:started', async () => {
      try {
        console.log('Enabling carbons...')
        await this.client!.enableCarbons()
      }
      catch (err) {
        console.log('Server does not support carbons')
      }

      const rosterResult = await this.client!.getRoster()

      this.store!.roster = rosterResult.items.map(item => item.jid)

      this.client!.updateCaps()
      this.client!.sendPresence({
        legacyCapabilities: this.client!.disco.getCaps(),
      })
      await this.client!.searchHistory('adam@chat.a-nord.se', {})
      this.store!.connected = true
    })

    this.client.connect()

    return false
  },

  sendChat(body, to) {
    this.client!.sendMessage({
      type: 'chat',
      body,
      to,
    })
  },

}

export default XMPPService
