import css from '@eslint/css'
import { tailwindSyntax } from '@eslint/css/syntax'
import js from '@eslint/js'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import stylistic from '@stylistic/eslint-plugin'
import onlyWarn from 'eslint-plugin-only-warn'
// import tailwind from 'eslint-plugin-tailwindcss'
import turbo from 'eslint-plugin-turbo'
import ts from 'typescript-eslint'

/** @type {import("eslint").Linter.Config} */
export default [
  { ...js.configs.recommended, files: ['**/*.js'] },

  // TypeScript
  ...[
    ...ts.configs.recommendedTypeChecked,
    ...ts.configs.strictTypeChecked,
    ...ts.configs.stylisticTypeChecked,
    stylistic.configs['recommended-flat'],
    {
      name: 'tsconfigRootDir',
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
  ].map((conf) => ({
    ...conf,
    files: ['**/*.ts', '**/*.tsx'],
  })),

  // CSS
  {
    files: ['**/*.css'],
    plugins: {
      css,
    },
    language: 'css/css',
    ...css.configs.recommended,
    languageOptions: {
      customSyntax: tailwindSyntax,
      tolerant: true,
    },
  },

  // Tailwind
  // ...tailwind.configs['flat/recommended'].map(conf => ({
  //   ...conf,
  //   files: ['**/*.tsx','**/*.css'],
  // })),
  // {
  //   settings: {
  //     tailwindcss: {
  //       // These are the default values but feel free to customize
  //       callees: ['classnames', 'clsx', 'ctl'],
  //       config: '', // returned from `loadConfig()` utility if not provided
  //       cssFiles: [
  //         '**/*.css',
  //         '!**/node_modules',
  //         '!**/.*',
  //         '!**/dist',
  //         '!**/build',
  //       ],
  //       cssFilesRefreshRate: 5_000,
  //       removeDuplicates: true,
  //       skipClassAttribute: false,
  //       whitelist: [],
  //       tags: [], // can be set to e.g. ['tw'] for use in tw`bg-blue`
  //       classRegex: '^class(Name)?$', // can be modified to support custom attributes. E.g. "^tw$" for `twin.macro`
  //     },
  //   },
  // },

  // Markdown
  ...markdown.configs.recommended,

  // JSON
  {
    files: ['**/*.json'],
    ignores: ['package-lock.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },

  {
    files: ['**/tsconfig.json', '.vscode/*.json'],
    language: 'json/jsonc',
    languageOptions: {
      allowTrailingCommas: true,
    },
    ...json.configs.recommended,
  },

  turbo.configs['flat/recommended'],
  {
    plugins: { onlyWarn },
  },
  {
    ignores: ['dist/**'],
  },
]
