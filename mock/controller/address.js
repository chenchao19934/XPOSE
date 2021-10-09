module.exports = [
  {
    url: '/cgi-bin/getDevIP',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        data: {
          ip: '113.142.81.49',
          mac: '18-31-BF-07-EA-5E',
        }
      }
    }
  }
]