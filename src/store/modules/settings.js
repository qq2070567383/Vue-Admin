// 右边设置相关
import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme, // 主题
  showSettings: showSettings, // 显示设置
  tagsView: tagsView, // 显示标签
  fixedHeader: fixedHeader, // 固定头部
  sidebarLogo: sidebarLogo // 显示logo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) { // 如果对象中有这个属性，那么那个属性的值就等于该值
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

