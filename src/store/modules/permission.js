import { asyncRoutes, constantRoutes } from '@/router' // 导入静态和动态路由

// 使用meta角色,以确定当前用户是否具有权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) { // 判断路由下面有meta并且下面还有roles，有的话就返回一个true或者false（route.meta.roles包含roles）
    return roles.some(role => route.meta.roles.includes(role)) // some只要数组里面有一个是true，就返回true
  } else {
    return true
  }
}

// 通过递归过滤异步路由表
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    // console.log(tmp);
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles) // 递归
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [], // 所有过滤后的路由 + 静态数据
  addRoutes: [] // 所有过滤后的路由
}

const mutations = {
  SET_ROUTES: (state, routes) => { // 连接动态路由和静态路由
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes) // concat() 方法用于连接两个或多个数组
  }
}

const actions = {
  generateRoutes({ commit }, roles) { // 得到可访问路由
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) { // 如果角色里面包含admin,就把所有的动态路由都提交出去
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles) // 否则交出过滤路由
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
