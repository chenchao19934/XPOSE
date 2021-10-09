const chalk = require('chalk')

const accessTokens = {
  admin: 'admin-accessToken',
  editor: 'editor-accessToken',
  test: 'test-accessToken',
}

module.exports = [
  {
    url: '/cgi-bin/login',
    type: 'post',
    response(config) {
      const { userName } = config.body
      const accessToken = accessTokens[userName]
      if (!accessToken) {
        return {
          code: 500,
          msg: '帐户或密码不正确。',
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: {
          sessionID: 'xxx-94494949-xxxx',
        }
      }
    }
  },
  {
    url: '/cgi-bin/activate',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: {
          account: 'admin',
          passwd: '123'
        }
      }
    }
  }
]