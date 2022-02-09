// url路径参数转对象函数
function param2Obj(url) {
  //decodeURIComponent函数，对URI进行解码
  // 把erl以？隔开，然后解码，最后用正则去掉空格
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g  ,  ' ')  
  if (!search) {
    return {}
  }
  const obj = {}
  // 把search，以&分隔
  const searchArr = search.split('&')
  // 进行遍历，查找每一项中是否有 = ，如果有就进行字符串的截取，=左边的为键 ，右边的为值，以此来构建对象
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

// 一个简单的深拷贝函数
function deepClone(source) {
  if (!source && typeof source !== 'object') {    //如果传进来的对象没有，且类型不是对象，那么就直接抛出一个错误类型
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}    //判断构造器是不是数组类型
  Object.keys(source).forEach(keys => {   //遍历递归实现深拷贝，只要有每一项，并且类型是对象就继续调用函数
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

module.exports = {
  param2Obj,  //暴露这两个工具函数
  deepClone
}
