const WebpackBaseConfig = require('./webpack.base.config')
const webpackMerge = require('webpack-merge')
const packageJson = require('../package.json')
module.exports = webpackMerge(WebpackBaseConfig, {
  output: {
    library: packageJson.name,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  devtool: 'source-map',
  mode: 'production',
  externals: ['lodash']
})