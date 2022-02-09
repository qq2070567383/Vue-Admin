const Mock = require('mockjs')
const { param2Obj } = require('./utils')

const user = require('./user')
const role = require('./role')
const article = require('./article')
const search = require('./remote-search')   //导入4个接口数据

// ...展开运算符，提取数据
const mocks = [
  ...user,
  ...role,
  ...article,
  ...search
]

//正面模拟
//请谨慎使用，它将重新定义XMLHttpRequest，
//这将导致许多第三方库无效（如progress event）。
function mockXHR () {
  // 模拟补丁
  // https://github.com/nuysoft/Mock/issues/300
  // 引入mockjs导致XHR无法携带cookie的问题
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false
      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap (respond) {
    return function (options) {
      let result = null
      if (respond instanceof Function) {    //instanceof 就是判断一个实例是否属于某种类型
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    //数据模拟使用，url使用正则表达式匹配mocks下每一项的url，请求方法使用每一项的url，没有的话就默认使用get，路径使用每一项的响应
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

module.exports = {
  mocks,
  mockXHR
}
