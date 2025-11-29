import path from "path";
import chalk from "chalk";
import { type Plugin } from "vite";
import { run } from "vite-plugin-run";
import {
  assertIsArray,
  assertIsBoolean,
  assertIsString
} from "@rzl-zone/utils-js/assertions";
import {
  isError,
  isPlainObject,
  getPreciseType,
  isInteger,
  isString,
  isUndefined,
  isNonEmptyString
} from "@rzl-zone/utils-js/predicates";

import { CONFIG } from "@ts/utils/constants";
import { realValue } from "@ts/utils/stringValue";
import { getComposerPackageVersion } from "@ts/utils/composer";

import { build } from "./build";
import { defaultConfig, type Config } from "./config";

const { PACKAGE } = CONFIG;

/**
 * ---------------------------------------------------------
 * * ***Vite Plugin: `rzlZiggyVitePlugin`.***
 * ---------------------------------------------------------
 * Generates Laravel `Ziggy Route` for JavaScript/TypeScript route files,
 * watches Laravel route/config changes during development, and triggers
 * automatic regeneration with throttling/delay controls.
 *
 * - **This plugin is designed for full compatibility with:**
 *    - **Laravel routes → JS/TS client route generator**
 *    - **Dynamic rebuild on file changes**
 *    - **Strict runtime validation for config options**
 *
 * - **Key Features:**
 *    - Auto-generates fresh route files using an internal `build()` command.
 *    - Watches `routes/**\/*.php`, `config/rzl-ziggy.php`, and `.env*` files.
 *    - Provides configurable `delay`, `throttle`, `except`, `only`, `group`, and `url`.
 *    - Supports Ziggy `types` / `typesOnly` to export TS types only.
 *    - Prints clean, colorized console logs when regeneration is triggered.
 *    - Full runtime validation with detailed error messages.
 *
 * @param config - Optional configuration object to customize plugin behavior, see {@link Config | `Config` }.
 *
 * @returns
 * A Vite plugin object with:
 * - `name`: Plugin identifier.
 * - `configResolved`: Hook to access resolved Vite config.
 * - `handleHotUpdate`: Hook to react to file changes and trigger rebuilds.
 *
 * @throws
 * - `TypeError` if any config property has the wrong type.
 * - Detailed runtime validation errors for:
 *   - non-integer `delay` / `throttle`
 *   - non-string entries inside `except` / `only`
 *   - invalid `boolean` flags (`sail`, `types`, etc.)
 *   - invalid `url` or `group` types
 *
 * @example
 * ```ts
 * import rzlZiggyVitePlugin from "@rzl-zone/ziggy-route/vite-plugin";
 *
 * export default defineConfig({
 *   plugins: [
 *     rzlZiggyVitePlugin({
 *       delay: 200,
 *       throttle: 300,
 *       only: ["web.*"],
 *       types: true
 *     })
 *   ]
 * });
 * ```
 *
 * @example
 * ```ts
 * // Error case: invalid "except" values
 * rzlZiggyVitePlugin({
 *   except: ["admin.*", 123]
 * });
 * // ❌ Throws:
 * // TypeError: "Parameter `except` property of the `config` (first parameter) must be of type `array-of-string` and contains `string` (non empty-string) only, invalid values: `number`: `123`"
 * ```
 *
 * @remarks
 * - In development, this plugin logs a full stack trace for errors.
 * - In production, stack traces are suppressed for cleaner output.
 * - This plugin integrates tightly with Laravel route structure and assumes
 *   the project has a valid `composer.json` + Ziggy Route config files.
 */
