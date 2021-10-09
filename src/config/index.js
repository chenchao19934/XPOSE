/**
 * @description 通用配置
 */
const setting = require('./setting.config')
const network = require('./net.config')
module.exports = Object.assign({}, setting, network)