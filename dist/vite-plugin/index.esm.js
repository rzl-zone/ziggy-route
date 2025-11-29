/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.12.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
import { CONFIG, isPlainObject, isInteger, getPreciseType, realValue, assertIsArray, isUndefined, assertIsString, assertIsBoolean, isNonEmptyString, isError, safeJsonParse, isString } from '../chunk-IWMGSFDN.esm.js';
import path, { resolve } from 'path';
import chalk2 from 'chalk';
import { run } from 'vite-plugin-run';
import { readFileSync } from 'fs';

var tag = chalk2.bgHex("#00bcd4").black.bold(` ${CONFIG.PACKAGE.PREFIX.NAME} `);
var logger = {
  info: (label, msg) => {
    console.log(
      `
${tag} ${chalk2.blueBright("\u2139\uFE0F " + label)} ${chalk2.gray("\u2794")} ${chalk2.white(msg)}`
    );
  },
  success: (label, msg) => {
    console.log(
      `
${tag} ${chalk2.greenBright("\u2705 " + label)} ${chalk2.gray("\u2794")} ${chalk2.whiteBright(msg)}`
    );
  },
  warn: (label, msg) => {
    console.warn(
      `
${tag} ${chalk2.yellow("\u26A0\uFE0F  " + label)} ${chalk2.gray("\u2794")} ${chalk2.yellowBright(msg)}`
    );
  },
  error: (label, msg) => {
    console.error(
      `
${tag} ${chalk2.redBright("\u274C " + label)} ${chalk2.gray("\u2794")} ${chalk2.red(msg)}`
    );
  },
  throw: (label, err) => {
    if (isError(err)) {
      logger.error(label, err.message);
      if (process.env.NODE_ENV === "development") {
        if (err.stack) {
          console.error(chalk2.gray(err.stack));
        }
      }
      throw err;
    } else {
      logger.error(label, "Unknown error occurred");
      throw new Error(isString(err) ? err : "Unknown error");
    }
  },
  raw: (msg) => console.log(`
${tag} ${msg}`)
};
function rzlThrow(label, err) {
  logger.throw(label, err);
  throw isString(err) ? new Error(err) : err;
}

var { PACKAGIST_NAME } = CONFIG.PACKAGE;
var getComposerPackageVersion = () => {
  try {
    const composerPath = resolve(process.cwd(), "composer.json");
    const readComposer = readFileSync(composerPath, "utf-8");
    const composer = safeJsonParse(
      readComposer
    );
    if (!composer?.require?.[PACKAGIST_NAME]) {
      rzlThrow(
        "composer.json",
        `${PACKAGIST_NAME} not found in composer.json dependencies`
      );
    }
    const version = composer.require[PACKAGIST_NAME];
    const match = version.match(/^[~^><]?(\d+)/);
    if (!match) {
      rzlThrow(
        "Version Format",
        `Invalid version format for ${PACKAGIST_NAME}: ${version}`
      );
    }
    const cleanVersion = match[1];
    logger.success("Composer Package", `${PACKAGIST_NAME} v${cleanVersion}`);
    return cleanVersion;
  } catch (error) {
    if (isError(error)) {
      if (error.code === "ENOENT") {
        rzlThrow("composer.json", `File not found in: ${process.cwd()}.`);
      }
      rzlThrow("Version Fetch Failed", error);
    }
    rzlThrow("Unknown Error", "Something exploded \u{1F4A3}");
  }
};

var build = (version, config) => {
  const cmd = [
    config.sail && !process.env.LARAVEL_SAIL ? "sail" : "php",
    "artisan",
    "rzl-ziggy:generate"
  ];
  if (config.group) cmd.push("--group", config.group);
  if (config.url) cmd.push("--url", config.url);
  if (["0", "1", "2"].includes(version)) {
    if (config.types) cmd.push("--types");
    if (config.typesOnly) cmd.push("--types-only");
    if (version === "0" || version === "1") {
      if (config.only.length > 0) cmd.push("--only", config.only.join(","));
      if (config.except.length > 0)
        cmd.push("--except", config.except.join(","));
    }
  }
  return cmd;
};

