import axios from 'axios';
import utils from './utils';
import { Message } from 'element-ui';

// 新创建 axios 实例配置
const service = axios.create({
	baseURL: process.env.VUE_APP_TITLE === 'development' ? '/api/' : process.env.VUE_APP_USE_SERVER,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json'
	}
});

service.defaults.headers.post['Content-Type'] = 'application/json';
service.interceptors.request.use((config) => {
	if (config.isImg) config.headers['Content-Type'] = 'multipart/form-data';

	const sessionToken = utils.getCookie('sessionToken');
	if (sessionToken) config.headers['Authorization'] = 'Bearer ' + sessionToken;
	return config;
}, (error) => {
	// Message.closeAll();
	Message.warning("错误的传参");
	return Promise.reject(error);
});

service.interceptors.response.use((res) => {
	//对响应数据做些事
	const { code, msg } = res.data;
	if (code != 200) {
		Message.error(msg);
		return Promise.reject(res);
	}
	return res.data;
}, (error) => {
	if (error && error.response && error.response.data && error.response.data.status == 401) {
		utils.setCookie("sessionToken", "", -1);
		window.location.href = '/login?auth=false';
	}
	console.log(error);
	//return Promise.reject(error)
});

export default service;