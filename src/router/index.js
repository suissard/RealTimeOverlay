import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OverlayView from '../views/OverlayView.vue'
import RemoteView from '../views/RemoteView.vue'

const routes = [
  {
    path: '/',
    name: 'Overlay',
    component: OverlayView,
    meta: { layout: 'BlankLayout' }
  },
  {
    path: '/remote',
    name: 'Remote',
    component: RemoteView,
    meta: { layout: 'MainLayout' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
