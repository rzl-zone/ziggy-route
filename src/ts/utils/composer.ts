import type { ComposerPackage } from "../../../types/composer-schema";

import { resolve } from "path";
import { readFileSync } from "fs";
import { CONFIG } from "@ts/utils/constants";
import { isError } from "@rzl-zone/utils-js/predicates";
import { safeJsonParse } from "@rzl-zone/utils-js/conversions";

import { logger, rzlThrow } from "../utils/logger";

const { PACKAGIST_NAME } = CONFIG.PACKAGE;

export const getComposerPackageVersion = (): string => {
  try {
    const composerPath = resolve(process.cwd(), "composer.json");
    const readComposer = readFileSync(composerPath, "utf-8");
    const composer = safeJsonParse<ComposerPackage, typeof readComposer>(
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
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        rzlThrow("composer.json", `File not found in: ${process.cwd()}.`);
      }

      rzlThrow("Version Fetch Failed", error);
    }

    rzlThrow("Unknown Error", "Something exploded 💣");
  }
};
