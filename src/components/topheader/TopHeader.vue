<template>
  <div class="header">
    <div class="person">
      <el-badge :is-dot="info.length>0" class="item">
        <el-icon><Bell /></el-icon>
      </el-badge>
       <el-avatar class="ml mr" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
       <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          welcome,{{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="user" command="user">个人空间</el-dropdown-item>
            <el-dropdown-item icon="Close" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
  </el-dropdown>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useTabStore } from '@/stores/tab';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const userStore = useUserStore()
const tabStore = useTabStore()
const info = ref([1,2,3,4])

const handleCommand =(command:string)=>{
 if(command === 'user'){
  tabStore.addTab('个人中心','/personal','User')
  tabStore.changeCurrentTab('个人中心','/personal')
  router.push('/personal')
 }else{
  userStore.Logout()
  router.push('/login')
 }
}
</script>

<style lang="less" scoped>
  .header{
    height: 60px;
    background-color: #fff;
    padding: 0 20px;
    .person{
      height: 60px;
      float: right;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .item{
      margin-top: 10px;
    }
  }

</style>