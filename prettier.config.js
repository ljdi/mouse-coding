/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  semi: false,
  trailingComma: 'all',
  jsxSingleQuote: true,
  printWidth: 120,

  plugins: ['prettier-plugin-sort-json', 'prettier-plugin-tailwindcss'],
}
