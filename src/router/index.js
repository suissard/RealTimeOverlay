import { createRouter, createWebHistory } from 'vue-router'
import OverlayView from '../views/OverlayView.vue'
import RemoteView from '../views/RemoteView.vue'

const routes = [
  {
    path: '/',
    name: 'Overlay',
    component: OverlayView
  },
  {
    path: '/remote',
    name: 'Remote',
    component: RemoteView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
