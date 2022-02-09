<template>
  <div class="login-container">
    <!--
      :model：表单数据
      :rules：表单验证规则
      label-position 子项对齐方式
      lable-position 和 label-width  一起使用才会生效
    -->
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">

      <div class="title-container">
        <h3 class="title">登录表单</h3>
      </div>

      <!--
        prop  绑定规则，规制都是写在表单上的
       -->
      <el-form-item prop="username">
        <!-- 字体图标 -->
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!--
        v-model  绑定数据
        placeholder   占位符，只有在input输入框中有用
        type  输入框类型
        name 原生属性---也就是原生input中的name属性
        tabindex  设置键盘上的tab键第一次点击就聚焦到那去
        autocomplete  自动补全---只有输入框有这个属性
        -->
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <!--
        v-model  是否可见
        content 提示内容
        placement  显示位置
        manual 手动控制模式 ---鼠标移入和移除不在出现提示，只有点击了被包裹的元素才会显示隐藏
       -->
      <el-tooltip v-model="capsTooltip" content="大写锁定已打开！" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>

          <!--
            @blur="capsTooltip = false"   表示失去焦点的时候，隐藏提示
            @keyup.enter.native="handleLogin"  键盘按下回车键登录
            :type="passwordType"  之所以动态绑定类型是，点击小眼睛后变成文本标签
           -->
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <!-- 小眼睛字体图标 -->
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <!--
        type  按钮类型
        .native  在组件是使用原生事件
        .prevent  阻止默认事件
        :loading  按钮加载中，之所以动态绑定是因为不能一直一个状态
       -->
      <!-- 登录按钮 -->
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <!-- 底部提示 -->
      <div style="position:relative">
        <div class="tips">
          <span>用户名 : admin</span>
          <span>密码 : 随便</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">用户名 : editor</span>
          <span>密码 : 随便</span>
        </div>

        <!-- 联系我们按钮 -->
        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          联系我们
        </el-button>
      </div>
    </el-form>

    <!-- 模拟失败，弹出框 -->
    <el-dialog title="Or connect with" :visible.sync="showDialog">
      无法在本地模拟，因此请结合您自己的业务模拟！！
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate' // 验证用户账号
import SocialSign from './components/SocialSignin' // qq微信登录组件

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    // 自定义验证规则要写在data下面
    // 验证用户名
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) { // 如果账户不是'admin', 'editor'中的一个就调用callback抛出错误，callback规定了必须调用
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin', // 登录账户
        password: '111111' // 登录密码
      },
      loginRules: { // 登录账户密码验证规则
        // 必须，且失去焦点触发验证规则
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password', // 密码框类型
      capsTooltip: false, // 提示是否可见
      loading: false, // 按钮是否加载中
      showDialog: false, // 显示联系我们盒子
      redirect: undefined, // 重定向
      otherQuery: {} // 其它查询
    }
  },
  watch: {
    $route: { // 监听当前路由，数值改变执行handler方法
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true // 立即执行
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') { // 如果组件一加载账号和密码框里面没有内容，那么就让它自动聚焦
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) { // 检测大写是否开启
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() { // 显示密码
      if (this.passwordType === 'password') { // 一点小眼睛，如果当前输入框的类型是密码类型，那么就让改变他的类型为空，否则就为密码类型
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => { // dom结构随数据改变这样的操作都应该放进this.$nextTick()的回调函数中
        this.$refs.password.focus()
      })
    },
    handleLogin() { // 点回车时，对账户密码进行验证，验证通过就请求接口
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true // 开始加载转圈动画
          this.$store.dispatch('user/login', this.loginForm) // 调用接口，提交账户密码
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery }) // 请求接口成功之后，再进行路由跳转，并且携带this.otherQuery参数
              this.loading = false // 暂停动画
            })
            .catch(() => { // 请求失败停止转圈动画
              this.loading = false
            })
        } else {
          console.log('error submit!!') // 验证不通过就打印错误
          return false
        }
      })
    },
    getOtherQuery(query) {
      // Object.keys(),放回一个由属性组成的数组
      // reduce 为数组中的每一个元素依次执行回调函数，必须要有return
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') { // 当前值不等于redirect，那么acc对象下的cur的值就为query下的cur
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
