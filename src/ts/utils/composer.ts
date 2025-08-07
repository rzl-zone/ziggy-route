import { readFileSync } from "fs";
import { resolve } from "path";
import { logger, rzlThrow } from "../utils/logger";
import { isError } from "@rzl-zone/utils-js";
import { CONFIG } from "@ts/utils/constants";

const { PACKAGIST_NAME } = CONFIG.PACKAGE;

export const getComposerPackageVersion = (): string => {
  try {
    const composerPath = resolve(process.cwd(), "composer.json");
    const composer = JSON.parse(readFileSync(composerPath, "utf-8"));

    if (!composer.require?.[PACKAGIST_NAME]) {
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
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        rzlThrow("composer.json", `File not found in ${process.cwd()}`);
      }

      rzlThrow("Version Fetch Failed", error);
    }

    rzlThrow("Unknown Error", "Something exploded 💣");
  }
};
