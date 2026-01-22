import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

/**
 * @description Vite configuration for plugin-leg-us-ny.
 * Ensures legislature mapping logic has access to Node.js built-ins.
 */
export default defineConfig({
  root: __dirname,
  cacheDir:
    '../../../../node_modules/.vite/packages/plugins/legislatures/us-ny',
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
    outDir: '../../../../dist/packages/plugins/legislatures/us-ny',
    emptyOutDir: true,
    reportCompressedSize: true,
    ssr: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'plugin-leg-us-ny',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
    },
  },
  test: {
    name: 'plugin-leg-us-ny',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory:
        '../../../../coverage/packages/plugins/legislatures/us-ny',
      provider: 'v8',
    },
  },
});
