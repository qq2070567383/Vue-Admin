<template>
  <div class="dashboard-container">
    <!-- 动态切换组件 -->
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles' // 从vuex立马得到角色名
    ])
  },
  created() {
    if (!this.roles.includes('admin')) { // 如果当前角色中不包括admin，那么就加载editorDashboard组件
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
