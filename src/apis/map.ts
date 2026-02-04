import { post } from '@/utils/http'
enum Apis {
  Map = '/mapList',
  submit = '/submitMap',
}
function getMapList() {
  return post(Apis.Map)
}
function submitMap(data: any) {
  return post(Apis.submit, data)
}
export { getMapList, submitMap }
