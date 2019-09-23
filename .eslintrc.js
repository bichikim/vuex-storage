module.exports = {
  plugins: ['@typescript-eslint', 'import', 'vue', 'sort-class-members'],
  env: {
    'commonjs': true,
    'browser': true,
    'es6': true,
    'amd': true,
    'node': true,
    'mocha': true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', 'vue'],
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:import/warnings',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    useJSXTextNode: true,
    jsx: true,
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'indent': 'off',
      },
    },
    {
      files: ['*.ts', '*.vue', '*.tsx'],
      rules: {
        'indent': 'off',
        'new-cap': 'off',
        'no-undef': 'off',
        'no-undefined': 'off',
        'no-unused-vars': 'off',
        'no-dupe-class-members': 'off',
        'no-magic-numbers': 'off',
      },
    },
    {
      files: ['*.vue'],
      rules: {
        'max-len': 'off',
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'no-var': 'off',
        'import/no-duplicates': 'off',
        'typescript/interface-name-prefix': 'off',
        'typescript/no-namespace': 'off',
        'no-magic-numbers': 'off',
      },
    },
    {
      files: [
        '*.spec.js',
        '*.spec.ts',
        '*.test.ts',
        '*.test.js',
      ],
      rules: {
        'no-magic-numbers': 'off',
        'max-nested-callbacks': 'off',
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    /**************************************
     * import
     **************************************/
    /**************************************
     * common javascript options
     **************************************/
    // off
    'one-var': 'off',
    'no-undef': 'error',
    'no-console': ['warn', {allow: ['warn', 'error', 'info']}],
    'linebreak-style': 'off',
    'no-prototype-builtins': 'off',
    'class-methods-use-this': 'off',
    // on
    'array-callback-return': 'error',
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': ['error', {before: true, after: true}],
    'block-scoped-var': 'error',
    'block-spacing': ['error', 'never'],
    'camelcase': ['error', {'properties': 'always'}],
    'comma-dangle': ['error', 'always-multiline'],
    'capitalized-comments': [
      'error',
      'always',
      {
        'line': {
          'ignorePattern': '^(\w)*',
        },
        'block': {
          'ignorePattern': '^( ?)(tslint:disable|eslint-disable|istanbul ignore)',
        },
      },
    ],
    'comma-style': ['error', 'last'],
    'complexity': ['error', 20],
    'consistent-this': ['error', 'self'],
    'default-case': 'error',
    'func-name-matching': ['error', 'never'],
    'getter-return': 'error',
    'global-require': 'error',
    'guard-for-in': 'error',
    'indent': ['error', 2, {'SwitchCase': 1}],
    'keyword-spacing': [
      'error', {
        'before': true,
        'after': true,
        'overrides': {
          'catch': {
            'after': false,
          },
          'if': {
            'after': false,
          },
          'for': {
            'after': false,
          },
          'while': {
            'after': false,
          },
          'switch': {
            'after': false,
          },
        },
      }],
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
    'no-implicit-globals': 'off',
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': ['error', {'ignore': [0, 1, -1]}],
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
    'no-unused-vars': 'warn',
    'nonblock-statement-body-position': 'error',
    'object-curly-spacing': ['error', 'never'],
    'quotes': ['error', 'single'],
    'require-await': 'error',
    'semi': ['error', 'never'],
    'sort-keys': 'off',
    'space-before-blocks': [
      'error', {
        'functions': 'always', 'keywords': 'always', 'classes': 'always',
      }],
    'space-before-function-paren': [
      'error', {
        'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always',
      }],
    'vars-on-top': 'error',

    /*************************************
     * type script options
     *************************************/
    // off
    // '@typescript-eslint/explicit-member-accessibility': 'off',
    // '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    // '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
    // '@typescript-eslint/no-type-alias': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    // on
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/class-name-casing': 'error',
    '@typescript-eslint/member-naming': ['error', {'private': '^_'}],
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-parameter-properties': 'error',
    '@typescript-eslint/type-annotation-spacing': [
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
    /***********************************
     * sort class memberss
     ***********************************/
    'sort-class-members/sort-class-members': ['error', {
      order: [
        '[static-properties]',
        '[static-methods]',
        '[properties]',
        '[private-properties]',
        'constructor',
        '[methods]',
        '[private-methods]',
      ],
      accessorPairPositioning: 'getThenSet',
    }],
    /***********************************
     * Vue
     ***********************************/
    'vue/mustache-interpolation-spacing': ['error', 'never'],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/match-component-file-name': ['error']
  },
}
