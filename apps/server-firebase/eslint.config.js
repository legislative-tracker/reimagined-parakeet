import baseConfig from '../../eslint.config.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...baseConfig,
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'import/no-unresolved': 0,
    },
  },
  {
    
    files: ['vitest.config.ts', 'vitest.setup.ts'],
    rules: {
      '@nx/enforce-module-boundaries': 'off' 
    },
  }
);