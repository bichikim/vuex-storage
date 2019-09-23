module.exports = {
  'presets': [
    [
      '@vue/babel-preset-jsx', {
      'modules': false,
      'useBuiltIns': 'entry',
    }],
  ],
  'env': {
    'test': {
      'presets': ['@vue/babel-preset-jsx'],
      'plugins': ['istanbul'],
    },
  },
}
