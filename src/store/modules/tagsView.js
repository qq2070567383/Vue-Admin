const state = {
  visitedViews: [], // 头部显示的标签
  cachedViews: [] // 缓存的标签
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => { // 添加浏览标签
    // 防止重复增加被浏览过的标签
    if (state.visitedViews.some(v => v.path === view.path)) return // some检测数组中是否有一项满足条件
    // 用路由中的标签去合并tags标签的名字
    state.visitedViews.push(
      Object.assign({}, view, { // Object.assign() 对象合并 浅拷贝
        title: view.meta.title || 'no-name'
      })
    )
  },
  ADD_CACHED_VIEW: (state, view) => { // 增加缓存标签
    // console.log(state.cachedViews);
    if (state.cachedViews.includes(view.name)) return // 防止重复缓存标签
    if (!view.meta.noCache) { // 如果路由中的nocachw为false就缓存标签
      state.cachedViews.push(view.name)
    }
  },

  DEL_VISITED_VIEW: (state, view) => { // 删除浏览标签
    // console.log(state.visitedViews);
    // 遍历数组对象，得到该对象所在下标
    for (const [i, v] of state.visitedViews.entries()) { // entries()返回值：给定对象自身可枚举属性的键值对数组。
      if (v.path === view.path) { // 如果删除的那一项的path等于state.visitedViews中其中某项的path，就把它删掉
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => { // 删除缓存标签
    // view.name点击那一页的name
    // state.cachedViews仓库中已经被点击的值
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => { // 删除其它浏览过的tags标签，也就是被删除的标签不是当前显示的标签
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => { // 删除其他缓存标签，只留下当前这个显示的标签，用于用户退出在进来依旧能显示退出之前的页面
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // 如果index=-1，则不存在缓存的标记
      state.cachedViews = []
    }
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // 保留标签
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix) // 过滤得到每一项有affix的一个数组
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: state => { // 删除全部缓存，数组cachedViews清空
    state.cachedViews = []
  },

  UPDATE_VISITED_VIEW: (state, view) => { // 刷新tags
    for (let v of state.visitedViews) { // 遍历得到state.visitedViews下所有的浏览tag，对比其中某项是否等于被点击的那一项的path，是的话就把该项合并
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  addView({ dispatch }, view) { // 提交这个addView方法就执行addVisitedView和addCachedView这两个方法
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) { // 增肌浏览tag   提交一个addVisitedView的异步方法，通过mutations改变state改变里面的值
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) { // 增加缓存tags
    commit('ADD_CACHED_VIEW', view)
  },

  delView({ dispatch, state }, view) { // 删除tags
    return new Promise(resolve => { // 放回一个Promise的resolve状态，当使用 .then调用resolveh回调函数时，里面的参数就是这里的参数
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view) { // 删除浏览标签
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view) // 提交一个DEL_VISITED_VIEW方法，修改浏览标签
      resolve([...state.visitedViews]) // [...state.visitedViews]剩下的浏览标签
    })
  },
  delCachedView({ commit, state }, view) { // 删除缓存标签
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view) // 提交一个DEL_CACHED_VIEW方法，修改缓存标签
      resolve([...state.cachedViews]) // [...state.cachedViews]剩下的缓存标签
    })
  },
  // 外面往仓库提交一个dispatch( ) ,就会得到一个Promise成功的回调函数，里面包括了一个参数，这个参数将来用在 .then里面的第一个回调里面
  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews({ commit, state }, view) { // 删除其它浏览标签
    return new Promise(resolve => { // 修改DEL_OTHERS_VISITED_VIEWS，并且执行resolve回调
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }, view) { // 删除其它缓存标签
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delAllViews({ dispatch, state }, view) { // 删除全部标签
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews({ commit, state }) { // 删除全部浏览标签
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews({ commit, state }) { // 删除全部缓存标签
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },

  updateVisitedView({ commit }, view) { // 刷新浏览标签
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
