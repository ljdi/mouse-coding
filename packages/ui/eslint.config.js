import config from '@mc/config/eslint/react'

export default [
  ...config,
  {
    ignores: ['src/shadcn'],
  },
]
