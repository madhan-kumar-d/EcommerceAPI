import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import securityPlugin from 'eslint-plugin-security';

const typescriptRecommendedRules = {
  '@typescript-eslint/adjacent-overload-signatures': 'warn',
  '@typescript-eslint/array-type': ['warn', { default: 'array' }],
  '@typescript-eslint/explicit-function-return-type': 'off',
  // '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-inferrable-types': 'off',
  // '@typescript-eslint/no-non-null-assertion': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
};

const securityRecommendedRules = {
  'security/detect-object-injection': 'warn',
  'security/detect-eval-with-expression': 'warn',
  'security/detect-no-csrf-before-method-override': 'warn',
  // Add other security rules you want to enable
};

export default [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
      security: securityPlugin,
    },
    rules: {
      ...typescriptRecommendedRules,
      ...securityRecommendedRules,
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
