import { get, post } from '@/utils/http'
enum Apis {
  del = '/orderList/delete',
  city = '/cityList',
  updateRule = '/addDot',
}
export const delSelected = (SelectedList: any) => {
  return post(Apis.del, SelectedList)
}
export const getCity = () => {
  return get(Apis.city)
}

export const updateRule = (rules: any) => {
  return post(Apis.updateRule, rules)
}
