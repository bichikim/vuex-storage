const path = require('path')

const resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  resolve: {
    extensions: [
      '.js', '.jsx', '.mjs', '.json', '.ts', '.tsx', '.vue', '.stylus', 'styl',
    ],
    alias: {
      '@': resolve('src'),
      '~': resolve('src'),
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
}
