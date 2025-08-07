import { isBoolean, isString } from "@rzl-zone/utils-js";
import { defineConfig, Options } from "tsup";

const configOptions = (options: Options): Options => {
  if (
    !isString(options.dts) &&
    !isBoolean(options.dts) &&
    options.dts?.only === true
  ) {
    return {
      ...options,
      clean: !options.watch,
      dts: { only: true }
    };
  }

  return {
    dts: true,
    minify: true,
    format: ["cjs", "esm"],
    outDir: "dist",
    target: "esnext",
    clean: !options.watch,
    outExtension({ format }) {
      return {
        js:
          format === "iife"
            ? ".iife.js"
            : format === "cjs"
              ? `.cjs`
              : `.${format}.js`
      };
    },
    ...options
  };
};

export default defineConfig((options) => [
  configOptions({
    ...options,
    outDir: "dist/ziggy-route",
    entry: ["src/ts/ziggy/build/node/*.{ts,tsx}"]
  }),
  configOptions({
    ...options,
    format: "iife",
    outDir: "dist/ziggy-route",
    entry: ["src/ts/ziggy/build/browser/*.{ts,tsx}"]
  }),
  configOptions({
    ...options,
    outDir: "dist/vite-plugin",
    entry: ["src/ts/vite-plugin/index.{ts,tsx}"]
  })
]);
