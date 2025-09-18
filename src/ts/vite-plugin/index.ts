import path from "path";
import chalk from "chalk";
import { type Plugin } from "vite";
import { run } from "vite-plugin-run";
import {
  isError,
  isPlainObject,
  getPreciseType,
  isInteger,
  isArray,
  isString,
  isUndefined,
  isBoolean
} from "@rzl-zone/utils-js/predicates";

import { build, BuildConfig } from "./build";
import { defaultConfig, type Config } from "./config";
import { getComposerPackageVersion } from "@ts/utils/composer";
import { realValue } from "@ts/utils/stringValue";
import { CONFIG } from "@ts/utils/constants";

const { PACKAGE } = CONFIG;

const rzlZiggyVite = (config: Config = {}): Plugin => {
  if (!isPlainObject(config)) {
    config = {};
  }

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
    if (!isArray(except)) {
      throw new TypeError(
        `Parameter \`except\` property of the \`config\` (first parameter) must be of type \`array\`, but received: \`${getPreciseType(
          except
        )}\`, with value: \`${realValue(except)}\`.`
      );
    }
    if (!isUndefined(group) && !isString(group)) {
      throw new TypeError(
        `Parameter \`group\` property of the \`config\` (first parameter) must be of type \`string\`, but received: \`${getPreciseType(
          group
        )}\`, with value: \`${realValue(group)}\`.`
      );
    }
    if (!isArray(only)) {
      throw new TypeError(
        `Parameter \`only\` property of the \`config\` (first parameter) must be of type \`array\`, but received: \`${getPreciseType(
          only
        )}\`, with value: \`${realValue(only)}\`.`
      );
    }
    if (!isBoolean(sail)) {
      throw new TypeError(
        `Parameter \`sail\` property of the \`config\` (first parameter) must be of type \`boolean\`, but received: \`${getPreciseType(
          sail
        )}\`, with value: \`${realValue(sail)}\`.`
      );
    }
    if (!isBoolean(types)) {
      throw new TypeError(
        `Parameter \`types\` property of the \`config\` (first parameter) must be of type \`boolean\`, but received: \`${getPreciseType(
          types
        )}\`, with value: \`${realValue(types)}\`.`
      );
    }
    if (!isBoolean(typesOnly)) {
      throw new TypeError(
        `Parameter \`typesOnly\` property of the \`config\` (first parameter) must be of type \`boolean\`, but received: \`${getPreciseType(
          typesOnly
        )}\`, with value: \`${realValue(typesOnly)}\`.`
      );
    }
    if (!isUndefined(url) && !isString(url)) {
      throw new TypeError(
        `Parameter \`url\` property of the \`config\` (first parameter) must be of type \`string\`, but received: \`${getPreciseType(
          url
        )}\`, with value: \`${realValue(url)}\`.`
      );
    }

    const invalidExcept = except.filter((exc) => !isString(exc));
    if (invalidExcept.length > 0) {
      throw new TypeError(
        `Parameter \`except\` property of the \`config\` (first parameter) must be of type \`array-of-string\` and contains \`string\` only, invalid values: ${invalidExcept
          .map((exc) => {
            return `\n\`${getPreciseType(exc)}\`: \`${realValue(exc)}\``;
          })
          .join(", ")}`
      );
    }

    const invalidOnly = only.filter((onl) => !isString(onl));
    if (invalidOnly.length > 0) {
      throw new TypeError(
        `Parameter \`only\` property of the \`config\` (first parameter) must be of type \`array-of-string\` and contains \`string\` only, invalid values: ${invalidOnly
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
    } as BuildConfig);

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
      console.error(`${chalk.red("❓ Unknown error type thrown:")}`);
      throw error;
    }
  }

  return {} as Plugin;
};

export default rzlZiggyVite;
