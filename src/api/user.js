import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

// 用户信息
export function getInfo(token) { // 得到token
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

// 退出
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
