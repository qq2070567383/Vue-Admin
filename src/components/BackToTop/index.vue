  <!-- 放回顶部组件-->
<template>
  <!-- 设置vue过度动画 -->
  <transition :name="transitionName">
    <div
      v-show="visible"
      :style="customStyle"
      class="back-to-ceiling"
      @click="backToTop"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 17 17"
        xmlns="http://www.w3.org/2000/svg"
        class="Icon Icon--backToTopArrow"
        aria-hidden="true"
        style="height:16px;width:16px"
      >
        <path d="M12.036 15.59a1 1 0 0 1-.997.995H5.032a.996.996 0 0 1-.997-.996V8.584H1.03c-1.1 0-1.36-.633-.578-1.416L7.33.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.004z" />
      </svg>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BackToTop',
  props: {
    // 隐藏高度
    visibilityHeight: {
      type: Number,
      default: 400
    },
    // 返回位置
    backPosition: {
      type: Number,
      default: 0
    },
    // 动态绑定样式，可以是对象，可以写在props或data里面,如果样式带 - 可以使用' ' 包裹,或者用驼峰
    customStyle: {
      type: Object,
      default: function() {
        return {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          'borderRadius': '4px',
          'lineHeight': '45px',
          background: '#e7eaf1'
        }
      }
    },
    // 过度名字
    transitionName: {
      type: String,
      default: 'fade'
    }
  },
  data() {
    return {
      visible: false, // 设置盒子是否隐藏
      interval: null, // 定时器标识符
      isMoving: false // 盒子是否移动，移动就改为true
    }
  },
  // don加载后
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  // 页面销毁前
  beforeDestroy() {
    // 移除事件，清除定时器
    window.removeEventListener('scroll', this.handleScroll)
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    handleScroll() {
      // 窗口被卷去的高度，大于400就显示
      this.visible = window.pageYOffset > this.visibilityHeight
    },
    // 返回动画
    backToTop() {
      // 如果isMoving为true就不执行返回函数，用它来控制是否可以返回
      if (this.isMoving) return
      // 窗口目前的高度
      const start = window.pageYOffset
      console.log(start)
      let i = 0
      this.isMoving = true
      // 一点击，就在一定时间内放回到顶部
      this.interval = setInterval(() => {
        const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500))
        console.log(next)
        // 如果当前屏幕被卷曲的高度小于0时，位置为（0,0）
        if (next <= this.backPosition) {
          window.scrollTo(0, this.backPosition)
          clearInterval(this.interval)
          this.isMoving = false
        } else {
          window.scrollTo(0, next)
        }
        i++
      }, 16.7)
    },
    // 运动速度函数
    easeInOutQuad(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b
      return -c / 2 * (--t * (t - 2) - 1) + b
    }
  }
}
</script>

<style scoped>
.back-to-ceiling {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}

.back-to-ceiling:hover {
  background: #d5dbe7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.back-to-ceiling .Icon {
  fill: #9aaabf;
  background: none;
}
</style>
