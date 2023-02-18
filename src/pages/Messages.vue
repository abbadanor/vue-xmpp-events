<script setup lang="ts">
import { useStore } from '../store'
const store = useStore()
</script>

<template>
  <div v-if="store.roster.length > 0">
    <h2 class="text-xl font-bold">
      Buddies
    </h2>
    <ul v-for="jid in store.roster" :key="jid">
      <li>
        <router-link class="underline" :to="`/contact/${jid}`">
          {{ jid }}
        </router-link>
      </li>
    </ul>
  </div>
  <div v-if="store.messages.length > 0">
    <h4 class="text-xl font-bold mt-3">
      Messages
    </h4>
    <div v-for="message in store.messages" :key="message.id" class="p-3 even:bg-gray-100 even:rounded-md">
      <code>
        <pre>{{ JSON.stringify(message, null, "  ") }}</pre>
      </code>
    </div>
  </div>
</template>
