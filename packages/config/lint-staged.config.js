export default {
  '*.{json,md,css}': ['prettier --write'],
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint -c eslint/index.js --fix'],
}
