<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model="searchParams.name" placeholder="请输入姓名"> </el-input>
      </el-col>
      <el-col :span="6">
        <el-select placeholder="请选择部门" v-model="searchParams.department">
          <el-option label="全部" value=""></el-option>
          <el-option label="总裁" value="总裁办"></el-option>
          <el-option label="蓝室" value="蓝室"></el-option>
          <el-option label="黑室" value="黑室"></el-option>
          <el-option label="离心" value="离心"></el-option>
          <el-option label="浮力" value="浮力"></el-option>
          <el-option label="火发" value="火发"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-col>
    </el-row>
  </el-card>
  <el-card>
    <el-table :data="dataList" v-loading="loading" class="mt">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="idNo" label="身份证号"></el-table-column>
      <el-table-column prop="position" label="职位">
        <template #default="scope">
          <el-tag>{{ scope.row.position }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="department" label="部门"></el-table-column>
      <el-table-column prop="pageAuthority" label="页面权限">
        <template #default="scope">
          <el-tag type="success">{{ scope.row.pageAuthority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="btnAuthority" label="按钮权限">
        <template #default="scope">
          <el-tag type="info">{{ scope.row.btnAuthority }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="opera" label="操作" width="280">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="setAuth(scope.row.pageAuthority, scope.row.account)"
          >
            权限设置
          </el-button>
          <el-button type="danger" size="small"> 删除 </el-button>
          <el-button type="danger" size="small"> 禁用 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <authModal
    :visable="visable"
    :keys="checkList"
    :btnAuth="btnAuth"
    :account="accountNo"
    @close="visable = false"
  ></authModal>
  <el-pagination
    class="fr mt mb"
    v-model:current-page="pageInfo.page"
    v-model:page-size="pageInfo.pageSize"
    :page-sizes="[10, 20, 30]"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :total="totals"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHttp } from '@/hooks/useHttp'
import authModal from './components/authModal.vue'
import { authApi } from '@/apis/system'
import type { menuItem } from '@/types/user'
const visable = ref<boolean>(false)
interface searchType {
  name: string
  department: string
}
const searchParams = ref<searchType>({
  name: '',
  department: '',
})
const resetSearch = () => {
  searchParams.value = { name: '', department: '' }
  resetPagination()
}
const {
  dataList,
  loading,
  loadData,
  totals,
  pageInfo,
  handleSizeChange,
  handleCurrentChange,
  resetPagination,
} = useHttp('/permissionList', searchParams)

const flatUrls = (list: menuItem[]) => {
  const flatList: string[] = []

  function trans(node: menuItem) {
    if (node.url && !node.children) {
      flatList.push(node.url)
    }
    if (node.children) {
      node.children.forEach((item: menuItem) => trans(item))
    }
  }
  list.forEach((node: menuItem) => trans(node))
  return flatList
}
const checkList = ref<string[]>([])
const btnAuth = ref<string[]>([])
const accountNo = ref<string>('')
const setAuth = async (auth: string, account: string) => {
  const {
    data: { btn, list },
  } = await authApi(auth)
  checkList.value = flatUrls(list)
  btnAuth.value = btn
  accountNo.value = account
  visable.value = true
}
</script>
