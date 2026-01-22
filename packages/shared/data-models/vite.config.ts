import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

/**
 * @description Vite configuration for shared-data-models.
 * Uses build.ssr to ensure Node.js compatibility for Firebase Cloud Functions.
 */
export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/packages/shared/data-models',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    outDir: '../../../dist/packages/shared/data-models',
    emptyOutDir: true,
    reportCompressedSize: true,
    // Correct placement for SSR flag
    ssr: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'shared-data-models',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
    },
  },
  test: {
    name: 'data-models',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/packages/shared/data-models',
      provider: 'v8',
    },
  },
});
