const { join } = require('path')
const fs = require('fs')

/**
 * @author chenchao
 * @description 处理所有 controller 模块，npm run serve时在node环境中自动输出controller文件夹下Mock接口，请勿修改。
 * @returns {[]}
 */
function handleMockArray() {
  const mockArray = []
  const getFiles = (jsonPath) => {
    const jsonFiles = []
    const findJsonFile = (path) => {
      const files = fs.readdirSync(path)
      files.forEach((item) => {
        const fPath = join(path, item)
        const stat = fs.statSync(fPath)
        if (stat.isDirectory() === true) findJsonFile(item)
        if (stat.isFile() === true) jsonFiles.push(item)
      })
    }
    findJsonFile(jsonPath)
    jsonFiles.forEach((item) => mockArray.push(`./controller/${item}`))
  }
  getFiles('mock/controller')
  return mockArray
}
module.exports = {
  handleMockArray
}
