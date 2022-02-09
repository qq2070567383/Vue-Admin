const Mock = require('mockjs')

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {   //之所以采用遍历生成的方式，是因为待会对这些数据进行操作
  NameList.push(Mock.mock({
    name: '@cname'    //中文姓名
  }))
}
NameList.push({ name: 'mock-Pan' })

module.exports = [
  // 用户名搜索
  {
    url: '/vue-element-admin/search/user',
    type: 'get',
    response: config => {
      const { name } = config.query   //取到提交过来的name
      const mockNameList = NameList.filter(item => {
        const lowerCaseName = item.name.toLowerCase()     //字符串转化为 小写
        return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
      })
      return {
        code: 20000,
        data: { items: mockNameList }
      }
    }
  },

  // 首页交易清单
  {
    url: '/vue-element-admin/transaction/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: 20,
          'items|20': [{
            order_no: '@guid()',    //唯一标识符
            timestamp: +Mock.Random.date('T'),
            username: '@cname',   //生成中文姓名
            price: '@float(1000, 15000, 0, 2)',   //随机生成1000到15000之间的带两位小数的数
            'status|1': ['success', 'pending']    //有50%的几率生成'success', 'pending'
          }]
        }
      }
    }
  }
]
