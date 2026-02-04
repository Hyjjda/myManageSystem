<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <!-- 设备总览 -->
      <el-card>
        <div class="title">
          <h3>运行状态</h3>
          <p class="ml">更新时间：{{ yy }}年{{ mm }}月{{ dd }}日</p>
          <el-icon color="grey" style="margin-left: 10px" @click="refreshData"><Refresh /></el-icon>
        </div>
        <div class="equip" v-loading="loading">
          <div class="item">
            <h4 class="mb mt">设备使用率</h4>
            <img :src="flash" class="mb" />
            <h1 class="mb">{{ ramdomNum }} / 100</h1>

            <div class="statistic-card">
              <el-statistic :value="10">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    异常设备
                    <el-tooltip effect="dark" content="出现问题的设备" placement="top">
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>相较于昨天：</span>
                  <span class="green">
                    +10%
                    <el-icon color="red">
                      <CaretTop />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="item">
            <h4 class="mb mt">充电柜使用率</h4>
            <img :src="flash2" class="mb" />
            <h1 class="mb">{{ ramdomNum2 }} / 40</h1>

            <div class="statistic-card">
              <el-statistic :value="3">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    异常设备
                    <el-tooltip effect="dark" content="出现问题的设备" placement="top">
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>相较于昨天：</span>
                  <span class="green">
                    -10%
                    <el-icon color="green">
                      <CaretBottom />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="item">
            <h4 class="mb mt">充电站使用率</h4>
            <img :src="flash3" class="mb" />
            <h1 class="mb">{{ ramdomNum3 }} / 77</h1>

            <div class="statistic-card">
              <el-statistic :value="6">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    异常设备
                    <el-tooltip effect="dark" content="出现问题的设备" placement="top">
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>相较于昨天：</span>
                  <span class="green">
                    +15%
                    <el-icon color="red">
                      <CaretTop />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <!-- 常用功能 -->
      <el-card class="mt">
        <template #header>
          <div class="title">
            <h3>常用功能</h3>
          </div>
        </template>
        <div class="quick">
          <el-row :gutter="0">
            <el-col :span="4">
              <img :src="repair" name="报警管理" @click="handleClick" />
              <p>报警管理</p>
            </el-col>
            <el-col :span="4">
              <img :src="progress" name="招商管理" @click="handleClick" />
              <p>招商管理</p>
            </el-col>
            <el-col :span="4">
              <img :src="total" name="营收统计" @click="handleClick" />
              <p>营收统计</p>
            </el-col>
            <el-col :span="4">
              <img :src="remain" name="订单管理" @click="handleClick" />
              <p>订单管理</p>
            </el-col>
            <el-col :span="4">
              <img :src="money" name="计费管理" @click="handleClick" />
              <p>计费管理</p>
            </el-col>
            <el-col :span="4">
              <img :src="daily" name="电子地图" @click="handleClick" />
              <p>电子地图</p>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!-- 图表统计 -->
      <el-card class="mt">
        <template #header>
          <div class="title">
            <h3>能源统计</h3>
          </div>
        </template>
        <el-row>
          <el-col :span="6">
            <div ref="chartRef1" style="width: 100%; height: 400px"></div>
          </el-col>
          <el-col :span="18">
            <div ref="chartRef2" style="width: 100%; height: 400px"></div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="6">
      <!-- 设备总览雷达图 -->
      <el-card>
        <template #header>
          <div class="card-header">
            <h2>设备总览</h2>
          </div>
        </template>
        <div ref="chartRef3" style="width: 100%; height: 240px"></div>
      </el-card>
      <!-- 收入城市排行表 -->
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h2>营收统计</h2>
          </div>
        </template>
        <ul class="rank-list">
          <li class="rank-item">
            <span class="rank" style="background-color: gold; color: aliceblue">1</span>
            <span class="city">重庆</span>
            <span class="sales">19,999</span>
            <span style="margin-left: 50px">
              11%
              <el-icon color="green"><CaretTop /></el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank" style="background-color: silver; color: aliceblue">2</span>
            <span class="city">成都</span>
            <span class="sales">19,999</span>
            <span style="margin-left: 50px">
              11%
              <el-icon color="green"><CaretTop /></el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank" style="background-color: burlywood; color: aliceblue">3</span>
            <span class="city">北京</span>
            <span class="sales">19,999</span>
            <span style="margin-left: 50px">
              11%
              <el-icon color="green"><CaretTop /></el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank" style="color: black">4</span>
            <span class="city">上海</span>
            <span class="sales">19,999</span>
            <span style="margin-left: 50px">
              11%
              <el-icon color="green"><CaretTop /></el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank" style="color: black">5</span>
            <span class="city">武汉</span>
            <span class="sales">19,999</span>
            <span style="margin-left: 50px">
              11%
              <el-icon color="green"><CaretTop /></el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank" style="color: black">6</span>
            <span class="city">广州</span>
            <span class="sales">19,999</span>
            <span style="margin-left: 50px">
              11%
              <el-icon color="green"><CaretTop /></el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank" style="color: black">7</span>
            <span class="city">合肥</span>
            <span class="sales">19,999</span>
            <span style="margin-left: 50px">
              11%
              <el-icon color="green"><CaretTop /></el-icon>
            </span>
          </li>
          <li class="rank-item">
            <span class="rank" style="color: black">8</span>
            <span class="city">深圳</span>
            <span class="sales">19,999</span>
            <span style="margin-left: 50px">
              11%
              <el-icon color="green"><CaretTop /></el-icon>
            </span>
          </li>
        </ul>
      </el-card>
      <!-- 时间线 -->
      <el-card>
        <template #header>
          <div class="header">
            <h2>故障时间表</h2>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item timestamp="2025/9/12" placement="top" type="primary" hollow="true">
            <el-card>
              <h4>充不起电</h4>
              <p>用户-重庆九龙坡</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2025/12/3" placement="top" type="primary" hollow="true">
            <el-card>
              <h4>设备停摆</h4>
              <p>区域经理-北京昌平</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2026/1/2" placement="top" type="primary" hollow="true">
            <el-card>
              <h4>设备温度异常</h4>
              <p>用户-重庆大渡口</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useTabStore } from '@/stores/tab'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useChart } from '@/hooks/useChart'
