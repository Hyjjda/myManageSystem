<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card>
        <el-input style="width: 80%" placeholder="请输入关键词" v-model="filterText">
          <template #append>
            <el-button icon="Search"></el-button>
          </template>
        </el-input>

        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :filter-node-method="filterNode"
          :prop="defaultProps"
          :data="cityList"
          class="mt"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card>
        <template #header>
          <div class="card-header">
            <h3>{{ title }}设置</h3>
          </div>
        </template>
        <el-form
          :rules="rules"
          :model="ruleForm"
          ref="formRef"
          label-width="auto"
          :disabled="!title"
        >
          <el-form-item label="模板名称" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入名称"
              style="max-width: 200px"
            ></el-input>
          </el-form-item>

          <el-button type="primary" class="mt mb" @click="addTimeSlot">新增时间区间</el-button>

          <el-form-item v-for="(item, index) in ruleForm.date" :key="index">
            <el-col :span="8">
              <el-form-item
                :label="`时间区间` + (index + 1)"
                :prop="'date.' + index + '.stime'"
                :rules="[{ required: true, message: '时间不为空', trigger: 'blur' }]"
              >
                <el-time-picker
                  v-model="item.stime"
                  placeholder="开始时间"
                  style="width: 100%"
                  value-format="HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <span>--</span>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :prop="'date.' + index + '.etime'"
                :rules="[{ required: true, message: '时间不为空', trigger: 'blur' }]"
              >
                <el-time-picker
                  v-model="item.etime"
                  placeholder="结束时间"
                  style="width: 100%"
                  value-format="HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                label="电费："
                :prop="'date.' + index + '.fee'"
                :rules="[
                  { required: true, message: '请输入电费', trigger: 'blur' },
                  { type: 'number', message: 'must be a number' },
                ]"
              >
                <el-input
                  v-model.number="item.fee"
                  style="width: 100%"
                  placeholder="请输入区间单价"
                />
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="服务费" prop="service">
            <el-input
              v-model.number="ruleForm.service"
              style="max-width: 200px"
              placeholder="请输入服务费"
            ></el-input>
          </el-form-item>
          <el-form-item label="停车费" prop="parking">
            <el-input
              v-model.number="ruleForm.parking"
              style="max-width: 200px"
              placeholder="请输入停车费用"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="marks">
            <el-input v-model="ruleForm.marks" style="max-width: 300px" type="textarea"></el-input>
          </el-form-item>

          <el-form-item class="mr">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button type="danger" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { getCity, updateRule } from '@/apis/operation'
import {
  type FormInstance,
  type FilterNodeMethodFunction,
  type TreeInstance,
  type FormRules,
  ElMessage,
} from 'element-plus'
interface TreeItem {
  label: string
  children?: TreeItem[]
}
interface ruleFormType {
  name: string
  service: string
  parking: string
  marks: string
  date: Array<{ stime: string; etime: string; fee: string }>
}
const defaultProps = {
  children: 'children',
  label: 'label',
}
//数据渲染
const cityList = ref<TreeItem[]>([])
const getCityList = async () => {
  const res = await getCity()
  cityList.value = res.data
}
onMounted(() => getCityList())
//模糊查询
const filterText = ref<string>('')
const treeRef = ref<TreeInstance>()
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
const filterNode: FilterNodeMethodFunction = (value: string, data) => {
  if (!value) return true
  return data.label.includes(value)
}
//表单
const title = ref<string>('')
const formRef = ref<FormInstance>()
const rules = reactive<FormRules<ruleFormType>>({
  name: [{ required: true, message: '完善名称', trigger: 'blur' }],
  service: [
    { required: true, message: '请输入服务费', trigger: 'blur' },
    { type: 'number', message: 'must be a number' },
  ],
  parking: [
    { required: true, message: '请输入停车费', trigger: 'blur' },
    { type: 'number', message: 'must be a number' },
  ],
  marks: [{ required: false }, { max: 50, message: '最多输入50个字', trigger: 'change' }],
})
const ruleForm = ref<ruleFormType>({
  name: '',
  service: '',
  marks: '',
  parking: '',
  date: [{ stime: '', etime: '', fee: '' }],
})

const addTimeSlot = () => {
  if (ruleForm.value.date.length < 5) ruleForm.value.date.push({ stime: '', etime: '', fee: '' })
  else {
    ElMessage({
      type: 'warning',
      message: '最多添加5个区间',
    })
    return
  }
}

const submitForm = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const res = await updateRule({ ...ruleForm.value, target: title.value })
      if (res.code === 200)
        ElMessage({
          type: 'success',
          message: res.msg,
        })
      resetForm()
    }
  })
}
const resetForm = () => {
  ruleForm.value = {
    name: '',
    service: '',
    marks: '',
    parking: '',
    date: [{ stime: '', etime: '', fee: '' }],
  }
  title.value = ''
}
const handleNodeClick = (node: any) => {
  if (!node.children) {
    title.value = node.label
  }
}
</script>
