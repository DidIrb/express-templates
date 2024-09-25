import { defineConfig } from "tsup"

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["src/index.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  // minify: true,
  target: "es2020",
  clean: true,
})
