/* tslint:disable:no-require-imports */
const path = require('path')
const formatter = require('eslint-friendly-formatter')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')
const resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}
const tsTranspileOnly = process.env.TS_TRANSPILE_ONLY === 'true'
const packageJson = require('../package.json')
module.exports = ({mode = 'bundle'} = {}) => {
  const tsConfigFile = process.env.TS_CONFIG_FILE || `tsconfig.${mode}.json`
  return {
    entry: {
      app: ['./src/index.ts'],
    },
    output: {
      path: resolve('dist/bundle'),
      filename: '[name].js',
      pathinfo: true,
      library: packageJson.name,
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    resolve: {
      extensions: [
        '.js', '.jsx', '.mjs', '.json',
        '.ts', '.tsx', '.vue', '.stylus', 'styl',
      ],
      alias: {
        '@': resolve('src'),
        '~': resolve('lib'),
        '@@': resolve(''),
        '~~': resolve(''),
        'vue$': 'vue/dist/vue.esm.js',
      },
      plugins: [
        new TsconfigPathsWebpackPlugin({
          configFile: tsConfigFile,
        }),
      ],
    },
    plugins: [new VueLoaderPlugin()],
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|ts|vue)/,
          use: [{
            loader: 'eslint-loader',
            options: {
              formatter,
            },
          }],
          exclude: /node_modules/,
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.tsx?$/,
          exclude: [/node_modules/],
          use: [
            'babel-loader',
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/],
                transpileOnly: tsTranspileOnly,
                configFile: tsConfigFile,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.styl(us)?$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'stylus-loader',
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|ico|eot|woff|woff2|ttf)$/,
          loader: 'url-loader',
          options: {
            name: '[name].[ext]?[hash]',
            publicPath: './dist/',
            limit: 10000,
          },
        },
        {
          test: /\.pug$/,
          oneOf: [
            // this applies to `<template lang="pug">` in Vue components
            {
              resourceQuery: /^\?vue/,
              use: ['pug-plain-loader'],
            },
            // this applies to pug imports inside JavaScript
            {
              use: ['pug-loader'],
            },
          ],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          exclude: [/node_modules/],
        },

      ],
    },
  }
}
