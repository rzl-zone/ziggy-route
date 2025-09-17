import chalk from "chalk";
import { isError, isString } from "@rzl-zone/utils-js/predicates";

import { CONFIG } from "./constants";

const {
  bgHex,
  blueBright,
  greenBright,
  gray,
  red,
  redBright,
  white,
  whiteBright,
  yellow,
  yellowBright
} = chalk;

const tag = bgHex("#00bcd4").black.bold(` ${CONFIG.PACKAGE.PREFIX.NAME} `);

export const logger = {
  info: (label: string, msg: string) => {
    console.log(
      `\n${tag} ${blueBright("ℹ️ " + label)} ${gray("➔")} ${white(msg)}`
    );
  },
  success: (label: string, msg: string) => {
    console.log(
      `\n${tag} ${greenBright("✅ " + label)} ${gray("➔")} ${whiteBright(msg)}`
    );
  },
  warn: (label: string, msg: string) => {
    console.warn(
      `\n${tag} ${yellow("⚠️  " + label)} ${gray("➔")} ${yellowBright(msg)}`
    );
  },
  error: (label: string, msg: string) => {
    console.error(
      `\n${tag} ${redBright("❌ " + label)} ${gray("➔")} ${red(msg)}`
    );
  },
  throw: (label: string, err: unknown) => {
    if (isError(err)) {
      logger.error(label, err.message);

      if (process.env.NODE_ENV === "development") {
        if (err.stack) {
          console.error(gray(err.stack));
        }
      }

      throw err;
    } else {
      logger.error(label, "Unknown error occurred");
      throw new Error(isString(err) ? err : "Unknown error");
    }
  },
  raw: (msg: string) => console.log(`\n${tag} ${msg}`)
};

export function rzlThrow(label: string, err: unknown): never {
  logger.throw(label, err);
  throw isString(err) ? new Error(err) : err;
}
