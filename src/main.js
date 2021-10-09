import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.min.css';
import globalWs from './utils/globalWs';
// 自定义字体
import './assets/css/font.css';
// 动态引入模块
// import './utils/require.context';

require('../mock');

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    bus: new Vue()
  }
}).$mount('#app');


Vue.prototype.websocket = globalWs;
