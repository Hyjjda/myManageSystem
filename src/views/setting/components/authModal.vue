<template>
  <el-dialog
    title="权限设置"
    :model-value="visable"
    width="600px"
    @open="showLog"
    @close="$emit('close')"
  >
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限</span>
        </div>
      </template>

      <el-tree
        show-checkbox
        :data="treeData"
        max-width="600px"
        node-key="url"
        ref="treeRef"
      ></el-tree>
    </el-card>
    <el-card class="mt">
      <template #header>
        <div class="card-header">
          <span>按钮权限</span>
        </div>
      </template>
      <el-checkbox-group v-model="btnAuth" class="mt">
        <el-checkbox label="全部" value="all" />
        <el-checkbox label="添加" value="add" />
        <el-checkbox label="编辑" value="edit" />
        <el-checkbox label="删除" value="delete" />
      </el-checkbox-group>
    </el-card>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button @click="updateAuth" type="primary">更新</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { transformMenu } from '@/utils/transformMenu'
import { updateAuthApi } from '@/apis/system'
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
const props = defineProps({
  visable: {
    type: Boolean,
    required: true,
  },
  keys: {
    type: Array,
    required: true,
  },
  btnAuth: {
    type: Array,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
})
const treeRef = ref()
const treeData = ref(transformMenu(userStore.menu))

const btnAuth = ref<any[]>([])
const showLog = () => {
  treeRef.value.setCheckedKeys(props.keys)
  btnAuth.value = props.btnAuth
}
const emits = defineEmits(['close'])

const updateAuth = async () => {
  const res = await updateAuthApi(btnAuth.value, treeRef.value.getCheckedKeys(true), props.account)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: res.msg,
    })
  }
  emits('close')
}
</script>
