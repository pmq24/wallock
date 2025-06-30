import globals from 'globals'
import neostandard from 'neostandard'
import vue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/']
  },
  ...neostandard({
    files: ['./**/*.vue'],
    filesTs: ['./**/*.vue'],
    ts: true,
  }),
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      sourceType: 'module',
    },
  },
]
