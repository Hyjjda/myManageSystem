<template>
  <div class="logo">
    <img :src="logo" alt="" />
    <h1>动力之家</h1>
  </div>
  <el-menu :router="true" :default-active="$route.path">
    <menu-item v-for="item in menuList" :item="item" :key="item.url"></menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import menuItem from '@/components/navMenu/menuItem.vue'
import { ref } from 'vue'
import logo from '@/assets/logo.png'
const userStore = useUserStore()
const menuList: any = ref([])
menuList.value = userStore.menu
</script>

<style lang="less" scoped>
.logo {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  img {
    width: 30px;
    height: 30px;
    margin-left: -10px;
  }
  h1 {
    color: #333;
    margin-left: 10px;
    font-size: 22px;
  }
}
.el-menu {
  border-right: none;
}
</style>
