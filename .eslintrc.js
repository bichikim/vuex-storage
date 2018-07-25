/* eslint-disable max-len,no-magic-numbers */
module.exports = {
  plugins: ['html', 'vue', 'typescript'],
  env: {
    'commonjs': true,
    'browser': true,
    'es6': true,
    'amd': true,
    'node': true,
    'mocha': true,
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'indent': 'off',
      }
    },
    {
      files: ['*.ts'],
      rules: {
        'new-cap': 'off',
        'no-undef': 'off',
        'no-undefined': 'off',
        'no-unused-vars': 'off',
      }
    },
    {
      files: ['*.spec.js'],
      rules: {
        'no-magic-numbers': 'off',
        'max-nested-callbacks': 'off',
        'no-undef': 'off',
      }
    }
  ],
  'extends': ['eslint:recommended', 'plugin:vue/recommended'],
  parserOptions: {
    parser: 'typescript-eslint-parser',
    sourceType: 'module',
  },
  rules: {
    /**************************************
     * chai
     **************************************/

    /**************************************
     * vue options
     **************************************/
    'no-dupe-keys': 'error',
    'vue/jsx-uses-vars': 'error',
    'vue/max-attributes-per-line': ['error', {'singleline': 5, 'multiline': {'max': 3, 'allowFirstLine': false}}],
    'vue/require-default-prop': 'error',
    /**************************************
     * common javascript options
     **************************************/
    // off
    'one-var': 'off',
    'no-undef': 'error',
    'no-console': ['warn', {allow: ['warn', 'error']}],
    'linebreak-style': 'off',
    // on
    'array-callback-return': 'error',
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': ['error', {before: true, after: true}],
    'block-scoped-var': 'error',
    'block-spacing': ['error', 'never'],
    'camelcase': ['error', {'properties': 'always'}],
    'class-methods-use-this': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'comma-style': ['error', 'last'],
    'complexity': ['error', 20],
    'consistent-this': ['error', 'self'],
    'default-case': 'error',
    'func-name-matching': ['error', 'never'],
    'getter-return': 'error',
    'global-require': 'error',
    'guard-for-in': 'error',
    'indent': ['error', 2, { "SwitchCase": 1 }],
    'keyword-spacing': ['error', {'before': false, 'after': false, 'overrides': {'const' : {before: true, after: true}, 'let' : {before: true, after: true}, 'from': {before: true, after: true}, 'import': {before: true, after: true}, 'as': {before: true, after: true}, 'export': {after: true}, 'return': {before: true, after: true}, 'this': {before: true, after: true}, 'case':{after: true}, 'extends': {before: true}, 'implements': {before: true},},}],
    'max-depth': ['error', {'max': 4}],
    'max-len': ['error', 100],
    'max-lines': ['error', 1000],
    'max-nested-callbacks': ['error', {'max': 3}],
    'max-params': ['error', {'max': 6}],
    'max-statements-per-line': ['error', {'max': 2}],
    'new-cap': ['error', {'newIsCap': true}],
    'no-alert': 'error',
    'no-await-in-loop': 'error',
    'no-bitwise': 'error',
    'no-buffer-constructor': 'error',
    'no-caller': 'error',
    'no-catch-shadow': 'error',
    'no-div-regex': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-extra-parens': ['error', 'functions'],
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': ['error', {'ignore': [0, 1]}],
    'no-multi-assign': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-plusplus': 'error',
    'no-proto': 'error',
    'no-prototype-builtins': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow-restricted-names': 'error',
    'no-tabs': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-undefined': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'nonblock-statement-body-position': 'error',
    'object-curly-spacing': ['error', 'never'],
    'quotes': ['error', 'single'],
    'require-await': 'error',
    'semi': ['error', 'never'],
    'sort-keys': 'off',
    'space-before-blocks': ['error', {'functions': 'always', 'keywords': 'never', 'classes': 'always'}],
    'space-before-function-paren': ['error', {'anonymous': 'never', 'named': 'never', 'asyncArrow': 'always'}],
    'vars-on-top': 'error',
    // 'consistent-return': 'error', // disable for now
    // 'func-style': ['error', 'expression', {'allowArrowFunctions': true}],
    // 'no-mixed-operators': ['error', {groups: [["&&", "||"],]}],
    // 'no-shadow': ['error', {'builtinGlobals': false, 'hoist': 'all'}],
    // no-invalid-this: 'error',
    // no-mixed-requires: 'error'
    // no-path-concat: 'error'
    // no-process-env: 'error'
    // no-process-exit: 'error'
    // no-restricted-modules
    // no-restricted-properties
    // no-warning-comments
    //'max-statements': 'error'

    /*************************************
     * type script options
     *************************************/
    // off
    'typescript/explicit-member-accessibility': 'off',
    'typescript/member-delimiter-style': 'off',
    'typescript/member-ordering': 'off',
    'typescript/no-empty-interface': 'off',
    'typescript/no-explicit-any': 'off',
    'typescript/no-type-alias': 'off',
    'typescript/no-use-before-define ': 'off',
    // on
    'typescript/adjacent-overload-signatures': 'error',
    'typescript/class-name-casing': 'error',
    'typescript/interface-name-prefix': ['error', 'always'],
    'typescript/member-naming': ['error', {'private': '^_'}],
    'typescript/no-angle-bracket-type-assertion': 'error',
    'typescript/no-array-constructor': 'error',
    'typescript/no-namespace': 'error',
    'typescript/no-parameter-properties': 'error',
    'typescript/no-triple-slash-reference': 'error',
    'typescript/no-unused-vars': 'error',
    'typescript/type-annotation-spacing': [
      'error', {
        'before': false,
        'after': false,
        'overrides': {
          'arrow': {
            'before': true,
            'after': true,
          },
          'colon': {
            'before': false,
            'after': true,
          },
        },
      }],
  }
};
