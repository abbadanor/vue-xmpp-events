import { createRouter, createWebHistory } from 'vue-router'
import Conversations from '../pages/Conversations.vue'

const routes = [
  { path: '/conversations/:jid', component: Conversations },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
