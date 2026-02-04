import { post } from '@/utils/http'
enum Apis {
  auth = '/userAuth',
  update = '/setAuth',
}

export const authApi = (pageAuthority: string) => {
  return post(Apis.auth, { pageAuthority })
}

export const updateAuthApi = (btnList: any[], pageList: any[], account: string) => {
  return post(Apis.update, { btnList, pageList, account })
}
