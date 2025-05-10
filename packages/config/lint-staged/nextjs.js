import path from 'node:path'

const buildNextLintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

export default {
  '*.{js,jsx,ts,tsx}': ['prettier --write', buildNextLintCommand],
  '*.{json,md,css}': [
    'prettier --write',
    // (filenames) => `eslint --fix ${filenames.join(' ')}`,
  ],
  './*.{js,ts}': ['prettier --write', 'eslint --fix'],
}
