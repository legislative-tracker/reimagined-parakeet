const baseConfig = require('../../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        parser: require('jsonc-eslint-parser'),
        // Point to the specific configs that include your library and test files
        project: ['./tsconfig.lib.json', './tsconfig.spec.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/esbuild.config.{js,ts,mjs,mts}',
            '{projectRoot}/vite.config.{js,ts,mjs,mts}',
          ],
        },
      ],
    },
  },
];
