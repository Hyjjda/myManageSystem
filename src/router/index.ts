import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './RouteMap'
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
