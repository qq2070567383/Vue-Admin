import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 页面刷新时顶部出现进度条
import 'nprogress/nprogress.css' // 进度条样式文件
import { getToken } from '@/utils/auth' // 得到token
import getPageTitle from '@/utils/get-page-title' // 导入网页标题

NProgress.configure({ showSpinner: false }) // 关闭加载旋转器，将其设置为false。(默认值：true)

const whiteList = ['/login', '/auth-redirect'] // 设置没用重定向的白名单

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  // 启动进度条
  NProgress.start()

  // 动态设置网页标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已经登录，
  const hasToken = getToken()

  // 如果hasToken有值，也就是说明登录了
  if (hasToken) {
    // 如果要去的路劲是/login那么就把他重定向到根路径也就是dashboard页面（因为在router里面 / 被重定向到了/dashboard）
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // 完成进度条，详情看: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 如果去的是其它页面，并且有权限
      const hasRoles = store.getters.roles && store.getters.roles.length > 0 // 或与非返回的是布尔值

      // 如果有权限角色就放行
      if (hasRoles) {
        next()
        // 没有角色权限就再获取一下
      } else {
        try {
          // 通过接口向后台请求用户角色
          // this.$store.dispatch() 是用来传值给vuex的mutation改变state
          const { roles } = await store.dispatch('user/getInfo') // 往叫user的vuex模块中提交getInfo方法，然后得到roles

          const accessRoutes = await store.dispatch('permission/generateRoutes', roles) // 往叫permission的vuex模块中提交getInfo方法，然后得到accessRoutes（可访问路由）
          // 动态添加可访问的路由
          router.addRoutes(accessRoutes)
          // 设置replace:true，这样导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error)
          // 删除token并转到登录页面重新登录
          await store.dispatch('user/resetToken') // 往叫user的vuex模块中提交resetToken方法
          Message.error(error || '有错误！') // 提示有错误
          next(`/login?redirect=${to.path}`) // 跳转到登录页面
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token的情况下可以去这些白名单这些页面
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 其他的就跳转到登录页面获取token
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 路由后置守卫
router.afterEach(() => {
  NProgress.done()
})
