<!-- 头像上传-->
<template>
  <div class="components-container">
    <!-- 标题 -->
    <aside>This is based on
      <a class="link-type" href="//github.com/dai-siki/vue-image-crop-upload"> vue-image-crop-upload</a>.
      Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.
    </aside>

    <!-- 头像组件 -->
    <pan-thumb :image="image" />

    <!-- 上传按钮 -->
    <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
      Change Avatar
    </el-button>

    <!-- 提交图片 -->
    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      url="https://httpbin.org/post"
      lang-type="en"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper' // 导入提交图片组件
import PanThumb from '@/components/PanThumb' // 导入头像组件

export default {
  name: 'AvatarUploadDemo',
  components: { ImageCropper, PanThumb },
  data() {
    return {
      imagecropperShow: false, // 控制提交图片组件是否显示
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191' // 头衔地址
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style scoped>
  .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>

