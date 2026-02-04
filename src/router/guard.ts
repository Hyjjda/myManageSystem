import router from "@/router/index";
import { useUserStore } from "@/stores/user";
router.beforeEach((to)=>{
  const userStore = useUserStore()
  const isLogin = userStore.token
  
  if(!isLogin){
    if(to.path !== '/login' )
    {
      return {path:'/login'}
    }
  }else{
    if(to.path === '/login')
      return {path:'/'}

    if(to.meta?.needAuth && !(userStore.rules.some((role:string) =>(to.meta.needAuth as string[]).includes(role))))
      return {path:'/'}
  }
})