import axios from '@/utils/require.js';
let loginAPI = process.env.NODE_ENV !== 'production' ? "http://192.168.0.150" : "https://192.168.0.150"; // 登录服务
const Api = {
  // 发送激活码
  getActiveCode(data) {
    return axios({
      url: '/code' + '/api/HttpTrigger1?code=FlRdEIt/W/RdLniu/rVhKA70YqOjlVLn6fPdlwSbb2VHav1u/ld3MA==',
      method: 'GET',
      params: data
    })
  },
  // 登录
  login(data) {
    return axios({
      url: '/api/cgi-bin/login.cgi',
      method: 'POST',
      data: data
    })
  },
  // 获取mac地址
  getMacAddress(data) {
    return axios({
      url: '/api/cgi-bin/getdevip.cgi',
      method: 'POST',
      data: data
    })
  },
  // 用户激活
  accountActivate(data) {
    return axios({
      url: '/api/cgi-bin/activate.cgi',
      method: 'POST',
      data: data
    })
  }
}

export default Api;