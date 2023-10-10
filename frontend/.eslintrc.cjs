const prettierOptions = {
  singleQuote: true,

  // 以下为 @trivago/prettier-plugin-sort-imports 配置，若未使用可删去
  // importOrder 中的文件顺序规范，可依据项目实际情况自行更改
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  importOrder: [
    'react-app-polyfill/',
    'core-js/',
    '<THIRD_PARTY_MODULES>',
    '^vite',
    '^react',
    '^antd',
    'components/',
    'pages/',
    'hooks/',
    'utils/',
    '^[./]',
  ],
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
};

module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', 'prettier', 'jsdoc'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    "@typescript-eslint/ban-ts-comment": "off",
    'prettier/prettier': ['error', prettierOptions],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message: 'suggest import xxx from `lodash/xxx`',
          },
          // {
          //   name: 'uuid',
          //   message: 'suggest import xxx from `uuid/dist/xxx`',
          // },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': ['warn', prettierOptions] },
    },
  ],
  ignorePatterns: ['public/*'],
};
