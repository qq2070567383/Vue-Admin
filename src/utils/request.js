import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // 需要在不同环境下请求不同地址
  // url = 基本url加上请求url
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置超时时间
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  // 一个是请求在请求之前为url携带上请求头
  config => { // config就是一个promise
    // 取值，如果store里面有token
    if (store.getters.token) {
      // 那么让每一个请求头都带上token
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  // 一个是直接请求错误的话
  error => {
    console.log(error)
    // 抛出错误，阻止程序运行
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  // 一个是请求的状态码不对
  response => {
    const res = response.data
    console.log(response.data)
    // 如果响应的状态码不等于20000，那么就调用element-ui里面的Message，提示文字为res.message 或 'Error',持续5秒
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 如果响应的状态码不等于50008或50012或50014
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 调用element-ui里面的confirm提示框，第二个参数是提示框标题，第三个参数是配置项
        MessageBox.confirm('您已注销，可以取消以停留在此页面，或重新登录', '确认注销', {
          confirmButtonText: '登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 异步存值，之后进行浏览器刷新，浏览器重新从服务器请求资源
          store.dispatch('user/resetToken').then(() => {
            // 页面刷新，重新请求数据
            location.reload()
          })
        })
      }
      // 抛出以个新的错误
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  // 一个是直接响应错误
  error => {
    console.log('错误' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    // 抛出错误，阻止程序运行
    return Promise.reject(error)
  }
)

export default service
