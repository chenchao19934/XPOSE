/**
 * @function require.context
 * @description 公共布局及样式自动引入
 * @param directory {string} 读取文件路径
 * @param useSubdirectories {boolean} 是否遍历文件的子目录
 * @param regExp {RegExp} 匹配文件的正则
 * @date: 2021-10-08 15:52:48
 * @author chenchao
 */

import Vue from 'vue'
// 公共组件注册全局组件
const requireComponents = require.context('./components', true, /\.vue$/)
requireComponents.keys().forEach((fileName) => {
  const componentConfig = requireComponents(fileName)
  const componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})

// 公共样式动态载入
const requireThemes = require.context('@/styles/themes', true, /\.scss$/)
requireThemes.keys().forEach((fileName) => {
  require(`@/styles/themes/${fileName.slice(2)}`)
})