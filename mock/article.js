const Mock = require('mockjs')

const List = []   //总数据列表
const count = 100   //循环的一个变量

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {     //随机模拟数据，生成100条
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: 'mock data',
    content: baseContent,   //测试文本
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,    //测试图片
    platforms: ['a-platform']
  }))
}

module.exports = [    
  // 得到数据条数
  {
    url: '/vue-element-admin/article/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query      //config.query用户请求这个地址所传的参数，设置了默认值

      console.log(importance);
      let mockList = List.filter(item => {    //过滤重要性，类型，标题
        if (importance && item.importance !== +importance) return false   //注意这里的+是转换为数字类型，它单独使用的时候是可以直接转的，和人运算的时候不会转
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {   //如果分类等于 -id 那么就撤销模拟
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))    //提取对应页面的对应条数数据

      return {
        code: 20000,
        data: {
          total: mockList.length,   //符合条件的所有数据数目
          items: pageList,     //符合条件的所有数据
        }
      }
    }
  },

  //通过id得到那篇文章的所有数据
  {
    url: '/vue-element-admin/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article   //返回对应id的那篇文章
          }
        }
      }
    }
  },

  //获取页面访问量
  {
    url: '/vue-element-admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  //文章创建成功
  {
    url: '/vue-element-admin/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  //文章更新成功
  {
    url: '/vue-element-admin/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

