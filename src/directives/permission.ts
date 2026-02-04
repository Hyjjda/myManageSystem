import { useUserStore } from '@/stores/user'
export default {
  beforeMount(el: any, binding: any) {
    const userStore = useUserStore()
    const permission = binding.value
    if (!userStore.rules.includes(permission)) el.style.display = 'none'
  },
}
