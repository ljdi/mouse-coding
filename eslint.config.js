import js from '@eslint/js'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import prettierConfig from 'eslint-config-prettier/flat'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import neostandard from 'neostandard'
import tseslint from 'typescript-eslint'

/** @type {import("eslint").Linter.Config} */
export default tseslint.config(
  {
    ignores: ['dist', 'routeTree.gen.ts'],
  },

  {
    name: 'TS',
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
    },
    rules: {
      'import/no-unresolved': 'off',
      // 导入排序规则
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          'newlines-between': 'always-and-inside-groups',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  {
    name: 'JSON',
    files: ['**/*.json'],
    ignores: ['package-lock.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },

  {
    name: 'JSONC',
    files: ['**/*.jsonc'],
    language: 'json/jsonc',
    ...json.configs.recommended,
  },

  {
    name: 'JSON5',
    files: ['**/*.json5'],
    language: 'json/json5',
    ...json.configs.recommended,
  },

  // Markdown
  markdown.configs.recommended,

  {
    files: ['**/tsconfig.json', '.vscode/*.json'],
    language: 'json/jsonc',
    languageOptions: {
      allowTrailingCommas: true,
    },
    ...json.configs.recommended,
  },

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  prettierConfig,
  neostandard(),
)
