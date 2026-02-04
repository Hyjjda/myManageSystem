import type { menuItem } from '@/types/user'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTabStore = defineStore('tabs', () => {
  const tabList = ref<menuItem[]>([])
  const currentTab = ref<{ name: string; url: string }>({ name: '', url: '' })

  const addTab = (name: string, url: string, icon: string) => {
    if (!tabList.value.some((tab) => tab.url === url)) {
      tabList.value.push({ name, icon, url })
    }
  }

  const changeCurrentTab = (name: string, url: string) => {
    currentTab.value = { name, url }
  }

  const delTab = (name: string) => {
    if (name === currentTab.value.name) {
      const idx = tabList.value.findIndex((item) => item.name === name)
      const prev = tabList.value[idx - 1]
      if (prev) {
        currentTab.value = { name: prev.name, url: prev.url }
      } else {
        ElMessage({
          type: 'error',
          message: '不可删除第一项',
        })
        return
      }
    }
    tabList.value = tabList.value.filter((item) => item.name !== name)
  }
  return {
    tabList,
    currentTab,
    addTab,
    changeCurrentTab,
    delTab,
  }
})
