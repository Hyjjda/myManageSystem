<template>
  <el-tabs
    closable
    v-model="currentTab.name"
    type="card"
    class="demo-tabs"
    @tab-click="handleClick"
    @tab-remove="handleRemove"
  >
    <el-tab-pane v-for="item in tabList" :key="item.url" :lable="item.name" :name="item.name">
      <template #label>
        <span class="custom-tabs-label">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive"> </component>
    </keep-alive>
    <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive"> </component>
  </router-view>
</template>

<script setup lang="ts">
import { useTabStore } from '@/stores/tab'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()
const userStore = useUserStore()
const { tabList, currentTab } = storeToRefs(tabStore)

const handleClick = ({ index }: { index: number }) => {
  tabStore.changeCurrentTab(tabList.value[index]!.name, tabList.value[index]!.url)
  router.push(tabList.value[index]!.url)
}

const handleRemove = (name: string) => {
  tabStore.delTab(name)
  router.push(currentTab.value.url)
}

function findObjByUrl(arr: any, url: string): any {
  for (const item of arr) {
    if (item.url === url) return item
    if (item.children) {
      const res = findObjByUrl(item.children, url)
      if (res) return res
    }
  }
  return null
}
const { name, url, icon } = findObjByUrl(userStore.menu, route.path)
tabStore.addTab(name, url, icon)
tabStore.changeCurrentTab(name, url)
</script>
