import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import * as path from 'path';

/**
 * @description Vite configuration for the plugin-shared-utils library.
 * Standardized to use Vite to match the rest of the workspace and ensure
 * Node.js compatibility via SSR mode.
 */
export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/packages/plugins/shared-utils',

  plugins: [
    nxViteTsPaths(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],

  build: {
    outDir: '../../../dist/packages/plugins/shared-utils',
    emptyOutDir: true,
    reportCompressedSize: true,
    lib: {
      entry: 'src/index.ts',
      name: 'plugin-shared-utils',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['node:path', 'node:fs', 'node:os'],
    },
    // Crucial: Target Node.js environment
    ssr: true,
  },

  test: {
    name: 'plugin-shared-utils',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/packages/plugins/shared-utils',
      provider: 'v8',
    },
  },
});
