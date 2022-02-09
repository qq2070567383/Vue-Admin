/**
  底部按钮点击实现波纹效果
 */

// Object.assign合并对象
export default function(e, arg_opts) {
  var opts = Object.assign({
    ele: e.target, // 波纹作用元素
    type: 'hit', // hit点击位置扩散center中心点扩展
    bgc: 'rgba(0, 0, 0, 0.15)' // 波纹颜色
  }, arg_opts)
  var target = opts.ele // 得到传递过来的目标对象
  if (target) {
    var rect = target.getBoundingClientRect() // 得到目标元素位置，返回的是一个对象
    var ripple = target.querySelector('.e-ripple')
    if (!ripple) { // 如果没有这个元素就用span创建一个class名为e-ripple的元素，追加到目标元素下
      ripple = document.createElement('span')
      ripple.className = 'e-ripple'
      ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px'
      target.appendChild(ripple)
    } else {
      ripple.className = 'e-ripple'
    }

    // switch case循环语句，如果条件的值和case的值匹配上了就执行，下面的代码
    switch (opts.type) {
      case 'center':
        ripple.style.top = (rect.height / 2 - ripple.offsetHeight / 2) + 'px'
        ripple.style.left = (rect.width / 2 - ripple.offsetWidth / 2) + 'px'
        break
        // 设置默认值执行代码为：
      default:
        ripple.style.top = (e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop) + 'px'
        ripple.style.left = (e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft) + 'px'
    }
    ripple.style.backgroundColor = opts.bgc // 设置颜色
    ripple.className = 'e-ripple z-active' // 设置类名
    return false
  }
}
