import { mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.base.config';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

export default mergeConfig(baseConfig, {
  plugins: [angular(), tsconfigPaths()],
  test: {
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
