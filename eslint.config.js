import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/dist-transpiled/**'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
)
