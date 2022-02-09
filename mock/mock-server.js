const chokidar = require('chokidar')    //监听文件变化
const bodyParser = require('body-parser')   //解析http请求体
const chalk = require('chalk')    //控制台输出着色
const path = require('path')    //导入路径，用来处理相对和绝对路径
const Mock = require('mockjs')    //导入mockjs，用来模拟数据

//path.join方法用于连接路径，
//process.cwd() 是当前Node.js进程执行时的文件夹地址——工作目录
// 获取mock静态返回数据所在的目录
const mockDir = path.join(process.cwd(), 'mock')  

//已经登记的路由
function registerRoutes (app) {
  let mockLastIndex
  const { mocks } = require('./index.js')
  const mocksForServer = mocks.map(route => {
    return responseFake(route.url, route.type, route.response)
  })
  for (const mock of mocksForServer) {
    app[mock.type](mock.url, mock.response)
    mockLastIndex = app._router.stack.length
  }
  const mockRoutesLength = Object.keys(mocksForServer).length
  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength
  }
}

//未注册的路由
function unregisterRoutes () {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}

// 对url进行正则匹配，默认类型设置为get，判断respond是不是一个函数是的话就传入req和res
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`${process.env.VUE_APP_BASE_API}${url}`),
    type: type || 'get',
    response (req, res) {
      console.log('request invoke:' + req.path)
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

module.exports = app => {
  // parse app.body
  // https://expressjs.com/en/4x/api.html#req.body  
   //添加插件
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  const mockRoutes = registerRoutes(app)
  var mockRoutesLength = mockRoutes.mockRoutesLength
  var mockStartIndex = mockRoutes.mockStartIndex

  // 监视文件，热重新加载模拟服务器
  chokidar.watch(mockDir, {
    ignored: /mock-server/,
    ignoreInitial: true
  }).on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      try {
        // remove mock routes stack
        app._router.stack.splice(mockStartIndex, mockRoutesLength)

        // clear routes cache
        unregisterRoutes()

        const mockRoutes = registerRoutes(app)
        mockRoutesLength = mockRoutes.mockRoutesLength
        mockStartIndex = mockRoutes.mockStartIndex

        console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })
}
