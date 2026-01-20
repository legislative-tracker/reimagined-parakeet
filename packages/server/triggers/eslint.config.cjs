/**
 * @description Project-specific ESLint configuration for server-triggers.
 * This file optimizes linting performance by narrowing the TypeScript
 * scope to the local project and its specific NodeNext resolution.
 */
const baseConfig = require('../../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.spec.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {},
  },
];