const rzlZiggyVitePlugin = (config: Config = {}): Plugin => {
  if (!isPlainObject(config)) config = {};

  try {
    const version = getComposerPackageVersion();
    const {
      delay = defaultConfig.delay,
      throttle = defaultConfig.throttle,
      except = defaultConfig.except,
      group = defaultConfig.group,
      only = defaultConfig.only,
      sail = defaultConfig.sail,
      types = defaultConfig.types,
      typesOnly = defaultConfig.typesOnly,
      url = defaultConfig.url
    } = config;

    if (!isInteger(delay)) {
      throw new TypeError(
        `Parameter \`delay\` property of the \`config\` (first parameter) must be of type \`integer-number\`, but received: \`${getPreciseType(
          delay
        )}\`, with value: \`${realValue(delay)}\`.`
      );
    }
    if (!isInteger(throttle)) {
      throw new TypeError(
        `Parameter \`throttle\` property of the \`config\` (first parameter) must be of type \`integer-number\`, but received: \`${getPreciseType(
          throttle
        )}\`, with value: \`${realValue(throttle)}\`.`
      );
    }

    assertIsArray(except, {
      message({ currentType, validType }) {
        return `Parameter \`except\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${realValue(except)}\`.`;
      }
    });

    if (!isUndefined(group)) {
      assertIsString(group, {
        message({ currentType, validType }) {
          return `Parameter \`group\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${realValue(group)}\`.`;
        }
      });
    }

    assertIsArray(only, {
      message({ currentType, validType }) {
        return `Parameter \`only\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${realValue(only)}\`.`;
      }
    });

    assertIsBoolean(sail, {
      message({ currentType, validType }) {
        return `Parameter \`sail\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${realValue(sail)}\`.`;
      }
    });

    assertIsBoolean(types, {
      message({ currentType, validType }) {
        return `Parameter \`types\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${realValue(types)}\`.`;
      }
    });

    assertIsBoolean(typesOnly, {
      message({ currentType, validType }) {
        return `Parameter \`typesOnly\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${realValue(typesOnly)}\`.`;
      }
    });

    if (!isUndefined(url)) {
      assertIsString(url, {
        message({ currentType, validType }) {
          return `Parameter \`url\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${realValue(url)}\`.`;
        }
      });
    }

    const invalidExcept: unknown[] = except.filter(
      (exc) => !isNonEmptyString(exc)
    );
    if (invalidExcept.length > 0) {
      throw new TypeError(
        `Parameter \`except\` property of the \`config\` (first parameter) must be of type \`array-of-string\` and contains \`string\` (non empty-string) only, invalid values: ${invalidExcept
          .map((exc) => {
            return `\n\`${getPreciseType(exc)}\`: \`${realValue(exc)}\``;
          })
          .join(", ")}`
      );
    }

    const invalidOnly: unknown[] = only.filter((onl) => !isNonEmptyString(onl));
    if (invalidOnly.length > 0) {
      throw new TypeError(
        `Parameter \`only\` property of the \`config\` (first parameter) must be of type \`array-of-string\` and contains \`string\` (non empty-string) only, invalid values: ${invalidOnly
          .map((onl) => {
            return `\n\`${getPreciseType(onl)}\`: \`${realValue(onl)}\``;
          })
          .join(", ")}`
      );
    }

    const cmd = build(version, {
      delay,
      throttle,
      except,
      group,
      only,
      sail,
      types,
      typesOnly,
      url
    });

    const { configResolved, handleHotUpdate } = run(
      process.env.NODE_ENV === "development"
        ? [
            {
              delay,
              throttle,
              onFileChanged: ({ file }) => {
                const changedFile = path
                  .relative(process.cwd(), file)
                  .replace(/\\/g, "/");
                console.log(
                  `\n🚀 ${chalk.bold.cyanBright("Live Watcher")} ${chalk.gray("detected change in")} ${chalk.yellowBright(changedFile)}`
                );
                console.log(
                  `${chalk.hex("#ff6f00")("⚡ Rerunning")} ${chalk.bold.cyan(cmd.join(" "))} ${chalk.italic.gray("...syncing fresh routes 🔄.")}\n`
                );
              },
              name: "rzl-ziggy-generator",
              run: cmd,
              pattern: [
                "routes/**/*.php",
                "config/rzl-ziggy.php",
                ".env",
                ".env.*",
                ".env.*.*"
              ],
              condition: (file) => {
                const relative = path
                  .relative(process.cwd(), file)
                  .replace(/\\/g, "/");

                return (
                  (file.includes("/config/") &&
                    file.endsWith("rzl-ziggy.php")) ||
                  (file.includes("/routes/") && file.endsWith(".php")) ||
                  relative === ".env" ||
                  relative.startsWith(".env.") ||
                  /^config\/rzl-ziggy.php$/.test(relative) ||
                  /^routes\/.*\.php$/.test(relative) ||
                  /\.env(\..+)?$/.test(relative)
                );
              }
            }
          ]
        : []
    );

    return {
      name: "rzl-ziggy-plugin",
      configResolved,
      handleHotUpdate
    };
  } catch (error) {
    console.error(
      `\n${chalk.bgRed.white.bold(`💥 ${PACKAGE.PREFIX.NAME} ERROR `)} ${chalk.redBright("An error occurred in")} ${chalk.yellow(`[${PACKAGE.NPM_NAME}/vite-plugin]`)}`
    );

    if (isError(error)) {
      console.error(
        `${chalk.red("🛑 Message:")} ${chalk.white(error.message)}`
      );

      if (process.env.NODE_ENV === "development") {
        console.error(
          `${chalk.gray("📌 Stack Trace:")}\n${chalk.dim(error.stack || "")}`
        );
      } else {
        console.error(
          `${chalk.gray("💡 Tip:")} Run in ${chalk.cyan("development")} mode to see stack trace.`
        );
      }
    } else {
      console.error(`${chalk.red("❓ Unknown error type thrown:")}\n${error}`);
      throw error;
    }

    return {
      name: "rzl-ziggy-plugin"
    };
  }
};

export default rzlZiggyVitePlugin;
