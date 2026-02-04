<template>
  <!-- 查询模块 -->
  <el-card :gutter="20">
    <el-row>
      <el-col :span="6">
        <el-input v-model.trim="selectParams.input" placeholder="查询方式">
          <template #append>
            <el-select v-model="select" style="width: 115px">
              <el-option label="名称" value="name" />
              <el-option label="编号" value="id" />
            </el-select>
          </template>
        </el-input>
      </el-col>
      <el-col :span="6" class="ml">
        <el-select placeholder="设备状态" v-model="selectParams.state">
          <el-option :value="1" label="全部"></el-option>
          <el-option :value="2" label="使用中"></el-option>
          <el-option :value="3" label="空闲中"></el-option>
          <el-option :value="4" label="维护中"></el-option>
          <el-option :value="5" label="待维修"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" class="ml">
        <el-button type="primary" @click="goFind">查询</el-button>
        <el-button @click="resetFind">重置</el-button>
      </el-col>
    </el-row>
  </el-card>
  <!-- 统计模块 -->
  <el-card class="static mt">
    <el-row>
      <el-col :span="6">
        <el-statistic title="累计充电量（°）" :value="268500" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="累计充电次数" :value="11100" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="服务区域（区）" :value="88" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="累计效益(元)" :value="5622178" />
      </el-col>
    </el-row>
  </el-card>
  <!-- 新增模块 -->
  <el-card class="mt">
    <el-button type="primary" icon="Plus" @click="updateRow">新增充电站</el-button>
  </el-card>
  <!-- 数据渲染 -->
  <el-card class="mt">
    <el-table :data="tableList" size="small" v-loading="isLoad">
      <el-table-column type="index" width="50px" />
      <el-table-column prop="name" label="站点名称" />
      <el-table-column prop="id" label="站点ID" />
      <el-table-column prop="city" label="城市" />
      <el-table-column prop="fast" label="快充数" />
      <el-table-column prop="slow" label="慢充数" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 2" type="primary">使用中</el-tag>
          <el-tag v-if="scope.row.status === 3" type="success">空闲中</el-tag>
          <el-tag v-if="scope.row.status === 4" type="warning">维护中</el-tag>
          <el-tag v-if="scope.row.status === 5" type="error">待维修</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="now" label="正在充电" />
      <el-table-column prop="fault" label="故障数" />
      <el-table-column prop="person" label="站长" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column label="编辑">
        <template #default="scope">
          <el-button type="primary" size="small" @click="Edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗" @confirm="deleteItem(scope.row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
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
  </el-card>
  <EditForm :dialog-visible="isShow" @close="isShow = false" @reload="getList"></EditForm>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getListApi, deleteListApi } from '@/apis/station'
import EditForm from './components/EditForm.vue'
import type { RowType } from '@/types/station'
import { useStationStore } from '@/stores/station'
import { ElMessage } from 'element-plus'
//顶部数据
const select = ref('name')
const selectParams = reactive({
  input: '',
  state: 1,
})
//顶部查询按钮
const goFind = () => {
  getList()
}
const resetFind = () => {
  selectParams.input = ''
  selectParams.state = 1
  select.value = 'name'
  pageInfo.value.page = 1
  pageInfo.value.pageSize = 10
  getList()
}
//数据
const tableList = ref<RowType[] | []>([])
const totals = ref<number>(1)
const pageInfo = ref({
  page: 1,
  pageSize: 10,
})
const isLoad = ref<boolean>(false)
//获取数据函数
const getList = async () => {
  isLoad.value = true
  const {
    data: { list, total },
  } = await getListApi({
    ...pageInfo.value,
    status: selectParams.state,
    [select.value]: selectParams.input,
  })
  isLoad.value = false
  tableList.value = list
  totals.value = total
}
//换页相关函数
const handleSizeChange = (pageSize: number) => {
  pageInfo.value.pageSize = pageSize
  getList()
}
const handleCurrentChange = (page: number) => {
  pageInfo.value.page = page
  getList()
}
//弹窗
const stationStore = useStationStore()
const isShow = ref<boolean>(false)
const Edit = (row: RowType) => {
  stationStore.updateRow(row)
  isShow.value = true
}
//操作按钮
const updateRow = () => {
  stationStore.initRow()
  isShow.value = true
}
const deleteItem = async (id: string) => {
  const res = await deleteListApi(id)
  if (res.code === 200) {
    ElMessage({
      message: res.msg,
      type: 'success',
    })
    getList()
  }
}
onMounted(() => getList())
</script>

<style lang="less">
.static {
  text-align: center;
}
</style>
