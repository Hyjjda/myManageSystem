import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { ElNotification } from 'element-plus'
const request: AxiosInstance = axios.create({
  baseURL: 'https://www.demo.com',
  timeout: 5000,
})
//请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => {
    ElNotification({
      title: 'ERROR',
      message: error.message,
      type: 'error',
    })
    return Promise.reject(error)
  },
)
//响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.code != 200) {
      ElNotification({
        title: '失败',
        message: response.data.msg,
        type: 'error',
      })
    } else {
      return response.data
    }
  },
  (error: AxiosError) => {
    ElNotification({
      title: 'ERROR',
      message: error.message,
      type: 'error',
    })
    return Promise.reject(error)
  },
)

export default request
