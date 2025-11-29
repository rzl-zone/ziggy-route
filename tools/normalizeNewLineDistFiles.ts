import fs from "fs";
import fg from "fast-glob";
import { isNonEmptyArray } from "@rzl-zone/utils-js/predicates";

import { BUILD_LOGGER } from "./utils/logger";

const normalizeCleanDistFiles = async (pattern: string | string[]) => {
  try {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const files: string[] = [];

    for (const p of patterns) {
      const matched = (await fg(p, { absolute: false })).sort();
      files.push(...matched);
    }

    BUILD_LOGGER.ON_STARTING({
      actionName: "Normalize New Lines"
    });

    const filesToClean = [];
    for (const filePath of files) {
      if (!filePath.match(/\.(js|cjs|mjs)$/)) continue;
      if (!fs.existsSync(filePath)) continue;

      const content = await fs.promises.readFile(filePath, "utf8");
      if (/(\r?\n){3,}/.test(content)) {
        filesToClean.push(filePath);
      }
    }

    for (const [idx, filePath] of filesToClean.entries()) {
      const content = await fs.promises.readFile(filePath, "utf8");
      const finalContent = content.replace(/(\r?\n){3,}/g, "\r\n\r\n");

      if (finalContent !== content) {
        await fs.promises.writeFile(filePath, finalContent, "utf8");

        BUILD_LOGGER.ON_PROCESS({
          actionName: "New Line Normalized",
          count: idx + 1,
          nameDirect: filePath
        });
      }
    }

    if (isNonEmptyArray(filesToClean)) {
      BUILD_LOGGER.ON_FINISH({
        actionName: "Normalize New Lines",
        count: filesToClean.length
      });
    } else {
      BUILD_LOGGER.ON_SKIPPING({
        actionName: "Normalize New Lines",
        reasonEndText: "normalize"
      });
    }
  } catch (error) {
    BUILD_LOGGER.ON_ERROR({
      actionName: "Normalize New Lines",
      error
    });
  }
};

await normalizeCleanDistFiles("dist/**/*.{js,cjs,mjs}");
