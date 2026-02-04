import { post } from '@/utils/http'
import { onMounted, reactive, ref } from 'vue'

export function useHttp<T>(url: string, params: any) {
  const dataList = ref<T[]>([])
  const loading = ref<boolean>(false)
  const totals = ref<number>(0)
  const pageInfo = reactive({
    page: 1,
    pageSize: 10,
  })

  const loadData = async () => {
    try {
      loading.value = true
      const { data } = await post(url, { ...params.value, ...pageInfo })
      dataList.value = data.list
      totals.value = data.total
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }
  const handleSizeChange = (size: number) => {
    pageInfo.pageSize = size
    loadData()
  }
  const handleCurrentChange = (page: number) => {
    pageInfo.page = page
    loadData()
  }
  const resetPagination = () => {
    pageInfo.page = 1
    pageInfo.pageSize = 10
    loadData()
  }

  onMounted(() => loadData())

  return {
    dataList,
    loading,
    loadData,
    totals,
    pageInfo,
    handleSizeChange,
    handleCurrentChange,
    resetPagination,
  }
}
