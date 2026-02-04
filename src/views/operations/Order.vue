<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入订单号" v-model="searchParams.orderNo"></el-input>
      </el-col>
      <el-col :span="6">
        <el-select placeholder="选择状态" v-model="searchParams.status">
          <el-option label="全部" :value="1"></el-option>
          <el-option label="进行中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
          <el-option label="异常" :value="4"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请输入设备编号" v-model="searchParams.no"></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="loadData">确定</el-button>
        <el-button @click="resetQuery"> 重置</el-button>
      </el-col>
      <el-col :span="6" class="mt">
        <el-input placeholder="请输入站点名称" v-model="searchParams.name"></el-input>
      </el-col>
      <el-col :span="6" class="mt">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
          @change="handleChange"
        />
      </el-col>
    </el-row>
  </el-card>

  <el-card class="mt">
    <el-button type="danger" :disabled="!selectedList.length" @click="handelDel"
      >批量删除</el-button
    >
    <el-button
      type="primary"
      icon="Download"
      :disabled="!selectedList.length"
      @click="exportToExcel"
      >导出数据至Excel</el-button
    >
  </el-card>

  <el-card class="mt">
    <el-table :data="dataList" v-loading="loading" @selection-change="handleSelect">
      <el-table-column type="selection" width="55" />
      <el-table-column label="订单号" prop="orderNo"></el-table-column>
      <el-table-column label="设备编号" prop="equipmentNo"></el-table-column>
      <el-table-column label="下单时间" prop="date"></el-table-column>
      <el-table-column label="开始时间" prop="startTime"></el-table-column>
      <el-table-column label="结束时间" prop="endTime"></el-table-column>
      <el-table-column label="金额" prop="money"></el-table-column>
      <el-table-column label="支付方式" prop="pay"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="scope"
          ><el-tag type="success" v-if="scope.row.status == 2">进行中</el-tag>
          <el-tag type="primary" v-else-if="scope.row.status == 3">已完成</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status == 4">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="toDetail(scope.row.orderNo)"
            >详情</el-button
          >
          <el-button type="danger" size="small" @click="singleDel(scope.row.orderNo)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
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
import { useHttp } from '@/hooks/useHttp'
import { ref, watch } from 'vue'
import { delSelected } from '@/apis/operation'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useTabStore } from '@/stores/tab'
import * as xlsx from 'xlsx'
import { saveAs } from 'file-saver'
const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()
interface searchType {
  orderNo: string
  status: number
  no: string
  name: string
  startTime: string
  endTime: string
}
interface SelectionListType {
  orderNo: string
  equipmentNo: string
  date: string
  startTime: string
  endTime: string
  money: string
  pay: string
  status: number
}
const searchParams = ref<searchType>({
  orderNo: '',
  status: 1,
  no: '',
  name: '',
  startTime: '',
  endTime: '',
})
const date = ref<string[]>([])
const handleChange = (value: string[]) => {
  searchParams.value.startTime = value[0] as string
  searchParams.value.endTime = value[1] as string
  console.log(searchParams.value)
}
const selectedList = ref<SelectionListType[]>([])
const handleSelect = (newSelected: SelectionListType[]) => {
  selectedList.value = newSelected
}
const handelDel = async () => {
  try {
    const res = await delSelected(selectedList.value.map((item: SelectionListType) => item.orderNo))
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.msg,
      })
      loadData()
    }
  } catch (error) {
    console.log(error)
  }
}
const resetQuery = () => {
  date.value = []
  searchParams.value = {
    orderNo: '',
    status: 1,
    no: '',
    name: '',
    startTime: '',
    endTime: '',
  }
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
} = useHttp<SelectionListType>('/orderList', searchParams)

const singleDel = async (orderNo: string) => {
  try {
    const res = await delSelected([orderNo])
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.msg,
      })
      loadData()
    }
  } catch (error) {
    console.log(error)
  }
}

const toDetail = (orderNo: string) => {
  router.push('/operations/detail?orderNo=' + orderNo)
  tabStore.addTab('订单详情', '/operations/detail', 'Share')
  tabStore.changeCurrentTab('订单详情', '/operations/detail')
}

watch(
  () => route.name,
  (to, from) => {
    if (to === 'orders' && from !== 'detail') loadData()
  },
)

const exportToExcel = () => {
  const ws = xlsx.utils.json_to_sheet(selectedList.value)
  const wb = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1')

  const wbout = xlsx.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  saveAs(blob, '订单表.xlsx')
}
</script>
