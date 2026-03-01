import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/style.less'
import '@/mock'
import '@/router/guard'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import permission from './directives/permission'
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.directive('permission', permission)
app.use(pinia)
app.use(router)

app.mount('#app')
