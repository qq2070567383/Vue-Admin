<!-- 鼠标拖拽组件-->
<!--
  默认进行
  group="article"   设置为同一个组
  :set-data="setData"   设置值时的回调函数
  start (e)   元素移动开始前状态
  end (e)    元素移动开始后状态
-->
<template>
  <div class="dndList">
    <!-- 左边内容 -->
    <div
      :style="{width:width1}"
      class="dndList-list"
    >
      <!-- 标题 -->
      <h3>{{ list1Title }}</h3>
      <draggable
        :set-data="setData"
        :list="list1"
        group="article"
        class="dragArea"
      >
        <div
          v-for="element in list1"
          :key="element.id"
          class="list-complete-item"
        >
          <!-- 展示文本内容 -->
          <div class="list-complete-item-handle">
            {{ element.id }}[{{ element.author }}] {{ element.title }}
          </div>
          <!-- 展示删除小图标 -->
          <div style="position:absolute;right:0px;">
            <span
              style="float: right ;margin-top: -20px;margin-right:5px;"
              @click="deleteEle(element)"
            >
              <i
                style="color:#ff4949"
                class="el-icon-delete"
              />
            </span>
          </div>
        </div>
      </draggable>
    </div>

    <!-- 右边内容 -->
    <div
      :style="{width:width2}"
      class="dndList-list"
    >
      <h3>{{ list2Title }}</h3>
      <draggable
        :list="list2"
        group="article"
        class="dragArea"
      >
        <div
          v-for="element in list2"
          :key="element.id"
          class="list-complete-item"
        >
          <div
            class="list-complete-item-handle2"
            @click="pushEle(element)"
          >
            {{ element.id }} [{{ element.author }}] {{ element.title }}
          </div>
        </div>
      </draggable>
    </div>

    <!-- <div>
      <draggable @start="start"
                 @end="end"
                 group="article">
        <p v-for="d in list"
           :key="d.id">{{d.name}}</p>
        <button slot="footer">Add</button>
      </draggable>
    </div> -->

  </div>
</template>

<script>
import draggable from 'vuedraggable' // 导入vuedraggable

export default {
  name: 'DndList',
  components: { draggable },
  props: {
    list1: {
      type: Array, // 左边盒子数据
      default() {
        return []
      }
    },
    list2: { // 右边盒子数据
      type: Array,
      default() {
        return []
      }
    },
    list1Title: { // 左边盒子标题
      type: String,
      default: 'list1'
    },
    list2Title: { // 右边盒子标题
      type: String,
      default: 'list2'
    },
    width1: { // 右边盒子宽度
      type: String,
      default: '48%'
    },
    width2: { // 左边盒子宽度
      type: String,
      default: '48%'
    }
  },
  data() {
    return {
      // list: [
      //   { name: "John", id: 1 },
      //   { name: "Joao", id: 2 },
      //   { name: "Jean", id: 3 },
      //   { name: "Gerard", id: 4 }
      // ]
    }
  },
  methods: {
    // this.list1 下面每一项的id都不等于被点击那项的id，就返回true
    isNotInList1(v) {
      return this.list1.every(k => v.id !== k.id)
    },
    // this.list2 下面每一项的id都不等于被点击那项的id，就返回true
    isNotInList2(v) {
      return this.list2.every(k => v.id !== k.id)
    },
    // 删除左边内容
    deleteEle(ele) {
      // for of 遍历对象，如果被点击那一项的id等于list1下的某一项的id，那么就找到该项所在下标，把它用splice删除
      for (const item of this.list1) {
        console.log(item)
        if (item.id === ele.id) {
          const index = this.list1.indexOf(item)
          this.list1.splice(index, 1)
          break
        }
      }
      // 如果this.isNotInList2(ele)为true（也就是说点了删除，而且那行数据还不在list2里面），那么就在this.list2的头部插入该元素
      if (this.isNotInList2(ele)) {
        this.list2.unshift(ele)
      }
    },
    // 右边盒子一点击就往左边盒子中增加内容
    pushEle(ele) {
      // for of 遍历对象，如果被点击那一项的id等于list2下的某一项的id，那么就找到该项所在下标，把它用splice删除
      for (const item of this.list2) {
        if (item.id === ele.id) {
          const index = this.list2.indexOf(item)
          this.list2.splice(index, 1)
          break
        }
      }
      // 如果this.isNotInList2(ele)为true（也就是说点了该行，而且那行数据还不在list1里面），那么就在this.list1的后面插入该元素
      if (this.isNotInList1(ele)) {
        this.list1.push(ele)
      }
    },
    setData(dataTransfer) {
      // 为了避免火狐浏览器上的 bug
      // 详情请看 : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    }
    // start (e) {
    //   console.log(e)
    // },
    // end (e) {
    //   console.log(e)
    // },
  }
}
</script>

<style lang="scss" scoped>
.dndList {
  background: #fff;
  padding-bottom: 40px;
  &:after {
    content: '';
    display: table;
    clear: both;
  }
  .dndList-list {
    float: left;
    padding-bottom: 30px;
    &:first-of-type {
      margin-right: 2%;
    }
    .dragArea {
      margin-top: 15px;
      min-height: 50px;
      padding-bottom: 30px;
    }
  }
}

.list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  margin-top: 4px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}

.list-complete-item-handle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
}

.list-complete-item-handle2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}

.list-complete-item.sortable-chosen {
  //被选中目标的样式
  background: #4ab7bd;
}

.list-complete-item.sortable-ghost {
  //设置被拖动元素，到其它元素上时的样式
  background: #df6d9d;
}

.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
}
</style>
