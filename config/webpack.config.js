const webpackBaseConfig = require('./webpack.base.config')
const webpackMerge = require('webpack-merge')
const Webpack = require('webpack')
module.exports = webpackMerge(webpackBaseConfig({mode: 'bundle'}), {
  /**
   * Test in this project needs development
   * For more info See this
   * @link https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
   */
  mode: 'production',
  // for webpack karma debug
  devtool: 'source-map',
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
})
