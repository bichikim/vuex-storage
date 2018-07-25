const WebpackBaseConfig = require('./webpack.base.config')
const webpackMerge = require('webpack-merge')
const packageJson = require('../package.json')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const externals = () => {
  const {dependencies} = packageJson
  return Object.keys(dependencies)
}
module.exports = webpackMerge(WebpackBaseConfig, {
  output: {
    library: packageJson.name,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  devtool: 'source-map',
  mode: 'production',
  externals: [...externals()],
  module: {
    rules: [
      {
        test: /\.ts$/, exclude: /node_modules/, use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader', options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },

        ],
      },
    ],
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({configFile: './tsconfig.build.json'}),
    ],
  },
})