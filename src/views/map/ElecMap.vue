<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <MapContainer></MapContainer>
    </el-col>
    <el-col :span="6">
      <el-card class="desc">
        <template #header>
          <div class="card-header">
            <h3>总体信息</h3>
          </div>
        </template>
        <div>1.累计充电站数量：<el-text type="primary">34个</el-text></div>
        <div>2.单省份最多充电桩：<el-text type="primary">北京(4个)</el-text></div>
        <div>3.充电站遍及省份：<el-text type="primary">14个</el-text></div>
        <div>4.暂无充电站省份：<el-text type="primary">22个</el-text></div>
        <div>5.累计充电站：<el-text type="primary">北京(4个)</el-text></div>
        <div>6.单日营收最高：<el-text type="primary">北京西单充电站</el-text></div>
        <div>7.单日营收最低：<el-text type="primary">南宁青秀山充电站</el-text></div>
        <div>8.故障率最高：<el-text type="primary">兰州黄河桥充电站</el-text></div>
      </el-card>

      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h3>新增站点</h3>
          </div>
        </template>
        <el-form
          ref="formRef"
          :rules="formRules"
          :model="formData"
          style="max-width: 600px"
          label-width="85px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="formData.address"></el-input>
          </el-form-item>
          <el-form-item label="立即使用" prop="now">
            <el-switch v-model="formData.immdia"></el-switch>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="formData.content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="handleReset">清空内容</el-button>
            <el-button type="primary" @click="submitForm">确认添加</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import MapContainer from '@/components/map/MapContainer.vue'
import { ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { submitMap } from '@/apis/map'
const formData = ref({
  name: '',
  address: '',
  immdia: false,
  content: '',
})
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 20, message: '名称长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' },
    { min: 5, max: 100, message: '地址长度在 5 到 30 个字符', trigger: 'blur' },
  ],
  content: [{ required: false }, { max: 200, message: '备注不能超过 200 个字符', trigger: 'blur' }],
}

// 清空表单
const formRef = ref<FormInstance>()
const handleReset = () => {
  if (!formRef.value) return
  formData.value = {
    name: '',
    address: '',
    immdia: false,
    content: '',
  }
}
//提交内容
const submitForm = async () => {
  try {
    await formRef.value?.validate()
    const res = await submitMap(formData.value)
    ElMessage({
      message: res.msg,
      type: 'success',
    })
    handleReset()
  } catch (e) {
    ElMessage({
      message: '请填写表单完整',
      type: 'warning',
    })
  }
}
</script>

<style scoped>
.desc {
  line-height: 30px;
}
</style>
