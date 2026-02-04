<script setup lang="ts">
import { fomaterToThousand } from '@/utils/toThousand'
import { onMounted, reactive, ref } from 'vue'
import { useChart } from '@/hooks/useChart'
import { getChartData, getList2Api } from '@/apis/station'
import { usePagaination } from '@/hooks/usePage'
const chartRef = ref(null)
const getCrossOPts = async () => {
  const option = reactive({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: {
      data: ['销售', '收入'],
    },
    xAxis: [
      {
        type: 'category',
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '销售',
        min: 0,
        max: 50,
        interval: 10,
        axisLabel: {
          formatter: '{value} 度',
        },
      },
      {
        type: 'value',
        name: '收入',
        min: 0,
        max: 50,
        interval: 5,
        axisLabel: {
          formatter: '{value}w ',
        },
      },
    ],
    series: [
      {
        name: '销售',
        type: 'bar',
        data: [3, 6, 9, 10, 12, 3, 5, 10, 25, 30, 20, 10],
      },
      {
        name: '收入',
        type: 'line',
        yAxisIndex: 1,
        data: [10, 16, 19, 26, 12, 43, 35, 30, 22, 33, 20, 11],
        smooth: true,
      },
    ],
  })
  const res = await getChartData()
  option.series[0]!.data = res.data.list1
  option.series[1]!.data = res.data.list2
  return option
}
const tableData = ref([])
const isLoad = ref(false)
const name = ref<string>('')
const getList2 = async () => {
  isLoad.value = true
  const {
    data: { list, total },
  } = await getList2Api({ page: pageInfo.page, pageSize: pageInfo.pageSize, name: name.value })
  setTotals(total)
  tableData.value = list
  tableData.value = list.map((item: any) => {
    return {
      ...item,
      day: item.electricity + item.parkingFee + item.serviceFee + item.member,
    }
  })
  totals.value = total
  isLoad.value = false
}
const { totals, setTotals, pageInfo, handleSizeChange, handleCurrentChange, resetPagination } =
  usePagaination(getList2)
onMounted(() => getList2())
useChart(chartRef, getCrossOPts)
</script>

<template>
  <div>
    <!-- 统计表部分 -->
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="pic">
              <el-icon>
                <Document />
              </el-icon>
            </div>
            <h3>今日总收入</h3>
          </div>
          <div class="total mt">
            <h1 class="mr">{{ fomaterToThousand(12344) }}</h1>
            <div class="percent" style="color: red">+2%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="pic">
              <el-icon>
                <Document />
              </el-icon>
            </div>
            <h3>本月总收入</h3>
          </div>
          <div class="total mt">
            <h1 class="mr">{{ fomaterToThousand(1678345) }}</h1>
            <div class="percent" style="color: green">-1%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="pic">
              <el-icon>
                <Document />
              </el-icon>
            </div>
            <h3>会员卡储蓄</h3>
          </div>
          <div class="total mt">
            <h1 class="mr">{{ fomaterToThousand(57456) }}</h1>
            <div class="percent" style="color: red">+34%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="pic">
              <el-icon>
                <Document />
              </el-icon>
            </div>
            <h3>服务支出</h3>
          </div>
          <div class="total mt">
            <h1 class="mr">{{ fomaterToThousand(4355) }}</h1>
            <div class="percent" style="color: green">-21%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="pic">
              <el-icon>
                <Document />
              </el-icon>
            </div>
            <h3>电费</h3>
          </div>
          <div class="total mt">
            <h1 class="mr">{{ fomaterToThousand(8673) }}</h1>
            <div class="percent" style="color: green">-21%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="pic">
              <el-icon>
                <Document />
              </el-icon>
            </div>
            <h3>个人所得税</h3>
          </div>
          <div class="total mt">
            <h1 class="mr">{{ fomaterToThousand(1233) }}</h1>
            <div class="percent" style="color: green">-21%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 图表 -->
    <el-card class="mt">
      <div ref="chartRef" style="width: 100%; height: 400px"></div>
    </el-card>
    <!-- 数据 -->
    <el-card class="mt">
      <el-input v-model="name" style="max-width: 400px" placeholder="输入站点名称筛选">
        <template #append>
          <el-button icon="Search" @click="getList2" />
        </template>
      </el-input>
      <el-table :data="tableData" v-loading="isLoad" size="small">
        <el-table-column type="index" />
        <el-table-column prop="name" label="名字" width="180" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="count" label="数量" />
        <el-table-column prop="electricity" label="电费（CNY）" />
        <el-table-column prop="parkingFee" label="停车费（CNY）" />
        <el-table-column prop="serviceFee" label="服务费（CNY）" />
        <el-table-column prop="day" label="日收入（CNY）" sortable>
          <template #default="scope">
            <span>{{ scope.row.day }}</span>
            <el-tag class="ml" :type="scope.row.percent > 0 ? 'danger' : 'success'">
              {{ scope.row.percent > 0 ? '+' + scope.row.percent + '%' : scope.row.percent + '%' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="month" label="月度收入（k）">
          <template #default="scope">
            <span>{{ scope.row.month }}</span>
            <el-tag class="ml" :type="scope.row.mpercent > 0 ? 'danger' : 'success'">
              {{
                scope.row.mpercent > 0 ? '+' + scope.row.mpercent + '%' : scope.row.mpercent + '%'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="member" label="会员金（CNY）" />
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
  </div>
</template>

<style lang="less">
.title {
  display: flex;
  align-items: center;
  .pic {
    width: 30px;
    height: 30px;
    line-height: 30px;
    background-color: aliceblue;
    border-radius: 50%;
  }
  h3 {
    color: #666;
  }
}
.total {
  display: flex;
  align-items: center;
  h1 {
    font-size: 30px;
  }
  .percent {
    display: inline-block;
    padding: 3px 5px;
    font-size: 12px;
    border-radius: 4px;
    background-color: #f3f0f0;
  }
}
</style>
