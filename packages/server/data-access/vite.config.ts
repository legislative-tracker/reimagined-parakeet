import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

/**
 * @description Vite configuration for the server-data-access library.
 * This library MUST use build.ssr to allow Node.js modules (fs, path)
 * required by Firebase Admin.
 */
export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/packages/server/data-access',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
  ],
  build: {
    outDir: '../../../dist/packages/server/data-access',
    emptyOutDir: true,
    reportCompressedSize: true,
    // Ensures Vite targets Node.js and preserves built-in modules
    ssr: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'server-data-access',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Prevent bundling of heavy backend SDKs
      external: [
        'firebase-admin',
        'firebase-functions',
        'node:path',
        'node:fs',
        'node:os',
        'node:crypto',
      ],
    },
  },
  test: {
    name: 'server-data-access',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/packages/server/data-access',
      provider: 'v8' as const,
    },
  },
});
