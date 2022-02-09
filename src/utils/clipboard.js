import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess() { // 复制成功之后弹出消息
  Vue.prototype.$message({
    message: 'Copy successfully',
    type: 'success',
    duration: 1500
  })
}

function clipboardError() { // 复制失败之后弹出消息
  Vue.prototype.$message({
    message: 'Copy failed',
    type: 'error'
  })
}
// text  复制的内容
// event   触发复制的节点
export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => { // 复制成功之后弹出消息，并且销毁粘贴板
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => { // 复制失败之后弹出消息，并且销毁粘贴板
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
