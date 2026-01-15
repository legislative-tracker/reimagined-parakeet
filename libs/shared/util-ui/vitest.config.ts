/// <reference types='vitest' />
import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __libDir = path.dirname(fileURLToPath(new URL(import.meta.url)));

export default defineConfig(() => ({
  root: __libDir,
  cacheDir: "../../../node_modules/.vite/libs/shared/util-ui",
  plugins: [
    angular({
      tsconfig: path.resolve(__libDir, "tsconfig.spec.json"),
    }),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(["*.md"]),
  ],
  test: {
    passWithNoTests: true,
    watch: false,
    globals: true,
    environment: "jsdom",

    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    setupFiles: ["src/test-setup.ts"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../../coverage/libs/shared/util-ui",
      provider: "v8" as const,
    },
  },
}));
