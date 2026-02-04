import { type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layouts/defaultLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
      },
      {
        path: '/chargingstation/monitor',
        name: 'monitor',
        component: () => import('@/views/station/Monitor.vue'),
      },
      {
        path: '/chargingstation/revenue',
        name: 'revenue',
        component: () => import('@/views/station/revenue.vue'),
      },
      {
        path: '/chargingstation/fault',
        name: 'pile',
        component: () => import('@/views/station/Changepile.vue'),
      },
      { path: '/map', name: 'map', component: () => import('@/views/map/ElecMap.vue') },
      {
        path: '/operations/orders',
        name: 'orders',
        component: () => import('@/views/operations/Order.vue'),
        meta: { keepAlive: true },
      },
      {
        path: '/operations/detail',
        name: 'detail',
        component: () => import('@/views/operations/Detail.vue'),
      },
      {
        path: '/operations/total',
        name: 'total',
        component: () => import('@/views/operations/Charging.vue'),
      },
      { path: '/alarm', name: 'alarm', component: () => import('@/views/alarm/Alarm.vue') },
      { path: '/equipment', name: 'vip', component: () => import('@/views/vip/Vip.vue') },
      {
        path: '/document',
        name: 'invest',
        component: () => import('@/views/invest/Invest.vue'),
        meta: {
          needAuth: ['admin'],
        },
      },
      {
        path: '/system',
        name: 'sitting',
        component: () => import('@/views/setting/Setting.vue'),
        meta: {
          needAuth: ['admin'],
        },
      },
      { path: '/personal', name: 'user', component: () => import('@/views/person/Person.vue') },
    ],
  },
  { path: '/login', name: 'Login', component: () => import('@/views/login.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue') },
]
export default routes
