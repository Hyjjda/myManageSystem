import { get } from '@/utils/http'
enum Apis {
  doc = '/document',
}

export const getTypeApi = () => {
  return get(Apis.doc)
}
