// 使用详情查看  https://github.com/Inndy/vue-clipboard2
import Clipboard from 'clipboard'
if (!Clipboard) {
  throw new Error('您首先应该使用npm安装‘粘贴板’！') // 如果没有这个插件，就创造一个错误类型抛出让用户安装
}

// 别的文件要使用到这文件里面的函数或者变量才导出
// el是当前指令作用的那个Dom元素
export default {
  bind(el, binding) { // 指令第一次绑定到元素时调用，可以用来做初始化
    if (binding.arg === 'success') { // 如果给指令传递的参数等于success，拿到绑定的方法（binding.value）
      el._v_clipboard_success = binding.value // // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听，
    } else if (binding.arg === 'error') {
      el._v_clipboard_error = binding.value
    } else {
      const clipboard = new Clipboard(el, { // 不传上面那两个参数的情况下，就创建一个粘贴板
        text() { return binding.value }, // 返回所绑定的值
        action() { return binding.arg === 'cut' ? 'cut' : 'copy' } // 更改复制模式，设置如果传的参数不是cut就默认使用copy
      })
      // 成功
      clipboard.on('success', e => {
        const callback = el._v_clipboard_success // 拿到methods下的回调方法,这里不能在使用binding.value因为这个指令绑定了数据，不是函数了
        callback && callback(e) // eslint-disable-line
      })
      // 失败
      clipboard.on('error', e => {
        const callback = el._v_clipboard_error
        callback && callback(e) // eslint-disable-line
      })
      el._v_clipboard = clipboard
    }
  },
  update(el, binding) { // 所在组件的 VNode 更新时调用
    if (binding.arg === 'success') {
      el._v_clipboard_success = binding.value
    } else if (binding.arg === 'error') {
      el._v_clipboard_error = binding.value
    } else {
      el._v_clipboard.text = function() { return binding.value }
      el._v_clipboard.action = function() { return binding.arg === 'cut' ? 'cut' : 'copy' }
    }
  },
  unbind(el, binding) { // 只调用一次，指令与元素解绑时调用,可以理解为销毁时
    if (binding.arg === 'success') {
      delete el._v_clipboard_success
    } else if (binding.arg === 'error') {
      delete el._v_clipboard_error
    } else {
      el._v_clipboard.destroy() // 实例销毁
      delete el._v_clipboard // 删除这个私有变量
    }
  }
}
