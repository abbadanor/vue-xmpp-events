<script setup lang="ts">
import * as XMPP from 'stanza'

function log(name: string, data) {
  let codeData = ''
  if (typeof data === 'string') {
    codeData = data;
  } else {
    if (name === 'connected' || name === 'disconnected') {
      codeData = '';
    } else {
      codeData = JSON.stringify(data, null, '  ');
    }
  }
  console.log(name, "\n", codeData)
}

async function searchHistory() {
  try {
    const hej = await client.getHistorySearchForm("adam@chat.a-nord.se")
    console.log("hej", hej)
  } catch (error) {
    console.error(error) 
  }
}

let client: XMPP.Agent;
function connect() {
  client = XMPP.createClient({
    jid: "admin@chat.a-nord.se",
    password: "password",
    transports: {
      bosh: false,
      websocket: "wss://chat.a-nord.se/xmpp-websocket"
    }
  });

  client.on('*', log);

  client.on('session:started', async () => {
    try {
      console.log("Enabling carbons...")
      await client.enableCarbons();
    } catch (err) {
      console.log('Server does not support carbons');
    }

    await client.getRoster();
    client.updateCaps();
    client.sendPresence({
      legacyCapabilities: client.disco.getCaps()
    });
  });

  client.connect();

  return false;
};
</script>

<template>
  <h1>Connection Settings</h1>
  <button @click="connect()">Connect</button>
  <button @click="searchHistory()">Search history</button>
</template>
