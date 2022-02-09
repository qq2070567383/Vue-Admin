const state = {
  logs: [] // 错误日记
}

const mutations = {
  ADD_ERROR_LOG: (state, log) => { // 添加日志
    state.logs.push(log)
  },
  CLEAR_ERROR_LOG: (state) => { // 清除日志
    state.logs.splice(0) // splice(0) 会把原数组清空
  }
}

const actions = {
  addErrorLog({ commit }, log) {
    commit('ADD_ERROR_LOG', log)
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
