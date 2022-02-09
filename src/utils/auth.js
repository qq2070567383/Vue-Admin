import Cookies from 'js-cookie' // 使用插件导入cookies

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey) // 得到cookies
}

export function setToken(token) {
  return Cookies.set(TokenKey, token) // 设置cookies
}

export function removeToken() {
  return Cookies.remove(TokenKey) // 移除cookies
}
