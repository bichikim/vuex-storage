/**
 * karma settings
 * This test must have packages below
 * karma, karma-chai, karma-sourcemap-loader, karma-spec-reporter, karma-webpack
 * mocha, chai, karma-coverage
 * @author Bichi Kim <bichi@live.co.kr>
 */

// const webpack = require('./webpack.test.config.js')
module.exports = function(config) {
  config.set({
    browsers: ['ChromeHeadlessWithoutSecurity'],
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    reporters: ['progress', 'karma-typescript'],
    files: [
      // '../node_modules/@babel/polyfill/dist/polyfill.js',
      // {pattern: '../src/**/*.spec.js', watched: false},
      // {pattern: '../test/specs/**/*.spec.js', watched: false},
      '../src/**/*.ts',
      '../src/**/*.js',
    ],
    exclude: [
      '../src/**/*.spec.skip.js',
    ],
    preprocessors: {
      '../**/*.js': 'karma-typescript',
      '../**/*.ts': 'karma-typescript',
    },
    // coverageReporter: {
    //   type: 'in-memory',
    // },
    // remapCoverageReporter: {
    //   'text-summary': null,
    //   lcovonly: './coverage/lcov.info',
    //   html: './coverage/html',
    //   cobertura: './coverage/cobertura.xml',
    // },
    // webpack,
    // webpackMiddleware: {
    //   noInfo: true,
    // },
    logLevel: config.LOG_INFO,
    colors: true,
    customLaunchers: {
      ChromeWithoutSecurity: {
        base: 'Chrome',
        flags: ['--disable-web-security'],
      },
      ChromeHeadlessWithoutSecurity: {
        base: 'ChromeHeadless',
        flags: ['--disable-web-security'],
      },
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        allowJs: true,
      },
      include: [
        'src/**/*.js',
      ],
      bundlerOptions: {
        alias: {
          '@': '../src',
        },
        resolve: {
          directories: ['../node_modules'],
        },
      },
    },
    // mime: {
    //   'text/x-typescript': ['ts'],
    // },
  })
}
