import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi } from '@/apis/user'

interface loginParams {
  username: string
  password: string
}

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref(localStorage.getItem('token') || '')
    const rules = ref(JSON.parse(localStorage.getItem('rules') || '[]'))
    const username = ref(localStorage.getItem('username') || '')
    const menu = ref(JSON.parse(localStorage.getItem('menu') || '[]'))

    const Login = async (data: loginParams) => {
      try {
        const res = await loginApi(data)
        token.value = res.data.token
        rules.value = res.data.user.roles
        username.value = res.data.user.nickname
        menu.value = res.menulist
      } catch (e) {
        console.log(e)
      }
    }

    const Logout = () => {
      token.value = ''
      rules.value = []
      username.value = ''
      menu.value = []
    }

    return {
      token,
      rules,
      username,
      menu,
      Login,
      Logout,
    }
  },
  {
    persist: true,
  },
)
