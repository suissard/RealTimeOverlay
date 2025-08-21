import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OverlayView from '../views/OverlayView.vue'
import RemoteView from '../views/RemoteView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/overlay',
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
