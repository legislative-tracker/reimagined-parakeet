const nx = require('@nx/eslint-plugin');
const tsEslint = require('typescript-eslint');

/**
 * @description Root ESLint configuration (ESLint 9+ Flat Config).
 * Using Project-Specific type-aware linting to solve performance bottlenecks.
 */
module.exports = [
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

  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@nx': nx,
    },
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        /**
         * PERFORMANCE FIX: Enables the Project Service to find the nearest tsconfig.json.
         * This replaces the global 'project: ["./tsconfig.base.json"]' which was causing
         * the 100s+ linting times in the server-triggers project.
         */
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            /**
             * DESCRIPTION: SCOPE BOUNDARIES
             * - Frontend apps/libs cannot import backend-only logic or secrets.
             * - Backend services only import backend or shared logic.
             * - Shared libs remain platform-agnostic.
             */
            {
              sourceTag: 'scope:client',
              onlyDependOnLibsWithTags: ['scope:client', 'scope:shared'],
            },
            {
              sourceTag: 'scope:backend',
              onlyDependOnLibsWithTags: ['scope:backend', 'scope:shared'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },

            /**
             * DESCRIPTION: TYPE BOUNDARIES (Layered Architecture)
             * Enforces that higher-level layers (apps/features) depend on
             * lower-level layers (ui/data-access/utils), never the reverse.
             */
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:util',
                'type:plugin',
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
              onlyDependOnLibsWithTags: ['type:util', 'type:data-models'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'type:plugin',
              onlyDependOnLibsWithTags: ['type:util', 'type:data-models'],
            },
          ],
        },
      ],
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

  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        { ignoredFiles: ['{projectRoot}/vite.config.{js,ts,mjs,mts}'] },
      ],
    },
  },
];
