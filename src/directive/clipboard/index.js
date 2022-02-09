import Clipboard from './clipboard'

const install = function(Vue) {
  Vue.directive('Clipboard', Clipboard) // 注册全局指令
}

if (window.Vue) {
  window.clipboard = Clipboard
  Vue.use(install); // eslint-disable-line
}

Clipboard.install = install // 对象Clipboard下的install属性为自定义指令
export default Clipboard
