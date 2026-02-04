<template>
  <div class="bg">
    <div class="login">
      <div class="title">
        <img :src="logo" alt="" width="70px" height="70px">
        <h2 class="ml">能源港管理系统</h2>
      </div>
      <el-form class="form" :model="ruleForm"  :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名" prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" type='password' prefix-icon="Lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/logo.png'
import { reactive,ref } from 'vue';
import type{ FormRules,FormInstance } from 'element-plus'; 
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
const router = useRouter()
const userSotre = useUserStore()
interface RoleForm{
  username:string;
  password:string
}
const ruleForm:RoleForm= reactive({
  username:'',
  password:''
})

const rules = reactive<FormRules<RoleForm>>({
  username:[
    {required:true,message:'请输入用户名',trigger:'blur'},
    {min:4,max:8,message:'必须是4-8位' ,trigger:'blur'}
  ],
  password:[
    {required:true,message:'请输入密码',trigger:'blur'},
    {pattern:/^\d{6}$/,message:'密码为6位数字',trigger:'blur'}
  ]
})
const formRef = ref<FormInstance>()
const handleLogin = ()=>{
  formRef.value?.validate(async(valid:boolean)=>{
      if(valid){
        // 提交表单
        await  userSotre.Login(ruleForm)
        router.push('/')
      }
  })
}
</script>

<style lang="less" scoped>
.bg{
  background-image: url('../assets/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  .login{
    width: 500px;
    height: 300px;
    padding: 60px;
    box-shadow: 0,0,10px,10px #f4f4f4;
    position: absolute;
    text-align: center;
    margin-top: 210px;
    left: 10%;
    .title{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  }
  .form{
    margin-top: 20px;
  }
  
  

}
</style>