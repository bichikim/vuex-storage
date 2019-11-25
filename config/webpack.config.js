const webpackBaseConfig = require('./webpack.base.config')
const path = require('path')
const webpackMerge = require('webpack-merge')
const Webpack = require('webpack')
const packageJson = require('../package.json')
const resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}
module.exports = webpackMerge(webpackBaseConfig({mode: 'bundle', tsTranspileOnly: false}), {
  /**
   * Test in this project needs development
   * For more info See this
   * @link https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
   */
  mode: 'production',
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    pathinfo: true,
    library: packageJson.name,
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  // for webpack karma debug
  devtool: 'source-map',
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  externals: [
    /^[a-z\-0-9]+$/,
  ],
})
