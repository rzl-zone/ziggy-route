/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.12.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
'use strict';

var chunk4M7PUXSA_cjs = require('../chunk-4M7PUXSA.cjs');
var path = require('path');
var chalk2 = require('chalk');
var vitePluginRun = require('vite-plugin-run');
var fs = require('fs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var path__default = /*#__PURE__*/_interopDefault(path);
var chalk2__default = /*#__PURE__*/_interopDefault(chalk2);

var tag = chalk2__default.default.bgHex("#00bcd4").black.bold(` ${chunk4M7PUXSA_cjs.CONFIG.PACKAGE.PREFIX.NAME} `);
var logger = {
  info: (label, msg) => {
    console.log(
      `
${tag} ${chalk2__default.default.blueBright("\u2139\uFE0F " + label)} ${chalk2__default.default.gray("\u2794")} ${chalk2__default.default.white(msg)}`
    );
  },
  success: (label, msg) => {
    console.log(
      `
${tag} ${chalk2__default.default.greenBright("\u2705 " + label)} ${chalk2__default.default.gray("\u2794")} ${chalk2__default.default.whiteBright(msg)}`
    );
  },
  warn: (label, msg) => {
    console.warn(
      `
${tag} ${chalk2__default.default.yellow("\u26A0\uFE0F  " + label)} ${chalk2__default.default.gray("\u2794")} ${chalk2__default.default.yellowBright(msg)}`
    );
  },
  error: (label, msg) => {
    console.error(
      `
${tag} ${chalk2__default.default.redBright("\u274C " + label)} ${chalk2__default.default.gray("\u2794")} ${chalk2__default.default.red(msg)}`
    );
  },
  throw: (label, err) => {
    if (chunk4M7PUXSA_cjs.isError(err)) {
      logger.error(label, err.message);
      if (process.env.NODE_ENV === "development") {
        if (err.stack) {
          console.error(chalk2__default.default.gray(err.stack));
        }
      }
      throw err;
    } else {
      logger.error(label, "Unknown error occurred");
      throw new Error(chunk4M7PUXSA_cjs.isString(err) ? err : "Unknown error");
    }
  },
  raw: (msg) => console.log(`
${tag} ${msg}`)
};
function rzlThrow(label, err) {
  logger.throw(label, err);
  throw chunk4M7PUXSA_cjs.isString(err) ? new Error(err) : err;
}

var { PACKAGIST_NAME } = chunk4M7PUXSA_cjs.CONFIG.PACKAGE;
var getComposerPackageVersion = () => {
  try {
    const composerPath = path.resolve(process.cwd(), "composer.json");
    const readComposer = fs.readFileSync(composerPath, "utf-8");
    const composer = chunk4M7PUXSA_cjs.safeJsonParse(
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
    if (chunk4M7PUXSA_cjs.isError(error)) {
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

var { PACKAGE } = chunk4M7PUXSA_cjs.CONFIG;
var rzlZiggyVitePlugin = (config = {}) => {
  if (!chunk4M7PUXSA_cjs.isPlainObject(config)) config = {};
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
    if (!chunk4M7PUXSA_cjs.isInteger(delay)) {
      throw new TypeError(
        `Parameter \`delay\` property of the \`config\` (first parameter) must be of type \`integer-number\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(
          delay
        )}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(delay)}\`.`
      );
    }
    if (!chunk4M7PUXSA_cjs.isInteger(throttle)) {
      throw new TypeError(
        `Parameter \`throttle\` property of the \`config\` (first parameter) must be of type \`integer-number\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(
          throttle
        )}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(throttle)}\`.`
      );
    }
    chunk4M7PUXSA_cjs.assertIsArray(except, {
      message({ currentType, validType }) {
        return `Parameter \`except\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(except)}\`.`;
      }
    });
    if (!chunk4M7PUXSA_cjs.isUndefined(group)) {
      chunk4M7PUXSA_cjs.assertIsString(group, {
        message({ currentType, validType }) {
          return `Parameter \`group\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(group)}\`.`;
        }
      });
    }
    chunk4M7PUXSA_cjs.assertIsArray(only, {
      message({ currentType, validType }) {
        return `Parameter \`only\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(only)}\`.`;
      }
    });
    chunk4M7PUXSA_cjs.assertIsBoolean(sail, {
      message({ currentType, validType }) {
        return `Parameter \`sail\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(sail)}\`.`;
      }
    });
    chunk4M7PUXSA_cjs.assertIsBoolean(types, {
      message({ currentType, validType }) {
        return `Parameter \`types\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(types)}\`.`;
      }
    });
    chunk4M7PUXSA_cjs.assertIsBoolean(typesOnly, {
      message({ currentType, validType }) {
        return `Parameter \`typesOnly\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(typesOnly)}\`.`;
      }
    });
    if (!chunk4M7PUXSA_cjs.isUndefined(url)) {
      chunk4M7PUXSA_cjs.assertIsString(url, {
        message({ currentType, validType }) {
          return `Parameter \`url\` property of the \`config\` (first parameter) must be of type \`${validType}\`, but received: \`${currentType}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(url)}\`.`;
        }
      });
    }
    const invalidExcept = except.filter(
      (exc) => !chunk4M7PUXSA_cjs.isNonEmptyString(exc)
    );
    if (invalidExcept.length > 0) {
      throw new TypeError(
        `Parameter \`except\` property of the \`config\` (first parameter) must be of type \`array-of-string\` and contains \`string\` (non empty-string) only, invalid values: ${invalidExcept.map((exc) => {
          return `
\`${chunk4M7PUXSA_cjs.getPreciseType(exc)}\`: \`${chunk4M7PUXSA_cjs.realValue(exc)}\``;
        }).join(", ")}`
      );
    }
    const invalidOnly = only.filter((onl) => !chunk4M7PUXSA_cjs.isNonEmptyString(onl));
    if (invalidOnly.length > 0) {
      throw new TypeError(
        `Parameter \`only\` property of the \`config\` (first parameter) must be of type \`array-of-string\` and contains \`string\` (non empty-string) only, invalid values: ${invalidOnly.map((onl) => {
          return `
\`${chunk4M7PUXSA_cjs.getPreciseType(onl)}\`: \`${chunk4M7PUXSA_cjs.realValue(onl)}\``;
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
    const { configResolved, handleHotUpdate } = vitePluginRun.run(
      process.env.NODE_ENV === "development" ? [
        {
          delay,
          throttle,
          onFileChanged: ({ file }) => {
            const changedFile = path__default.default.relative(process.cwd(), file).replace(/\\/g, "/");
            console.log(
              `
\u{1F680} ${chalk2__default.default.bold.cyanBright("Live Watcher")} ${chalk2__default.default.gray("detected change in")} ${chalk2__default.default.yellowBright(changedFile)}`
            );
            console.log(
              `${chalk2__default.default.hex("#ff6f00")("\u26A1 Rerunning")} ${chalk2__default.default.bold.cyan(cmd.join(" "))} ${chalk2__default.default.italic.gray("...syncing fresh routes \u{1F504}.")}
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
            const relative = path__default.default.relative(process.cwd(), file).replace(/\\/g, "/");
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
${chalk2__default.default.bgRed.white.bold(`\u{1F4A5} ${PACKAGE.PREFIX.NAME} ERROR `)} ${chalk2__default.default.redBright("An error occurred in")} ${chalk2__default.default.yellow(`[${PACKAGE.NPM_NAME}/vite-plugin]`)}`
    );
    if (chunk4M7PUXSA_cjs.isError(error)) {
      console.error(
        `${chalk2__default.default.red("\u{1F6D1} Message:")} ${chalk2__default.default.white(error.message)}`
      );
      if (process.env.NODE_ENV === "development") {
        console.error(
          `${chalk2__default.default.gray("\u{1F4CC} Stack Trace:")}
${chalk2__default.default.dim(error.stack || "")}`
        );
      } else {
        console.error(
          `${chalk2__default.default.gray("\u{1F4A1} Tip:")} Run in ${chalk2__default.default.cyan("development")} mode to see stack trace.`
        );
      }
    } else {
      console.error(`${chalk2__default.default.red("\u2753 Unknown error type thrown:")}
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

module.exports = vite_plugin_default;
