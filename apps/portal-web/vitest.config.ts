import { mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.base.config.js';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default mergeConfig(baseConfig, {
  plugins: [angular(), nxViteTsPaths()],
  test: {
    reporters: ['default', 'verbose'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/vitest.setup.ts'],
    include: ['src/**/*.spec.ts'],
    server: {
      deps: {
        inline: [/@angular\//, /rxfire/],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/main.ts', 'src/**/*.d.ts'],
    },
  },
});
