const WebpackBaseConfig = require('./webpack.base.config')
const webpackMerge = require('webpack-merge')
const Webpack = require('webpack')
//  karma test won't ues entry
process.env.NODE_ENV = 'test'
WebpackBaseConfig.entry = null
module.exports = webpackMerge(WebpackBaseConfig, {
  /**
   * Test in this project needs development
   * For more info See this
   * @link https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
   */
  mode: 'development',
  // for webpack karma debug
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$|\.ts$/,
        use: {
          // for karma coverage
          loader: 'istanbul-instrumenter-loader',
          options: {esModules: true},
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/,
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('test'),
    }),
  ],
})