import { getLineData, getPieData, getRadioData } from '@/apis/dashboard'
//图片引入
import flash from '@/assets/flash.png'
import flash2 from '@/assets/flash2.png'
import flash3 from '@/assets/flash3.png'
import repair from '@/assets/repair.png'
import progress from '@/assets/progress.png'
import remain from '@/assets/remain.png'
import total from '@/assets/total.png'
import money from '@/assets/money.png'
import daily from '@/assets/daily.png'
import { CaretTop } from '@element-plus/icons-vue'
//模拟更新数据
const yy = ref(2020)
const mm = ref(1)
const dd = ref(1)
const ramdomNum = ref(10)
const ramdomNum2 = ref(10)
const ramdomNum3 = ref(10)
const loading = ref(true)
// 生成随机数函数
const generateRandomNumbers = () => {
  ramdomNum.value = Math.round(Math.random() * 90)
  ramdomNum2.value = Math.round(Math.random() * 40)
  ramdomNum3.value = Math.round(Math.random() * 70)
}
// 更新时间的函数
const getNowTime = () => {
  loading.value = true
  const now = new Date()
  yy.value = now.getFullYear()
  mm.value = now.getMonth() + 1
  dd.value = now.getDate()

  setTimeout(() => {
    loading.value = false
    generateRandomNumbers()
  }, 2000)
}
const refreshData = () => {
  getNowTime()
}

