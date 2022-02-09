<template>
  <div :class="classObj" class="app-wrapper">
    <!--如果设备是移动设备，并且被侧边框打开时，点击隐藏遮罩层-->
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- 侧边框 -->
    <sidebar class="sidebar-container" />
    <!-- 右边主要内容区域 -->
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <!-- 最上边导航 -->
        <navbar />
        <!-- 标签视图 -->
        <tags-view v-if="needTagsView" />
      </div>
      <!-- 路由视图 -->
      <app-main />
      <!-- 右边设置 -->
      <right-panel v-if="showSettings">
        <!-- 设置 -->
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
// 导入右面板组件
import RightPanel from '@/components/RightPanel'
// 导入主视图，导航栏，设置，侧边框，标签视图
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
// 导入混入
import ResizeMixin from './mixin/ResizeHandler'
// 导入mapState用于在计算属性中获取仓库数据
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  // 注册模块
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  // 注册混入
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      // 导入相应数据
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() { // 放回一个对象
      return {
        hideSidebar: !this.sidebar.opened, // 隐藏边框
        openSidebar: this.sidebar.opened, // 展开边框
        withoutAnimation: this.sidebar.withoutAnimation, // 关闭动画
        mobile: this.device === 'mobile' // 设备
      }
    }
  },
  methods: {
    handleClickOutside() {
      // 设置在移动设备下，点击侧边框外的遮罩层时，侧边框收缩是否带动画
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
