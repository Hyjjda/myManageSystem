import { get, post } from '@/utils/http'

enum Apis {
  list = '/alarmList',
  filter = '/alarm/select',
}

export const alarmListApi = () => {
  return get(Apis.list)
}

export const filterList = (level: number) => {
  return post(Apis.filter, level)
}
