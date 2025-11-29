import { defineConfig, Options } from "tsup";
import { isBoolean, isString } from "@rzl-zone/utils-js/predicates";

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
    minify: options.minify ?? "terser",
    treeshake: true,
    splitting: true,
    bundle: true,
    terserOptions: {
      format: {
        comments: false
      }
    },
    format: ["cjs", "esm"],
    outDir: "dist",
    // target: "esnext",
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
    minify: false,
    entry: {
      "ziggy-route/vue": "src/ts/ziggy-route/build/node/vue.ts",
      "ziggy-route/react": "src/ts/ziggy-route/build/node/react.ts",
      "ziggy-route/index": "src/ts/ziggy-route/build/node/index.ts",
      "vite-plugin/index": "src/ts/vite-plugin/index.ts"
    }
  }),
  configOptions({
    ...options,
    format: "iife",
    outDir: "dist/ziggy-route",
    entry: {
      "rzl-ziggy": "src/ts/ziggy-route/build/browser/index.ts"
    }
  })
]);
