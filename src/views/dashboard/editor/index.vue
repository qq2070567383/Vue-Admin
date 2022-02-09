<!-- 普通管理员组件 -->
<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <!-- 头像组件 -->
      <pan-thumb :image="avatar" style="float: left">
        你的角色是:
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
      </pan-thumb>
      <!-- 右上角小猫咪 -->
      <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />
      <!-- 头像旁边几个大字 -->
      <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">Editor's Dashboard</span>
      </div>
    </div>
    <!-- 人物走路动图 -->
    <div>
      <img :src="emptyGif" class="emptyGif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 通过mapGetters在计算属性中直接导入state中的数据
import PanThumb from '@/components/PanThumb' // 导入头像组件
import GithubCorner from '@/components/GithubCorner' // 导入小猫咪组件

export default {
  name: 'DashboardEditor',
  components: { PanThumb, GithubCorner },
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3' // 一张动图
    }
  },
  computed: {
    ...mapGetters([
      'name', // 从vuex中导入名字，角色，头像gif
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
