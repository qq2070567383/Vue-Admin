import { login, logout, getInfo } from '@/api/user' // 导入请求api
import { getToken, setToken, removeToken } from '@/utils/auth' // 导入token相关操作
import router, { resetRouter } from '@/router' // 导入所有路由，并且导入其中的resetRouter函数

const state = {
  token: getToken(), // 得到token
  name: '', // 名字
  avatar: '', // 头像gif
  introduction: '', // 介绍
  roles: [] // 角色
}

const mutations = {
  SET_TOKEN: (state, token) => { // 保存token
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => { // 保存介绍
    state.introduction = introduction
  },
  SET_NAME: (state, name) => { // 保存名字
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => { // 保存角色
    state.roles = roles
  }
}

// actions 中的第一个参数是当前vuex模块的上下文
// { commit }表示向mutations里面提交修改方法，第二个参数是提交这份方法时所带的参数
const actions = {
  // 用户登录
  login({ commit }, userInfo) { // 调用这个函数就立马返回一个promise，但是他成功的结果是建立在请求接口成功之上是
    const { username, password } = userInfo // 得到用户账号和密码
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => { // 一点登录，请求接口，请求成功，进行回调
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 得到用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => { // 调用导入进来getInfo得到结果
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录。')
        }
        const { roles, name, avatar, introduction } = data
        // getInfo:角色必须是非空数组
        if (!roles || roles.length <= 0) {
          reject('角色必须是非空数组！')
        }
        commit('SET_ROLES', roles) // /往mutations里面提交修改
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => { // 捕获报错
        reject(error)
      })
    })
  },

  // 用户退出，
  // 退出的时候请求一下接口，并且清空token和角色信息
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => { // 执行这个函数我们得到了一个Promise对象
      logout(state.token).then(() => {
        commit('SET_TOKEN', '') // token 为空
        commit('SET_ROLES', []) // 角色为空
        removeToken() // A删除token
        resetRouter() // 移除路由

        // 重置已访问视图和缓存视图，解决tags固钉问题
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken() // 调用移除token的接口
      resolve() // 返回结果
    })
  },

  // 动态修改权限
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo') // 在模块中调用其他方法

    resetRouter()

    // 基于角色生成可访问的路线图
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // 动态添加可访问的路由
    router.addRoutes(accessRoutes)

    // 重置已访问视图和缓存视图
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true, // 名称空间
  state,
  mutations,
  actions
}
