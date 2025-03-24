import eslintPluginNext from '@next/eslint-plugin-next'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'
import react from './react.js'

/** @type {import("eslint").Linter.Config} */
export default typescriptEslint.config(
  react,
  {
    languageOptions: {
      globals: globals.serviceworker,
    },
  },
  {
    plugins: {
      '@next/next': eslintPluginNext,
    },
    rules: {
      ...eslintPluginNext.configs.recommended.rules,
      ...eslintPluginNext.configs['core-web-vitals'].rules,
    },
  },
  { ignores: ['.next'] },
)
