import { createRouter, createWebHistory } from 'vue-router'
import routes from './RouteMap'
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
