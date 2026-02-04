import { post } from "@/utils/http";
enum Apis{
  login='/login'
}
interface loginParams{
  username:string,
  password:string
}
function loginApi(data:loginParams):Promise<any>{
  return post(Apis.login,data)
}

export {loginApi}