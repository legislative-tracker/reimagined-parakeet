const nx = require('@nx/eslint-plugin');
const tsEslint = require('typescript-eslint');

/**
 * @description Root ESLint configuration using Flat Config format (ESLint 9+).
 * This file serves as the global policy engine for the workspace, enforcing
 * module boundaries, type safety, and code consistency.
 */
module.exports = [
  // Global ignores to prevent linting artifacts and dependencies
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/.nx',
      '**/coverage',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },

  // Base configurations for Javascript and Typescript
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  // Custom rules for Typescript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@nx': nx,
    },
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        project: ['./tsconfig.base.json'],
      },
    },
    rules: {
      /**
       * Enforces the Nx Monorepo architectural boundaries.
       * Logic: Apps depend on Features -> Features depend on UI/Data-Access -> All depend on Utils.
       */
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:util',
              ],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:data-access',
                'type:util',
              ],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
          ],
        },
      ],
      // Senior-level Typescript strictness rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  // Configuration for project-specific files (e.g., package.json)
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        { ignoredFiles: ['{projectRoot}/eslint.config.js'] },
      ],
    },
  },
];
