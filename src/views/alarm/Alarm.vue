<template>
  <el-card>
    <el-radio-group size="large" v-model="radioBtn" class="mt" @change="changeLevel">
      <el-radio-button label="全部" :value="0"></el-radio-button>
      <el-radio-button label="严重" :value="1"></el-radio-button>
      <el-radio-button label="紧要" :value="2"></el-radio-button>
      <el-radio-button label="一般" :value="3"></el-radio-button>
    </el-radio-group>
  </el-card>

  <el-card class="mt" v-for="item in alarmList" :key="item.equNo">
    <el-alert :title="`${item.address}异常 `" show-icon type="warning" class="mt"></el-alert>
    <el-descriptions :border="true" direction="vertical" :column="4">
      <el-descriptions-item :label="nameMap.get(key)" v-for="(val, key) in item">
        <el-tag
          v-if="key === 'level'"
          :type="val === 1 ? 'danger' : val === 2 ? 'warning' : 'info'"
        >
          {{ val === 1 ? '严重' : val === 2 ? '紧要' : '一般' }}
        </el-tag>
        <el-text type="danger" v-else-if="key === 'status'">
          {{ val === 1 ? '待指派' : val === 2 ? '处理中' : '处理完毕' }}
        </el-text>
        <span v-else>{{ val }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button
          :type="item.status === 2 ? 'warning' : 'primary'"
          @click="openDrawer(item.equNo)"
        >
          {{ item.status === 1 ? '指派' : item.status === 2 ? '催促' : '结果' }}
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>任务指派</h4>
    </template>
    <stepForm :form1="basicRef" :form2="apartRef" :form3="responseRef" @submit-data="submitData">
      <template #step-1>
        <el-form :model="formData.basic" :rules="basicRules" ref="basicRef">
          <el-form-item label="姓名" prop="name">
            <el-input v-model.trim="formData.basic.name"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input v-model.trim="formData.basic.tel"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="formData.basic.email"></el-input>
          </el-form-item>
          <el-form-item label="工号" prop="no">
            <el-input v-model.trim.number="formData.basic.no"></el-input>
          </el-form-item>
          <el-form-item label="是否加急">
            <el-switch v-model.trim="formData.basic.urgent" />
          </el-form-item>
          <el-form-item label="其他选项">
            <el-checkbox-group
              v-model.trim="formData.basic.others"
              :options="options"
              :props="props"
            />
          </el-form-item>
          <el-form-item label="备注" prop="marks">
            <el-input
              type="textarea"
              v-model.trim="formData.basic.marks"
              placeholder="最多五十字"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>

      <template #step-2>
        <el-form ref="apartRef" :model="formData.apart" :rules="apartRules">
          <el-form-item label="审批部门" prop="from">
            <el-select placeholder="请选择相关部门" v-model="formData.apart.from">
              <el-option label="总裁" :value="1"></el-option>
              <el-option label="蓝室" :value="2"></el-option>
              <el-option label="黑室" :value="3"></el-option>
              <el-option label="浮力" :value="4"></el-option>
              <el-option label="离心" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行部门" prop="to">
            <el-select placeholder="请选择相关部门" v-model="formData.apart.to">
              <el-option label="总裁" :value="1"></el-option>
              <el-option label="蓝室" :value="2"></el-option>
              <el-option label="黑室" :value="3"></el-option>
              <el-option label="浮力" :value="4"></el-option>
              <el-option label="离心" :value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #step-3>
        <el-form ref="responseRef" :model="formData.response" :rules="responseRules">
          <el-form-item label="负责人" prop="name">
            <el-input v-model.trim="formData.response.name"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="tel">
            <el-input v-model.trim="formData.response.tel"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </stepForm>
    <el-result icon="warning" :title="`${equipment}出现问题`" sub-title="请认真及时解决">
      <template #extra>
        <el-button type="primary" @click="drawer = false">我已知晓</el-button>
      </template>
    </el-result>
  </el-drawer>
</template>

<script setup lang="ts">
import { alarmListApi, filterList } from '@/apis/alarm'
import { onMounted, ref } from 'vue'
import stepForm from '@/components/stepForm/stepForm.vue'
import { ElMessage, type FormInstance } from 'element-plus'
interface alarmItemType {
  address: string
  code: number
  description: string
  equNo: string
  level: number
  status: number
  time: string
}
const nameMap = new Map<keyof alarmItemType, string>([
  ['address', '地址'],
  ['code', '编码'],
  ['description', '描述'],
  ['equNo', '设备编号'],
  ['level', '级别'],
  ['status', '状态'],
  ['time', '时间'],
])
const radioBtn = ref<number>(0)
const alarmList = ref<alarmItemType[]>([])
const getAlarmList = async () => {
  const res = await alarmListApi()
  alarmList.value = res.data
}
//切换按钮
const changeLevel = async (level: number) => {
  if (level) {
    const res = await filterList(level)
    alarmList.value = res.data
  } else getAlarmList()
}
//右边展开栏
const drawer = ref<boolean>(false)
const equipment = ref<string>('')
const openDrawer = (equNo: string) => {
  drawer.value = true
  equipment.value = equNo
}
const formData = ref({
  basic: {
    name: '',
    email: '',
    tel: '',
    no: '',
    urgent: false,
    others: [],
    marks: '',
  },
  apart: {
    to: '',
    from: '',
  },
  response: {
    name: '',
    tel: '',
  },
})

// step1
const basicRules = {
  name: [{ required: true, message: '请完善姓名', trigger: 'blur' }],
  tel: [
    { required: true, message: '请完善电话号码', trigger: 'blur' },
    // { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请完善邮箱', trigger: 'blur' },
    // {
    //   pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
    //   message: '请输入正确的邮箱格式',
    //   trigger: 'blur',
    // },
  ],
  no: [
    { required: true, message: '请完善工号', trigger: 'blur' },
    { type: 'number', message: '必须是数字' },
  ],
  marks: [{ max: 50, message: '不能超过50字' }],
}
const basicRef = ref<FormInstance>()

const props = { label: 'name', value: 'id', disabled: 'unable' }
const options = [
  { name: '更换设备', id: 1 },
  { name: '维修', id: 2 },
  { name: '需报备', id: 3 },
  { name: '需拍照', id: 4 },
]
//step2
const apartRef = ref<FormInstance>()
const apartRules = {
  to: [{ required: true, message: '执行部门不能为空', trigger: 'blur' }],
  from: [{ required: true, message: '审批部门不能为空', trigger: 'blur' }],
}

//step3
const responseRef = ref<FormInstance>()
const responseRules = {
  name: [{ required: true, message: '请完善姓名', trigger: 'blur' }],
  tel: [
    { required: true, message: '请完善电话号码', trigger: 'blur' },
    // { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
}

//表单提交
const submitData = () => {
  console.log(formData.value)
  ElMessage({
    type: 'success',
    message: '下达任务成功',
  })
  drawer.value = false
}
onMounted(() => getAlarmList())
</script>