//功能跳转
const tabStore = useTabStore()
const userStore = useUserStore()
const router = useRouter()
const findMenuByName = (menu: any, name: string): any => {
  for (let item of menu) {
    if (item.name === name) return item
    if (item.children) {
      const res = findMenuByName(item.children, name)
      if (res) return res
    }
  }
  return null
}
const handleClick = (e: any) => {
  const tab = findMenuByName(userStore.menu, e.target.name)
  tabStore.addTab(tab.name, tab.url, tab.icon)
  tabStore.changeCurrentTab(tab.name, tab.url)
  router.push(tab.url)
}

//图表构建
const chartRef1 = ref(null)
const chartRef2 = ref(null)
const chartRef3 = ref(null)
//折线图数据渲染
const getLineChartData = async () => {
  const options = reactive({
    title: {
      text: '电量统计',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [],
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}KW',
      },
    },
    series: [
      {
        name: '',
        type: 'line',
        smooth: 'true',
        data: [],
        lineStyle: {
          width: 4,
        },
        itemStyle: {
          color: 'red',
          shadowBlur: 4,
          shadowColor: 'rgba(0,0,255,0.5)',
        },
      },
      {
        name: '',
        type: 'line',
        smooth: 'true',
        data: [],
        lineStyle: {
          width: 4,
        },
        itemStyle: {
          color: 'green',
          shadowBlur: 4,
          shadowColor: 'rgba(0,0,255,0.5)',
        },
      },
      {
        name: '',
        type: 'line',
        smooth: 'true',
        data: [],
        lineStyle: {
          width: 4,
        },
        itemStyle: {
          color: 'blue',
          shadowBlur: 4,
          shadowColor: 'rgba(0,0,255,0.5)',
        },
      },
    ],
  })
  const res = await getLineData()
  options.legend.data = res.data.list.map((item: any) => item.name)
  for (let i = 0; i < res.data.list.length; i++) {
    options.series[i]!.name = res.data.list[i].name
    options.series[i]!.data = res.data.list[i].data
  }
  return options
}
//饼装图数据渲染
const getPieChartData = async () => {
  const options = reactive({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}w ({d}%)',
    },
    legend: {
      left: 'center',
      top: 'bottom',
    },
    series: [
      {
        name: '收入',
        type: 'pie',
        radius: [70, 100],
        roseType: 'area',
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
        },
        data: [],
      },
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: '收入统计',
        fontSize: 20,
        fontWeight: 'bold',
      },
    },
  })
  const res = await getPieData()
  options.series[0]!.data = res.data.list
  return options
}
//雷达图渲染
const getRadioChartData = async () => {
  const options = reactive({
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '闲置数', max: 65 },
        { name: '使用数', max: 160 },
        { name: '故障数', max: 300 },
        { name: '维修数', max: 380 },
        { name: '更换数', max: 520 },
        { name: '报废数', max: 250 },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [],
            name: 'Actual Spending',
          },
        ],
      },
    ],
  })

  const res = await getRadioData()

  options.series[0]!.data[0]!.value = res.data.list
  return options
}
useChart(chartRef1, getPieChartData)
useChart(chartRef2, getLineChartData)
useChart(chartRef3, getRadioChartData)

onMounted(() => {
  getNowTime()
})
</script>

<style lang="less">
.title {
  display: flex;
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
  align-items: flex-end;
  font-weight: bold;
  p {
    color: grey;
  }
}
.equip {
  display: flex;
  justify-content: space-between;
  padding: 0 60px;
  .item {
    h1 {
      font-size: 40px;
    }
  }
}
.quick {
  cursor: pointer;
  margin: 20px 0;
  text-align: center;
  p {
    color: #333;
  }
}
.rank-list {
  padding: 0;
  .rank-item {
    display: flex;
    justify-content: space-around;
    padding: 5px;
    .rank {
      display: inline-block;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      line-height: 30px;
      text-align: center;
    }
    .city {
      flex-grow: 1;
      font-size: 18px;
      font-weight: bold;
      padding-left: 10px;
    }
    .sales {
      margin-left: 30px;
    }
  }
  .rank-item:nth-child(even) {
    background-color: #eae5e5;
  }
}
</style>
