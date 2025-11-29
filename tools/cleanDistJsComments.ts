import fs from "fs";
import fg from "fast-glob";
import { isNonEmptyArray } from "@rzl-zone/utils-js/predicates";
import { BUILD_LOGGER } from "./utils/logger";

type CleanOptions = {
  removeAdjacentEmptyLines?: boolean; // default: false
};

const cleanDistJsComments = async (
  pattern: string | string[],
  options: CleanOptions = {}
) => {
  try {
    const { removeAdjacentEmptyLines = false } = options;
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const files: string[] = [];

    for (const p of patterns) {
      const matched = (await fg(p, { absolute: false })).sort();
      files.push(...matched);
    }

    BUILD_LOGGER.ON_STARTING({
      actionName: "Cleaning JS Comment"
    });

    const filesToClean: string[] = [];
    for (const filePath of files) {
      if (!filePath.match(/\.(js|cjs|mjs)$/)) continue;
      if (!fs.existsSync(filePath)) continue;

      const content = await fs.promises.readFile(filePath, "utf8");
      const lines = content.split(/\r?\n/);

      const hasTarget = lines.some((line, i, arr) => {
        if (/^[ \t]*\/\/\s*(src|node_modules)\//.test(line)) return true;
        if (/^[ \t]*\/\/\s*eslint/.test(line)) return true;
        if (
          removeAdjacentEmptyLines &&
          /^\s*$/.test(line) &&
          ((arr[i - 1] &&
            (/^[ \t]*\/\/\s*(src|node_modules)/.test(arr[i - 1]) ||
              /^[ \t]*\/\/\s*eslint/.test(arr[i - 1]))) ||
            (arr[i + 1] &&
              (/^[ \t]*\/\/\s*(src|node_modules)/.test(arr[i + 1]) ||
                /^[ \t]*\/\/\s*eslint/.test(arr[i + 1]))))
        ) {
          return true;
        }

        return false;
      });

      if (hasTarget) filesToClean.push(filePath);
    }

    for (const [index, filePath] of filesToClean.entries()) {
      const content = await fs.promises.readFile(filePath, "utf8");
      const lines = content.split(/\r?\n/);

      const cleanedLines = lines
        .filter((line, i, arr) => {
          if (/^[ \t]*\/\/\s*(src|node_modules)\//.test(line)) return false;
          if (/^[ \t]*\/\/\s*eslint/.test(line)) return false;

          if (removeAdjacentEmptyLines && /^\s*$/.test(line)) {
            const prev = arr[i - 1];
            const next = arr[i + 1];
            if (
              (prev &&
                (/^[ \t]*\/\/\s*(src|node_modules)/.test(prev) ||
                  /^[ \t]*\/\/\s*eslint/.test(prev))) ||
              (next &&
                (/^[ \t]*\/\/\s*(src|node_modules)/.test(next) ||
                  /^[ \t]*\/\/\s*eslint/.test(next)))
            ) {
              return false;
            }
          }

          return true;
        })
        .map((line) => {
          return line
            .replace(/\/\/\s*(src|node_modules)\/[^\n]*/g, "")
            .replace(/\/\/\s*eslint[^\n]*/g, "");
        });

      const finalContent = cleanedLines.join("\n");

      if (finalContent !== content) {
        await fs.promises.writeFile(filePath, finalContent, "utf8");

        BUILD_LOGGER.ON_PROCESS({
          actionName: "JS Comment Cleaned",
          count: index + 1,
          nameDirect: filePath
        });
      }
    }

    if (isNonEmptyArray(filesToClean)) {
      BUILD_LOGGER.ON_FINISH({
        actionName: "Cleaning JS Comment",
        count: filesToClean.length
      });
    } else {
      BUILD_LOGGER.ON_SKIPPING({
        actionName: "Cleaning JS Comment",
        reasonEndText: "cleaning"
      });
    }
  } catch (error) {
    BUILD_LOGGER.ON_ERROR({
      actionName: "Cleaning JS Comment",
      error
    });
  }
};

await cleanDistJsComments("dist/**/*.{js,cjs,mjs}", {
  removeAdjacentEmptyLines: false
});
