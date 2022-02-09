//设置相应数据，用户token
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  },
}

//设置相应数据，用户信息
const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: '我是一名超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: '我是一名管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // 用户登录
  {
    url: '/vue-element-admin/user/login',   //请求地址
    type: 'post',   //因为是post请求，所以肯定有数据从前台传过来
    response: config => {   //响应体
      const { username } = config.body  //外面传进来的数据,其中传进来的用户名是admin
      const token = tokens[username]    //拿到tokens下admin的值
      //模拟错误
      if (!token) {   //做一些逻辑判断，当没有token时，返回相应数据
        return {
          code: 60204,
          message: '帐户和密码不正确.'
        }
      }

      return {    //响应放回给客户端的数据
        code: 20000,
        data: token,  //所以这里是{token: 'admin-token'}
      }
    }
  },

  // 得到哦用户信息
  {
    url: '/vue-element-admin/user/info\.*',   //    .*   是因为使用query，所以会在地址后面带上其他信息
    type: 'get',    //因为是get请求所以，直接返回数据就行
    response: config => {
      const { token } = config.query    //获取发送请求所携带的token
      const info = users[token]

      // 如果没有对应的info
      if (!info) {
        return {
          code: 50008,
          message: '登录失败，无法获取用户详细信息.'
        }
      }
      return {
        code: 20000,
        data: info,
      }
    }
  },

  // 用户退出,告知成功即可
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success',
      }
    }
  }
]
