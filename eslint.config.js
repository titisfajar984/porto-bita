import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // Node-side files: build config, tests and the e2e specs.
    files: ['*.config.ts', 'tests/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // These modules intentionally export non-component values next to components
    // (shadcn's `buttonVariants`, the i18n provider + its hook, brand icon set).
    // Fast-refresh granularity is not a correctness concern here.
    files: ['src/components/ui/**/*.tsx', 'src/app/**/*.tsx', 'src/components/three/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
