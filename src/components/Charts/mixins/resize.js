// 默认导入index
// 混入，就是有很多组件需要同一个方法。同一个变量。做同样的事。
// 导入防抖

// 它的作用是做到页面大小变化时，图表进行响应式调整大小
import { debounce } from '@/utils'

export default {
  data() {
    return {
      $_sidebarElm: null, // 控制页面大小变化侧边框进行显示隐藏
      $_resizeHandler: null // 控制页面大小变化图表进行刷新
    }
  },
  mounted() {
    this.initListener()
  },
  // keep-alive 缓存组件的时候调用
  activated() {
    // 页面活动的时候，它是一个函数不在是null
    if (!this.$_resizeHandler) {
      // 避免重复初始化
      this.initListener()
    }
    // 激活“保持活动状态”图表时，自动调整大小
    this.resize()
  },
  // 页面销毁时
  beforeDestroy() {
    this.destroyListener()
  },
  // 缓存组件被卸载的时候调用
  deactivated() {
    this.destroyListener()
  },
  methods: {
    // 事件的名字
    $_sidebarResizeHandler(e) {
      // 如果过度的是宽度
      if (e.propertyName === 'width') {
        this.$_resizeHandler()
      }
    },
    initListener() {
      // 防抖函数，限制窗口在100毫秒内进行刷新
      this.$_resizeHandler = debounce(() => {
        this.resize()
      }, 100)
      // 页面监听窗口大小变化
      window.addEventListener('resize', this.$_resizeHandler)
      // 菜单栏全局监听过渡事件，实现页面太窄时，进行折叠
      this.$_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      this.$_sidebarElm && this.$_sidebarElm.addEventListener('transitionend', this.$_sidebarResizeHandler)
    },
    // 页面销毁时
    destroyListener() {
      // 页面移除对窗口大小变化的监听
      window.removeEventListener('resize', this.$_resizeHandler)
      this.$_resizeHandler = null
      // 菜单栏移除对全局过渡事件的监听
      this.$_sidebarElm && this.$_sidebarElm.removeEventListener('transitionend', this.$_sidebarResizeHandler)
    },

    // resize() --- echarts自带方法，在容器大小发生改变时，改变图表尺寸，需要手动调用，同时让this始终指向chaart
    resize() {
      const { chart } = this
      console.log(this)
      // echart 图表随着页面的大小而变化大小和刷新图表
      chart && chart.resize()
    }
  }
}
