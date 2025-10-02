import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/.tsbuildinfo',
      'eslint.config.mjs'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['server/src/**/*.ts'], // add 'shared/src/**/*.ts' and 'client/src/**/*.ts'
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./server/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      semi: ['error', 'never'],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
]
