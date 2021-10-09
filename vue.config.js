const path = require('path')
const {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  devPort,
  providePlugin,
} = require('./src/config')
const { version, author } = require('./package.json')
const Webpack = require('webpack')
const dayjs = require('dayjs')
const time = dayjs().format('YYYY-M-D HH:mm:ss')

process.env.VUE_APP_TITLE = title || 'XPOST'
process.env.VUE_APP_AUTHOR = author || 'zz'
process.env.VUE_APP_UPDATE_TIME = time
process.env.VUE_APP_VERSION = version

const resolve = (dir) => path.join(__dirname, dir)
const mockServer = () => {
  if (process.env.NODE_ENV === 'development') return require('./mock')
  else return ''
}

module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    // proxy: {
    //   "/api": {
    //     target: 'http://192.168.0.117/api',
    //     // target: 'http://192.168.0.203/api',
    //     // target: 'http://192.168.0.205/api',
    //     pathRewrite: {
    //       "^/api": ""
    //     },
    //     changeOrigin: true,
    //     ws: true,
    //     // ws: true,//websocket支持
    //     secure: false
    //   },
    //   "/code": {
    //     target: 'https://xposereg.azurewebsites.net',
    //     pathRewrite: {
    //       "^/code": ""
    //     },
    //     changeOrigin: true,
    //     secure: false,
    //     ws: true,
    //   }
    // },
    after: mockServer(),
  },
  configureWebpack() {
    //如果有更改devtool的行为，请先判断是否是production环境
    //比如这样的 config.devtool="source-map";FF
    //改为下面这样的
    // config.devtool = config.mode === "production" ? false : "source-map";
    return {
      resolve: {
        alias: {
          '@': resolve('src'),
        },
      },
      plugins: [
        new Webpack.ProvidePlugin(providePlugin)
      ],
    }
  },
  chainWebpack(config) {
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.performance.set('hints', false)
      config.devtool('none')
      config.optimization.splitChunks({
        automaticNameDelimiter: '-',
        chunks: 'all',
        cacheGroups: {
          chunk: {
            name: 'vab-chunk',
            test: /[\\/]node_modules[\\/]/,
            minSize: 131072,
            maxSize: 524288,
            chunks: 'async',
            minChunks: 2,
            priority: 10,
          },
          vue: {
            name: 'vue',
            test: /[\\/]node_modules[\\/](vue(.*)|core-js)[\\/]/,
            chunks: 'initial',
            priority: 20,
          },
          elementUI: {
            name: 'element-ui',
            test: /[\\/]node_modules[\\/]element-ui(.*)[\\/]/,
            priority: 30,
          },
        },
      })
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true,
        })
        .end()
    })
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.devtool('source-map')
    })
  },
  // 是否使用 thread-loader
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  pwa: {},
}