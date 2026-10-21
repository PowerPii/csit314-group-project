import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Integration tests: entity classes against the local Supabase database.
// Run `npx supabase start` first.
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: { "server-only": new URL("./tests/support/server-only.ts", import.meta.url).pathname },
  },
  test: {
    include: ["tests/entity/**/*.test.ts"],
    setupFiles: ["tests/support/local-supabase.ts"],
    fileParallelism: false,
  },
});
