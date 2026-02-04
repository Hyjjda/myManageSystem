import type { RowType } from '@/types/station'
import { post, get } from '@/utils/http'

interface listType {
  id?: string
  name?: string
  status: number
  page: number
  pageSize: number
}
interface list2Type {
  name?: string
  page: number
  pageSize: number
}
enum Apis {
  list = '/stationList',
  update = '/station/submit',
  delete = '/station/delete',
  cross = '/crossData',
  list2 = '/revenueList',
  pipe = '/currentList',
}

function getListApi(params: listType) {
  return post(Apis.list, params)
}

function updateListApi(params: RowType) {
  return post(Apis.update, params)
}

function deleteListApi(id: string) {
  return post(Apis.delete, { id })
}

function getChartData() {
  return get(Apis.cross)
}
function getList2Api(params: list2Type) {
  return post(Apis.list2, params)
}

function getPipeApi() {
  return get(Apis.pipe)
}
export { getListApi, updateListApi, deleteListApi, getChartData, getList2Api, getPipeApi }
