/**
 * @description 导出默认通用配置
 */
const setting = {
  // 开发以及部署时的URL
  publicPath: './',
  // 生产环境构建文件的目录名
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'assets',
  // 开发环境每次保存时是否输出为eslint编译警告
  lintOnSave: false,
  // 进行编译的依赖
  transpileDependencies: [],
  //标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
  title: '',
  //简写
  abbreviation: 'xpose',
  //开发环境端口号
  devPort: '8888',
  //版本号
  version: process.env.VUE_APP_VERSION,
  //缓存路由的最大数量
  keepAliveMaxNum: 99,
  // 路由模式，可选值为 history 或 hash
  routerMode: 'hash',
  //不经过token校验的路由
  routesWhiteList: ['/login', '/register', '/404', '/401'],
  //加载时显示文字
  loadingText: '正在加载中...',
  //token名称
  tokenName: 'accessToken',
  //token在localStorage、sessionStorage存储的key的名称
  tokenTableName: 'XPOSE',
  //token存储位置localStorage sessionStorage
  storage: 'localStorage',
  //token失效回退到登录页时是否记录本次的路由
  recordRoute: true,
  //是否显示在页面高亮错误
  errorLog: ['development', 'production'],
  //是否开启登录拦截
  loginInterception: true,
  //需要自动注入并加载的模块
  providePlugin: { $: 'jquery',jQuery: 'jquery', },
  //npm run build时是否自动生成7z压缩包
  build7z: false,
}
module.exports = setting
