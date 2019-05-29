/**
 * karma settings
 * @author Bichi Kim <bichi@live.co.kr>
 */

// const webpack = require('./webpack.test.config.js')
module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    files: [
      '../src/**/*.ts', // *.tsx for React Jsx
    ],
    preprocessors: {
      '../**/*.ts': 'karma-typescript', // *.tsx for React Jsx
    },
    logLevel: config.LOG_INFO,
    reporters: ['spec', 'karma-typescript'],
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
      reports: {
        html: 'coverage',
        lcovonly: 'coverage',
        'text-summary': '',
      },
      tsconfig: '../tsconfig.json',
      bundlerOptions: {
        resolve: {
          directories: ['../node_modules'],
        },
      },
      compilerOptions: {
        declaration: false,
        declarationDir: false,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        jsx: 'react',
        module: 'commonjs',
        sourceMap: true,
        target: 'es5',
        allowJs: true,
      },
      exclude: ['../node_modules'],
      include: [
        '../src/**/*.ts',
        '../types/**/*.d.ts',
      ],
    },
  })
}
