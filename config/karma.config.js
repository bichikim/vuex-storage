/**
 * Karma settings
 * @author Bichi Kim <bichi@live.co.kr>
 */
process.env.NODE_ENV = 'test'
const webpack = require('./webpack.test.config.js')
const path = require('path')
module.exports = function (config) {
  config.set({
    basePath: '../',
    browsers: ['ChromeHeadless', 'FirefoxHeadless'],
    frameworks: ['mocha', 'chai'],
    reporters: ['spec','coverage-istanbul'],
    files: [
      // eslint-disable-next-line @typescript-eslint/indent
      'config/karma.polyfill.js',
      {pattern: 'test/browser/**/*.spec.js', watched: false},
      {pattern: 'test/browser/**/*.spec.ts', watched: false},
      {pattern: 'test/both/**/*.spec.js', watched: false},
      {pattern: 'test/both/**/*.spec.ts', watched: false},
    ],
    exclude: [
      'test/**/*.spec.skip.js',
    ],
    preprocessors: {
      'config/**/*.js': ['webpack', 'sourcemap'],
      'config/**/*.ts': ['webpack', 'sourcemap'],
      'test/both/**/*.js': ['webpack', 'sourcemap'],
      'test/both/**/*.ts': ['webpack', 'sourcemap'],
      'test/browser/**/*.js': ['webpack', 'sourcemap'],
      'test/browser/**/*.ts': ['webpack', 'sourcemap'],
    },
    coverageReporter: {
      // This is for Webstrom coverage reporter
      // Karma coverage won't use this
      dir: '.coverage',
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join(process.cwd(), '.coverage'),
      fixWebpackSourcePaths: true,
    },
    // fix url path
    proxies: {
      // fix assets path
      '/assets/': '/base/src/assets/',
    },
    webpack,
    webpackMiddleware: {
      stats: 'errors-only',
      logLevel: 'silent',
      noInfo: true,
    },
    autoWatch: true,
    logLevel: config.LOG_INFO,
    colors: true,
    customLaunchers: {
      ChromeWithoutSecurity: {
        base: 'Chrome',
        flags: ['--disable-web-security'],
      },
      FirefoxHeadless: {
        base: 'Firefox',
        flags: [ '-headless' ],
      },
      ChromeHeadlessWithoutSecurity: {
        base: 'ChromeHeadless',
        flags: ['--disable-web-security'],
      },
    },
    mime: {
      'text/x-typescript': ['ts' ,'tsx'],
    },
  })
}
