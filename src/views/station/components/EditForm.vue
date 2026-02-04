<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="title"
    width="750px"
    @close="handleCancel"
    destroy-on-close="true"
  >
    <el-form label-width="75" :rules="rules" :model="ruleForm" ref="formRef">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="站点ID" prop="id">
            <el-input v-model="ruleForm.id" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-input v-model="ruleForm.city"></el-input>
          </el-form-item>
          <el-form-item label="站长" prop="person">
            <el-input v-model="ruleForm.person"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input v-model="ruleForm.tel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="快充数" prop="fast">
            <el-input v-model="ruleForm.fast"></el-input>
          </el-form-item>
          <el-form-item label="慢充数" prop="slow">
            <el-input v-model="ruleForm.slow"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select placeholder="设备状态" v-model="ruleForm.status" :disabled="disabled">
              <el-option :value="1" label="全部"></el-option>
              <el-option :value="2" label="使用中"></el-option>
              <el-option :value="3" label="空闲中"></el-option>
              <el-option :value="4" label="维护中"></el-option>
              <el-option :value="5" label="待维修"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="充电中" prop="now">
            <el-input v-model="ruleForm.now" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="故障" prop="fault">
            <el-input v-model="ruleForm.fault" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitData"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { RowType } from '@/types/station'
import { useStationStore } from '@/stores/station'
import { updateListApi } from '@/apis/station'
const stationStore = useStationStore()
const ruleForm = ref<RowType>({
  name: '',
  id: '',
  city: '',
  fast: '',
  slow: '',
  fault: '',
  status: 1,
  person: '',
  tel: '',
  now: '',
})
const rules = reactive<FormRules<RowType>>({
  name: [{ required: true, message: '站点名称不能为空', trigger: 'blur' }],
  id: [{ required: true, message: '站点id不能为空', trigger: 'blur' }],
  city: [{ required: true, message: '所属城市不能为空', trigger: 'blur' }],
  person: [{ required: true, message: '站点负责人不能为空', trigger: 'blur' }],
  tel: [{ required: true, message: '负责人电话不能为空', trigger: 'blur' }],
  fast: [{ required: true, message: '快充数不能为空', trigger: 'blur' }],
  slow: [{ required: true, message: '慢充数不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '充电站状态不能为空', trigger: 'blur' }],
  now: [{ required: true, message: '正在充电数不能为空', trigger: 'blur' }],
  fault: [{ required: true, message: '故障数量不能为空', trigger: 'blur' }],
})
const disabled = ref<boolean>(false)
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    required: true,
  },
})
const emits = defineEmits(['close', 'reload'])

const handleCancel = () => {
  emits('close')
}
const formRef = ref<FormInstance>()
const title = ref<string>('')
//修改表单
const submitData = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const res = await updateListApi(ruleForm.value)
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: '操作成功！',
        })
        handleCancel()
        emits('reload')
      }
    }
  })
}
//控制不动项修改与否
watch(
  () => props.dialogVisible,
  () => {
    if (stationStore.rowData.name) {
      title.value = '修改充电站'
      disabled.value = true
    } else {
      title.value = '新增充电站'
      disabled.value = false
    }
    ruleForm.value = stationStore.rowData
  },
)
</script>
