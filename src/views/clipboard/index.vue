<!--粘贴板组件，这里使用两种方法来实现粘贴板，分别是直接使用和用指令的方式调用-->
<template>
  <!-- 使用了element里面的tabs标签页，放置一个输入框和按钮 -->
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="直接使用剪贴板" name="directly">
        <el-input v-model="inputData" placeholder="Please input" style="width:400px;max-width:100%;" />
        <el-button type="primary" icon="el-icon-document" @click="handleCopy(inputData,$event)">
          copy
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="按指令使用剪贴板" name="v-directive">
        <el-input v-model="inputData" placeholder="Please input" style="width:400px;max-width:100%;" />
        <!-- 复制成功之后执行 clipboardSuccess方法，-->
        <el-button v-clipboard:copy="inputData" v-clipboard:success="clipboardSuccess" type="primary" icon="el-icon-document">
          copy
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // 使用指令
import clipboard from '@/directive/clipboard/index.js' // 导入粘贴板指令

export default {
  name: 'ClipboardDemo',
  directives: { // 注册指令
    clipboard
  },
  data() {
    return {
      activeName: 'directly', // 设置默认展示项
      inputData: 'https://github.com/PanJiaChen/vue-element-admin' // 绑定的数据
    }
  },
  methods: {
    handleCopy(text, event) {
      clip(text, event)
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

