// 在main.js中要导入 vue  .App  store  router
// Vue.use() 的作用是，将插件挂载在vue上面，好全局使用
// 再导入文件时使用 * as xxx 的情况是，想导入一个文件中所有的被export导出的函数或变量
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // 初始化css文件，这个文件是通过npm安装的，所以直接导入

import Element from 'element-ui' // 导入element和相关样式
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // 自己写的初始化全局样式

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // 判断用户的权限
import './utils/error-log' // error log

import * as filters from './filters' // 全局过滤器

console.log(process.env.NODE_ENV)
/**
*如果您不想使用模拟服务器
*您想将MockJs用于mockapi
*您可以执行：mockXHR（）
*
*目前，MockJs将用于生产环境，
*请在上网前将其删除！
*/

// process.env.NODE_ENV 这是一个变量用来识别当前环境
// 如果当前环境是生产环境就使用mock。js
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock') // 导入mock中的mockXHR方法
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // 设置element默认大小票，可参考 https://element.eleme.cn/#/zh-CN/component/quickstart
  locale: enLang // 如果使用中文，无需设置，请删除
})

// 注册全局过滤器，导入的是一个对象，所以使用Object.keys（）方法，得到一个由key组成的数组，遍历数据，让key作为全局过滤器的名字，后边的是key对应的处理函数
// 返回一个由对象属性所组成的一个数组
// 作用是：让每个过滤器的名字都全局注册
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 阻止控制台生产启动消息
Vue.config.productionTip = false

// 创建vue实例，然后挂载
new Vue({
  el: '#app',
  router,
  store, // 从根组件向所有子组件，以 store 选项的方式“注入”该 store 的机制
  render: h => h(App)
})
