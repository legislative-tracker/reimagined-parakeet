import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import dts from 'vite-plugin-dts';
import * as path from 'path';

/**
 * @description Vite configuration for shared-config-firebase.
 * Explicitly targets SSR to support Firebase Admin and Functions SDKs.
 */
export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/packages/shared/config-firebase',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    outDir: '../../../dist/packages/shared/config-firebase',
    emptyOutDir: true,
    reportCompressedSize: true,
    ssr: true,
    lib: {
      entry: 'src/index.ts',
      name: 'shared-config-firebase',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['firebase-admin', 'firebase-functions'],
    },
  },
  test: {
    name: 'config-firebase',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/packages/shared/config-firebase',
      provider: 'v8',
    },
  },
});
