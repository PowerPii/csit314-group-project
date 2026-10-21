import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Unit tests: controllers with their entities stubbed. Fast, no database.
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: { "server-only": new URL("./tests/support/server-only.ts", import.meta.url).pathname },
  },
  test: {
    include: ["tests/control/**/*.test.ts"],
    restoreMocks: true,
    coverage: {
      include: ["src/control/**"],
      reporter: ["text", "html"],
    },
  },
});
