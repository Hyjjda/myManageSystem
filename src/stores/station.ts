import type { RowType } from '@/types/station'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStationStore = defineStore(
  'station',
  () => {
    const rowData = ref<RowType>({
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
    const updateRow = (row: RowType) => {
      rowData.value = row
    }
    const initRow = () => {
      rowData.value = {
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
      }
    }
    return {
      rowData,
      updateRow,
      initRow,
    }
  },
  { persist: true },
)
