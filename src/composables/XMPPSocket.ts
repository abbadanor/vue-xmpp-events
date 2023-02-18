import * as XMPP from 'stanza'
import type { useStore } from '../store'

export function useXMPPSocket(store: ReturnType<typeof useStore>) {
  let client: XMPP.Agent

  const connect = () => {
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
      store.connected = true
    })

    client.connect()

    return false
  }

  const sendChat = (body: string, to: string) => {
    client.sendMessage({
      type: 'chat',
      body,
      to,
    })
  }

  return {
    connect,
    sendChat,
  }
}
