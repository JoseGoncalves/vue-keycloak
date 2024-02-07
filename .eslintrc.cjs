/* eslint-env node */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  overrides: [
    {
      files: ['src/**/*.ts'],
      excludedFiles: ['*.test.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
      extends: ['plugin:@typescript-eslint/recommended-type-checked', 'prettier'],
    },
    {
      files: ['src/**/*.test.ts'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
}
