<template>
  <el-sub-menu v-if="item.children" :index="item.url">
      <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{item.name}}</span>
      </template>
      <my-menu v-for="child in item.children" :item="child" :key="child.url"></my-menu>
  </el-sub-menu>
  <el-menu-item v-else :index="item.url" v-show="!(item.name === '订单详情')" @click="addItem(item.name,item.icon,item.url)">
      <el-icon>
       <component :is="item.icon"></component>
      </el-icon>
      <span>{{item.name}}</span>
  </el-menu-item>
</template>


<script  lang="ts">
import { defineComponent, type PropType } from 'vue';
import {type menuItem as menuItemType} from '@/types/user'
import { useTabStore } from '@/stores/tab';
export default defineComponent({
  name:'MyMenu',
  props:{
    item:{
      type:Object as PropType<menuItemType>,
        required:true
    }
  },
  setup(){
    const tabStore = useTabStore()
    const addItem = (name:string,icon:string,url:string)=>{
        tabStore.addTab(name,url,icon)
        tabStore.changeCurrentTab(name,url)
    }
    return{addItem}
  }
  
})
</script>