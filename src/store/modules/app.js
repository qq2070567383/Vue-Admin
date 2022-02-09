import Cookies from 'js-cookie'

const state = {
  sidebar: {
    //    Cookies.get(‘sidebarStatus’))的意思是取出来的是"1"或 “0”
    //    !!+Cookies.get(‘sidebarStatus’)的意思是!false或 !true , 对布尔值进行取反, 会得到对应的布尔值
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true, // 是否展开
    withoutAnimation: false // 设置动画
  },
  device: 'desktop', // 设备为电脑
  size: Cookies.get('size') || 'medium'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false // 设置动画
    if (state.sidebar.opened) { // 如果为true，cookies就创建一个名为'sidebarStatus'值为1的对象
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => { // 关闭侧边框
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => { //  切换设备
    state.device = device
  },
  SET_SIZE: (state, size) => { // 设置侧边栏大小
    state.size = size
    Cookies.set('size', size)
  }
}

const actions = {
  toggleSideBar({ commit }) { // 切换边框
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) { // 关闭边框
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) { // 切换设备
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) { // 设置大小
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
