import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

/**
 * @description Vite configuration for the server-triggers Firebase Functions entry point.
 * Configured as an SSR library to bundle TypeScript into a Node-compatible main.js.
 * @returns {import('vite').UserConfig}
 */
export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/packages/server/triggers',

  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

  build: {
    outDir: '../../../dist/packages/server/triggers',
    emptyOutDir: true,
    reportCompressedSize: true,
    ssr: true,
    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
      // Standardizing the output filename to main.js
      fileName: 'main',
    },
    rollupOptions: {
      external: [
        'firebase-admin',
        'firebase-functions',
        /^node:/,
        'path',
        'fs',
        'os',
        'crypto',
      ],
      output: {
        format: 'es',
        entryFileNames: '[name].js',
      },
    },
  },

  test: {
    name: 'server-triggers',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/packages/server/triggers',
      provider: 'v8',
    },
  },
});