var defaultConfig = {
  sail: false,
  types: true,
  typesOnly: false,
  delay: 250,
  throttle: 250,
  only: [],
  except: []
};

var { PACKAGE } = CONFIG;
var rzlZiggyVitePlugin = (config = {}) => {
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
    const invalidExcept = except.filter(
      (exc) => !isNonEmptyString(exc)
    );
    if (invalidExcept.length > 0) {
      throw new TypeError(
        `Parameter \`except\` property of the \`config\` (first parameter) must be of type \`array-of-string\` and contains \`string\` (non empty-string) only, invalid values: ${invalidExcept.map((exc) => {
          return `
\`${getPreciseType(exc)}\`: \`${realValue(exc)}\``;
        }).join(", ")}`
      );
    }
    const invalidOnly = only.filter((onl) => !isNonEmptyString(onl));
    if (invalidOnly.length > 0) {
      throw new TypeError(
        `Parameter \`only\` property of the \`config\` (first parameter) must be of type \`array-of-string\` and contains \`string\` (non empty-string) only, invalid values: ${invalidOnly.map((onl) => {
          return `
\`${getPreciseType(onl)}\`: \`${realValue(onl)}\``;
        }).join(", ")}`
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
      process.env.NODE_ENV === "development" ? [
        {
          delay,
          throttle,
          onFileChanged: ({ file }) => {
            const changedFile = path.relative(process.cwd(), file).replace(/\\/g, "/");
            console.log(
              `
\u{1F680} ${chalk2.bold.cyanBright("Live Watcher")} ${chalk2.gray("detected change in")} ${chalk2.yellowBright(changedFile)}`
            );
            console.log(
              `${chalk2.hex("#ff6f00")("\u26A1 Rerunning")} ${chalk2.bold.cyan(cmd.join(" "))} ${chalk2.italic.gray("...syncing fresh routes \u{1F504}.")}
`
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
            const relative = path.relative(process.cwd(), file).replace(/\\/g, "/");
            return file.includes("/config/") && file.endsWith("rzl-ziggy.php") || file.includes("/routes/") && file.endsWith(".php") || relative === ".env" || relative.startsWith(".env.") || /^config\/rzl-ziggy.php$/.test(relative) || /^routes\/.*\.php$/.test(relative) || /\.env(\..+)?$/.test(relative);
          }
        }
      ] : []
    );
    return {
      name: "rzl-ziggy-plugin",
      configResolved,
      handleHotUpdate
    };
  } catch (error) {
    console.error(
      `
${chalk2.bgRed.white.bold(`\u{1F4A5} ${PACKAGE.PREFIX.NAME} ERROR `)} ${chalk2.redBright("An error occurred in")} ${chalk2.yellow(`[${PACKAGE.NPM_NAME}/vite-plugin]`)}`
    );
    if (isError(error)) {
      console.error(
        `${chalk2.red("\u{1F6D1} Message:")} ${chalk2.white(error.message)}`
      );
      if (process.env.NODE_ENV === "development") {
        console.error(
          `${chalk2.gray("\u{1F4CC} Stack Trace:")}
${chalk2.dim(error.stack || "")}`
        );
      } else {
        console.error(
          `${chalk2.gray("\u{1F4A1} Tip:")} Run in ${chalk2.cyan("development")} mode to see stack trace.`
        );
      }
    } else {
      console.error(`${chalk2.red("\u2753 Unknown error type thrown:")}
${error}`);
      throw error;
    }
    return {
      name: "rzl-ziggy-plugin"
    };
  }
};
var vite_plugin_default = rzlZiggyVitePlugin;
/*! Bundled license information:

@rzl-zone/utils-js/dist/assertions/index.js:
  (*!
   * ====================================================
   * Rzl Utils-JS.
   * ----------------------------------------------------
   * Version: 3.11.0.
   * Author: Rizalvin Dwiky.
   * Repository: https://github.com/rzl-zone/utils-js.
   * ====================================================
   *)
*/

export { vite_plugin_default as default };
