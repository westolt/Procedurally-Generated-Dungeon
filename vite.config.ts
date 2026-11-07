import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/algorithms/**/*.ts"],
      reporter: ["text", "html", "lcov"],
    },
  },
});
