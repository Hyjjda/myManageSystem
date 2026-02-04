import { get } from '@/utils/http'
enum Apis {
  lineData = '/lineData',
  pieData = '/pieData',
  radioData = '/radioData',
}

function getLineData() {
  return get(Apis.lineData)
}

function getPieData() {
  return get(Apis.pieData)
}

function getRadioData() {
  return get(Apis.radioData)
}
export { getLineData, getPieData, getRadioData }
