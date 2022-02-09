import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters' // 导入getters

Vue.use(Vuex)

// 下面这段代码的主要作用就是匹配modules文件夹下的所有.js文件（vuex模块）

// 定义了一个函数，这个函数的作用是 返回所有的 .js的文件
// require.context()第一个参数是要搜索的目录，第二个表达式是正则表达式pipe所有.js的文件
const modulesFiles = require.context('./modules', true, /\.js$/) // 参考 https://webpack.js.org/guides/dependency-management/#requirecontext

// keys 是一个函数，它返回上下文模块可以处理的所有可能请求的数组
// array.reduce( function( total, currentValue, currentIndex, arr ),  initialValue )

// modulePath是当前元素

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // console.log(modules, modulePath);
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath) // 传入要搜素的目录,返回模块
  // console.log(value);
  modules[moduleName] = value.default // obj[key]只有在循环中这样写才代表键，value.default就是返回的所有模块
  return modules
}, {}) // { } 是默认值

// 模块化开发要求modules是一个对象，里面放的是每一个小模块
const store = new Vuex.Store({
  modules, // 这里面放的是state 和 mutations，actions
  getters // 这里面放的是getters，用来简化state里面的数据
})

export default store
