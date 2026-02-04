import * as echarts from 'echarts'
import { markRaw, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export function useChart(chartRef: Ref<HTMLElement | null>, getChartData: Function) {
  const chartInstance = ref<echarts.ECharts | null>(null)

  const initChart = async () => {
    if (chartRef.value) {
      // 由于vue响应式跟echart响应式冲突 我们用markraw让vue响应式失效
      chartInstance.value = markRaw(echarts.init(chartRef.value))
      const chartOptions = await getChartData()
      chartInstance.value.setOption(chartOptions)
    }
  }

  //窗口适配
  const resizeChart = () => {
    chartInstance.value?.resize()
  }
  onMounted(() => {
    initChart()
    window.addEventListener('resize', resizeChart)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart)
    if (chartInstance.value) chartInstance.value.dispose()
  })
}
