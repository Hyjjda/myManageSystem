import { ref, reactive } from 'vue'
export function usePagaination(loadData: () => Promise<any>, initialPageSize = 10) {
  const totals = ref(0)
  const pageInfo = reactive({
    page: 1,
    pageSize: initialPageSize,
  })
  const handleSizeChange = (size: number) => {
    pageInfo.pageSize = size
    loadData()
  }
  const handleCurrentChange = (page: number) => {
    pageInfo.page = page
    console.log(666, pageInfo.page)
    loadData()
  }
  const resetPagination = () => {
    pageInfo.page = 1
    pageInfo.pageSize = initialPageSize
  }
  const setTotals = (all: number) => {
    totals.value = all
  }
  return {
    totals,
    setTotals,
    pageInfo,
    handleSizeChange,
    handleCurrentChange,
    resetPagination,
  }
}
