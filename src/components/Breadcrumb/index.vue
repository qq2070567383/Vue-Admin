  <!-- 面包屑组件-->
<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/"
  >
    <!-- vue过度动画 -->
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item,index) in levelList"
        :key="item.path"
      >
        <!-- 如果 item.redirect==='noRedirect'或者是最后一个，那么使用span，否则就用a标签来进行跳转-->
        <span
          v-if="item.redirect==='noRedirect'||index==levelList.length-1"
          class="no-redirect"
        >{{ item.meta.title }}</span>
        <a
          v-else
          @click.prevent="handleLink(item)"
        >{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
// 导入url正则匹配
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null // 当前匹配的路由组
    }
  },
  watch: {
    $route(route) {
      // 如果转到重定向页面，请不要更新面包屑
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // 只显示路由的mate上面的标题
      // this.$route.matched  匹配当前页面路由所在层级，显示为数组
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      console.log(matched)
      const first = matched[0]
      // 如果没有值
      if (!this.isDashboard(first)) {
        // matched把参数连接到数组中去
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }
      // 过滤每一项然后返回一个数组，要求每一项里面有item.meta 并且有 item.meta.title 并且 item.meta.breadcrumb !不是 false
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },

    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      // rim()方法的作用是去掉字符串两端的多余的空格
      // toLocaleLowerCase()   字符转化为小写
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    // 将参数插入到路劲里面去
    pathCompile(path) {
      const { params } = this.$route
      // 定义一个url路径正则表达式匹配规则
      // compile()
      // 作用：快速填充 url 字符串的参数值
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    // 点击跳转
    handleLink(item) {
      // 解构出redirect, path
      const { redirect, path } = item
      // 如果有重定向就跳转到redirect
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
// 设置主盒子样式
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  //设置a标签样式
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
