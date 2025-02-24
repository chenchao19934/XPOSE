/**
 * @author chenchao
 * @description 导入所有 controller 模块，浏览器环境中自动输出controller文件夹下Mock接口。
 */
import Mock from 'mockjs'
import { paramObj } from '@/utils'

const mocks = []
const files = require.context('../../mock/controller', false, /\.js$/)

files.keys().forEach((key) => {
  mocks.push(...files(key))
})


/**
 * @author chenchao
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
function paramObj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

export function mockXHR() {
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

  function XHRHttpRequst(respond) {
    return function (options) {
      let result
      if (respond instanceof Function) {
        const { body, type, url } = options
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: paramObj(url),
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  mocks.forEach((item) => {
    Mock.mock(
      new RegExp(item.url),
      item.type || 'get',
      XHRHttpRequst(item.response)
    )
  })
}
