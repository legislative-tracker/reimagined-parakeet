const baseConfig = require('../../../../eslint.config.js');

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
    rules: {},
  },
];
